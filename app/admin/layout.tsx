import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="admin-bar">
        <div className="inner">
          <div style={{ display: 'flex', gap: 20 }}>
            <strong>Admin</strong>
            <Link href="/admin">Interviews</Link>
            <Link href="/admin/new">Upload interview</Link>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Link href="/">View public site</Link>
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="btn btn-ghost" style={{ padding: '6px 12px', background: 'transparent', color: '#e9e4dd', borderColor: '#5a514a' }}>
                Log out
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>{children}</div>
    </>
  );
}
