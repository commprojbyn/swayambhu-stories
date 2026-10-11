import Link from 'next/link';
import SearchBox from '@/components/SearchBox';
import InterviewCard from '@/components/InterviewCard';
import { latestPublished } from '@/lib/interviews';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const recent = await latestPublished(3);

  return (
    <>
      <section className="container hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Oral histories · Swayambhu, Kathmandu</p>
            <h1>An archive of voices, memories and lived heritage.</h1>
            <p className="lead">
              Explore recorded interviews with people connected to Swayambhu. Search their words,
              listen to their stories, and read along in Nepali, Nepal Bhasa and English.
            </p>

            <SearchBox />
            <p className="hint">
              Search across interview transcripts by meaning, not just exact words. Try a question in English to find relevant moments.
            </p>

            <Link href="/archive" className="btn btn-ghost">Browse all interviews →</Link>
          </div>

          <figure style={{ margin: 0 }}>
            <div className="figure-frame">
              <div
                className="photo"
                role="img"
                aria-label="Swayambhu stupa"
                style={{ backgroundImage: "url('/images/swayambhu-hero.jpg')" }}
              />
            </div>
            <figcaption>Swayambhu, Kathmandu — the place at the heart of these conversations.</figcaption>
          </figure>
        </div>
      </section>

      <section className="container section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <h2>Recently added interviews</h2>
            <p className="muted small" style={{ margin: 0 }}>
              Original recordings with timestamped transcripts. English translations are shown when available.
            </p>
          </div>
          <Link href="/archive" className="small" style={{ fontWeight: 500 }}>View all interviews →</Link>
        </div>

        {recent.length > 0 ? (
          <div className="list">
            {recent.map((iv) => <InterviewCard key={iv.id} iv={iv} />)}
          </div>
        ) : (
          <p className="muted">No interviews have been published yet.</p>
        )}
      </section>

      <section className="container section" style={{ paddingTop: 0 }}>
        <div className="story-hero" style={{ backgroundImage: "linear-gradient(180deg, rgba(20,16,12,0.15), rgba(20,16,12,0.75)), url('/images/story-hero.jpg')" }}>
          <div>
            <p className="eyebrow" style={{ color: '#f1d9c9' }}>A visual story</p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>A hilltop, a valley, and the people who keep them alive.</h2>
            <p>Walk through the stupa, its rituals and the voices that carry its memory.</p>
            <Link href="/story" className="btn" style={{ marginTop: 12 }}>Read the story →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
