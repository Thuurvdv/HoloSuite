declare const ChatMessage: any;

export async function postHackResultMessage({ title, result, actorName, message, rollTotal, dc }: any) {
  const success = result === "success";
  const color = success ? "#38f28f" : "#ff477e";
  const label = success ? "HACK SUCCESS" : "HACK FAILED";
  const detail = message || (success ? "Objective completed." : "Trace or countermeasure completed.");
  const rollLine = Number.isFinite(Number(rollTotal)) && Number.isFinite(Number(dc))
    ? `<p style="margin: 4px 0 0; color: #bdeff6;">Roll ${Number(rollTotal)} vs DC ${Number(dc)}</p>`
    : "";

  const content = `
    <div class="holosuite-hacking-chat-result" style="border-left: 4px solid ${color}; padding: 8px 10px; background: rgba(5, 8, 14, 0.88); color: ${color};">
      <strong>${escapeHtml(label)} // ${escapeHtml(title)} // ${escapeHtml(actorName || "Hacker")}</strong>
      <p style="margin: 6px 0 0; color: ${color};">${escapeHtml(detail)}</p>
      ${rollLine}
    </div>
  `;

  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker(),
    content
  });
}

function escapeHtml(value: any) {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}
