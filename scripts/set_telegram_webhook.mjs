// Points the Telegram bot at the site's webhook route.
// Usage: node --env-file=.env scripts/set_telegram_webhook.mjs https://andreitazetdinov.com
const base = process.argv[2];
const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
if (!base || !token || !secret) {
  console.error("Usage: node --env-file=.env scripts/set_telegram_webhook.mjs https://<site>");
  process.exit(1);
}

async function tg(method, body = {}) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`${method}: ${json.description}`);
  return json.result;
}

await tg("setWebhook", {
  url: new URL("/api/telegram/webhook", base).href,
  secret_token: secret,
  allowed_updates: ["message"],
});
console.log(await tg("getWebhookInfo"));
