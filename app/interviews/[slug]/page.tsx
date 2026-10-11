import { notFound } from 'next/navigation';
import InterviewPlayer from '@/components/InterviewPlayer';
import { getPublishedBySlug, getSegments } from '@/lib/interviews';
import { formatDate, formatDuration } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function InterviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { slug } = await params;
  const { t } = await searchParams;
  const iv = await getPublishedBySlug(slug);
  if (!iv) notFound();

  const segments = await getSegments(iv.id);
  const start = t ? Number(t) : undefined;

  return (
    <article className="container">
      <header className="interview-head">
        <p className="eyebrow">Interview · {iv.language}</p>
        <h1>{iv.title}</h1>
        <p className="muted small" style={{ marginBottom: 0 }}>
          Interviewee: {iv.interviewee} · {iv.language} · {formatDuration(iv.duration_seconds)} · Recorded {formatDate(iv.recorded_on)} · {iv.location}
        </p>
      </header>

      <InterviewPlayer
        videoUrl={iv.video_url}
        segments={segments}
        initialSeconds={Number.isFinite(start) ? start : undefined}
      />

      {(iv.summary || iv.topics.length > 0) && (
        <section className="summary-block">
          {iv.summary && <p className="lead" style={{ fontSize: '1.05rem' }}>{iv.summary}</p>}
          {iv.topics.length > 0 && (
            <div>{iv.topics.map((tp) => <span key={tp} className="topic">{tp}</span>)}</div>
          )}
        </section>
      )}
    </article>
  );
}
