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
  const hasMedia = !!iv.video_url || segments.length > 0;
  const paragraphs = iv.summary.split(/\n\s*\n/).filter(Boolean);

  return (
    <article className="container">
      <header className="interview-head">
        <p className="eyebrow">{hasMedia ? `Interview · ${iv.language}` : `Archive entry · ${iv.language}`}</p>
        <h1>{iv.title}</h1>
        <p className="muted small" style={{ marginBottom: 0 }}>
          {hasMedia
            ? `Interviewee: ${iv.interviewee} · ${iv.language} · ${formatDuration(iv.duration_seconds)} · Recorded ${formatDate(iv.recorded_on)} · ${iv.location}`
            : iv.interviewee}
        </p>
      </header>

      {hasMedia && (
        <InterviewPlayer
          videoUrl={iv.video_url}
          segments={segments}
          initialSeconds={Number.isFinite(start) ? start : undefined}
        />
      )}

      {(paragraphs.length > 0 || iv.topics.length > 0) && (
        <section className="summary-block" style={hasMedia ? undefined : { marginTop: 8 }}>
          {paragraphs.map((p, i) => (
            <p key={i} className="lead" style={{ fontSize: '1.05rem' }}>{p}</p>
          ))}
          {iv.topics.length > 0 && (
            <div style={{ marginTop: 16 }}>
              {iv.topics.map((tp) => <span key={tp} className="topic">{tp}</span>)}
            </div>
          )}
        </section>
      )}
    </article>
  );
}