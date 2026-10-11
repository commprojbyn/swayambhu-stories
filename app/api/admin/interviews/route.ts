import { adminGuard } from '@/lib/auth';
import { sql } from '@/lib/db';
import { slugify } from '@/lib/format';

export async function POST(req: Request) {
  const denied = await adminGuard();
  if (denied) return denied;

  const b = (await req.json()) as Record<string, unknown>;
  const title = String(b.title ?? '').trim();
  if (!title) return Response.json({ error: 'Title is required' }, { status: 400 });

  const topics = String(b.topics ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  const slug = `${slugify(title)}-${Date.now().toString(36)}`;
  const audioUrl = b.audio_url ? String(b.audio_url) : null;
  const videoUrl = b.video_url ? String(b.video_url) : null;

  const [row] = await sql<{ id: string }[]>`
    insert into interviews (slug, title, interviewee, language, recorded_on, location, summary, topics,
                            published, status, video_url, audio_url, duration_seconds)
    values (
      ${slug}, ${title}, ${String(b.interviewee ?? '')}, ${String(b.language ?? 'Nepali')},
      ${b.recorded_on ? String(b.recorded_on) : null}, ${String(b.location ?? 'Swayambhu, Kathmandu')},
      ${String(b.summary ?? '')}, ${topics}, ${b.published === true},
      ${audioUrl ? 'uploaded' : 'awaiting_media'}, ${videoUrl}, ${audioUrl},
      ${typeof b.duration_seconds === 'number' ? b.duration_seconds : null}
    )
    returning id`;

  return Response.json({ id: row.id }, { status: 201 });
}
