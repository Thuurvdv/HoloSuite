/**
 * Return the active Foundry system id in a stable form.
 *
 * Foundry normally exposes this as game.system.id. During parts of the V14
 * startup lifecycle, however, the world metadata can be available before the
 * fully constructed System package. Keeping the fallback here prevents a
 * temporary missing package object from disabling an otherwise supported
 * system integration for the lifetime of an Application instance.
 */
export function getActiveSystemId(): string {
  const activeGame = (globalThis as any).game;
  const system = activeGame?.system;
  const worldSystem = activeGame?.world?.system;
  const legacySystem = activeGame?.data?.system;
  const candidates = [
    system?.id,
    system?._source?.id,
    system?.data?.id,
    typeof system === "string" ? system : null,
    typeof worldSystem === "string" ? worldSystem : worldSystem?.id,
    typeof legacySystem === "string" ? legacySystem : legacySystem?.id
  ];
  const id = candidates.find(candidate => typeof candidate === "string" && candidate.trim());
  return String(id ?? "").trim().toLocaleLowerCase();
}

export function isActiveSystem(...systemIds: string[]): boolean {
  const activeId = getActiveSystemId();
  return !!activeId && systemIds.some(id => String(id).trim().toLocaleLowerCase() === activeId);
}

export function isCoC7System(): boolean {
  return isActiveSystem("CoC7");
}
