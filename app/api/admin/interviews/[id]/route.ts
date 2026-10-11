import { adminGuard } from '@/lib/auth';
import { sql } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  const b = (await req.json()) as Record<string, unknown>;

  const title = String(b.title ?? '').trim();
  if (!title) return Response.json({ error: 'Title is required' }, { status: 400 });
  const topics = String(b.topics ?? '').split(',').map((t) => t.trim()).filter(Boolean);

  await sql`
    update interviews set
      title = ${title},
      interviewee = ${String(b.interviewee ?? '')},
      language = ${String(b.language ?? 'Nepali')},
      recorded_on = ${b.recorded_on ? String(b.recorded_on) : null},
      location = ${String(b.location ?? '')},
      summary = ${String(b.summary ?? '')},
      topics = ${topics},
      published = ${b.published === true},
      updated_at = now()
    where id = ${id}`;

  return Response.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Params) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  await sql`delete from interviews where id = ${id}`;
  return Response.json({ ok: true });
}
