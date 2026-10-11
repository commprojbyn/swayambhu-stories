# Swayambhu Stories

An oral-history archive for Swayambhu, Kathmandu. Public visitors can browse interviews, search
by metadata, transcript text, and meaning, and play a video from any passage of its transcript.
A single admin account uploads videos and metadata; transcription and English translation run automatically.

## Stack

- Next.js 15 (App Router) + TypeScript, deployed on Vercel
- Vercel Postgres (Neon) with pgvector for search by meaning
- Vercel Blob for video and audio storage (direct browser upload)
- OpenAI `whisper-1` for timestamped transcription, `text-embedding-3-small` for search
- Google Cloud Translation (Nepali / Newari → English)
- FFmpeg (WebAssembly) in the admin's browser to extract audio before upload

## Deploy on Vercel

1. Push this folder to a GitHub repository and import it in Vercel.
2. In the Vercel project, open **Storage** and:
   - Create a **Neon Postgres** database (adds `POSTGRES_URL`).
   - Create a **Blob** store (adds `BLOB_READ_WRITE_TOKEN`).
3. Under **Settings → Environment Variables**, add:
   `OPENAI_API_KEY`, `GOOGLE_TRANSLATE_API_KEY` (optional), `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`.
4. Deploy. Then, on your machine, create the database tables once:
   ```bash
   npm install
   vercel env pull .env.local
   npm run db:setup
   npm run db:seed        # optional: adds the three placeholder interviews
   ```
5. Open `/admin/login` and sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

## Local development

```bash
cp .env.example .env.local   # fill in values
npm install
npm run db:setup
npm run dev
```

## Adding photos

Place images in `public/images/`:
- `swayambhu-hero.jpg` (home page photo)
- `story-hero.jpg` (story banner)
- `story-1.jpg` … `story-5.jpg` (story chapters)

Use only photographs you have rights to. The photos in the design preview should be replaced with your own, or with images that the project team is permitted to publish.

## Limits to know about

- **Function duration.** Transcribing a long interview can take several minutes. The processing route requests 300 seconds, which needs Vercel Pro or Fluid compute. On the Hobby plan, processing may time out; the admin page then shows the status and a **Run transcription** button to retry.
- **Audio size.** Whisper accepts up to 25 MB per request. The browser exports 32 kbps mono audio (about 14 MB per hour). Interviews longer than about 1.7 hours need splitting.
- **Browser audio extraction.** FFmpeg.wasm handles typical interview files, but very large videos (several GB) may be slow or run out of memory in the browser.
- **Privacy.** Blob URLs are public but unguessable. Restricted interviews would need private Blob storage with signed access; this is not yet implemented.
- **Single admin.** Access is controlled by one email and password from environment variables. Replacing this with per-person accounts (for example Firebase Auth, as in the team's platform plan) is a natural next step.
- **Nepal Bhasa transcription.** Whisper does not officially support Newari. Nepal Bhasa audio is auto-detected and may be less accurate. Expect to review and correct those transcripts.
