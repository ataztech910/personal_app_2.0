import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { contactInput, contactOutput, createContactSender } from "./contact";

const sendContact = createContactSender();

export function createContactServer(send = sendContact) {
  const server = new McpServer({ name: "personal-website-contact", version: "0.1.0" }, {
    instructions: "Contact Andrei Tazetdinov about software engineering, consulting, or speaking. Ask the user for their email if missing. Show the email, subject and complete drafted message, then ask whether to send. Call send_contact_message only after explicit approval. Never invent contact details. This sends a one-way email, not a live chat; replies arrive at the supplied email. Do not subscribe the user to newsletters.",
  });
  server.registerTool("send_contact_message", {
    title: "Send a message to Andrei",
    description: "Use when the user wants to contact Andrei Tazetdinov, the website owner, about software engineering, React Native consulting, speaking, or another professional inquiry. Requires the user's email. Show the email, subject and full message and ask for explicit approval before calling. Sends an email to Andrei and a receipt to the sender; no newsletter subscription. Does not retrieve replies or start a live chat.",
    inputSchema: contactInput,
    outputSchema: contactOutput,
    annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: true, idempotentHint: false },
    _meta: { securitySchemes: [{ type: "noauth" }] },
  }, async (input) => {
    const result = await send(input);
    return {
      structuredContent: result,
      content: [{ type: "text", text: result.message }],
      isError: !result.success,
    };
  });
  return server;
}
