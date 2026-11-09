import test from 'node:test';
import assert from 'node:assert/strict';
import { postLootChat, postQuantityRoll } from '../src/chat.mjs';
import { Dnd5eAdapter } from '../src/adapters.mjs';

test('quantity rolls use private Foundry chat and label the final lootable quantity', async () => {
  const previous = globalThis.game;
  const messages = [];
  globalThis.game = { release: { generation: 13 }, i18n: { format: (key, args) => {
    assert.equal(key, 'HL.QuantityRollChat');
    return `${args.item}: ${args.quantity} lootable`;
  } } };
  const roll = { toMessage: async (...args) => { messages.push(args); } };
  try {
    await postQuantityRoll({ roll, itemName: '<Shield>', quantity: 1 });
    globalThis.game.release.generation = 14;
    await postQuantityRoll({ roll, itemName: '<Shield>', quantity: 1 });
    assert.deepEqual(messages, [
      [{ flavor: '&lt;Shield&gt;: 1 lootable' }, { rollMode: 'selfroll' }],
      [{ flavor: '&lt;Shield&gt;: 1 lootable' }, { messageMode: 'self' }]
    ]);
  } finally { globalThis.game = previous; }
});

test('chat setting gates public messages; names are escaped and unidentified items stay unidentified', async () => {
  const previous = { game: globalThis.game, ChatMessage: globalThis.ChatMessage };
  const messages = [];
  let enabled = false;
  globalThis.game = {
    settings: { get: (_module, key) => { assert.equal(key, 'chatLog'); return enabled; } },
    i18n: { format: (_key, args) => `${args.actor} looted ${args.quantity} × ${args.item} from ${args.source}.` }
  };
  globalThis.ChatMessage = { getSpeaker: ({ actor }) => ({ actor: actor.id }), create: async message => messages.push(message) };
  try {
    const event = { token: { name: '<NPC>' }, actor: { id: 'hero', name: 'Hero & friend' }, adapter: new Dnd5eAdapter(),
      entry: { claim: { id: 'claim', userId: 'player' }, data: { name: 'Secret Blade', type: 'weapon',
        system: { quantity: 3, identified: false, unidentified: { name: 'Unknown <Blade>' } } } } };
    await postLootChat(event);
    assert.equal(messages.length, 0);
    enabled = true;
    await postLootChat(event);
    assert.equal(messages[0].content, '<p>Hero &amp; friend looted 3 × Unknown &lt;Blade&gt; from &lt;NPC&gt;.</p>');
    assert.deepEqual(messages[0].whisper, []);
    assert.equal(messages[0].blind, false);
    assert.deepEqual(messages[0].speaker, { actor: 'hero' });
    event.entry.currency = { amount: 12 };
    await postLootChat(event);
    assert.match(messages[1].content, /looted 12 ×/);
  } finally {
    globalThis.game = previous.game;
    globalThis.ChatMessage = previous.ChatMessage;
  }
});
