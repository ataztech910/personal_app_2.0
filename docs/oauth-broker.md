# ADVNCD OAuth Broker (Next.js + Supabase)

## Architecture Summary

This OAuth broker allows `advncd` CLI to authenticate users with Google without embedding `client_secret` in CLI.

- CLI starts login with `POST /api/auth/cli/start`.
- Server creates short-lived `cli_login_sessions` record (`pending`).
- CLI opens `verify_url` in browser (`/advncd/verify?session_id=...`).
- Browser flow goes to Google via `/api/auth/google/start` and returns to `/api/auth/google/callback`.
- Callback exchanges code with Google **server-side** (using `GOOGLE_CLIENT_SECRET`), encrypts refresh token with AES-256-GCM, stores it in `oauth_accounts`, marks session `approved`.
- CLI polls `GET /api/auth/cli/poll` until `approved`, receives **app tokens**.
- CLI exchanges app access token for Google access token with `POST /api/auth/gcp/access-token`.

## Database Migration

Use migration:

- `supabase/migrations/20260311212000_oauth_broker.sql`

Tables:

- `users`
- `cli_login_sessions`
- `oauth_accounts`
- `app_tokens`
- `audit_events`

## Local Run Commands

```bash
# install deps
npm install

# generate Next route types
npx next typegen

# type-check
npx tsc --noEmit

# run unit/integration tests
npm run test

# start Next dev server
npm run dev
```

Supabase migration options:

```bash
# option A: Supabase SQL editor
# paste and execute: supabase/migrations/20260311212000_oauth_broker.sql

# option B: Supabase CLI
supabase db push
```

## Sequence Diagram (Text)

1. `CLI -> Next`: `POST /api/auth/cli/start`  
2. `Next -> DB`: insert `cli_login_sessions (pending)`  
3. `Next -> CLI`: `{ session_id, verify_url, expires_in, interval_seconds }`  
4. `CLI -> Browser`: open `verify_url`  
5. `Browser -> Next`: `GET /api/auth/google/start?session_id=...`  
6. `Next -> DB`: store `oauth_state_hash`, `oauth_nonce`  
7. `Next -> Browser`: redirect to Google OAuth  
8. `Google -> Next`: callback with `code`, `state`  
9. `Next -> Google`: exchange code for tokens  
10. `Next -> Google`: fetch user info  
11. `Next -> DB`: upsert `users`, encrypt+store refresh token in `oauth_accounts`, mark session `approved`  
12. `CLI -> Next`: polling `GET /api/auth/cli/poll?session_id=...`  
13. `Next -> CLI`: `{ status: "approved", app_access_token, app_refresh_token, expires_in, email }`  
14. `CLI -> Next`: `POST /api/auth/gcp/access-token` with bearer app token  
15. `Next -> Google`: refresh Google access token using encrypted refresh token  
16. `Next -> CLI`: `{ access_token, token_type, expires_in }`  

## API Contract

### `POST /api/auth/cli/start`

Request:
```json
{ "device_name": "optional-cli-name" }
```

Response:
```json
{
  "session_id": "uuid",
  "verify_url": "https://.../advncd/verify?session_id=...",
  "expires_in": 600,
  "interval_seconds": 5
}
```

### `GET /api/auth/cli/poll?session_id=...`

Pending:
```json
{ "status": "pending" }
```

Approved:
```json
{
  "status": "approved",
  "app_access_token": "...",
  "app_refresh_token": "...",
  "expires_in": 900,
  "email": "user@example.com"
}
```

Denied:
```json
{ "status": "denied" }
```

Expired (`410`):
```json
{ "status": "expired" }
```

Slow polling (`429`):
```json
{ "error": "slow_down", "retry_after_seconds": 3 }
```

### `POST /api/auth/token/refresh`

Request:
```json
{ "app_refresh_token": "..." }
```

Response:
```json
{ "app_access_token": "...", "expires_in": 900 }
```

### `POST /api/auth/gcp/access-token`

Headers:
```http
Authorization: Bearer <app_access_token>
```

Response:
```json
{ "access_token": "...", "token_type": "Bearer", "expires_in": 3600 }
```

### `POST /api/auth/logout`

Request (optional refresh token):
```json
{ "app_refresh_token": "..." }
```

Also accepts bearer app access token and revokes all active app tokens for that user.

## Minimal cURL E2E

1. Start session
```bash
curl -X POST http://localhost:3000/api/auth/cli/start \
  -H 'content-type: application/json' \
  -d '{"device_name":"local-dev"}'
```

2. Open `verify_url` in browser and complete Google login.

3. Poll
```bash
curl "http://localhost:3000/api/auth/cli/poll?session_id=<SESSION_ID>"
```

4. Exchange app access token for Google token
```bash
curl -X POST http://localhost:3000/api/auth/gcp/access-token \
  -H "authorization: Bearer <APP_ACCESS_TOKEN>"
```

5. Refresh app access token
```bash
curl -X POST http://localhost:3000/api/auth/token/refresh \
  -H 'content-type: application/json' \
  -d '{"app_refresh_token":"<APP_REFRESH_TOKEN>"}'
```

## Go CLI Integration Notes

Use backend base URL via env:

- `ADVNCD_AUTH_BASE_URL` (fallback to default production broker URL)

Recommended flow in `advncd login`:

1. `POST /api/auth/cli/start`
2. open returned `verify_url` in browser
3. poll `/api/auth/cli/poll` by `interval_seconds`
4. on approved: store only `app_access_token`, `app_refresh_token`, `expires_at`, `email` in local `credentials.json`

Do **not** store Google refresh token in CLI.

`GetAccessToken()` strategy:

1. if app access token expired -> call `/api/auth/token/refresh`
2. call `/api/auth/gcp/access-token` with valid app access token
3. return Google `access_token` to existing GCP calls (`init`, `projects`, `services`, `publish`, `n8n`)

## Security Checklist

- Google `client_secret` is used only server-side.
- Refresh token encrypted at rest (AES-256-GCM).
- App refresh tokens stored hashed (`sha256(pepper:token)`).
- App access tokens are short-lived JWTs.
- Poll endpoint has interval enforcement + max attempts.
- OAuth state cookie + DB state hash check to reduce CSRF risk.
- Audit events for start/approve/deny/refresh/exchange/logout.
- Token/secret values are never logged.

## Threat Model + Residual Risks

### Mitigated

- CLI binary reverse engineering cannot leak Google client secret.
- DB dump does not expose plaintext Google refresh token.
- Stolen app access token has short TTL.
- Brute-force polling limited by interval and max-attempt checks.

### Residual

- If `SUPABASE_SERVICE_ROLE_KEY` is compromised, attacker can read encrypted tokens and metadata.
- If `TOKEN_ENCRYPTION_KEY` is compromised, encrypted refresh tokens can be decrypted.
- Stateful CSRF relies on cookie + state hash checks; additional hardening (PKCE, strict CSP) is recommended.
- No IP reputation or external WAF limits are included in this implementation.
