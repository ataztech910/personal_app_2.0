# Publish Andrei Tazetdinov Assistant

Package source: `chatgpt-plugin/`. Build with `npm run package:chatgpt`.
Upload artifact: `dist/chatgpt/personal-website-contact-0.2.2.zip`.

The display name is **Andrei Tazetdinov Assistant**. The package and MCP server
identifier remain `personal-website-contact` to preserve the existing identity;
Runtime release `0.2.0` adds the public profile tool; package `0.2.1` clarifies
the listing purpose and selects the Communication category. Package `0.2.2` adds
the actual demonstration recording to the review metadata. Reconnect or refresh existing custom
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
   The route returns the exact token as plain text. The public token supplied for
   this plugin is bundled in the route; `OPENAI_APPS_CHALLENGE` can override it
   if the portal issues a replacement.
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
   Package `0.2.2` includes the actual recording URL:
   `https://www.andreitazetdinov.com/review/andrei-assistant-demo.mp4`.
   Confirm that the deployed video opens before submitting. The current recording
   shows the draft, email, approval and successful tool result; it does not show
   an inbox receipt or a separate decline scenario.
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

## Addressing the initial portal findings

Package `0.2.1` changes the listing category from Productivity to Communication
and explains that the main purpose is reading one professional's public profile
and contacting that person by email. Communication is a supported category in
the official submission error reference. This is a better semantic fit, not a
guarantee that the automated category assessment will pass.

Upload the new ZIP **to the existing plugin**, then inspect the new metadata
assessment. The category finding is separate from the review-information finding.

For **Incomplete review information**, open **Metadata & Skills → Review
information → Review details**. Confirm the imported five positive and three
negative cases, inspect the required fields and connection/domain status, and add
a real reviewer-accessible demo video URL. Package `0.2.2` now provides that URL;
re-upload it to import the recording metadata. The finding text alone does not identify every
missing field, so check the portal rather than assuming the video is the only one.

A simple demo sequence:

1. Open a new ChatGPT conversation with the custom plugin enabled.
2. Ask who Andrei is; show `get_profile`, source links, and no request for email.
3. Ask to draft a React Native consulting inquiry; provide your own email.
4. Show the subject, email and full draft, then approve sending.
5. Show the successful tool result and the receipt in your email inbox.
6. Start another draft and decline sending; show that no send tool is invoked.

Keep the screen recording accessible to reviewers and hide unrelated personal
mail. In the portal, mark the service as requiring no authentication; do not
invent reviewer credentials. If a field is managed by the ZIP, change its package
metadata and re-upload rather than expecting portal edits to override the ZIP.

## Official references

- Package format: https://developers.openai.com/plugins/build/plugins
- Submission and domain verification: https://developers.openai.com/plugins/deploy/submission
- Review and discovery: https://developers.openai.com/plugins/deploy/app-review
- Supported categories and package errors: https://developers.openai.com/plugins/deploy/submission-errors
