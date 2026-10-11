import { sql } from './db';
import type { InterviewRow, SegmentRow } from './types';

const COLUMNS = sql`
  id, slug, title, interviewee, language,
  to_char(recorded_on, 'YYYY-MM-DD') as recorded_on,
  location, summary, topics, published, status, error,
  duration_seconds, video_url, audio_url`;

export async function listPublished(language?: string): Promise<InterviewRow[]> {
  if (language) {
    return sql<InterviewRow[]>`select ${COLUMNS} from interviews
      where published and language = ${language}
      order by recorded_on desc nulls last, created_at desc`;
  }
  return sql<InterviewRow[]>`select ${COLUMNS} from interviews
    where published order by recorded_on desc nulls last, created_at desc`;
}

export async function latestPublished(n: number): Promise<InterviewRow[]> {
  return sql<InterviewRow[]>`select ${COLUMNS} from interviews
    where published order by recorded_on desc nulls last, created_at desc limit ${n}`;
}

export async function getPublishedBySlug(slug: string): Promise<InterviewRow | null> {
  const [row] = await sql<InterviewRow[]>`select ${COLUMNS} from interviews
    where published and slug = ${slug}`;
  return row ?? null;
}

export async function getById(id: string): Promise<InterviewRow | null> {
  const [row] = await sql<InterviewRow[]>`select ${COLUMNS} from interviews where id = ${id}`;
  return row ?? null;
}

export async function listAll(): Promise<(InterviewRow & { segment_count: number })[]> {
  return sql<(InterviewRow & { segment_count: number })[]>`
    select ${COLUMNS}, (select count(*)::int from segments s where s.interview_id = interviews.id) as segment_count
    from interviews order by created_at desc`;
}

export async function getSegments(interviewId: string): Promise<SegmentRow[]> {
  return sql<SegmentRow[]>`select idx, start_ms, end_ms, original, english
    from segments where interview_id = ${interviewId} order by idx`;
}
