export function userAutoReplyTemplate(params: { name: string }) {
  const safeName = (params.name || "").trim() || "there";

  return `
  <div style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:28px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="background:#0b0b0b;padding:22px 24px;">
                <div style="font-size:14px;letter-spacing:2px;color:#ffffff;opacity:0.9;font-weight:700;">
                  ANDREI TAZETDINOV
                </div>
                <div style="margin-top:6px;font-size:12px;color:#ffffff;opacity:0.75;">
                  Style • Freedom • Success
                </div>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:26px 24px;color:#111111;">
                <h1 style="margin:0 0 10px 0;font-size:22px;line-height:1.25;">
                  Thanks, ${escapeHtml(safeName)}!
                </h1>
                <p style="margin:0 0 14px 0;font-size:14px;line-height:1.6;color:#333;">
                  I’ve received your message and I’ll get back to you as soon as possible.
                </p>

                <div style="margin:18px 0 22px 0;padding:14px 16px;border:1px solid #e8e8e8;border-radius:12px;background:#fafafa;">
                  <div style="font-size:12px;letter-spacing:1px;color:#666;font-weight:700;">
                    WHAT’S NEXT
                  </div>
                  <div style="margin-top:8px;font-size:14px;line-height:1.6;color:#333;">
                    If your request is urgent, reply to this email with more details — it helps me respond faster.
                  </div>
                </div>

                <a href="https://www.andreitazetdinov.com"
                   style="display:inline-block;padding:12px 16px;border-radius:12px;background:#0b0b0b;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;">
                  Visit my website
                </a>

                <p style="margin:22px 0 0 0;font-size:13px;line-height:1.6;color:#555;">
                  — Andrei
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 24px;background:#ffffff;border-top:1px solid #eeeeee;">
                <div style="font-size:12px;color:#777;line-height:1.6;">
                  You’re receiving this because you contacted me through my website.
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}