import { sql } from './db';
import { embedQuery, toVector } from './embed';
import type { InterviewRow } from './types';

export type SegmentHit = {
  start_ms: number;
  original: string;
  english: string | null;
  slug: string;
  title: string;
  interviewee: string;
};

export type SearchResults = {
  interviews: InterviewRow[];
  transcriptMatches: SegmentHit[];
  meaningMatches: (SegmentHit & { score: number })[];
};

const INTERVIEW_COLUMNS = sql`id, slug, title, interviewee, language,
  to_char(recorded_on, 'YYYY-MM-DD') as recorded_on, location, summary, topics,
  published, status, error, duration_seconds, video_url, audio_url`;

export async function searchArchive(q: string): Promise<SearchResults> {
  // Escape LIKE wildcards so user input is matched literally.
  const like = `%${q.replace(/[\\%_]/g, (c) => '\\' + c)}%`;

  // 1. Metadata search: title, interviewee, summary, location, topics.
  const interviews = await sql<InterviewRow[]>`
    select ${INTERVIEW_COLUMNS} from interviews
    where published and (
      title ilike ${like} or interviewee ilike ${like} or summary ilike ${like}
      or location ilike ${like} or array_to_string(topics, ' ') ilike ${like}
    )
    order by recorded_on desc nulls last limit 20`;

  // 2. Transcript keyword search, in English translation and original language.
  const transcriptMatches = await sql<SegmentHit[]>`
    select s.start_ms, s.original, s.english, i.slug, i.title, i.interviewee
    from segments s join interviews i on i.id = s.interview_id
    where i.published and (s.english ilike ${like} or s.original ilike ${like})
    order by i.recorded_on desc nulls last, s.start_ms limit 40`;

  // 3. Search by meaning: vector similarity over segment embeddings (pgvector).
  let meaningMatches: (SegmentHit & { score: number })[] = [];
  const vec = await embedQuery(q).catch(() => null);
  if (vec) {
    const lit = toVector(vec);
    meaningMatches = await sql<(SegmentHit & { score: number })[]>`
      select s.start_ms, s.original, s.english, i.slug, i.title, i.interviewee,
             1 - (s.embedding <=> ${lit}::vector) as score
      from segments s join interviews i on i.id = s.interview_id
      where i.published and s.embedding is not null
      order by s.embedding <=> ${lit}::vector limit 8`;
  }

  return { interviews, transcriptMatches, meaningMatches };
}
