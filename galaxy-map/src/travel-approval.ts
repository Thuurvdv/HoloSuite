export const TRAVEL_APPROVAL_OPTIONS = [
  { value: "gm", label: "GM approval" },
  { value: "majority", label: "Majority vote" },
  { value: "unanimous", label: "Unanimous agreement" }
];

export function normalizeTravelApprovalMode(value: unknown) {
  return TRAVEL_APPROVAL_OPTIONS.some(option => option.value === value) ? String(value) : "unanimous";
}

export function getTravelElectorate(activeUsers: any[], requesterId: string, primaryGM: any, mode: unknown) {
  const approvalMode = normalizeTravelApprovalMode(mode);
  const uniqueUsers = [...new Map((activeUsers ?? []).filter(user => user?.id).map(user => [String(user.id), user])).values()];
  const voters = approvalMode === "gm"
    ? (primaryGM?.id ? [primaryGM] : [])
    : uniqueUsers.filter(user => String(user.id) !== String(requesterId));
  const voterIds = voters.map(user => String(user.id));
  const voterNames = Object.fromEntries(voters.map(user => [String(user.id), String(user.name || "Navigator").slice(0, 80)]));
  const participantCount = voterIds.length + (approvalMode === "gm" ? 0 : 1);
  const requiredApprovals = approvalMode === "gm"
    ? 1
    : approvalMode === "majority"
      ? Math.floor(participantCount / 2) + 1
      : participantCount;
  return { approvalMode, voterIds, voterNames, participantCount, requiredApprovals };
}

export function evaluateTravelApproval(pending: any) {
  const mode = normalizeTravelApprovalMode(pending?.approvalMode);
  const voterIds = [...new Set((pending?.voterIds ?? []).map(String))];
  const accepted = new Set([...(pending?.accepted ?? [])].map(String));
  const declined = new Set([...(pending?.declined ?? [])].map(String));
  const requesterApproval = mode === "gm" ? 0 : 1;
  const required = Math.max(1, Number(pending?.requiredApprovals) || (mode === "unanimous" ? voterIds.length + 1 : 1));
  const acceptedCount = requesterApproval + voterIds.filter(id => accepted.has(id)).length;
  const declinedCount = voterIds.filter(id => declined.has(id)).length;
  const pendingIds = voterIds.filter(id => !accepted.has(id) && !declined.has(id));
  if (acceptedCount >= required) return { outcome: "approved", acceptedCount, declinedCount, required, pendingIds };
  if (mode === "unanimous" && declinedCount > 0) return { outcome: "declined", acceptedCount, declinedCount, required, pendingIds };
  if (acceptedCount + pendingIds.length < required) return { outcome: "declined", acceptedCount, declinedCount, required, pendingIds };
  return { outcome: "pending", acceptedCount, declinedCount, required, pendingIds };
}
