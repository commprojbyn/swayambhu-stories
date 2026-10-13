import Link from 'next/link';

const chapters = [
  { n: 'I', title: 'Chapter one title', body: 'Placeholder text for the first chapter.', img: '/images/story-1.jpg', caption: 'Image placeholder' },
  { n: 'II', title: 'Chapter two title', body: 'Placeholder text for the second chapter.', img: '/images/story-2.jpg', caption: 'Image placeholder' },
  { n: 'III', title: 'Chapter three title', body: 'Placeholder text for the third chapter.', img: '/images/story-3.jpg', caption: 'Image placeholder' },
  { n: 'IV', title: 'Chapter four title', body: 'Placeholder text for the fourth chapter.', img: '/images/story-4.jpg', caption: 'Image placeholder' },
  { n: 'V', title: 'Chapter five title', body: 'Placeholder text for the fifth chapter.', img: '/images/story-5.jpg', caption: 'Image placeholder' },
];

export default function StoryPage() {
  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <section
        className="story-hero"
        style={{ backgroundImage: "linear-gradient(180deg, rgba(20,16,12,0.15), rgba(20,16,12,0.75)), url('/images/story-hero.jpg')" }}
      >
        <div>
          <p className="eyebrow" style={{ color: '#f1d9c9' }}>Subtitle</p>
          <h1>Story title</h1>
          <p>Placeholder introduction.</p>
        </div>
      </section>

      <div className="stat-strip">
        <div className="stat"><strong>0</strong>Stat label one</div>
        <div className="stat"><strong>0</strong>Stat label two</div>
        <div className="stat"><strong>0</strong>Stat label three</div>
        <div className="stat"><strong>0</strong>Stat label four</div>
      </div>

      {chapters.map((c) => (
        <section key={c.n} className="chapter">
          <div>
            <div className="chapter-number">CHAPTER {c.n}</div>
            <h2 style={{ marginTop: 10 }}>{c.title}</h2>
            <p className="lead" style={{ fontSize: '1.05rem' }}>{c.body}</p>
          </div>
          <figure className="chapter-media" style={{ margin: 0 }}>
            <div className="story-img" role="img" aria-label={c.title} style={{ backgroundImage: `url('${c.img}')` }} />
            <figcaption className="caption">{c.caption}</figcaption>
          </figure>
        </section>
      ))}

      <blockquote className="pull">“Placeholder quotation.”</blockquote>

      <section className="section" style={{ textAlign: 'center', paddingBottom: 0 }}>
        <h2>Call to action heading</h2>
        <p className="lead" style={{ margin: '0 auto 24px' }}>Placeholder line.</p>
        <Link href="/archive" className="btn">Go to the archive →</Link>
      </section>
    </div>
  );
}