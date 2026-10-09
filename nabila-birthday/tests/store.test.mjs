import test from 'node:test';
import assert from 'node:assert/strict';
import { readCard, saveCard } from '../lib/store.mjs';
import { initialCard } from '../lib/card.mjs';
test('production serves bundled birthday card without Redis and rejects unsaved edits', async () => {
  const previous = { VERCEL: process.env.VERCEL, UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL };
  process.env.VERCEL = '1'; delete process.env.UPSTASH_REDIS_REST_URL;
  try {
    assert.deepEqual(await readCard(), initialCard);
    await assert.rejects(saveCard(initialCard), /Penyimpanan online/);
  } finally {
    for (const [key,value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});
