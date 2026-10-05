import test from 'node:test';
import assert from 'node:assert/strict';
import { isOpen, initialCard, validateCard } from '../lib/card.mjs';
import cardHandler from '../api/card.js';
import { sessionCookie, authenticated, sameOrigin, passwordMatches } from '../lib/auth.mjs';
test('WIB gate opens exactly at midnight on October 10 and stays open', () => {
  assert.equal(isOpen(Date.parse('2026-10-09T16:59:59.999Z')),false);
  assert.equal(isOpen(Date.parse('2026-10-09T17:00:00Z')),true);
  assert.equal(isOpen(Date.parse('2026-10-11T17:00:00Z')),true);
});
test('locked API sends no card or private content', async () => {
  const original = Date.now; Date.now = () => Date.parse('2026-10-05T00:00:00Z');
  let payload; const res = {setHeader(){},end(value){payload=JSON.parse(value)}};
  try { await cardHandler({method:'GET',headers:{}},res); assert.equal(res.statusCode,423); assert.equal(payload.card,undefined); assert.equal(JSON.stringify(payload).includes('Nabila'),false); }
  finally { Date.now = original; }
});
test('editing requires admin session', async () => {
  const res = {setHeader(){},end(){}};
  await cardHandler({method:'PUT',headers:{},body:initialCard},res);
  assert.equal(res.statusCode,401);
});
test('signed sessions reject tampering and expiry', () => {
  process.env.SESSION_SECRET = 'test-only-secret'; process.env.ADMIN_PASSWORD = 'test-password';
  const cookie = sessionCookie().split(';')[0];
  assert.equal(authenticated({headers:{cookie}}),true);
  assert.equal(authenticated({headers:{cookie:cookie.slice(0,-1)+'z'}}),false);
  const now = Date.now; Date.now = () => now()+9*3600000;
  try { assert.equal(authenticated({headers:{cookie}}),false); } finally { Date.now=now; }
  assert.equal(passwordMatches('incorrect'),false); assert.equal(passwordMatches('test-password'),true);
  assert.equal(sameOrigin({headers:{origin:'https://evil.test',host:'card.test'}}),false);
});
test('card rejects empty and oversized values and drops unknown fields', () => {
  assert.throws(()=>validateCard({...initialCard,name:''}));
  assert.throws(()=>validateCard({...initialCard,message:'x'.repeat(8001)}));
  assert.equal(validateCard({...initialCard,admin:true}).admin,undefined);
});
