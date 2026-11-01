# Mishnat Yosef Ra'anana — signup landing page

A single-page site to gather 250 interested families before opening a Mishnat
Yosef pickup station in Ra'anana. Hebrew by default (RTL), with English and
French toggles. Embeds the explainer video and a signup form that writes to a
Google Sheet.

## Files

- `index.html` — the whole site (markup, styles, translations, logic). This is the only file you need to host.
- `apps-script/Code.gs` — the Google Apps Script backend that receives form submissions and writes them to a Sheet, and reports the running signup count.

## 1. Set up the Google Sheet + Apps Script backend

The destination sheet already exists (kept out of this public README on
purpose — grab the link from your own Google Drive, and keep its sharing set
to "Restricted" to just the people who need it).

Its `Signups` tab and header row (`Timestamp | Full Name | Phone | Interest Level | WhatsApp Consent | Language`) should already be set up. **Note:** the connected Google account could only read this sheet, not edit it — if the headers aren't there yet, add them yourself or re-share the sheet with edit access and ask again.

Deploying the Apps Script Web App itself can't be done by an AI agent on your behalf — Google requires the sheet's owner to click through the authorization/deploy prompts in the Apps Script editor, by design (no API call can skip this consent step). It's a 2-minute, one-time task:

1. Open the Sheet above, then **Extensions → Apps Script**.
2. Delete the default `Code.gs` content and paste in the contents of `apps-script/Code.gs` from this project.
3. Click **Deploy → New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, authorize the script when prompted, and copy the **Web app URL** it gives you (ends in `/exec`).
5. Send me that URL (or paste it yourself) into `index.html`, in this line near the top of the `<script>` block:
   ```js
   var SHEETS_WEB_APP_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
   ```
6. Also update `PAGE_URL` a few lines below once you know the real published address — it's used for the WhatsApp/copy-link share buttons.

Until step 5 is done, the form still works (it logs the submission to the browser console and shows the success message) so you can test the page, but **nothing is saved** and the live counter shows `?`.

Every time you edit `Code.gs` in the Apps Script editor, you need to create a **new deployment version** (Deploy → Manage deployments → edit → new version) for the changes to take effect on the existing URL.

## 2. Host the page

`index.html` is fully self-contained (no build step, no dependencies besides a Google Fonts `<link>`). Any static host works, for example:

- **GitHub Pages**: push this folder to a repo, enable Pages on the `main` branch.
- **Netlify / Vercel**: drag-and-drop the folder (or connect the repo).
- **Wix**: if you'd rather host on an existing Wix site, say so and we can wire this up through the Wix headless/CLI tooling instead of a plain static host.

## 3. Before you publish — please double check

- The "what is Mishnat Yosef" explainer text is written from public information (a no-storefront network, ~350 pickup stations, 55,000+ families nationwide). **Verify this against the actual Mishnat Yosef organization** before publishing — exact numbers, eligibility rules, and whether they require a minimum family count to open a new station may differ from what's written here.
- Swap the footer disclaimer / "fine print" text if this project *is* officially coordinated with the national organization rather than a grassroots resident effort.
- Update `PAGE_URL` in `index.html` once hosted, so the WhatsApp share button sends the real link.

## How the language toggle works

`index.html` keeps all three languages (`he`, `en`, `fr`) in one `translations`
object in the inline `<script>`. Switching languages swaps text via
`data-i18n` attributes and flips `document.documentElement.dir` between
`rtl`/`ltr`. Hebrew is the default and is remembered per-visitor via
`localStorage`.

## How the live counter works

`doGet` in `Code.gs` returns `{ count: <number of signups> }`. The page fetches
this on load to fill in the "X of 250 families" progress bar. If the Apps
Script URL isn't configured yet, the counter just shows `?` instead of breaking.
