import Link from 'next/link';
import InterviewCard from '@/components/InterviewCard';
import SearchBox from '@/components/SearchBox';
import { listPublished } from '@/lib/interviews';
import { LANGUAGES } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ArchivePage({ searchParams }: { searchParams: Promise<{ language?: string }> }) {
  const { language } = await searchParams;
  const active = LANGUAGES.find((l) => l === language);
  const interviews = await listPublished(active);

  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <p className="eyebrow">Archive</p>
      <h1>All interviews</h1>
      <p className="lead">Original recordings with timestamped transcripts. Search across titles, people, topics and spoken words.</p>

      <div style={{ margin: '24px 0 28px' }}>
        <SearchBox />
      </div>

      <div className="section-head" style={{ marginBottom: 14 }}>
        <div className="seg-toggle">
          <Link href="/archive" className={!active ? 'btn' : ''} style={{ padding: '8px 12px', fontSize: '0.85rem', color: !active ? '#fff' : 'var(--muted)', border: 0 }}>All</Link>
          {LANGUAGES.map((l) => (
            <Link key={l} href={`/archive?language=${encodeURIComponent(l)}`} style={{ padding: '8px 12px', fontSize: '0.85rem', color: active === l ? '#fff' : 'var(--muted)', background: active === l ? 'var(--accent)' : '#fff' }}>
              {l}
            </Link>
          ))}
        </div>
        <span className="small muted">{interviews.length} interview{interviews.length === 1 ? '' : 's'}</span>
      </div>

      {interviews.length ? (
        <div className="list">{interviews.map((iv) => <InterviewCard key={iv.id} iv={iv} />)}</div>
      ) : (
        <p className="muted">No interviews match this filter yet.</p>
      )}
    </div>
  );
}
