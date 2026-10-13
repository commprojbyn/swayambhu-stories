import Link from 'next/link';

const chapters = [
  {
    n: 'I',
    title: 'A hill above the valley',
    body: [
      'Swayambhunath sits on a wooded hill west of the city of Kathmandu, in the Kathmandu Valley. It is a Buddhist religious complex made up of a great stupa, shrines, and temples, some of which trace back to the Licchavi period.',
      'Its full name, Swayambhu, is often translated as “self-arisen.” The site has been a place of worship for well over a thousand years, and it is one of the oldest religious sites in Nepal.',
    ],
    img: '/images/heritage-1.jpg',
    caption: 'The hill and its approach. Photo credit: add when you add the image.',
  },
  {
    n: 'II',
    title: 'The legend of the lake',
    body: [
      'Local tradition tells of a time when the Kathmandu Valley was a great lake. The bodhisattva Manjushri, associated with wisdom, is said to have drained the water, and the lotus that rose from the lake became the hill on which the stupa stands.',
      'Geological evidence supports the idea that the valley was once a lake, which is one reason the legend is still told alongside the history.',
    ],
    img: '/images/heritage-2.jpg',
    caption: 'View across the valley. Photo credit: add when you add the image.',
  },
  {
    n: 'III',
    title: 'A white dome and watching eyes',
    body: [
      'The stupa has a white dome, a symbol of the earth, topped by a gilded spire. Painted eyes look out in all four directions across the valley, and carvings of the five Buddhas (Panch Buddhas) appear on the four sides.',
      'The site reflects Vajrayana Buddhism and the Newar Buddhist tradition, and it also includes Hindu shrines. Its art and architecture show how the two traditions have blended in Nepal.',
    ],
    img: '/images/heritage-3.jpg',
    caption: 'The stupa’s eyes and spire. Photo credit: add when you add the image.',
  },
  {
    n: 'IV',
    title: 'Centuries of repair',
    body: [
      'In 1504 a Tibetan Buddhist master, Tsangnyön Heruka, was invited to renovate the stupa, which he completed within three months. In the 17th century, King Pratap Malla built the long stone stairway that visitors still climb today.',
      'The stupa was thoroughly renovated in 2010, when the shrine was re-gilded with about 20 kilograms of gold. The 2015 earthquake damaged the site, and reconstruction and conservation work has been ongoing since then, supported by UNESCO and local authorities.',
    ],
    img: '/images/heritage-4.jpg',
    caption: 'The stone stairway. Photo credit: add when you add the image.',
  },
  {
    n: 'V',
    title: 'Everyday devotion',
    body: [
      'Pilgrims, monks, and visitors walk clockwise around the stupa, turning prayer wheels, lighting butter lamps, and offering incense. The hilltop is also home to many monkeys, which is why the site is widely known as the Monkey Temple.',
      'For many people, the site is not only a monument but a living centre of worship, where rituals continue each morning and evening.',
    ],
    img: '/images/heritage-5.jpg',
    caption: 'Prayer wheels along the circuit. Photo credit: add when you add the image.',
  },
];

const sources = [
  { label: 'Swayambhunath, Wikipedia', url: 'https://en.wikipedia.org/wiki/Swayambhunath' },
  { label: 'UNESCO World Heritage: Kathmandu Valley', url: 'https://whc.unesco.org/document/140592' },
  { label: 'Monument Moments: Swayambhunath, Lancaster University', url: 'https://www.lancaster.ac.uk/edi/engagement/sahm/nepal/' },
  { label: 'National Geographic: Nepal earthquake and heritage', url: 'https://www.nationalgeographic.com/culture/article/150608-nepal-kathmandu-earthquake-history-archaeology-world' },
];

export default function HeritagePage() {
  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <section
        className="story-hero"
        style={{ backgroundImage: "linear-gradient(180deg, rgba(20,16,12,0.15), rgba(20,16,12,0.75)), url('/images/heritage-hero.jpg')" }}
      >
        <div>
          <p className="eyebrow" style={{ color: '#f1d9c9' }}>About Swayambhu · Kathmandu, Nepal</p>
          <h1>Swayambhu Heritage</h1>
          <p>A hilltop Buddhist complex above the Kathmandu Valley, and a UNESCO World Heritage Site since 1979.</p>
        </div>
      </section>

      <div className="stat-strip">
        <div className="stat"><strong>1979</strong>UNESCO World Heritage listing (Kathmandu Valley)</div>
        <div className="stat"><strong>17th c.</strong>Pratap Malla’s stone stairway</div>
        <div className="stat"><strong>20 kg</strong>Gold used in the 2010 re-gilding</div>
        <div className="stat"><strong>Clockwise</strong>The traditional circuit of the stupa</div>
      </div>

      {chapters.map((c) => (
        <section key={c.n} className="chapter">
          <div>
            <div className="chapter-number">CHAPTER {c.n}</div>
            <h2 style={{ marginTop: 10 }}>{c.title}</h2>
            {c.body.map((p, i) => (
              <p key={i} className="lead" style={{ fontSize: '1.05rem' }}>{p}</p>
            ))}
          </div>
          <figure className="chapter-media" style={{ margin: 0 }}>
            <div className="story-img" role="img" aria-label={c.title} style={{ backgroundImage: `url('${c.img}')` }} />
            <figcaption className="caption">{c.caption}</figcaption>
          </figure>
        </section>
      ))}

      <section className="section" style={{ paddingTop: 0 }}>
        <h2 style={{ fontSize: '1.5rem' }}>Sources</h2>
        <ul className="small muted" style={{ paddingLeft: 18 }}>
          {sources.map((s) => (
            <li key={s.url} style={{ marginBottom: 6 }}>
              <a href={s.url} target="_blank" rel="noreferrer">{s.label}</a>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" style={{ textAlign: 'center', paddingBottom: 0 }}>
        <h2>Explore the archive</h2>
        <p className="lead" style={{ margin: '0 auto 24px' }}>Listen to recorded interviews and read the transcripts.</p>
        <Link href="/archive" className="btn">Go to the archive →</Link>
      </section>
    </div>
  );
}