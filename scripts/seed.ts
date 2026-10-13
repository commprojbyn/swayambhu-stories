// Adds placeholder entries. Edit the text below to replace it later.
import 'dotenv/config';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL ?? '', { ssl: 'require', max: 1 });

const aboutNepal = `Nepal is a federal democratic republic in South Asia, lying between India and China in the Himalayas. Its capital, Kathmandu, is also its largest city, and the country is home to eight of the world’s ten highest mountains, including Mount Everest, known in Nepali as Sagarmatha.

Nepali is the official language and the most widely spoken mother tongue, used by about 45 percent of the population. The 2021 national census recorded 124 languages spoken as mother tongues, from Maithili and Bhojpuri to Tharu, Tamang, and Nepal Bhasa (Newari). The census also recognised 142 castes and ethnicities.

Hinduism is the largest religion, practised by about 81 percent of the population according to the 2021 census. Nepal has been a secular state since 2008, but Buddhism has deep roots in the country, especially in the Kathmandu Valley, where Newar Buddhist traditions have flourished for centuries.

In 1979 UNESCO listed seven groups of monuments in the Kathmandu Valley as a single World Heritage Site, including Swayambhu. The April 2015 earthquake damaged or destroyed many of these monuments, and conservation work has continued since.`;

const items = [
  { slug: 'interview-one', title: 'Interview title one', interviewee: 'Interviewee name', language: 'Nepali', recorded_on: '2024-05-14', duration: 2322, topics: ['topic one', 'topic two'], summary: 'Placeholder summary for interview one.' },
  { slug: 'interview-two', title: 'Interview title two', interviewee: 'Interviewee name', language: 'Nepal Bhasa', recorded_on: '2024-05-18', duration: 2778, topics: ['topic one', 'topic three'], summary: 'Placeholder summary for interview two.' },
  { slug: 'about-nepal', title: 'About Nepal', interviewee: 'Archive overview', language: 'English', recorded_on: null, duration: null, topics: ['geography', 'languages', 'religion', 'heritage'], summary: aboutNepal },
];

async function main() {
  for (const it of items) {
    await sql`
      insert into interviews (slug, title, interviewee, language, recorded_on, summary, topics,
                              published, status, duration_seconds)
      values (${it.slug}, ${it.title}, ${it.interviewee}, ${it.language}, ${it.recorded_on},
              ${it.summary}, ${it.topics}, true, 'awaiting_media', ${it.duration})
      on conflict (slug) do nothing`;
  }
  console.log(`Seeded ${items.length} entries.`);
  await sql.end();
}

main().catch(async (err) => {
  console.error(err);
  await sql.end();
  process.exit(1);
});