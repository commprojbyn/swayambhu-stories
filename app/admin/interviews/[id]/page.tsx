import { notFound } from 'next/navigation';
import EditForm from '@/components/EditForm';
import { getById, getSegments } from '@/lib/interviews';

export const dynamic = 'force-dynamic';

export default async function AdminInterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const iv = await getById(id);
  if (!iv) notFound();
  const segments = await getSegments(iv.id);

  return (
    <>
      <p className="eyebrow">Interview</p>
      <h1 style={{ fontSize: '2rem', marginBottom: 24 }}>{iv.title}</h1>
      <EditForm iv={iv} />

      {segments.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: '1.5rem' }}>Transcript preview ({segments.length} passages)</h2>
          <div className="list" style={{ maxHeight: 420, overflowY: 'auto' }}>
            {segments.map((s) => (
              <div key={s.idx} className="row" style={{ gridTemplateColumns: '70px 1fr 1fr' }}>
                <span className="small muted">{Math.floor(s.start_ms / 1000)}s</span>
                <span className="deva" lang="ne" style={{ fontSize: '0.92rem' }}>{s.original}</span>
                <span style={{ fontSize: '0.92rem' }}>{s.english ?? <em className="muted">No translation</em>}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
