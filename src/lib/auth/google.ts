import { getGoogleOAuthConfig } from "./config";

type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  token_type: string;
  id_token?: string;
};

type GoogleUserInfo = {
  sub: string;
  email: string;
  email_verified: boolean;
};

const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_USERINFO_ENDPOINT = "https://openidconnect.googleapis.com/v1/userinfo";

async function postForm<T>(url: string, body: URLSearchParams): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const json = await response.json();
  if (!response.ok) {
    const message = typeof json?.error_description === "string"
      ? json.error_description
      : "Google token request failed";
    throw new Error(message);
  }

  return json as T;
}

export function buildGoogleOAuthUrl(params: { state: string; nonce: string }): string {
  const config = getGoogleOAuthConfig();
  const query = new URLSearchParams({
    client_id: config.googleClientId,
    redirect_uri: config.googleRedirectUri,
    response_type: "code",
    scope: config.oauthScope,
    access_type: "offline",
    include_granted_scopes: "true",
    prompt: "consent",
    state: params.state,
    nonce: params.nonce,
  });

  return `${GOOGLE_AUTH_ENDPOINT}?${query.toString()}`;
}

export async function exchangeCodeForTokens(code: string): Promise<GoogleTokenResponse> {
  const config = getGoogleOAuthConfig();
  const body = new URLSearchParams({
    code,
    client_id: config.googleClientId,
    client_secret: config.googleClientSecret,
    redirect_uri: config.googleRedirectUri,
    grant_type: "authorization_code",
  });

  return postForm<GoogleTokenResponse>(GOOGLE_TOKEN_ENDPOINT, body);
}

export async function refreshGoogleAccessToken(refreshToken: string): Promise<GoogleTokenResponse> {
  const config = getGoogleOAuthConfig();
  const body = new URLSearchParams({
    client_id: config.googleClientId,
    client_secret: config.googleClientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  return postForm<GoogleTokenResponse>(GOOGLE_TOKEN_ENDPOINT, body);
}

export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch(GOOGLE_USERINFO_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await response.json();
  if (!response.ok || !json?.email || !json?.sub) {
    throw new Error("Failed to fetch Google user info");
  }

  return {
    sub: json.sub as string,
    email: json.email as string,
    email_verified: Boolean(json.email_verified),
  };
}
