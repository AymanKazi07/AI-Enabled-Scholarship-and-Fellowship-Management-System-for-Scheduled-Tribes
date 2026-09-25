# Tribal Setu scholarship prototype

React/Vite prototype for a Scheduled Tribe scholarship application and officer workflow. The existing NFST and NOS application, scrutiny, merit, and dashboard flows remain available.

## Added features

- Searchable bilingual directory with short eligibility and benefit summaries for 11 official scheme listings: five Maharashtra Tribal Development schemes on [MahaDBT](https://mahadbt.maharashtra.gov.in/), five Ministry of Tribal Affairs schemes on [DBT Tribal](https://dbttribal.gov.in/AllScheme.aspx) (NFST/NOS are already offered in the prototype), and the [PM-USP Central Sector scholarship on NSP](https://scholarships.gov.in/All-Scholarships). The Ministry's Top Class scheme is linked to its current NSP listing. Listings are informational; applicants should follow the linked official portal's current eligibility, deadlines, and application route. MahaDBT and the Ministry list the post-matric scheme on both portals; it appears twice to show both routes.
- Low data toggle (also honors the browser's Save-Data setting): skips the applicant banner, applicant thumbnails, and external emblem images, and pauses voice recording and animation. The production service worker caches the app shell after first load; scheme links still require connectivity. The mode is saved in local storage. Tailwind styles are compiled into the app bundle instead of fetched from a runtime CDN.
- Full Hindi interface text across applicant, scrutiny, merit and dashboard views, plus bilingual scheme search and an application review summary. Voice assisted filling for name, community, institute, and degree in Hindi, Marathi, or English. Each field has its own Speak button; the user reviews and can edit the transcription before submitting. Audio is sent only on explicit recording. Recording stops after 12 seconds. Text input always remains usable.

## Run

**For development (all features):** In the project folder, run `npm ci` and `npm run dev`, then open the Local URL printed by Vite (usually `http://localhost:5173/`). Opening the root `index.html` with VS Code Live Server shows a blank page because that server cannot compile the React JSX in `src/`.

**For a Live Server demo:** Run `npm ci` and `npm run build:live`, then in VS Code right click **`live-preview/index.html`** and choose **Open with Live Server**. You can also upload the `live-preview/` directory to any static host. This build includes the scholarship directory and low data mode. The Bhashini voice buttons require the Node API server and therefore work through the development or production commands below, not through Live Server alone.


For actual Bhashini transcription, request a user ID, API key and ASR capable pipeline ID from [Bhashini](https://bhashini.gitbook.io/bhashini-apis). Set these **on the server**, never in a `VITE_` variable or browser code:

```bash
export BHASHINI_USER_ID='your-user-id'
export BHASHINI_API_KEY='your-api-key'
export BHASHINI_PIPELINE_ID='your-asr-pipeline-id'
npm run voice-server
```

Run `npm run dev` in another terminal. Vite forwards `/api` requests to the voice server on port 3001. For production, run `npm run build` followed by `npm start`; the Node server serves `dist` and the same API (set `PORT` if necessary). Serve via HTTPS for microphone permission. The server asks Bhashini for a language specific ASR configuration, forwards a short WAV recording to its returned inference endpoint, and returns text. With no credentials, the form shows a clear error and remains editable. The request only supports Hindi, Marathi, and English and caps recordings at 12 seconds. Production deployment requires an authorized Bhashini integration plan.

The interface uses a public-service style with a visible demo notice. Example application, certificate, score, alert and dashboard figures are simulated data. The information directory links to official sites for real applications.

## Changes to existing flows

No existing application scheme rules or officer actions were expanded. A directory listing links to each scheme's official application source. The prior NFST/NOS form and its simulated AI scrutiny remain prototype behavior; the added Bhashini transcription needs real credentials to operate. Application data is still stored only in React state and is lost on refresh. Offline shell caching does not submit or store applications.

Source checks: official portals reviewed 25 September 2026. Scheme terms and dates may change; no live scheme data API is used.
