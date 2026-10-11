import Link from 'next/link';
import type { InterviewRow } from '@/lib/types';
import { formatDate, formatDuration } from '@/lib/format';

export default function InterviewCard({ iv }: { iv: InterviewRow }) {
  return (
    <Link href={`/interviews/${iv.slug}`} className="row" style={{ color: 'inherit' }}>
      <div className="thumb" />
      <div>
        <h3>{iv.title}</h3>
        <div className="meta">
          Interviewee: {iv.interviewee} · {iv.language} · {formatDuration(iv.duration_seconds)}
        </div>
      </div>
      <div className="meta-col">
        <div className="label">Recorded</div>
        <div className="date">{formatDate(iv.recorded_on)}</div>
      </div>
      <div className="open" style={{ color: 'var(--accent)' }}>Open interview →</div>
    </Link>
  );
}
