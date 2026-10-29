export const dynamic = "force-dynamic";

// Public proof of domain ownership for this plugin, not an API credential.
const PUBLIC_CHALLENGE = "By6rZ2gmbpbDFuSaeXA2Mv4iPCQmECoy4X4jhFGkY5w";

export function GET() {
  const token = process.env.OPENAI_APPS_CHALLENGE || PUBLIC_CHALLENGE;
  return new Response(token, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
