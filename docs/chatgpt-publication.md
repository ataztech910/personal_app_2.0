# Publish Andrei Tazetdinov Assistant

Package source: `chatgpt-plugin/`. Build with `npm run package:chatgpt`.
Upload artifact: `dist/chatgpt/personal-website-contact-0.2.0.zip`.

The display name is **Andrei Tazetdinov Assistant**. The package and MCP server
identifier remain `personal-website-contact` to preserve the existing identity;
release `0.2.0` adds the public profile tool. Reconnect or refresh existing custom
MCP connections after deploying to discover both tools and the new instructions.

The ZIP contains root `plugin.json`, root `mcp.json`, and two existing website
icons. No environment files, credentials, source repository, hooks, skills, or
registered app references are bundled. The local build checks documented listing
limits, review case counts, URL conventions, icons, and ZIP contents. OpenAI's
portal performs the authoritative package/schema and submission validation.

## Prepared

- English listing metadata and three starter prompts.
- One no-auth remote MCP server exposing `get_profile` and `send_contact_message`,
  with five positive / three negative review cases covering both capabilities.
- Existing website brand icons, with no fabricated ChatGPT screenshots.
- Product page `/chatgpt`, privacy `/chatgpt/privacy`, terms `/chatgpt/terms`.
- Support points to `/contact?tab=email`.
- Domain verification route `/.well-known/openai-apps-challenge`.

All submission links use **https://www.andreitazetdinov.com**. The bare domain
redirects to `www`; the official MCP client rejects that cross-origin redirect
under its default policy. Always connect directly to the canonical `www` URL.

## Complete before submitting

1. Review the public listing and the privacy/terms text for accuracy. Deploy the
   new website routes through the existing website workflow. Verify all four
   listing URLs are public and the MCP endpoint lists `get_profile` and
   `send_contact_message`.
2. In the OpenAI developer submission portal, select the owning organization and
   project and complete the individual/business developer identity verification.
   Only an organization owner or member with the required app-management write
   permission can submit. The verified identity supplies the displayed publisher.
3. Upload the ZIP using **Upload new or existing plugin**. Inspect Metadata &
   Skills. Resolve validation findings; a valid ZIP alone is not review approval.
4. Open **MCPs → Connect** and use the configured HTTPS server with no authentication.
   Copy the exact domain verification token shown by the portal into Vercel's
   `OPENAI_APPS_CHALLENGE` environment variable and redeploy. If the portal allows
   choosing a challenge origin, use `https://www.andreitazetdinov.com`.
   The route returns the exact token as plain text, or 404 while unconfigured.
   Confirm the portal's selected challenge URL matches the deployed host/path.
   Do not replace an existing token used by a different app.
5. Connect/scan the server and resolve reported tool findings. Select the correct
   availability countries in the portal; the ZIP does not preselect a country list.
6. Install the custom plugin in ChatGPT and run the eight review cases. These are
   proposed scenarios, not a claim that a reviewer/live ChatGPT test has passed.
   Profile cases need no email and must not send anything. For sending cases,
   use your own real email and explicitly approve the send.
   Never submit an invented address: a receipt is sent to the supplied address.
   Keep test inquiries clearly labeled and avoid more than five distinct attempts
   per address within ten minutes (the POC limit).
7. Record a reviewer-accessible demo video showing connection, public profile
   lookup with source links and without requesting email, tool selection,
   email collection, draft display, approval, sending, result, and inbox receipt.
   Also demonstrate declining to send. Hide private inbox content and credentials.
   Enter the real video URL in the portal. It is deliberately omitted from the ZIP
   until a recording exists. No fake evidence or placeholder video is included.
8. Complete any remaining portal fields and policy attestations. Submit for review.
   After approval, explicitly select **Publish plugin**. Then confirm discovery
   using the exact listing name **Andrei Tazetdinov Assistant** or its directory URL.
   Approval/publication/discoverability are not guaranteed by local packaging.
9. After publication, update `/chatgpt` to replace the preparation status with the
   actual directory listing link supplied by the portal.

No account credentials are required for the plugin itself. Enter any additional
reviewer access notes in the portal, not in a public ZIP. Publication uses the
existing POC approval model: ChatGPT asks for consent; the backend does not have
a separate server-verified approval token. Shared rate limiting and stronger abuse
protection remain future improvements, as described in `chatgpt-contact.md`.

## Official references

- Package format: https://developers.openai.com/plugins/build/plugins
- Submission and domain verification: https://developers.openai.com/plugins/deploy/submission
- Review and discovery: https://developers.openai.com/plugins/deploy/app-review
