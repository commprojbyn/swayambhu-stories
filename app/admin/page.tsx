import Link from 'next/link';
import { listAll } from '@/lib/interviews';
import { formatDate, formatDuration } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const rows = await listAll();
  return (
    <>
      <div className="section-head">
        <div>
          <h1 style={{ fontSize: '2.2rem' }}>Interviews</h1>
          <p className="muted small">Upload recordings, add metadata, and review generated transcripts.</p>
        </div>
        <Link href="/admin/new" className="btn">+ Upload interview</Link>
      </div>

      {rows.length === 0 ? (
        <p className="muted">No interviews yet. Upload the first one to begin.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Interviewee</th>
              <th>Language</th>
              <th>Recorded</th>
              <th>Duration</th>
              <th>Segments</th>
              <th>Status</th>
              <th>Public</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td><Link href={`/admin/interviews/${r.id}`}><strong>{r.title}</strong></Link></td>
                <td>{r.interviewee}</td>
                <td>{r.language}</td>
                <td>{formatDate(r.recorded_on)}</td>
                <td>{formatDuration(r.duration_seconds)}</td>
                <td>{r.segment_count}</td>
                <td><span className={`badge ${r.status}`}>{r.status.replace('_', ' ')}</span></td>
                <td>{r.published ? 'Yes' : 'Hidden'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
