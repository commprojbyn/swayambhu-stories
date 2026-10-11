import { sql } from './db';
import { embedTexts, getOpenAI, toVector } from './embed';

// Whisper accepts up to 25 MB per request. The browser exports 16 kHz mono
// 32 kbps MP3, which is roughly 14 MB per hour of interview.
const MAX_AUDIO_BYTES = 24 * 1024 * 1024;

const WHISPER_LANG: Record<string, string | undefined> = {
  Nepali: 'ne',
  'Nepal Bhasa': undefined, // not in Whisper's language list; auto-detect
  English: 'en',
};

const GOOGLE_LANG: Record<string, string> = {
  Nepali: 'ne',
  'Nepal Bhasa': 'new', // Newari
  English: 'en',
};

function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function translateTexts(texts: string[], language: string): Promise<(string | null)[]> {
  if (language === 'English') return texts;
  const key = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!key) return texts.map(() => null); // archive still works with original text only

  const out: (string | null)[] = [];
  for (let i = 0; i < texts.length; i += 100) {
    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: texts.slice(i, i + 100),
          source: GOOGLE_LANG[language],
          target: 'en',
          format: 'text',
        }),
      },
    );
    if (!res.ok) throw new Error(`Google Translate failed (${res.status}): ${await res.text()}`);
    const json = (await res.json()) as { data: { translations: { translatedText: string }[] } };
    out.push(...json.data.translations.map((t) => decodeEntities(t.translatedText)));
  }
  return out;
}

export async function processInterview(id: string) {
  const [iv] = await sql<{ audio_url: string | null; language: string }[]>`
    select audio_url, language from interviews where id = ${id}`;
  if (!iv) throw new Error('Interview not found');
  if (!iv.audio_url) throw new Error('No audio has been uploaded for this interview');

  await sql`update interviews set status = 'processing', error = null, updated_at = now() where id = ${id}`;

  try {
    // 1. Download the audio and transcribe it with timestamps per segment.
    const audioRes = await fetch(iv.audio_url);
    if (!audioRes.ok) throw new Error('Could not download the audio file');
    const blob = await audioRes.blob();
    if (blob.size > MAX_AUDIO_BYTES) {
      throw new Error('Audio is larger than 24 MB. Split the interview into parts before uploading.');
    }
    const file = new File([blob], 'audio.mp3', { type: 'audio/mpeg' });

    const params = {
      file,
      model: 'whisper-1',
      response_format: 'verbose_json' as const,
      timestamp_granularities: ['segment' as const],
    };
    const code = WHISPER_LANG[iv.language];
    const transcript = await getOpenAI().audio.transcriptions.create(
      code ? { ...params, language: code } : params,
    );
    const verbose = transcript as unknown as {
      duration?: number;
      segments?: { start: number; end: number; text: string }[];
    };

    const segs = (verbose.segments ?? [])
      .map((s) => ({
        start_ms: Math.round(s.start * 1000),
        end_ms: Math.round(s.end * 1000),
        original: s.text.trim(),
      }))
      .filter((s) => s.original.length > 0);
    if (segs.length === 0) throw new Error('No speech was detected in this recording.');

    // 2. Translate every segment into English (skipped if no Google key).
    const english = await translateTexts(
      segs.map((s) => s.original),
      iv.language,
    );

    // 3. Embed for search by meaning.
    const vectors = await embedTexts(segs.map((s, i) => english[i] || s.original));

    // 4. Store everything atomically, keeping timestamps linked to text.
    const duration = Math.round(verbose.duration ?? segs[segs.length - 1].end_ms / 1000);
    await sql.begin(async (tx) => {
      await tx`delete from segments where interview_id = ${id}`;
      for (let i = 0; i < segs.length; i++) {
        const s = segs[i];
        const v = vectors[i];
        await tx`insert into segments (interview_id, idx, start_ms, end_ms, original, english, embedding)
          values (${id}, ${i}, ${s.start_ms}, ${s.end_ms}, ${s.original}, ${english[i]},
                  ${v ? toVector(v) : null}::vector)`;
      }
      await tx`update interviews set status = 'ready', duration_seconds = ${duration},
               updated_at = now() where id = ${id}`;
    });

    return { segments: segs.length, translated: english.every(Boolean) };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Processing failed';
    await sql`update interviews set status = 'error', error = ${message}, updated_at = now() where id = ${id}`;
    throw err;
  }
}
