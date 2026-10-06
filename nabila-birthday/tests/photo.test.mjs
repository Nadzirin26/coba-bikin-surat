import test from 'node:test';
import assert from 'node:assert/strict';
import photo from '../api/photo.js';
import { sessionCookie } from '../lib/auth.mjs';
test('photos are locked before birthday and private files are not sent', async () => {
  const now = Date.now; Date.now = () => Date.parse('2026-10-06T00:00:00Z');
  let result; const res = { setHeader(){},end(value){result=value;} };
  try { await photo({method:'GET',url:'/api/photo?id=1',headers:{}},res); assert.equal(res.statusCode,423); assert.equal(typeof result,'string'); }
  finally { Date.now=now; }
});
test('admin can preview photos and arbitrary paths are rejected', async () => {
  process.env.SESSION_SECRET='photo-test-secret';
  const cookie=sessionCookie().split(';')[0];
  let result; const res={setHeader(){},end(value){result=value;}};
  await photo({method:'GET',url:'/api/photo?id=1',headers:{cookie}},res);
  assert.ok(Buffer.isBuffer(result)); assert.equal(result.readUInt32BE(0),0x89504e47);
  await photo({method:'GET',url:'/api/photo?id=../../.env.local',headers:{cookie}},res);
  assert.equal(res.statusCode,404);
});
