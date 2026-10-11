import { cookies } from 'next/headers';
import { COOKIE, verifySessionToken } from './session';

// Use at the top of every admin route handler (defence in depth on top of middleware).
export async function adminGuard(): Promise<Response | null> {
  const store = await cookies();
  const ok = await verifySessionToken(store.get(COOKIE)?.value);
  return ok ? null : Response.json({ error: 'Unauthorized' }, { status: 401 });
}
