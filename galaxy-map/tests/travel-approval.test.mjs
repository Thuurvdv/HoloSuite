import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateTravelApproval, getTravelElectorate, normalizeTravelApprovalMode } from '../src/travel-approval.ts';
import { normalizeMap } from '../src/galaxy-model.ts';
import fs from 'node:fs';

globalThis.foundry = { utils: { randomID: () => 'test-id' } };
const users = [
  { id: 'requester', name: 'Rex', active: true },
  { id: 'gm', name: 'GM', active: true, isGM: true },
  { id: 'p2', name: 'Tali', active: true },
  { id: 'p3', name: 'Garrus', active: true }
];

test('old maps retain unanimous travel approval and known modes persist', () => {
  assert.equal(normalizeTravelApprovalMode('bad-mode'), 'unanimous');
  assert.equal(normalizeMap({}).travelApprovalMode, 'unanimous');
  assert.equal(normalizeMap({ travelApprovalMode: 'majority' }).travelApprovalMode, 'majority');
});

test('GM approval asks only the primary GM', () => {
  const electorate = getTravelElectorate(users, 'requester', users[1], 'gm');
  assert.deepEqual(electorate.voterIds, ['gm']);
  assert.equal(electorate.requiredApprovals, 1);
  assert.equal(evaluateTravelApproval({ ...electorate, accepted: new Set(['gm']), declined: new Set() }).outcome, 'approved');
  assert.equal(evaluateTravelApproval({ ...electorate, accepted: new Set(), declined: new Set(['gm']) }).outcome, 'declined');
});

test('majority counts the requester and waits until the result is certain', () => {
  const electorate = getTravelElectorate(users, 'requester', users[1], 'majority');
  assert.equal(electorate.participantCount, 4);
  assert.equal(electorate.requiredApprovals, 3);
  assert.equal(evaluateTravelApproval({ ...electorate, accepted: new Set(['gm']), declined: new Set(['p2']) }).outcome, 'pending');
  assert.equal(evaluateTravelApproval({ ...electorate, accepted: new Set(['gm', 'p3']), declined: new Set(['p2']) }).outcome, 'approved');
  assert.equal(evaluateTravelApproval({ ...electorate, accepted: new Set(), declined: new Set(['gm', 'p2']) }).outcome, 'declined');
});

test('unanimous mode cancels on one decline and passes when all voters approve', () => {
  const electorate = getTravelElectorate(users, 'requester', users[1], 'unanimous');
  assert.equal(electorate.requiredApprovals, 4);
  assert.equal(evaluateTravelApproval({ ...electorate, accepted: new Set(['gm']), declined: new Set(['p2']) }).outcome, 'declined');
  assert.equal(evaluateTravelApproval({ ...electorate, accepted: new Set(electorate.voterIds), declined: new Set() }).outcome, 'approved');
});

test('electorates deduplicate users and expose bounded participant names for progress', () => {
  const electorate = getTravelElectorate([...users, users[2]], 'requester', users[1], 'majority');
  assert.deepEqual(electorate.voterIds, ['gm', 'p2', 'p3']);
  assert.equal(electorate.voterNames.p2, 'Tali');
});

test('map settings and travel prompts expose approval mode and live progress', () => {
  const main = fs.readFileSync(new URL('../src/main.ts', import.meta.url), 'utf8');
  const manager = fs.readFileSync(new URL('../templates/map-manager.hbs', import.meta.url), 'utf8');
  const css = fs.readFileSync(new URL('../styles/galaxy-map-manager.css', import.meta.url), 'utf8');
  assert.match(main, /name="travelApprovalMode"/);
  assert.match(main, /data-travel-progress-count/);
  assert.match(main, /action:\s*"travel-ballot"/);
  assert.match(main, /function isPrimaryGMMessage/);
  assert.match(manager, /travelApprovalModeLabel/);
  assert.match(css, /\.gmf-travel-progress__bar/);
});
