import { refreshDeviceEmblems } from "./device-branding";

/** Fixed hardware sits beside Foundry's native chrome. Only nine-slice rails stretch. */
export function mountDeviceHardware(root: HTMLElement | null) {
  if (!root) return;
  mountWindowControls(root);
  if (root.querySelector(":scope > .cybercall-hardware")) {
    refreshDeviceEmblems(root);
    return;
  }
  const hardware = document.createElement("div");
  hardware.className = "cybercall-hardware";
  hardware.setAttribute("aria-hidden", "true");
  hardware.innerHTML = `
    <span class="cybercall-hardware-crown"></span>
    <span class="cybercall-hardware-side cybercall-hardware-side-left"></span>
    <span class="cybercall-hardware-side cybercall-hardware-side-right"></span>
    <span class="cybercall-hardware-chin"></span>
    <span class="cybercall-hardware-emblem"></span>
    <span class="cybercall-hardware-light cybercall-hardware-light-tl"></span>
    <span class="cybercall-hardware-light cybercall-hardware-light-tr"></span>
    <span class="cybercall-hardware-light cybercall-hardware-light-bl"></span>
    <span class="cybercall-hardware-light cybercall-hardware-light-br"></span>`;
  root.append(hardware);
  refreshDeviceEmblems(root);
}

/** Proxy native controls so Foundry keeps its references, actions, and dropdown lifecycle. */
function mountWindowControls(root: HTMLElement) {
  const header = root.querySelector<HTMLElement>(":scope > .window-header");
  if (!header) return;
  if (root.classList.contains("cybercall-fullscreen")) {
    root.classList.remove("cybercall-inline-window-controls");
    root.querySelectorAll("[data-cybercall-window-controls]").forEach((host) => host.replaceChildren());
    return;
  }
  let host = root.querySelector<HTMLElement>("[data-cybercall-window-controls]");
  if (!host) {
    const row = root.querySelector(".cybercall-console-nav, .cybercall-device-status, .cybercall-call-brand, .cybercall-mode-tabs");
    if (!row) return;
    host = document.createElement("span");
    host.dataset.cybercallWindowControls = "";
    row.append(host);
  }
  root.classList.add("cybercall-inline-window-controls");
  if (host.childElementCount) return;
  for (const [action, selector, label, icon] of [
    ["toggle", '[data-action="toggleControls"], [data-action="toggle-controls"]', "Toggle Controls", "fa-ellipsis-vertical"],
    ["close", '[data-action="close"], .close', "Close Window", "fa-xmark"]
  ]) {
    const native = header.querySelector<HTMLElement>(selector);
    if (!native || native.hidden || native.classList.contains("hidden")) continue;
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.cybercallWindowAction = action;
    if (action === "toggle") {
      // V14's native context menu anchors to the actual delegated action button.
      button.classList.add("header-control");
      button.dataset.action = "toggleControls";
    }
    button.setAttribute("aria-label", label);
    button.title = label;
    button.innerHTML = `<i class="fa-solid ${icon}" aria-hidden="true"></i>`;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      if (action === "toggle") {
        const menu = root.querySelector<HTMLElement>(":scope > .controls-dropdown");
        if (menu) {
          const frame = root.getBoundingClientRect(), anchor = button.getBoundingClientRect();
          menu.style.top = `${(anchor.bottom - frame.top) / (frame.height / root.offsetHeight) + 4}px`;
          menu.style.right = `${(frame.right - anchor.right) / (frame.width / root.offsetWidth)}px`;
        }
        return;
      }
      event.stopPropagation();
      native.click();
    });
    host.append(button);
  }
}
