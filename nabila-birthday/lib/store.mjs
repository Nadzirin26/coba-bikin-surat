import { readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import { initialCard } from './card.mjs';
const key = 'nabila:birthday:card:v1';
export async function redis(command) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Penyimpanan online belum terhubung. Hubungkan Upstash Redis di Vercel.');
  const response = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(command), signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('Penyimpanan belum bisa diakses. Coba lagi nanti.');
  const data = await response.json();
  if (data.error) throw new Error('Penyimpanan gagal memproses permintaan.');
  return data.result;
}
export async function readCard() {
  if (process.env.UPSTASH_REDIS_REST_URL) {
    const value = await redis(['GET', key]);
    return value ? JSON.parse(value) : initialCard;
  }
  // The deployed card remains readable even before online editing is configured.
  if (process.env.VERCEL) return initialCard;
  try { return JSON.parse(await readFile('.local/card.json', 'utf8')); }
  catch (e) { if (e.code === 'ENOENT') return initialCard; throw e; }
}
export async function saveCard(card) {
  if (process.env.UPSTASH_REDIS_REST_URL) return redis(['SET', key, JSON.stringify(card)]);
  if (process.env.VERCEL) throw new Error('Penyimpanan online belum terhubung.');
  await mkdir('.local', { recursive: true });
  await writeFile('.local/card.tmp', JSON.stringify(card, null, 2));
  await rename('.local/card.tmp', '.local/card.json');
}
const attempts = new Map();
export async function limitLogin(ip) {
  if (process.env.VERCEL || process.env.UPSTASH_REDIS_REST_URL) {
    const key = `nabila:login:${ip}:${Math.floor(Date.now() / 600000)}`;
    const count = await redis(['INCR', key]);
    if (count === 1) await redis(['EXPIRE', key, 660]);
    return count <= 10;
  }
  const key = `${ip}:${Math.floor(Date.now() / 600000)}`;
  if (attempts.size > 1000) attempts.clear();
  const count = (attempts.get(key) || 0) + 1;
  attempts.set(key, count);
  return count <= 10;
}
