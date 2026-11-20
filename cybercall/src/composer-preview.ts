import { DEFAULT_CALL, getUserDisplayName, normalizeCallData } from "./call-model";
import { mountDeviceHardware } from "./device-shell";

export function readComposerForm(form: HTMLFormElement) {
  const formData = new FormData(form);
  const actor = game.actors?.get(formData.get("actorId"));
  const image = String(formData.get("image") ?? "").trim() || actor?.img || "";
  const callerName = String(formData.get("callerName") ?? "").trim() || actor?.name || "UNKNOWN CALLER";
  const targetUserIds = formData.getAll("targetUserIds").map((id) => String(id)).filter(Boolean);
  const usersById = new Map<string, any>((game.users?.contents ?? []).map((user) => [user.id, user]));
  const targetUserNames = targetUserIds.map((id) => getUserDisplayName(usersById.get(id)) || id);

  return normalizeCallData({
    callerName,
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    image,
    message: String(formData.get("message") ?? "").trim(),
    signal: formData.get("signal"),
    variant: String(formData.get("variant") ?? DEFAULT_CALL.variant),
    fullscreen: formData.get("fullscreen") === "on",
    ringing: formData.get("ringing") === "on",
    targetUserIds,
    targetUserNames
  });
}

export function updateComposerPreview(form: HTMLFormElement) {
  const call = readComposerForm(form);
  const output = form.querySelector("[data-cybercall-signal-output]");
  if (output) output.textContent = `${call.signal}%`;
  const device = form.querySelector<HTMLElement>("[data-cybercall-live-preview]");
  const panel = device?.querySelector<HTMLElement>(".cybercall-panel");
  if (!panel) return;

  device.classList.toggle("cybercall-preview-wide", call.fullscreen);
  mountDeviceHardware(device);
  for (const variant of ["standard", "emergency", "corrupted"]) {
    panel.classList.toggle(`cybercall-${variant}`, call.variant === variant);
  }
  panel.classList.toggle("cybercall-broadcast", call.fullscreen);
  panel.classList.toggle("cybercall-ringing-panel", call.ringing);
  panel.style.setProperty("--cybercall-signal", `${call.signal}%`);
  panel.dataset.cybercallSignalQuality = call.signalQuality;
  panel.style.setProperty("--cybercall-glitch-shift", `${call.glitchShift}px`);
  panel.style.setProperty("--cybercall-glitch-interval", `${call.glitchInterval}s`);

  panel.querySelector("[data-cybercall-preview-name]").textContent = call.callerName;
  const subtitle = panel.querySelector("[data-cybercall-preview-subtitle]");
  if (subtitle) subtitle.textContent = call.subtitle;
  panel.querySelector("[data-cybercall-preview-message]").textContent = call.message;
  panel.querySelector("[data-cybercall-preview-signal]").textContent = `${call.signal}%`;
  const status = panel.querySelector("[data-cybercall-preview-status]");
  status.querySelector("span").textContent = call.kicker;
  status.querySelector("i").className = `fa-solid ${call.isEmergency ? "fa-triangle-exclamation" : "fa-satellite-dish"}`;

  const portrait = panel.querySelector("[data-cybercall-preview-portrait]");
  const currentImage = portrait.querySelector("img");
  if (call.image) {
    const image = currentImage ?? document.createElement("img");
    if (image.getAttribute("src") !== call.image) image.setAttribute("src", call.image);
    image.alt = call.callerName;
    if (!currentImage) portrait.replaceChildren(image);
  } else {
    const initials = portrait.querySelector(".cybercall-initials") ?? document.createElement("span");
    initials.className = "cybercall-initials";
    initials.textContent = call.initials;
    if (initials.parentNode !== portrait) portrait.replaceChildren(initials);
  }
}

