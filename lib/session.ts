// Web Crypto based session tokens so the same code runs in middleware (edge)
// and in Node route handlers.
export const COOKIE = 'ss_admin';
const TWELVE_HOURS = 1000 * 60 * 60 * 12;
const enc = new TextEncoder();

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(process.env.SESSION_SECRET ?? 'missing-secret'),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function constantTimeEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(): Promise<string> {
  const payload = String(Date.now() + TWELVE_HOURS);
  return `${payload}.${await hmac(payload)}`;
}

export async function verifySessionToken(token?: string | null): Promise<boolean> {
  if (!token || !process.env.SESSION_SECRET) return false;
  const [expiry, sig] = token.split('.');
  if (!expiry || !sig) return false;
  if (Number(expiry) < Date.now()) return false;
  return constantTimeEq(sig, await hmac(expiry));
}
