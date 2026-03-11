import { type NextRequest } from "next/server";

export function getRequestIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  return request.headers.get("x-real-ip");
}

export function getRequestUserAgent(request: NextRequest): string | null {
  return request.headers.get("user-agent");
}

export function jsonError(message: string, status = 400): Response {
  return Response.json({ error: message }, { status });
}
