export const MISSION_TYPES = ["Bounty", "Transport", "Exploration"];

export function normalizeMissionType(value: unknown) {
  const name = String(value ?? "").trim().replace(/\s+/g, " ").slice(0, 80);
  return MISSION_TYPES.find(type => type.toLowerCase() === name.toLowerCase()) || name || "Bounty";
}

export function missionPresentation(contract: Record<string, any>) {
  const missionType = normalizeMissionType(contract.missionType);
  const isBounty = missionType === "Bounty";
  const isTransport = missionType === "Transport";
  const isExploration = missionType === "Exploration";
  const missionSubject = (isBounty ? contract.targetName : isTransport ? contract.cargo : isExploration ? contract.region : contract.objective) || contract.title;
  const missionFacts = (isTransport
    ? [["Pickup", contract.pickup], ["Destination", contract.destination], ["Deadline", contract.deadline]]
    : isExploration ? [["Objective", contract.objective], ["Hazards", contract.hazards]]
    : isBounty ? [] : [["Objective", contract.objective]])
    .filter(([, value]) => value).map(([label, value]) => ({ label, value }));
  return { missionType, isBounty, isTransport, isExploration, missionSubject, missionFacts,
    displayMissionType: missionType,
    displayMissionSubject: isExploration ? String(contract.title || missionSubject) : missionSubject,
    displayContractTitle: String((isExploration ? contract.region : contract.title) || ""),
    subjectLabel: isBounty ? "Target" : isTransport ? "Cargo" : isExploration ? "Region" : "Objective",
    dangerLabel: isBounty ? "Threat" : "Danger",
    missionIcon: isBounty ? "fa-crosshairs" : isTransport ? "fa-truck-fast" : isExploration ? "fa-compass" : "fa-file-signature" };
}

/** Update field visibility without rerendering, preserving unsaved form values. */
export function updateMissionFields(root: HTMLElement) {
  const select = root.querySelector<HTMLSelectElement>("[name='missionTypeChoice']");
  const custom = root.querySelector<HTMLInputElement>("[name='missionTypeName']");
  if (!select || !custom) return;
  const other = select.value === "";
  custom.required = other;
  custom.disabled = !other;
  custom.closest<HTMLElement>("[data-mission-name]")!.hidden = !other;
  custom.setCustomValidity(other && !custom.value.trim() ? "Enter a mission type name." : "");
  const type = normalizeMissionType(other ? custom.value : select.value);
  root.querySelectorAll<HTMLElement>("[data-mission-fields]").forEach(field => {
    const kinds = field.dataset.missionFields!.split(" ");
    field.hidden = !kinds.includes(type) && !(kinds.includes("other") && !["Bounty", "Transport"].includes(type));
  });
  const target = root.querySelector<HTMLInputElement>("[name='targetName']");
  if (target) target.required = type === "Bounty";
  const danger = root.querySelector<HTMLElement>("[data-danger-label]");
  if (danger) danger.textContent = type === "Bounty" ? "Threat level" : "Danger level";
}
