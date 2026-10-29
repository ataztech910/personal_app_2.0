# Andrei Tazetdinov Assistant — ChatGPT POC

Connect this site's MCP server to ChatGPT as a custom app/plugin. `get_profile`
returns public experience, specializations, consulting, talks and books from the
same resume data displayed by `/resume`, with website source links. Profile lookup
needs no sender email and sends nothing. ChatGPT collects
the sender's email, drafts a professional inquiry to Andrei Tazetdinov, shows the
email, subject and complete message, asks for approval, then sends it through the
same Resend delivery function as the website's email form.

## Endpoint and tools

- Local: `http://localhost:3000/api/mcp`
- Production: `https://www.andreitazetdinov.com/api/mcp` (use `www` directly; avoid redirects)
- Transport: stateless MCP Streamable HTTP, JSON responses; Node.js runtime.
- App name: **Andrei Tazetdinov Assistant**
- Description: **Connect with Andrei Tazetdinov, software architect and React
  Native consultant. Ask about consulting, software architecture, technical
  speaking engagements, and professional collaboration.**
- Tools: `get_profile` (read-only) and `send_contact_message` (write)
- Authentication: none. Recipient is fixed by server configuration.

`get_profile` takes an empty strict object (`{}`); unknown arguments are rejected.
It returns name, title, summary, location, languages, specializations, consulting,
talks, books, projects, source links, contact instructions and limitations. It is
read-only and idempotent and does not use private environment variables. Prices
and current availability are deliberately not returned.

Input JSON Schema for `send_contact_message` (the MCP SDK advertises the equivalent schema):

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string", "minLength": 1, "maxLength": 100 },
    "email": { "type": "string", "format": "email", "maxLength": 255 },
    "subject": { "type": "string", "minLength": 1, "maxLength": 200 },
    "message": { "type": "string", "minLength": 1, "maxLength": 2000 }
  },
  "required": ["email", "subject", "message"],
  "additionalProperties": false
}
```

Strings are trimmed. Email is normalized to lowercase. Name, email and subject
must be single-line and contain no control characters; the body may contain
newlines/tabs. Missing name becomes `ChatGPT visitor`. Output contains `success`,
`code` (`sent`, `invalid_input`, `rate_limited`, `delivery_failed`) and `message`.
SDK schema errors are returned as MCP tool errors before delivery.

The write annotations are `readOnlyHint: false`, `destructiveHint: true` (email
cannot be unsent), `openWorldHint: true` (includes a receipt to the supplied email)
and `idempotentHint: false` (duplicate suppression has a limited time window).

## Configuration and deployment

Use the existing server-only environment variables, already in `.env.example`:

```dotenv
RESEND_API_KEY=...
MAIL_FROM=... # address on your verified Resend domain
CONTACT_RECEIVER=... # Andrei's inbox
```

No OpenAI API key, OAuth, database migration, widget, or additional host is needed.
Deploy through the website's existing Vercel workflow. The new Next.js route uses
the same environment variables as `/api/contact`. Set them for the chosen Vercel
environment and redeploy. Make sure deployment protection does not block the MCP
URL from ChatGPT. GET returning 405 is expected; verify using MCP POST requests.
Do not paste credentials into ChatGPT or expose them as public environment values.

## Local verification

```bash
npm ci
npm test
npx tsc --noEmit --incremental false
npm run build
npm run dev
```

Use `npx @modelcontextprotocol/inspector` and choose Streamable HTTP with
`http://localhost:3000/api/mcp`. Initialize and list tools first; these do not send
email. Calling the sending tool with real Resend credentials **does send mail**.

For an initialization smoke test without sending:

```bash
curl http://localhost:3000/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  --data '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"smoke-test","version":"1"}}}'
```

For local testing from ChatGPT expose port 3000 through an HTTPS development
tunnel, for example `ngrok http 3000`, and use `https://<tunnel-domain>/api/mcp`.
Alternatively use the deployed site directly.

## Connect in ChatGPT

The current official workflow is documented at
https://developers.openai.com/plugins/deploy/connect-chatgpt.
Account/workspace policies determine whether custom MCP connections are available.

1. Open ChatGPT Plugins, select **+ → Add custom MCP server**. Some interfaces
   expose custom MCP apps under **Settings → Apps → Advanced settings → Developer
   mode → Create app** instead.
2. Enter the app name and description above.
3. Choose a public URL and enter the full HTTPS URL including `/api/mcp`.
4. Choose **No authentication**, review the connection notice, and create the
   plugin/app. Inspect the discovered `get_profile` and `send_contact_message` tools.
5. Install/enable the resulting plugin and start a new conversation. Type `@` and
   select **Andrei Tazetdinov Assistant**.
6. First ask «Чем занимается Андрей и о чём выступает?» and verify profile lookup
   returns public information and links without requesting email or sending.
   Then ask: «Напиши Андрею насчёт консультации по React Native».
7. Verify ChatGPT asks for your email, shows the email/subject/full draft, and asks
   whether to send. Approve only after checking the draft and any host permission
   prompt. Verify the tool result, owner inbox and sender receipt.
8. Test declining approval: no tool call or email should occur. Test missing email
   and an unsupported request such as reading past messages: no sending should occur.

If schemas or instructions change, refresh/reconnect the MCP app so ChatGPT
discovers the current tool definitions. This is a private testing connection;
public directory submission is a separate step. The prepared submission package
and remaining portal steps are documented in [chatgpt-publication.md](chatgpt-publication.md).

## POC limitations

- Approval is provided by ChatGPT's conversation/permission flow, as agreed for
  this POC. The endpoint does not independently verify that a person approved the
  exact text. Model instructions and tool annotations are not server authorization.
- The endpoint is public and unauthenticated, like a contact form. It has strict
  input/body limits and basic per-process limits: five distinct attempts per email
  and thirty total attempts per ten minutes. These are abuse friction, not bot
  verification; callers can rotate email addresses. Limits reset on restart and do
  not coordinate across Vercel instances. Production hardening needs shared limits.
- Concurrent/identical retries are coalesced in-process for ten minutes. A hash of
  normalized content is also passed as the Resend idempotency key for both owner
  email and receipt. Resend suppresses identical sends across instances for 24
  hours: https://resend.com/docs/dashboard/emails/idempotency-keys.
  Intentionally sending the exact same content again in that window is also
  suppressed; editing the content creates a different send. No indefinite
  exactly-once guarantee is claimed.
- `sent` means accepted by Resend, not guaranteed inbox delivery. The owner email
  is authoritative; a failed sender receipt does not turn success into failure.
- This is one-way email. Andrei replies to the supplied address, not to ChatGPT.
  No chat history is exposed and no newsletter subscription is requested.
- Tests mock delivery; they do not contact Resend. Actual ChatGPT approval UX,
  connection availability and inbox delivery require the manual check above.

## Code map

- `src/app/api/mcp/route.ts`: bounded HTTP input, origin validation, MCP transport.
- `src/lib/mcp/server.ts`: metadata, instructions and both tool registrations.
- `src/lib/mcp/profile.ts`: public profile, reusing `src/lib/resume-data.ts`.
- `src/lib/mcp/contact.ts`: schema, basic rate limits and duplicate coalescing.
- `src/lib/contact.ts`: delivery shared with the existing contact form.
- `src/lib/mail.ts`: existing Resend client, optional idempotency key and timeout.
- Tests alongside the MCP route, contact sender and shared delivery function.

Official server guidance: https://developers.openai.com/plugins/build/mcp-server.
