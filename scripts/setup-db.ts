// Creates tables and the pgvector extension. Safe to run more than once.
// Usage: npm run db:setup   (needs POSTGRES_URL in .env.local)
import 'dotenv/config';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL ?? '', { ssl: 'require', max: 1 });

const schema = `
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  interviewee text NOT NULL DEFAULT '',
  language text NOT NULL DEFAULT 'Nepali',
  recorded_on date,
  location text NOT NULL DEFAULT 'Swayambhu, Kathmandu',
  summary text NOT NULL DEFAULT '',
  topics text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'awaiting_media',
  error text,
  duration_seconds integer,
  video_url text,
  audio_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS segments (
  id bigserial PRIMARY KEY,
  interview_id uuid NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  idx integer NOT NULL,
  start_ms integer NOT NULL,
  end_ms integer NOT NULL,
  original text NOT NULL,
  english text,
  embedding vector(256)
);

CREATE INDEX IF NOT EXISTS segments_interview_idx ON segments (interview_id, idx);
CREATE INDEX IF NOT EXISTS segments_embedding_idx ON segments USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS interviews_published_idx ON interviews (published, recorded_on);
`;

async function main() {
  await sql.unsafe(schema);
  console.log('Database schema is ready.');
  await sql.end();
}

main().catch(async (err) => {
  console.error(err);
  await sql.end();
  process.exit(1);
});
