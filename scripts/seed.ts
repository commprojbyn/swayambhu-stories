// Adds three placeholder interviews. Edit the text below to replace it later.
import 'dotenv/config';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL ?? '', { ssl: 'require', max: 1 });

const items = [
  { slug: 'interview-one', title: 'Interview title one', interviewee: 'Interviewee name', language: 'Nepali', recorded_on: '2024-05-14', duration: 2322, topics: ['topic one', 'topic two'], summary: 'Placeholder summary for interview one.' },
  { slug: 'interview-two', title: 'Interview title two', interviewee: 'Interviewee name', language: 'Nepal Bhasa', recorded_on: '2024-05-18', duration: 2778, topics: ['topic one', 'topic three'], summary: 'Placeholder summary for interview two.' },
  { slug: 'interview-three', title: 'Interview title three', interviewee: 'Interviewee name', language: 'English', recorded_on: '2024-05-22', duration: 1926, topics: ['topic two', 'topic three'], summary: 'Placeholder summary for interview three.' },
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