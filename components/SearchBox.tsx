export default function SearchBox({ defaultValue = '' }: { defaultValue?: string }) {
  return (
    <form action="/search" method="get" role="search">
      <div className="hero-search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ color: 'var(--muted)' }}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder="How have morning rituals changed?"
          aria-label="Search transcripts and interviews"
        />
        <button className="btn" type="submit">Search transcripts</button>
      </div>
    </form>
  );
}
