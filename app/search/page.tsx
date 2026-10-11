import Link from 'next/link';
import SearchBox from '@/components/SearchBox';
import InterviewCard from '@/components/InterviewCard';
import { searchArchive, type SegmentHit } from '@/lib/search';
import { formatClock } from '@/lib/format';

export const dynamic = 'force-dynamic';

function Moment({ hit, score }: { hit: SegmentHit; score?: number }) {
  const seconds = Math.floor(hit.start_ms / 1000);
  return (
    <div className="result">
      <h3>
        <Link href={`/interviews/${hit.slug}?t=${seconds}`} style={{ color: 'inherit' }}>{hit.title}</Link>
      </h3>
      <div className="small muted">
        {hit.interviewee} · at {formatClock(hit.start_ms)}
        {score !== undefined && <> · {Math.round(score * 100)}% match</>}
      </div>
      {hit.english && <p className="quote">{hit.english}</p>}
      <p className="small deva muted" lang="ne" style={{ margin: '4px 0 0' }}>{hit.original}</p>
      <div className="ts-link" style={{ marginTop: 8 }}>
        <Link href={`/interviews/${hit.slug}?t=${seconds}`}>Play from {formatClock(hit.start_ms)} →</Link>
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const query = q.trim();
  const results = query ? await searchArchive(query) : null;
  const total = results ? results.interviews.length + results.transcriptMatches.length + results.meaningMatches.length : 0;

  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <p className="eyebrow">Search</p>
      <h1>{query ? <>Results for “{query}”</> : 'Search the archive'}</h1>
      <div style={{ margin: '20px 0 8px' }}>
        <SearchBox defaultValue={query} />
      </div>
      {!query && <p className="muted small">Search interview titles, interviewees, topics, and the words spoken in transcripts.</p>}

      {results && (
        <>
          <p className="muted small">{total} result{total === 1 ? '' : 's'} across metadata, transcripts and meaning.</p>

          {results.meaningMatches.length > 0 && (
            <>
              <h2 className="group-title">Related by meaning</h2>
              {results.meaningMatches.map((h, i) => <Moment key={i} hit={h} score={h.score} />)}
            </>
          )}

          {results.interviews.length > 0 && (
            <>
              <h2 className="group-title">Interviews matching your search</h2>
              <div className="list">
                {results.interviews.map((iv) => <InterviewCard key={iv.id} iv={iv} />)}
              </div>
            </>
          )}

          {results.transcriptMatches.length > 0 && (
            <>
              <h2 className="group-title">Moments in transcripts</h2>
              {results.transcriptMatches.map((h, i) => <Moment key={i} hit={h} />)}
            </>
          )}

          {total === 0 && (
            <div className="result">
              <p style={{ margin: 0 }}>Nothing matched “{query}”. Try a shorter word, a different language, or a broader question.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
