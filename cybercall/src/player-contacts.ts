import { normalizeContact } from "./call-model";
import { MODULE_ID } from "./constants";

const DIRECTORY_FLAG = "playerContactDirectory";
const PERSONAL_FLAG = "playerPersonalContactDirectory";

export function isPlayerContactDirectory(entry: any) {
  const playerId = entry.getFlag(MODULE_ID, DIRECTORY_FLAG)?.playerId
    ?? entry.getFlag(MODULE_ID, PERSONAL_FLAG)?.playerId;
  return Boolean(playerId && (game.user?.isGM || game.user?.id === playerId));
}

function getPersonalDirectory(playerId: string) {
  if (!playerId || (!game.user?.isGM && game.user?.id !== playerId)) return null;
  return game.journal?.contents?.find((entry) =>
    entry.getFlag(MODULE_ID, PERSONAL_FLAG)?.playerId === playerId
    && entry.testUserPermission(game.user, "OBSERVER")
  ) ?? null;
}

/** Null means this browser's legacy list has not been imported yet. */
export function getSyncedPersonalContacts(playerId: string): any[] | null {
  const data = getPersonalDirectory(playerId)?.getFlag(MODULE_ID, PERSONAL_FLAG);
  if (!data?.initialized) return null;
  return Object.values(data.contacts ?? {}).map(normalizeContact)
    .filter((contact) => contact.name && contact.number)
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function getPlayerContacts(playerId: string) {
  const contacts = new Map((getSyncedPersonalContacts(playerId) ?? []).map((contact) => [contact.id, contact]));
  for (const contact of getAssignedContacts(playerId)) contacts.set(contact.id, contact);
  return [...contacts.values()].sort((left, right) => left.name.localeCompare(right.name));
}

/** Only the elected GM creates directories. Personal lists stay private to their owner and GMs. */
let creatingDirectories: Promise<void> | null = null;
export async function ensurePersonalContactDirectories() {
  if (!game.user?.isGM) return;
  const gm = (game.users?.contents ?? []).filter((user) => user.isGM && user.active)
    .sort((left, right) => left.id.localeCompare(right.id))[0];
  if (gm && gm.id !== game.user.id) return;
  if (creatingDirectories) return creatingDirectories;
  const levels = CONST.DOCUMENT_OWNERSHIP_LEVELS;
  creatingDirectories = (async () => {
    for (const player of game.users?.contents ?? []) {
      if (player.isGM || getPersonalDirectory(player.id)) continue;
      await game.journal.documentClass.create({
        name: `CyberCall Personal Contacts · ${player.name}`,
        ownership: { default: levels.NONE, [player.id]: levels.OWNER },
        flags: { [MODULE_ID]: { [PERSONAL_FLAG]: { playerId: player.id, initialized: false, contacts: {} } } }
      }, { render: false });
    }
  })();
  try { await creatingDirectories; }
  finally { creatingDirectories = null; }
}

export async function writePersonalContact(playerId: string, contactId: string, contact: any = null) {
  const directory = getPersonalDirectory(playerId);
  if (!directory || !contactId) return false;
  const path = `flags.${MODULE_ID}.${PERSONAL_FLAG}`;
  await directory.update({
    [`${path}.initialized`]: true,
    [`${path}.contacts.${contact ? contactId : `-=${contactId}`}`]: contact
  }, { render: false });
  return true;
}

export async function savePersonalContacts(playerId: string, contacts: any[]) {
  const directory = getPersonalDirectory(playerId);
  if (!directory) return false;
  const previous = getSyncedPersonalContacts(playerId) ?? [];
  const path = `flags.${MODULE_ID}.${PERSONAL_FLAG}`;
  const update: Record<string, any> = { [`${path}.initialized`]: true };
  const ids = new Set(contacts.map((contact) => contact.id));
  for (const contact of contacts) update[`${path}.contacts.${contact.id}`] = normalizeContact(contact);
  for (const contact of previous) if (!ids.has(contact.id)) update[`${path}.contacts.-=${contact.id}`] = null;
  await directory.update(update, { render: false });
  return true;
}

function getDirectory(playerId: string) {
  if (!playerId || (!game.user?.isGM && game.user?.id !== playerId)) return null;
  return game.journal?.contents?.find((entry) =>
    entry.getFlag(MODULE_ID, DIRECTORY_FLAG)?.playerId === playerId
    && entry.testUserPermission(game.user, "OBSERVER")
  ) ?? null;
}

export function getAssignedContacts(playerId: string) {
  const contacts = getDirectory(playerId)?.getFlag(MODULE_ID, DIRECTORY_FLAG)?.contacts ?? {};
  return Object.values(contacts)
    .map(normalizeContact)
    .filter((contact) => contact.name && contact.number)
    .sort((left, right) => left.name.localeCompare(right.name));
}

export async function writeAssignedContact(playerId: string, contactId: string, contact: any = null) {
  if (!game.user?.isGM) return;
  const user = game.users?.get(playerId);
  if (!user || user.isGM) return;

  const directory = getDirectory(playerId);
  if (!directory) {
    if (!contact) return;
    const Journal = game.journal.documentClass;
    const levels = CONST.DOCUMENT_OWNERSHIP_LEVELS;
    await Journal.create({
      name: `CyberCall Contacts · ${user.name}`,
      ownership: { default: levels.NONE, [playerId]: levels.OBSERVER },
      flags: { [MODULE_ID]: { [DIRECTORY_FLAG]: { playerId, contacts: { [contactId]: contact } } } }
    }, { render: false });
    return;
  }

  const path = `flags.${MODULE_ID}.${DIRECTORY_FLAG}.contacts`;
  const key = contact ? contactId : `-=${contactId}`;
  await directory.update({ [`${path}.${key}`]: contact }, { render: false });
}
