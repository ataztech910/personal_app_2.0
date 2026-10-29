import { afterEach, describe, expect, it, vi } from "vitest";
import { deliverContactMessage } from "./contact";

describe("contact email delivery", () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });

  function setup() {
    vi.stubEnv("RESEND_API_KEY", "test-only-key");
    vi.stubEnv("MAIL_FROM", "website@example.com");
    vi.stubEnv("CONTACT_RECEIVER", "owner@example.com");
    const fetch = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetch);
    return fetch;
  }
  const input = { name: "Visitor", email: "visitor@example.com", subject: "Consulting", message: "Hello" };

  it("uses the existing Resend configuration and separate deduplication keys", async () => {
    const fetch = setup();
    await deliverContactMessage(input, "mcp-contact/test");
    expect(fetch).toHaveBeenCalledTimes(2);
    const owner = fetch.mock.calls[0][1];
    expect(owner.headers["Idempotency-Key"]).toBe("mcp-contact/test/owner");
    expect(JSON.parse(owner.body)).toMatchObject({ to: ["owner@example.com"], reply_to: input.email });
    expect(fetch.mock.calls[1][1].headers["Idempotency-Key"]).toBe("mcp-contact/test/reply");
  });

  it("does not send the receipt when owner delivery fails or expose provider details", async () => {
    const fetch = setup();
    fetch.mockResolvedValue(new Response("private provider details", { status: 503 }));
    await expect(deliverContactMessage(input)).rejects.toThrow("Resend failed [503]");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("keeps successful owner delivery successful if the receipt fails", async () => {
    const fetch = setup();
    fetch.mockResolvedValueOnce(new Response("{}", { status: 200 })).mockResolvedValueOnce(new Response("private", { status: 503 }));
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(deliverContactMessage(input)).resolves.toBeUndefined();
    expect(log).toHaveBeenCalledWith("Contact auto-reply not sent");
  });
});
