import { createHmac, timingSafeEqual, createHash } from 'node:crypto';
const digest = value => createHash('sha256').update(value).digest();
export const passwordMatches = value => typeof value === 'string' && !!process.env.ADMIN_PASSWORD && timingSafeEqual(digest(value), digest(process.env.ADMIN_PASSWORD));
const sign = value => createHmac('sha256', process.env.SESSION_SECRET).update(value).digest('hex');
export function sessionCookie() {
  if (!process.env.SESSION_SECRET) throw new Error('SESSION_SECRET belum diatur.');
  const expiry = String(Date.now() + 8 * 60 * 60 * 1000);
  return `birthday_session=${expiry}.${sign(expiry)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${process.env.VERCEL ? '; Secure' : ''}`;
}
export function authenticated(req) {
  if (!process.env.SESSION_SECRET) return false;
  const token = (req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith('birthday_session='))?.split('=')[1];
  if (!token) return false;
  const [expiry, signature] = token.split('.');
  if (!/^\d+$/.test(expiry) || !/^[a-f0-9]{64}$/.test(signature || '') || Date.now() >= Number(expiry)) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(sign(expiry)));
}
export function sameOrigin(req) {
  try { return new URL(req.headers.origin).host === req.headers.host; } catch { return false; }
}
