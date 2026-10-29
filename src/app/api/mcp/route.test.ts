import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ deliver: vi.fn() }));
vi.mock("@/lib/contact", () => ({ deliverContactMessage: mocks.deliver }));
import { DELETE, GET, POST } from "./route";

async function rpc(method: string, params: object = {}) {
  return POST(new Request("https://example.com/api/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  }));
}

describe("POST /api/mcp", () => {
  beforeEach(() => { mocks.deliver.mockReset().mockResolvedValue(undefined); });

  it("initializes an official MCP session without sending mail", async () => {
    const response = await rpc("initialize", { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "test", version: "1" } });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.result.serverInfo.name).toBe("personal-website-contact");
    expect(body.result.instructions).toContain("explicit approval");
    expect(mocks.deliver).not.toHaveBeenCalled();
  });

  it("discovers only the contact tool, required email and write annotations", async () => {
    const response = await rpc("tools/list");
    const { result } = await response.json();
    expect(result.tools).toHaveLength(1);
    const tool = result.tools[0];
    expect(tool.name).toBe("send_contact_message");
    expect(tool.inputSchema.required).toEqual(expect.arrayContaining(["email", "subject", "message"]));
    expect(tool.inputSchema.required).not.toContain("name");
    expect(tool.annotations).toMatchObject({ readOnlyHint: false, destructiveHint: true, openWorldHint: true });
  });

  it("invokes the tool and deduplicates a retry", async () => {
    const params = { name: "send_contact_message", arguments: { name: "Test", email: "mcp-test@example.com", subject: "Hello", message: "Consulting inquiry" } };
    const response = await rpc("tools/call", params);
    const { result } = await response.json();
    expect(result.isError).toBe(false);
    expect(result.structuredContent).toMatchObject({ success: true, code: "sent" });
    await rpc("tools/call", params);
    expect(mocks.deliver).toHaveBeenCalledTimes(1);
  });

  it("rejects missing email before any delivery", async () => {
    const response = await rpc("tools/call", { name: "send_contact_message", arguments: { subject: "Hi", message: "Hello" } });
    const body = await response.json();
    expect(body.result.isError).toBe(true);
    expect(mocks.deliver).not.toHaveBeenCalled();
  });

  it("returns a structured delivery failure", async () => {
    mocks.deliver.mockRejectedValue(new Error("provider secret"));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await rpc("tools/call", { name: "send_contact_message", arguments: { email: "failure@example.com", subject: "Hi", message: "Hello" } });
    const body = await response.json();
    expect(body.result.isError).toBe(true);
    expect(body.result.structuredContent.code).toBe("delivery_failed");
    expect(JSON.stringify(body)).not.toContain("provider secret");
    log.mockRestore();
  });

  it("rejects cross-origin browser requests, malformed JSON and oversized bodies", async () => {
    for (const [body, headers, status] of [
      ["{}", { Origin: "https://other.example" }, 403],
      ["{", {}, 400],
      [" ".repeat(16 * 1024 + 1), {}, 413],
    ] as const) {
      const response = await POST(new Request("https://example.com/api/mcp", {
        method: "POST", headers: { "Content-Type": "application/json", ...headers }, body,
      }));
      expect(response.status).toBe(status);
    }
    expect(mocks.deliver).not.toHaveBeenCalled();
  });

  it("does not expose a persistent event stream or sessions", async () => {
    expect((await GET()).status).toBe(405);
    expect((await DELETE()).headers.get("Allow")).toBe("POST");
  });
});
