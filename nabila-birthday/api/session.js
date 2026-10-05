import { authenticated, passwordMatches, sameOrigin, sessionCookie } from '../lib/auth.mjs';
import { limitLogin } from '../lib/store.mjs';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const send = (status, body) => { res.statusCode = status; res.end(JSON.stringify(body)); };
  if (req.method === 'GET') return send(200, { authenticated: authenticated(req) });
  if (!['POST', 'DELETE'].includes(req.method)) return send(405, { error: 'Metode tidak tersedia.' });
  if (!sameOrigin(req)) return send(403, { error: 'Permintaan tidak diizinkan.' });
  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', `birthday_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${process.env.VERCEL ? '; Secure' : ''}`);
    return send(200, { authenticated: false });
  }
  try {
    if (!process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET) return send(503, { error: 'Kata sandi admin belum diatur di server.' });
    const ip = process.env.VERCEL ? req.headers['x-vercel-forwarded-for'] || 'unknown' : req.socket?.remoteAddress || 'local';
    if (!await limitLogin(ip)) return send(429, { error: 'Terlalu banyak percobaan. Coba lagi dalam 10 menit.' });
    if (!passwordMatches(req.body?.password)) return send(401, { error: 'Kata sandinya belum cocok.' });
    res.setHeader('Set-Cookie', sessionCookie());
    return send(200, { authenticated: true });
  } catch (error) { return send(503, { error: error.message }); }
}
