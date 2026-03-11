export type CliLoginStatus = "pending" | "approved" | "denied" | "expired";

export type UserRow = {
  id: string;
  email: string;
  google_sub: string | null;
  created_at: string;
  updated_at: string;
};

export type CliLoginSessionRow = {
  id: number;
  session_id: string;
  status: CliLoginStatus;
  device_name: string | null;
  user_id: string | null;
  expires_at: string;
  created_at: string;
  approved_at: string | null;
  denied_at: string | null;
  oauth_state_hash: string | null;
  oauth_nonce: string | null;
  oauth_started_at: string | null;
  poll_count: number;
  last_poll_at: string | null;
  ip: string | null;
  user_agent: string | null;
};

export type OAuthAccountRow = {
  id: number;
  user_id: string;
  provider: string;
  provider_account_id: string | null;
  encrypted_refresh_token: string;
  encryption_key_version: string;
  scopes: string | null;
  created_at: string;
  updated_at: string;
};

export type AppTokenRow = {
  id: number;
  token_id: string;
  user_id: string;
  session_id: string | null;
  refresh_token_hash: string;
  refresh_expires_at: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
};
