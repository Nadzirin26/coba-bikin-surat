import { isOpen, opensAt, validateCard } from '../lib/card.mjs';
import { authenticated, sameOrigin } from '../lib/auth.mjs';
import { readCard, saveCard } from '../lib/store.mjs';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const send = (status, data) => { res.statusCode = status; res.end(JSON.stringify(data)); };
  try {
    const admin = authenticated(req);
    if (req.method === 'GET') {
      if (!admin && !isOpen()) return send(423, { locked: true, opensAt, serverNow: Date.now() });
      return send(200, { card: await readCard(), admin, opensAt });
    }
    if (req.method !== 'PUT') { res.setHeader('Allow', 'GET, PUT'); return send(405, { error: 'Metode tidak tersedia.' }); }
    if (!admin) return send(401, { error: 'Silakan masuk lagi.' });
    if (!sameOrigin(req)) return send(403, { error: 'Permintaan tidak diizinkan.' });
    const card = validateCard(req.body);
    await saveCard(card);
    return send(200, { saved: true, card });
  } catch (error) { return send(503, { error: error.message }); }
}
