import test from 'node:test';
import assert from 'node:assert/strict';
import { LootRightClick } from '../src/right-click.mjs';

function fixture() {
  const target = new EventTarget(), canvas = {}, token = { uuid: 'Scene.scene.Token.corpse' };
  const state = { eligible: true, gm: false, ready: true, open: false, toggles: 0, dismissed: 0, now: 0, other: [] };
  const handler = new LootRightClick(target, { canvas, tokenAt: () => state.eligible && !state.gm && state.ready ? token : null,
    toggle: () => { state.open = !state.open; state.toggles++; }, dismiss: () => { state.dismissed++; }, now: () => state.now });
  // A later consumer must never see any part of a claimed right-click.
  for (const type of ['pointerdown', 'pointerup', 'pointercancel', 'contextmenu']) target.addEventListener(type, event => state.other.push(event.type));
  function emit(type, { button = 2, pointerId = 1, board = true } = {}) {
    const event = new Event(type, { cancelable: true });
    Object.assign(event, { button, pointerId, composedPath: () => board ? [canvas, target] : [target] });
    target.dispatchEvent(event);
    return event;
  }
  return { target, handler, state, emit };
}

for (const order of [['pointerdown', 'contextmenu', 'pointerup'], ['pointerdown', 'pointerup', 'contextmenu']]) {
  test(`repeated loot clicks consume the whole gesture (${order.join(', ')})`, () => {
    const f = fixture();
    for (let cycle = 0; cycle < 4; cycle++) {
      for (const type of order) assert.equal(f.emit(type).defaultPrevented, true);
      assert.equal(f.state.open, true); assert.equal(f.state.toggles, cycle + 1);
      // Simulate closing the popup with its close action before clicking again.
      f.state.open = false; f.state.now += 2000;
    }
    assert.deepEqual(f.state.other, []);
    f.handler.destroy();
  });
}

test('right-click toggles an open loot panel exactly once', () => {
  const f = fixture();
  for (let i = 0; i < 2; i++) for (const type of ['pointerdown', 'pointerup', 'contextmenu']) f.emit(type);
  assert.equal(f.state.open, false); assert.equal(f.state.toggles, 2); assert.deepEqual(f.state.other, []);
});

test('GM clicks, unavailable corpses, and an inactive module pass through', () => {
  for (const change of [{ gm: true }, { eligible: false }, { ready: false }]) {
    const f = fixture(); Object.assign(f.state, change);
    for (const type of ['pointerdown', 'pointerup', 'contextmenu']) assert.equal(f.emit(type).defaultPrevented, false);
    assert.equal(f.state.toggles, 0); assert.deepEqual(f.state.other, ['pointerdown', 'pointerup', 'contextmenu']);
  }
});

test('left clicks, other UI elements, and releases without a claimed press pass through', () => {
  for (const options of [{ button: 0 }, { board: false }]) {
    const f = fixture();
    for (const type of ['pointerdown', 'pointerup']) assert.equal(f.emit(type, options).defaultPrevented, false);
    assert.equal(f.state.toggles, 0);
  }
  assert.equal(fixture().emit('pointerup').defaultPrevented, false);
});

test('a claimed release remains consumed outside the canvas and after eligibility changes', () => {
  const f = fixture(); f.emit('pointerdown'); f.state.eligible = false;
  assert.equal(f.emit('pointerup', { board: false }).defaultPrevented, true);
  assert.equal(f.emit('contextmenu').defaultPrevented, true);
  assert.equal(f.state.toggles, 1); assert.deepEqual(f.state.other, []);
});

test('only the matching pointer release is claimed, and cancellation resets the gesture', () => {
  const f = fixture(); f.emit('pointerdown');
  assert.equal(f.emit('pointerup', { pointerId: 2 }).defaultPrevented, false);
  assert.equal(f.emit('pointercancel', { pointerId: 2 }).defaultPrevented, false);
  assert.equal(f.emit('pointercancel').defaultPrevented, true);
  assert.equal(f.emit('pointerup').defaultPrevented, false);
});

test('fresh non-loot right-clicks do not inherit a previous loot gesture', () => {
  const f = fixture(); f.emit('pointerdown'); f.emit('pointerup'); f.state.eligible = false;
  assert.equal(f.emit('pointerdown').defaultPrevented, false);
  assert.equal(f.emit('contextmenu').defaultPrevented, false);
  assert.equal(f.emit('pointerup').defaultPrevented, false);
});

test('standalone context-menu events still toggle loot and expire previous released gestures', () => {
  const f = fixture();
  assert.equal(f.emit('contextmenu').defaultPrevented, true); assert.equal(f.state.toggles, 1);
  f.emit('pointerdown'); f.emit('pointerup'); f.state.now += 1001;
  assert.equal(f.emit('contextmenu').defaultPrevented, true); assert.equal(f.state.toggles, 3);
});

test('window blur and teardown clear ownership and teardown removes all handlers', () => {
  const f = fixture(); f.emit('pointerdown');
  f.target.dispatchEvent(new Event('blur'));
  assert.equal(f.emit('pointerup').defaultPrevented, false);
  f.emit('pointerdown'); f.handler.destroy();
  assert.equal(f.emit('pointerup').defaultPrevented, false);
  assert.equal(f.emit('pointerdown').defaultPrevented, false);
  assert.equal(f.emit('contextmenu').defaultPrevented, false);
});
