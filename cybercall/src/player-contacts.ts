import { normalizeContact } from "./call-model";
import { MODULE_ID } from "./constants";

const DIRECTORY_FLAG = "playerContactDirectory";

export function isPlayerContactDirectory(entry: any) {
  const playerId = entry.getFlag(MODULE_ID, DIRECTORY_FLAG)?.playerId;
  return Boolean(playerId && (game.user?.isGM || game.user?.id === playerId));
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
