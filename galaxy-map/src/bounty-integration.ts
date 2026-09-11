declare const game: any;

export type BountyIntel = {
  id: string;
  name: string;
  image: string;
  status: string;
  statusLabel: string;
  reward: string;
  sceneId: string;
};

function getBountyBoardApi() {
  try {
    const module = game.modules?.get?.("bounty-board");
    if (module?.active === false) return null;
    const api = module.api ?? game.scifiSuite?.bountyBoard;
    return typeof api?.getBountiesForScene === "function" ? api : null;
  } catch {
    return null;
  }
}

export function hasBountyBoardIntegration() {
  return Boolean(getBountyBoardApi());
}

/** Resolve optional bounty intel through the canonical System -> Scene relationship. */
export function getBountyIntelForSystem(system: any): BountyIntel[] {
  const api = getBountyBoardApi();
  if (!api || !Array.isArray(system?.sceneIds)) return [];
  const seen = new Set<string>();
  const results: BountyIntel[] = [];
  try {
    for (const sceneId of system.sceneIds) {
      for (const bounty of api.getBountiesForScene(String(sceneId)) ?? []) {
        const id = String(bounty?.id ?? "");
        if (!id || seen.has(id)) continue;
        seen.add(id);
        results.push({
          id,
          name: String(bounty.name || "Unknown target"),
          image: String(bounty.image || ""),
          status: String(bounty.status || ""),
          statusLabel: String(bounty.statusLabel || bounty.status || ""),
          reward: String(bounty.reward || ""),
          sceneId: String(bounty.sceneId || sceneId)
        });
      }
    }
  } catch {
    return [];
  }
  return results;
}

export function openBountyIntel(bountyId: string) {
  try {
    const api = getBountyBoardApi();
    return typeof api?.openBounty === "function" && api.openBounty(String(bountyId)) !== false;
  } catch {
    return false;
  }
}
