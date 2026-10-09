import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { authenticated } from '../lib/auth.mjs';
import { isOpen } from '../lib/card.mjs';
export default async function music(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (!['GET','HEAD'].includes(req.method)) { res.statusCode=405; return res.end(); }
  if (!authenticated(req) && !isOpen()) { res.statusCode=423; return res.end(); }
  try {
    const bytes=await readFile(resolve('private/audio/from-the-start.mp3'));
    res.setHeader('Content-Type','audio/mpeg'); res.setHeader('Accept-Ranges','bytes');
    const range=req.headers.range;
    if (range) {
      const match=/^bytes=(\d*)-(\d*)$/.exec(range);
      let start=match?.[1] ? Number(match[1]) : Math.max(0,bytes.length-Number(match?.[2]));
      let end=match?.[1] && match[2] ? Math.min(Number(match[2]),bytes.length-1) : bytes.length-1;
      if (!match || (!match[1]&&!match[2]) || !Number.isSafeInteger(start) || start>=bytes.length || end<start) {
        res.statusCode=416;res.setHeader('Content-Range',`bytes */${bytes.length}`);return res.end();
      }
      res.statusCode=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${bytes.length}`);
      res.setHeader('Content-Length',end-start+1);return res.end(req.method==='HEAD' ? undefined : bytes.subarray(start,end+1));
    }
    res.setHeader('Content-Length',bytes.length);return res.end(req.method==='HEAD' ? undefined : bytes);
  } catch {res.statusCode=503;return res.end();}
}
