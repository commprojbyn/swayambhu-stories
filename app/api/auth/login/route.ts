import { COOKIE, constantTimeEq, createSessionToken } from '@/lib/session';

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: unknown; password?: unknown };
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  const adminEmail = (process.env.ADMIN_EMAIL ?? '').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? '';
  const ok =
    !!adminEmail &&
    !!adminPassword &&
    !!process.env.SESSION_SECRET &&
    constantTimeEq(email, adminEmail) &&
    constantTimeEq(password, adminPassword);

  if (!ok) return Response.json({ error: 'Invalid email or password' }, { status: 401 });

  const token = await createSessionToken();
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200${secure}`,
    },
  });
}
