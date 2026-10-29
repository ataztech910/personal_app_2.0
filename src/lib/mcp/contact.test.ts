import { describe, expect, it, vi } from "vitest";
import { createContactSender } from "./contact";

const input = { email: "visitor@example.com", subject: "React Native consulting", message: "I'd like to discuss a project." };

describe("MCP contact sender", () => {
  it("requires an email, validates types and rejects invalid fields", async () => {
    const deliver = vi.fn();
    const send = createContactSender(deliver);
    for (const invalid of [
      { ...input, email: undefined }, { ...input, email: "invalid" },
      { ...input, subject: " " }, { ...input, message: " " },
      { ...input, name: 123 }, { ...input, subject: "hello\r\nBcc: someone@example.com" },
      { ...input, message: "a".repeat(2001) }, { ...input, recipient: "other@example.com" },
    ]) expect((await send(invalid)).code).toBe("invalid_input");
    expect(deliver).not.toHaveBeenCalled();
  });

  it("delivers normalized input without subscribing the sender", async () => {
    const deliver = vi.fn().mockResolvedValue(undefined);
    expect((await createContactSender(deliver)({ ...input, email: " Visitor@Example.com " })).success).toBe(true);
    expect(deliver).toHaveBeenCalledWith({ ...input, email: "visitor@example.com", name: "ChatGPT visitor" }, expect.stringMatching(/^mcp-contact\/[a-f0-9]{64}$/));
  });

  it("coalesces concurrent calls and completed retries", async () => {
    const deliver = vi.fn().mockResolvedValue(undefined);
    const send = createContactSender(deliver);
    const results = await Promise.all([send(input), send(input), send(input)]);
    expect(results.every((r) => r.success)).toBe(true);
    expect((await send(input)).success).toBe(true);
    expect(deliver).toHaveBeenCalledTimes(1);
  });

  it("keeps the same provider idempotency key after failure and process recreation", async () => {
    const deliver = vi.fn().mockRejectedValueOnce(new Error("private provider details")).mockResolvedValue(undefined);
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const send = createContactSender(deliver);
    const failure = await send(input);
    expect(failure.code).toBe("delivery_failed");
    expect(JSON.stringify(failure)).not.toContain("private provider");
    expect((await send(input)).success).toBe(true);
    await createContactSender(deliver)(input);
    expect(deliver.mock.calls[0][1]).toBe(deliver.mock.calls[1][1]);
    expect(deliver.mock.calls[1][1]).toBe(deliver.mock.calls[2][1]);
    expect(log).toHaveBeenCalledWith("MCP contact delivery failed");
    log.mockRestore();
  });

  it("limits a sender to five distinct attempts per ten minutes", async () => {
    let time = 0;
    const deliver = vi.fn().mockResolvedValue(undefined);
    const send = createContactSender(deliver, () => time);
    for (let i = 0; i < 5; i++) expect((await send({ ...input, subject: `Request ${i}` })).success).toBe(true);
    expect((await send({ ...input, subject: "Sixth" })).code).toBe("rate_limited");
    time += 10 * 60 * 1000;
    expect((await send({ ...input, subject: "Sixth" })).success).toBe(true);
  });

  it("also caps total traffic across different sender addresses", async () => {
    const deliver = vi.fn().mockResolvedValue(undefined);
    const send = createContactSender(deliver);
    for (let i = 0; i < 30; i++) await send({ ...input, email: `sender${i}@example.com` });
    expect((await send({ ...input, email: "another@example.com" })).code).toBe("rate_limited");
    expect(deliver).toHaveBeenCalledTimes(30);
  });
});
