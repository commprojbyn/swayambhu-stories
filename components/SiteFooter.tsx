import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="inner">
        <span>Swayambhu Stories · A living oral-history archive</span>
        <span>
          <Link href="/about" className="muted">Access &amp; consent</Link> · <Link href="/about#contact" className="muted">Contact</Link>
        </span>
      </div>
    </footer>
  );
}
