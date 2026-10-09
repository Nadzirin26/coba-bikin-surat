import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import card from './api/card.js';
import session from './api/session.js';
import photo from './api/photo.js';
import music from './api/music.js';
const root = resolve('public');
createServer(async (req, res) => {
  try {
    const path = new URL(req.url, 'http://localhost').pathname;
    if (path === '/api/card' || path === '/api/session' || path === '/api/photo' || path === '/api/music') {
      if (['POST', 'PUT'].includes(req.method)) {
        let body = '';
        for await (const chunk of req) { body += chunk; if (Buffer.byteLength(body) > 20000) { res.writeHead(413); res.end(); return; } }
        try { req.body = JSON.parse(body || '{}'); } catch { res.writeHead(400); res.end(); return; }
      }
      return await (path === '/api/card' ? card : path === '/api/photo' ? photo : path === '/api/music' ? music : session)(req, res);
    }
    const file = resolve(root, '.' + (path === '/' ? '/index.html' : path === '/admin' ? '/admin.html' : decodeURIComponent(path)));
    if (!file.startsWith(root + sep)) { res.writeHead(403); res.end(); return; }
    const bytes = await readFile(file);
    res.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg' })[extname(file)] || 'application/octet-stream');
    res.end(bytes);
  } catch { res.writeHead(404); res.end('Tidak ditemukan.'); }
}).listen(3000, '127.0.0.1', () => console.log('Kartu Nabila: http://localhost:3000 | Editor: http://localhost:3000/admin'));
