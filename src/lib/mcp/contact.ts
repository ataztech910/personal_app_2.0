import { createHash } from "node:crypto";
import { z } from "zod";
import { deliverContactMessage } from "@/lib/contact";

const singleLine = (max: number) => z.string().trim().min(1).max(max).regex(/^[^\r\n\x00-\x1f\x7f]+$/);

export const contactInput = z.object({
  name: singleLine(100).optional().describe("Sender name, if provided by the user."),
  email: singleLine(255).email().describe("Sender email for Andrei's reply. Ask the user; never invent an address."),
  subject: singleLine(200).describe("Subject of the message approved by the user."),
  message: z.string().trim().min(1).max(2000).regex(/^[^\x00-\x08\x0b\x0c\x0e-\x1f\x7f]+$/)
    .describe("Exact message body shown to and approved by the user."),
}).strict();

export const contactOutput = z.object({
  success: z.boolean(),
  code: z.enum(["sent", "invalid_input", "rate_limited", "delivery_failed"]),
  message: z.string(),
});

const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const WINDOW = 10 * 60 * 1000;

/** POC guards are per process. Resend also deduplicates across server instances. */
export function createContactSender(deliver = deliverContactMessage, now = Date.now) {
  const attempts: { at: number; sender: string }[] = [];
  const completed = new Map<string, { at: number; result: Promise<z.infer<typeof contactOutput>> }>();

  return async (raw: unknown): Promise<z.infer<typeof contactOutput>> => {
    const parsed = contactInput.safeParse(raw);
    if (!parsed.success) return { success: false, code: "invalid_input", message: "Provide a valid email, subject and message; name is optional. Maximum lengths: name 100, email 255, subject 200, message 2000." };
    const input = { ...parsed.data, email: parsed.data.email.toLowerCase(), name: parsed.data.name || "ChatGPT visitor" };
    const timestamp = now();
    for (const [key, entry] of completed) if (timestamp - entry.at >= WINDOW) completed.delete(key);
    const key = `mcp-contact/${hash(JSON.stringify(input))}`;
    const previous = completed.get(key);
    if (previous) return previous.result;
    while (attempts.length && timestamp - attempts[0].at >= WINDOW) attempts.shift();
    const sender = hash(input.email);
    if (attempts.length >= 30 || attempts.filter((a) => a.sender === sender).length >= 5) {
      return { success: false, code: "rate_limited", message: "Too many messages. Please try again in 10 minutes." };
    }
    attempts.push({ at: timestamp, sender });
    const result = (async (): Promise<z.infer<typeof contactOutput>> => {
      try {
        await deliver(input, key);
        return { success: true, code: "sent", message: "Your message was accepted by the email provider for delivery to Andrei. He can reply to your email." };
      } catch {
        console.error("MCP contact delivery failed");
        return { success: false, code: "delivery_failed", message: "Could not confirm delivery. Retry the same message; do not change its contents solely to retry." };
      }
    })();
    completed.set(key, { at: timestamp, result });
    const response = await result;
    if (!response.success) completed.delete(key);
    return response;
  };
}
