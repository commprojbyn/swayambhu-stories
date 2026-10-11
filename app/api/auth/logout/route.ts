import { COOKIE } from '@/lib/session';

export async function POST(req: Request) {
  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL('/admin/login', req.url).toString(),
      'Set-Cookie': `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    },
  });
}
