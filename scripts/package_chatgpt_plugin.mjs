// Builds a small allowlisted ZIP; never packages repository files or secrets.
import assert from "node:assert/strict";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "chatgpt-plugin");
const manifest = JSON.parse(readFileSync(resolve(source, "plugin.json"), "utf8"));
const mcp = JSON.parse(readFileSync(resolve(source, "mcp.json"), "utf8"));
const extension = manifest.extensions["com.openai"];
const listing = extension.interface;

assert.match(manifest.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
assert.ok(manifest.name.length <= 64);
assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
for (const [field, max] of Object.entries({ displayName: 30, shortDescription: 30, longDescription: 4000, developerName: 80 })) {
  assert.ok(typeof listing[field] === "string" && listing[field].length > 0 && listing[field].length <= max, `Invalid ${field}`);
}
for (const field of ["websiteURL", "supportURL", "privacyPolicyURL", "termsOfServiceURL"]) {
  const url = new URL(listing[field]);
  assert.equal(url.protocol, "https:");
  assert.equal(url.origin, "https://www.andreitazetdinov.com");
  assert.equal(url.username + url.password, "");
}
assert.equal(extension.review.test_cases.positive.length, 5);
assert.equal(extension.review.test_cases.negative.length, 3);
const reviewedTools = new Set();
for (const test of extension.review.test_cases.positive) {
  assert.ok(test.description && test.prompt && test.expected_behavior);
  assert.ok(["get_profile", "send_contact_message"].includes(test.tools_triggered));
  reviewedTools.add(test.tools_triggered);
}
assert.deepEqual([...reviewedTools].sort(), ["get_profile", "send_contact_message"]);
if (extension.review.demo_recording_url) {
  const demo = new URL(extension.review.demo_recording_url);
  assert.equal(demo.origin, "https://www.andreitazetdinov.com");
  assert.equal(demo.pathname, "/review/andrei-assistant-demo.mp4");
  assert.ok(existsSync(resolve(root, "public/review/andrei-assistant-demo.mp4")), "Missing published demo video");
}
assert.ok(listing.defaultPrompt.length <= 3 && listing.defaultPrompt.every((p) => p.length <= 128));
assert.deepEqual(Object.keys(mcp.mcpServers), ["personal-website-contact"]);
const server = mcp.mcpServers["personal-website-contact"];
assert.equal(server.type, "streamable-http");
assert.equal(server.url, "https://www.andreitazetdinov.com/api/mcp");
assert.deepEqual(server.extensions["com.openai"].auth, { type: "none" });
assert.ok(!extension.apps && !extension.hooks, "Public package must not include app references or hooks");

const files = ["plugin.json", "mcp.json", "assets/icon.png", "assets/logo.png"];
assert.equal(listing.composerIcon, "./assets/icon.png");
assert.equal(listing.logo, "./assets/logo.png");
for (const file of files) assert.ok(existsSync(resolve(source, file)), `Missing ${file}`);
for (const file of files.filter((f) => f.endsWith(".png"))) {
  const image = readFileSync(resolve(source, file));
  assert.equal(image.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  const width = image.readUInt32BE(16);
  assert.equal(width, image.readUInt32BE(20));
  assert.ok(width >= 48 && width <= 4096 && image.length <= 5 * 1024 * 1024);
}

const output = resolve(root, "dist/chatgpt");
mkdirSync(output, { recursive: true });
const zip = resolve(output, `${manifest.name}-${manifest.version}.zip`);
rmSync(zip, { force: true });
execFileSync("zip", ["-X", "-q", zip, ...files], { cwd: source });
const entries = execFileSync("unzip", ["-Z1", zip], { encoding: "utf8" }).trim().split("\n");
assert.deepEqual(entries, files);
copyFileSync(zip, resolve(output, "personal-website-contact.zip"));
console.log(`Package checks passed. Created ${zip}`);
console.log("ZIP contains only manifest, MCP config and two existing website icons.");
console.log("Portal validation is still required. Confirm demo access and domain verification before submitting.");
if (!extension.review.demo_recording_url) {
  console.log("Draft upload only: required review.demo_recording_url is not set. Add a real reviewer-accessible video in the portal before submitting.");
}
