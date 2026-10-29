import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { contactInput, contactOutput, createContactSender } from "./contact";
import { getPublicProfile, profileOutput } from "./profile";

const sendContact = createContactSender();

export function createContactServer(send = sendContact) {
  const server = new McpServer({ name: "personal-website-contact", title: "Andrei Tazetdinov Assistant", version: "0.2.0" }, {
    instructions: "Use get_profile for Andrei's public experience, specializations, consulting, talks and books; it needs no email and sends nothing. Do not invent biography, rates or availability. For contact, ask for the user's email, show the email, subject and full draft, then ask whether to send. Call send_contact_message only after explicit approval. Never invent contact details. Replies arrive by email, not in ChatGPT. No newsletter subscription.",
  });
  server.registerTool("get_profile", {
    title: "Get Andrei's public profile",
    description: "Use when the user asks who Andrei Tazetdinov is, about his experience, specialties, React Native or software architecture consulting, conference talks, books, or professional collaboration. Returns the published website profile and source links. No sender email is needed and no message is sent. Does not provide live availability, prices, private correspondence or unlisted biography details.",
    inputSchema: z.object({}).strict(),
    outputSchema: profileOutput,
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false, idempotentHint: true },
    _meta: { securitySchemes: [{ type: "noauth" }] },
  }, async () => {
    const profile = getPublicProfile();
    return {
      structuredContent: profile,
      content: [{ type: "text", text: JSON.stringify(profile) }],
    };
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
