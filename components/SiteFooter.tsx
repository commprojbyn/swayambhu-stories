import Link from 'next/link';
// for

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="inner">
        <span>Swayambhu Stories · A living oral-history archive</span>
        <span>
          <Link href="/about" className="muted">Access &amp; consent</Link> ·{' '}
          <Link href="/contact" className="muted">Contact</Link> ·{' '}
          <Link href="/admin/login" className="muted">Admin Sign in</Link>
        </span>
      </div>
    </footer>
  );
}