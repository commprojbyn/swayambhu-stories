// Adds the three interviews from the archive preview as placeholders.
// Their recordings and transcripts are added later through the admin upload page.
import 'dotenv/config';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL ?? '', { ssl: 'require', max: 1 });

const items = [
  { slug: 'dawn-rituals-at-swayambhu', title: 'Dawn rituals at Swayambhu', interviewee: 'Maya Shakya', language: 'Nepal Bhasa', recorded_on: '2024-05-14', duration: 2322, topics: ['dawn', 'rituals', 'daily life'], summary: 'A morning-by-morning account of the rituals that open the day at Swayambhu.' },
  { slug: 'life-around-the-western-steps', title: 'Life around the western steps', interviewee: 'Tsering Lama', language: 'Nepali', recorded_on: '2024-05-18', duration: 2778, topics: ['community', 'steps', 'neighbourhood'], summary: 'Memories of living and working along the western approach to the hill.' },
  { slug: 'remembering-the-prayer-wheels', title: 'Remembering the prayer wheels', interviewee: 'Ratna Manandhar', language: 'Nepal Bhasa', recorded_on: '2024-05-22', duration: 1926, topics: ['prayer wheels', 'memory', 'tradition'], summary: 'Recollections of the prayer wheels and how the circuit has changed over the years.' },
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
  console.log(`Seeded ${items.length} placeholder interviews.`);
  await sql.end();
}

main().catch(async (err) => {
  console.error(err);
  await sql.end();
  process.exit(1);
});
