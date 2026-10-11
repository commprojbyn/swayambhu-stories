import Link from 'next/link';

const chapters = [
  {
    n: 'I',
    title: 'A hill above the valley',
    body:
      'Long before the city spread across the Kathmandu Valley, a hill rose in the west and became a place of prayer. Swayambhu is reached by a climb of stone steps, and every visitor arrives breathing hard, looking back at the valley as the city opens below.',
    img: '/images/story-1.jpg',
    caption: 'The approach to the hill. Add your own photograph to public/images/story-1.jpg.',
  },
  {
    n: 'II',
    title: 'Eyes that watch in four directions',
    body:
      'The stupa’s gilded spire and painted eyes look out over the valley. Many visitors say the face between the eyes resembles the Nepali numeral one, a small reminder that this is a place where ordinary people and ancient ideas meet.',
    img: '/images/story-2.jpg',
    caption: 'The painted eyes of the stupa. Replace with your own image.',
  },
  {
    n: 'III',
    title: 'The morning circuit',
    body:
      'Before the crowds arrive, devotees walk clockwise around the stupa, turning prayer wheels, lighting butter lamps and murmuring mantras. These are the dawn rituals that many of the people in this archive grew up with.',
    img: '/images/story-3.jpg',
    caption: 'Prayer wheels along the circuit. Replace with your own image.',
  },
  {
    n: 'IV',
    title: 'Many languages, one hill',
    body:
      'Nepali, Nepal Bhasa and English are all spoken here, often within a single conversation. The archive keeps each interview in the language it was recorded in, and provides an English reading so that these voices can travel further.',
    img: '/images/story-4.jpg',
    caption: 'Neighbourhood life around the western steps. Replace with your own image.',
  },
  {
    n: 'V',
    title: 'Why we listen',
    body:
      'Much of what this place means is carried in memory: who lit which lamp, how a festival used to be, what changed after a particular year. When those memories are recorded and searchable, they stop depending on a single person’s life to survive.',
    img: '/images/story-5.jpg',
    caption: 'Interview recording. Replace with your own image.',
  },
];

export default function StoryPage() {
  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <section className="story-hero" style={{ backgroundImage: "linear-gradient(180deg, rgba(20,16,12,0.15), rgba(20,16,12,0.75)), url('/images/story-hero.jpg')" }}>
        <div>
          <p className="eyebrow" style={{ color: '#f1d9c9' }}>Swayambhu, Kathmandu</p>
          <h1>A hill that has held prayer for centuries.</h1>
          <p>A short visual journey through the place at the centre of these conversations, and the people who remember it.</p>
        </div>
      </section>

      <div className="stat-strip">
        <div className="stat"><strong>3</strong>Interviews in the first collection</div>
        <div className="stat"><strong>3</strong>Languages: Nepali, Nepal Bhasa, English</div>
        <div className="stat"><strong>Timestamped</strong>Every passage links to the recording</div>
        <div className="stat"><strong>Searchable</strong>By word, topic and meaning</div>
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

      <blockquote className="pull">
        “The stories are the monument. Stones endure, but the voices of those who tend them give the stones their meaning.”
      </blockquote>

      <section className="section" style={{ textAlign: 'center', paddingBottom: 0 }}>
        <h2>Begin with a voice.</h2>
        <p className="lead" style={{ margin: '0 auto 24px' }}>Listen to a recorded interview, or search for a moment in its words.</p>
        <Link href="/archive" className="btn">Explore the archive →</Link>
      </section>
    </div>
  );
}
