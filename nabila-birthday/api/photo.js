import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { authenticated } from '../lib/auth.mjs';
import { isOpen } from '../lib/card.mjs';
const files = ['01.png', '02.jpg', '03.jpg', '04.png', '05.png', '06.png'];
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') { res.statusCode=405; return res.end(); }
  if (!authenticated(req) && !isOpen()) { res.statusCode=423; return res.end('Foto belum tersedia.'); }
  const id = new URL(req.url, 'http://localhost').searchParams.get('id');
  if (!/^[1-6]$/.test(id || '')) { res.statusCode=404; return res.end(); }
  try {
    const file = files[Number(id)-1];
    const bytes = await readFile(resolve('private/photos', file));
    res.setHeader('Content-Type', file.endsWith('.png') ? 'image/png' : 'image/jpeg');
    return res.end(bytes);
  } catch { res.statusCode=503; return res.end('Foto belum bisa dimuat.'); }
}
