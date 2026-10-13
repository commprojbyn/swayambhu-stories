// for
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// header
const links = [
  { href: '/archive', label: 'Archive' },
  { href: '/story', label: 'The story' },
  { href: '/about', label: 'About the archive' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return (
    <header className="site-header">
      <div className="inner">
        <Link href="/" className="brand">
          Swayambhu Stories
        </Link>
        <nav className="nav">
          {links.map((l) => {
            const active =
              l.href === '/archive'
                ? pathname.startsWith('/archive') || pathname.startsWith('/interviews')
                : pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className={active ? 'active' : undefined}>
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}