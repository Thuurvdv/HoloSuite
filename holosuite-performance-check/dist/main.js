var ut = Object.defineProperty;
var pt = (t, n, e) => n in t ? ut(t, n, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[n] = e;
var R = (t, n, e) => pt(t, typeof n != "symbol" ? n + "" : n, e);
const g = "holosuite-performance-check", S = "HoloSuite Performance Check";
function O(t) {
  try {
    return decodeURIComponent(t);
  } catch {
    return t;
  }
}
function mt(t) {
  const n = String(t ?? ""), e = [...n.matchAll(/(?:^|[\\/])modules[\\/]([^\\/?#:\s)]+)/gim)];
  for (const r of e) {
    const o = O(r[1]).toLowerCase();
    if (o && o !== g) return o;
  }
  if (e.length) return g;
  const s = n.match(/(?:^|[\\/])systems[\\/]([^\\/?#:\s)]+)/im);
  return s ? `system:${O(s[1]).toLowerCase()}` : /foundry(?:\.mjs|\.js)|client(?:\.mjs|\.js)/i.test(n) ? "foundry-core" : "unattributed";
}
function G(t) {
  const n = String(t ?? ""), e = n.match(/(?:^|[\\/])modules[\\/]([^\\/?#:\s)]+)/i);
  if (e) return O(e[1]).toLowerCase();
  const s = n.match(/(?:^|[\\/])systems[\\/]([^\\/?#:\s)]+)/i);
  return s ? `system:${O(s[1]).toLowerCase()}` : n ? "external-or-world" : "inline-or-core";
}
function x() {
  return mt(new Error().stack);
}
let tt = null;
const et = [];
let V = null;
function q(t) {
  tt = t;
}
const H = Symbol.for(`${g}.hook-instrumented`), z = Symbol.for(`${g}.hooks-patched`), U = /* @__PURE__ */ new WeakMap();
function ft(t, n, e) {
  let s = U.get(n);
  s || (s = /* @__PURE__ */ new Map(), U.set(n, s));
  const r = s.get(t) ?? [];
  r.push(e), s.set(t, r);
}
function W(t, n, e) {
  if (n[H]) return n;
  const s = function(...r) {
    const o = tt, i = typeof e == "string" ? e : e.value;
    if (!o || i === g) return n.apply(this, r);
    const a = performance.now();
    let c;
    try {
      c = n.apply(this, r);
    } catch (l) {
      throw o.record("hook", i, t, performance.now() - a, !0), l;
    }
    return o.record("hook", i, t, performance.now() - a, !1), c;
  };
  return Object.defineProperty(s, H, { value: !0 }), ft(t, n, s), s;
}
function ht(t) {
  const n = t == null ? void 0 : t.events, e = n instanceof Map ? [...n.entries()] : n && typeof n == "object" ? Object.entries(n) : [];
  let s = 0;
  for (const [r, o] of e)
    if (Array.isArray(o))
      for (const i of o) {
        if (!i || typeof i != "object") continue;
        const a = typeof i.fn == "function" ? "fn" : typeof i.callback == "function" ? "callback" : null;
        if (!a) continue;
        const c = i[a];
        if (!(c != null && c[H]))
          try {
            const l = { value: "preexisting/unattributed" };
            i[a] = W(r, c, l), et.push({ callback: c, source: l }), s += 1;
          } catch {
          }
      }
  return s;
}
function X(t) {
  return Array.isArray(t) ? t.map(String) : t instanceof Set ? [...t].map(String) : t && typeof t[Symbol.iterator] == "function" ? [...t].map(String) : [];
}
function bt(t) {
  return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function gt(t) {
  let n = "";
  try {
    n = Function.prototype.toString.call(t);
  } catch {
    return null;
  }
  if (!n || n.includes("[native code]")) return null;
  const e = Math.min(120, n.length);
  if (e < 24) return null;
  const s = Math.max(0, Math.floor((n.length - e) / 2));
  return n.slice(s, s + e);
}
async function yt() {
  var a;
  const t = /* @__PURE__ */ new Map();
  for (const c of et) {
    const l = t.get(c.callback) ?? {
      sources: [],
      needle: gt(c.callback),
      candidates: /* @__PURE__ */ new Set()
    };
    l.sources.push(c.source), t.set(c.callback, l);
  }
  const n = [...t.values()].filter((c) => c.needle);
  let e = 0;
  const s = (a = globalThis.game) == null ? void 0 : a.modules, r = s != null && s.values ? [...s.values()].filter((c) => c == null ? void 0 : c.active) : [];
  for (const c of r) {
    const l = String(c.id ?? "");
    if (!l || l === g) continue;
    const d = c.manifest ?? c, h = [.../* @__PURE__ */ new Set([
      ...X(c.esmodules ?? (d == null ? void 0 : d.esmodules)),
      ...X(c.scripts ?? (d == null ? void 0 : d.scripts))
    ])];
    for (const y of h) {
      let p = "";
      try {
        const f = await fetch(`modules/${l}/${y}`);
        if (!f.ok) continue;
        p = await f.text(), e += 1;
      } catch {
        continue;
      }
      const m = /* @__PURE__ */ new Map();
      for (const f of n) {
        if (!f.needle) continue;
        const v = m.get(f.needle) ?? [];
        v.push(f), m.set(f.needle, v);
      }
      const w = [...m.keys()];
      for (let f = 0; f < w.length; f += 75) {
        const v = w.slice(f, f + 75);
        if (!v.length) continue;
        const C = new RegExp(v.map(bt).join("|"), "g");
        for (const T of p.matchAll(C))
          for (const k of m.get(T[0]) ?? []) k.candidates.add(l);
      }
    }
  }
  let o = 0, i = 0;
  for (const c of t.values()) {
    let l = "preexisting/unattributed";
    c.candidates.size === 1 ? (l = [...c.candidates][0], o += 1) : c.candidates.size > 1 && (l = `ambiguous:${[...c.candidates].sort().join("|")}`, i += 1);
    for (const d of c.sources) d.value = l;
  }
  return {
    total: t.size,
    resolved: o,
    ambiguous: i,
    unresolved: t.size - o - i,
    scriptsScanned: e
  };
}
function nt() {
  return V ?? (V = yt()), V;
}
function vt() {
  const t = globalThis.Hooks;
  if (!t || typeof t.on != "function") return { installed: !1, existingWrapped: 0 };
  if (t[z]) return { installed: !0, existingWrapped: 0 };
  const n = t.on, e = t.once, s = t.off;
  return t.on = function(r, o, ...i) {
    return typeof o != "function" ? n.call(this, r, o, ...i) : n.call(this, r, W(r, o, x()), ...i);
  }, typeof e == "function" && (t.once = function(r, o, ...i) {
    return typeof o != "function" ? e.call(this, r, o, ...i) : e.call(this, r, W(r, o, x()), ...i);
  }), typeof s == "function" && (t.off = function(r, o, ...i) {
    var l;
    if (typeof o != "function") return s.call(this, r, o, ...i);
    const a = (l = U.get(o)) == null ? void 0 : l.get(r);
    if (!(a != null && a.length)) return s.call(this, r, o, ...i);
    let c;
    for (const d of a.splice(0)) c = s.call(this, r, d, ...i);
    return c;
  }), Object.defineProperty(t, z, { value: !0 }), { installed: !0, existingWrapped: ht(t) };
}
function M(t, n = 3) {
  const e = 10 ** n;
  return Math.round(t * e) / e;
}
function B(t, n) {
  if (!t.length) return 0;
  const e = [...t].sort((r, o) => r - o), s = Math.min(e.length - 1, Math.max(0, Math.ceil(e.length * n) - 1));
  return e[s];
}
function wt() {
  var t, n;
  return ((n = (t = globalThis.crypto) == null ? void 0 : t.randomUUID) == null ? void 0 : n.call(t)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function st(t) {
  try {
    const n = new URL(t, window.location.href);
    return ["http:", "https:"].includes(n.protocol) ? n.pathname : `${n.protocol}${n.pathname}`;
  } catch {
    return String(t).split(/[?#]/, 1)[0];
  }
}
function Mt() {
  var n;
  const t = (n = globalThis.game) == null ? void 0 : n.modules;
  return t != null && t.values ? [...t.values()].filter((e) => e == null ? void 0 : e.active).map((e) => {
    var s;
    return {
      id: String(e.id ?? "unknown"),
      title: String(e.title ?? e.id ?? "Unknown"),
      version: String(e.version ?? ((s = e == null ? void 0 : e.manifest) == null ? void 0 : s.version) ?? "unknown")
    };
  }).sort((e, s) => e.id.localeCompare(s.id)) : [];
}
function $t() {
  return [...document.styleSheets].map((t) => {
    var s;
    const n = String(t.href ?? "");
    let e = null;
    try {
      e = ((s = t.cssRules) == null ? void 0 : s.length) ?? 0;
    } catch {
      e = null;
    }
    return {
      source: G(n),
      href: st(n),
      ruleCount: e,
      disabled: !!t.disabled
    };
  });
}
function J() {
  var r, o, i, a, c;
  const t = globalThis.game, n = t == null ? void 0 : t.system, e = ((r = globalThis.canvas) == null ? void 0 : r.scene) ?? ((o = t == null ? void 0 : t.scenes) == null ? void 0 : o.current), s = Number(navigator.deviceMemory);
  return {
    capturedAt: (/* @__PURE__ */ new Date()).toISOString(),
    foundryVersion: String((t == null ? void 0 : t.version) ?? ((i = t == null ? void 0 : t.release) == null ? void 0 : i.version) ?? "unknown"),
    systemId: String((n == null ? void 0 : n.id) ?? "unknown"),
    systemVersion: String((n == null ? void 0 : n.version) ?? "unknown"),
    worldId: String(((a = t == null ? void 0 : t.world) == null ? void 0 : a.id) ?? "unknown"),
    sceneId: String((e == null ? void 0 : e.id) ?? "none"),
    sceneName: String((e == null ? void 0 : e.name) ?? "No active scene"),
    userRole: ((c = t == null ? void 0 : t.user) == null ? void 0 : c.role) ?? "unknown",
    browser: navigator.userAgent,
    hardwareConcurrency: Number.isFinite(navigator.hardwareConcurrency) ? navigator.hardwareConcurrency : null,
    deviceMemoryGb: Number.isFinite(s) ? s : null,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    devicePixelRatio: window.devicePixelRatio,
    domNodes: document.getElementsByTagName("*").length,
    openWindows: document.querySelectorAll(".app, .application").length
  };
}
class St {
  constructor() {
    R(this, "active", null);
    R(this, "reports", []);
  }
  get captureId() {
    var n;
    return ((n = this.active) == null ? void 0 : n.id) ?? "inactive";
  }
  get liveState() {
    if (!this.active) return null;
    const { id: n, label: e, deepMode: s, startedAt: r, startedAtPerformance: o } = this.active;
    return { id: n, label: e, deepMode: s, startedAt: r, startedAtPerformance: o };
  }
  get history() {
    return this.reports;
  }
  get latest() {
    return this.reports[0] ?? null;
  }
  start(n = {}) {
    if (this.active) throw new Error("A performance capture is already running.");
    const e = performance.now(), s = {
      id: wt(),
      label: String(n.label ?? "").trim() || `Capture ${this.reports.length + 1}`,
      deepMode: n.deepMode === !0,
      startedAt: (/* @__PURE__ */ new Date()).toISOString(),
      startedAtPerformance: e,
      environmentStart: J(),
      modules: Mt(),
      stylesheets: $t(),
      metrics: /* @__PURE__ */ new Map(),
      timeline: [],
      longTasks: [],
      resources: [],
      dom: { batches: 0, records: 0, addedNodes: 0, removedNodes: 0, attributeChanges: 0 },
      droppedTimelineEvents: 0,
      observers: [],
      restoreDeep: []
    };
    return this.active = s, q(this), this.installPerformanceObservers(s), s.deepMode && this.installDeepInstrumentation(s), this.mark("Capture started"), this.liveState;
  }
  stop() {
    const n = this.active;
    if (!n) throw new Error("No performance capture is running.");
    this.mark("Capture stopped");
    const e = performance.now() - n.startedAtPerformance;
    for (const o of n.observers) o.disconnect();
    for (const o of n.restoreDeep.reverse())
      try {
        o();
      } catch (i) {
        console.warn(`${g} | Could not restore an instrumented browser API.`, i);
      }
    q(null), this.active = null;
    const s = [...n.metrics.values()].map((o) => ({
      key: o.key,
      kind: o.kind,
      source: o.source,
      label: o.label,
      calls: o.calls,
      syncTotalMs: M(o.syncTotalMs),
      asyncCompletions: o.asyncCompletions,
      asyncWallTotalMs: M(o.asyncWallTotalMs),
      maxMs: M(o.maxMs),
      p50Ms: M(B(o.samples, 0.5)),
      p95Ms: M(B(o.samples, 0.95)),
      errors: o.errors
    })).sort((o, i) => i.syncTotalMs - o.syncTotalMs), r = {
      schemaVersion: 1,
      id: n.id,
      label: n.label,
      deepMode: n.deepMode,
      startedAt: n.startedAt,
      durationMs: M(e),
      environmentStart: n.environmentStart,
      environmentEnd: J(),
      modules: n.modules,
      stylesheets: n.stylesheets,
      metrics: s,
      timeline: n.timeline,
      longTasks: n.longTasks,
      resources: n.resources,
      dom: n.dom,
      droppedTimelineEvents: n.droppedTimelineEvents,
      notes: [
        "Times are measurements from this browser client only; GM and player clients must be captured separately.",
        "Async wall time can overlap other work and must not be added to synchronous CPU time.",
        "Style recalculation, layout, GPU work, garbage collection, and uninstrumented callbacks remain unattributed.",
        "Deep mode adds more observer overhead and should be used after a normal capture identifies a suspicious interval."
      ]
    };
    return this.reports.unshift(r), this.reports.length > 20 && (this.reports.length = 20), r;
  }
  clear() {
    if (this.active) throw new Error("Stop the current capture before clearing reports.");
    this.reports = [];
  }
  mark(n) {
    const e = this.active;
    e && this.pushTimeline(e, {
      offsetMs: M(performance.now() - e.startedAtPerformance),
      durationMs: 0,
      kind: "marker",
      source: g,
      label: String(n || "Marker")
    });
  }
  record(n, e, s, r, o = !1) {
    const i = this.active;
    if (!i || e === g) return;
    const a = Math.max(0, Number(r) || 0), c = `${n}\0${e}\0${s}`;
    let l = i.metrics.get(c);
    l || (l = {
      key: c,
      kind: n,
      source: e,
      label: s,
      calls: 0,
      syncTotalMs: 0,
      asyncCompletions: 0,
      asyncWallTotalMs: 0,
      maxMs: 0,
      errors: 0,
      samples: []
    }, i.metrics.set(c, l)), l.calls += 1, l.syncTotalMs += a, l.maxMs = Math.max(l.maxMs, a), o && (l.errors += 1), l.samples.length < 500 ? l.samples.push(a) : l.samples[l.calls % 500] = a, (a >= 0.25 || o) && this.pushTimeline(i, {
      offsetMs: M(performance.now() - i.startedAtPerformance - a),
      durationMs: M(a),
      kind: n,
      source: e,
      label: s,
      error: o
    });
  }
  recordAsync(n, e, s, r, o) {
    const i = this.active;
    if (!i || i.id !== o || e === g) return;
    const a = `${n}\0${e}\0${s}`, c = i.metrics.get(a);
    c && (c.asyncCompletions += 1, c.asyncWallTotalMs += Math.max(0, Number(r) || 0));
  }
  pushTimeline(n, e) {
    if (n.timeline.length >= 5e3) {
      n.droppedTimelineEvents += 1;
      return;
    }
    n.timeline.push(e);
  }
  installPerformanceObservers(n) {
    if (typeof PerformanceObserver == "function") {
      try {
        const e = new PerformanceObserver((s) => {
          var r;
          if (((r = this.active) == null ? void 0 : r.id) === n.id)
            for (const o of s.getEntries()) {
              const i = {
                offsetMs: M(o.startTime - n.startedAtPerformance),
                durationMs: M(o.duration),
                name: o.name || "long task"
              };
              n.longTasks.push(i), this.pushTimeline(n, {
                ...i,
                kind: "long-task",
                source: "browser/unattributed",
                label: i.name
              });
            }
        });
        e.observe({ type: "longtask", buffered: !1 }), n.observers.push(e);
      } catch {
      }
      try {
        const e = new PerformanceObserver((s) => {
          var r;
          if (((r = this.active) == null ? void 0 : r.id) === n.id)
            for (const o of s.getEntries()) {
              const i = o;
              n.resources.push({
                offsetMs: M(i.startTime - n.startedAtPerformance),
                durationMs: M(i.duration),
                source: G(i.name),
                initiatorType: i.initiatorType || "unknown",
                name: st(i.name)
              });
            }
        });
        e.observe({ type: "resource", buffered: !1 }), n.observers.push(e);
      } catch {
      }
    }
    if (n.deepMode && document.documentElement) {
      const e = new MutationObserver((s) => {
        var r, o, i;
        if (((r = this.active) == null ? void 0 : r.id) === n.id) {
          n.dom.batches += 1, n.dom.records += s.length;
          for (const a of s)
            a.type === "attributes" && (n.dom.attributeChanges += 1), n.dom.addedNodes += ((o = a.addedNodes) == null ? void 0 : o.length) ?? 0, n.dom.removedNodes += ((i = a.removedNodes) == null ? void 0 : i.length) ?? 0;
        }
      });
      e.observe(document.documentElement, { subtree: !0, childList: !0, attributes: !0 }), n.observers.push(e);
    }
  }
  installDeepInstrumentation(n) {
    var y;
    const e = globalThis, s = e.setTimeout, r = e.setInterval, o = e.requestAnimationFrame, i = (p, m, w, f) => function(...v) {
      var k, I;
      if (((k = a.active) == null ? void 0 : k.id) !== n.id) return m.apply(this, v);
      const C = performance.now();
      let T = !1;
      try {
        return m.apply(this, v);
      } catch (A) {
        throw T = !0, A;
      } finally {
        ((I = a.active) == null ? void 0 : I.id) === n.id && a.record(p, w, f, performance.now() - C, T);
      }
    }, a = this, c = function(p, m, ...w) {
      if (typeof p != "function") return s.call(this, p, m, ...w);
      const f = x();
      return s.call(this, i("timeout", p, f, `${Number(m) || 0} ms`), m, ...w);
    }, l = function(p, m, ...w) {
      if (typeof p != "function") return r.call(this, p, m, ...w);
      const f = x();
      return r.call(this, i("interval", p, f, `${Number(m) || 0} ms`), m, ...w);
    };
    e.setTimeout = c, e.setInterval = l;
    let d = null;
    typeof o == "function" && (d = function(p) {
      const m = x();
      return o.call(this, i("animation-frame", p, m, "requestAnimationFrame"));
    }, e.requestAnimationFrame = d), n.restoreDeep.push(() => {
      e.setTimeout === c && (e.setTimeout = s), e.setInterval === l && (e.setInterval = r), d && e.requestAnimationFrame === d && (e.requestAnimationFrame = o);
    });
    const h = (y = globalThis.game) == null ? void 0 : y.socket;
    if (h && typeof h.emit == "function") {
      const p = h.emit, m = this, w = function(f, ...v) {
        const C = x(), T = String(f ?? "socket event"), k = performance.now(), I = m.captureId, A = v.length - 1;
        if (A >= 0 && typeof v[A] == "function") {
          const E = v[A];
          v[A] = function(...dt) {
            return m.recordAsync("socket", C, T, performance.now() - k, I), E.apply(this, dt);
          };
        }
        try {
          const E = p.call(this, f, ...v);
          return m.record("socket", C, T, performance.now() - k, !1), E;
        } catch (E) {
          throw m.record("socket", C, T, performance.now() - k, !0), E;
        }
      };
      h.emit = w, n.restoreDeep.push(() => {
        h.emit === w && (h.emit = p);
      });
    }
  }
}
const u = new St();
function j(t, n = 3) {
  const e = 10 ** n;
  return Math.round(t * e) / e;
}
function ot(t) {
  const n = /* @__PURE__ */ new Map();
  for (const e of t.metrics) {
    const s = n.get(e.source) ?? {
      source: e.source,
      calls: 0,
      syncTotalMs: 0,
      maxMs: 0,
      asyncCompletions: 0,
      asyncWallTotalMs: 0,
      errors: 0
    };
    s.calls += e.calls, s.syncTotalMs += e.syncTotalMs, s.maxMs = Math.max(s.maxMs, e.maxMs), s.asyncCompletions += e.asyncCompletions, s.asyncWallTotalMs += e.asyncWallTotalMs, s.errors += e.errors, n.set(e.source, s);
  }
  return [...n.values()].map((e) => ({
    ...e,
    syncTotalMs: j(e.syncTotalMs),
    asyncWallTotalMs: j(e.asyncWallTotalMs),
    maxMs: j(e.maxMs)
  })).sort((e, s) => s.syncTotalMs - e.syncTotalMs);
}
function Tt(t) {
  const n = String(t ?? "");
  return /[",\r\n]/.test(n) ? `"${n.replace(/"/g, '""')}"` : n;
}
function N(t) {
  const n = [
    "capture",
    "started_at",
    "duration_ms",
    "deep_mode",
    "source",
    "kind",
    "operation",
    "calls",
    "sync_total_ms",
    "max_ms",
    "p50_ms",
    "p95_ms",
    "async_completions",
    "async_wall_total_ms",
    "errors"
  ], e = t.metrics.map((s) => [
    t.label,
    t.startedAt,
    t.durationMs,
    t.deepMode,
    s.source,
    s.kind,
    s.label,
    s.calls,
    s.syncTotalMs,
    s.maxMs,
    s.p50Ms,
    s.p95Ms,
    s.asyncCompletions,
    s.asyncWallTotalMs,
    s.errors
  ]);
  return [n, ...e].map((s) => s.map(Tt).join(",")).join(`\r
`);
}
function rt(t) {
  if (!t.length) return "";
  const [n] = N(t[0]).split(`\r
`), e = t.flatMap((s) => N(s).split(`\r
`).slice(1));
  return [n, ...e].join(`\r
`);
}
function it(t) {
  const n = t.environmentStart, e = ot(t).slice(0, 10);
  return [
    `# ${t.label}`,
    "",
    `- Captured: ${t.startedAt}`,
    `- Duration: ${t.durationMs.toFixed(1)} ms`,
    `- Mode: ${t.deepMode ? "Deep" : "Normal"}`,
    `- Foundry: ${n.foundryVersion}`,
    `- System: ${n.systemId} ${n.systemVersion}`,
    `- Scene: ${n.sceneName}`,
    `- Viewport: ${n.viewport} @ ${n.devicePixelRatio}x`,
    `- Active modules: ${t.modules.length}`,
    `- Long tasks: ${t.longTasks.length}`,
    "",
    "## Top observed sources",
    "",
    "| Source | Calls | Inclusive sync time | Longest | Async completions | Errors |",
    "|---|---:|---:|---:|---:|---:|",
    ...e.map((r) => `| ${r.source} | ${r.calls} | ${r.syncTotalMs.toFixed(2)} ms | ${r.maxMs.toFixed(2)} ms | ${r.asyncCompletions} | ${r.errors} |`),
    "",
    "Inclusive callback totals may overlap. Browser style/layout/GPU/GC work and callbacks registered before attribution was available can remain unattributed."
  ].join(`
`);
}
function D(t, n, e) {
  const s = new Blob([n], { type: e }), r = URL.createObjectURL(s), o = document.createElement("a");
  o.href = r, o.download = t, o.click(), window.setTimeout(() => URL.revokeObjectURL(r), 0);
}
function kt(t) {
  return t.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "performance-capture";
}
function Ct() {
  var n, e, s, r, o, i;
  const t = globalThis;
  return t.Application ?? ((s = (e = (n = t.foundry) == null ? void 0 : n.appv1) == null ? void 0 : e.api) == null ? void 0 : s.Application) ?? ((i = (o = (r = t.foundry) == null ? void 0 : r.applications) == null ? void 0 : o.api) == null ? void 0 : i.ApplicationV2);
}
function b(t) {
  const n = document.createElement("div");
  return n.textContent = String(t ?? ""), n.innerHTML;
}
function $(t) {
  return t < 1 ? `${t.toFixed(3)} ms` : `${t.toFixed(2)} ms`;
}
function F(t) {
  return t instanceof HTMLElement ? t : t && typeof t.get == "function" ? t.get(0) ?? null : Array.isArray(t) && t[0] instanceof HTMLElement ? t[0] : null;
}
function At(t) {
  if (!t)
    return `<section class="hspc-empty">
      <i class="fa-solid fa-chart-line" aria-hidden="true"></i>
      <h3>No completed capture yet</h3>
      <p>Start a capture, perform one repeatable action, and stop it from the Token Controls button or the keybinding.</p>
    </section>`;
  const e = ot(t).slice(0, 20).map((a) => `<tr>
    <td><code>${b(a.source)}</code></td>
    <td>${a.calls}</td>
    <td>${$(a.syncTotalMs)}</td>
    <td>${$(a.maxMs)}</td>
    <td>${a.asyncCompletions}</td>
    <td>${a.errors}</td>
  </tr>`).join(""), s = t.metrics.slice(0, 40).map((a) => `<tr>
    <td><code>${b(a.source)}</code></td>
    <td>${b(a.kind)}</td>
    <td title="${b(a.label)}">${b(a.label)}</td>
    <td>${a.calls}</td>
    <td>${$(a.syncTotalMs)}</td>
    <td>${$(a.maxMs)}</td>
    <td>${$(a.p95Ms)}</td>
  </tr>`).join(""), r = t.modules.map((a) => `<tr><td><code>${b(a.id)}</code></td><td>${b(a.version)}</td><td>${b(a.title)}</td></tr>`).join(""), o = /* @__PURE__ */ new Map();
  for (const a of t.stylesheets) {
    const c = o.get(a.source) ?? { sheets: 0, rules: 0, inaccessible: 0 };
    c.sheets += 1, a.ruleCount === null ? c.inaccessible += 1 : c.rules += a.ruleCount, o.set(a.source, c);
  }
  const i = [...o.entries()].sort((a, c) => c[1].rules - a[1].rules).map(([a, c]) => `<tr><td><code>${b(a)}</code></td><td>${c.sheets}</td><td>${c.rules}</td><td>${c.inaccessible}</td></tr>`).join("");
  return `<section class="hspc-report">
    <div class="hspc-cards">
      <article><span>Capture window</span><strong>${$(t.durationMs)}</strong></article>
      <article><span>Mode</span><strong>${t.deepMode ? "Deep" : "Normal"}</strong></article>
      <article><span>Active modules</span><strong>${t.modules.length}</strong></article>
      <article><span>Long tasks</span><strong>${t.longTasks.length}</strong></article>
      <article><span>DOM mutations</span><strong>${t.deepMode ? t.dom.records : "Not measured"}</strong></article>
      <article><span>Dropped events</span><strong>${t.droppedTimelineEvents}</strong></article>
    </div>
    <p class="hspc-caveat"><i class="fa-solid fa-circle-info"></i> Callback times are inclusive and can overlap. Style/layout, GPU, garbage collection, and other browser work remain unattributed.</p>
    <details open>
      <summary>Observed sources</summary>
      <div class="hspc-table-wrap"><table><thead><tr><th>Source</th><th>Calls</th><th>Inclusive time</th><th>Longest</th><th>Async</th><th>Errors</th></tr></thead><tbody>${e || '<tr><td colspan="6">No instrumented callbacks were observed.</td></tr>'}</tbody></table></div>
    </details>
    <details open>
      <summary>Slowest operations</summary>
      <div class="hspc-table-wrap"><table><thead><tr><th>Source</th><th>Kind</th><th>Operation</th><th>Calls</th><th>Total</th><th>Max</th><th>p95</th></tr></thead><tbody>${s || '<tr><td colspan="7">No operations were measured.</td></tr>'}</tbody></table></div>
    </details>
    <details>
      <summary>Environment and active modules</summary>
      <dl class="hspc-environment">
        <dt>Foundry</dt><dd>${b(t.environmentStart.foundryVersion)}</dd>
        <dt>System</dt><dd>${b(t.environmentStart.systemId)} ${b(t.environmentStart.systemVersion)}</dd>
        <dt>Scene</dt><dd>${b(t.environmentStart.sceneName)}</dd>
        <dt>Viewport</dt><dd>${b(t.environmentStart.viewport)} @ ${t.environmentStart.devicePixelRatio}x</dd>
        <dt>DOM nodes</dt><dd>${t.environmentStart.domNodes} → ${t.environmentEnd.domNodes}</dd>
      </dl>
      <div class="hspc-table-wrap"><table><thead><tr><th>Module ID</th><th>Version</th><th>Title</th></tr></thead><tbody>${r}</tbody></table></div>
    </details>
    <details>
      <summary>Stylesheet footprint</summary>
      <p>Rule counts describe loaded CSS only; they do not measure selector cost.</p>
      <div class="hspc-table-wrap"><table><thead><tr><th>Source</th><th>Sheets</th><th>Accessible rules</th><th>Inaccessible</th></tr></thead><tbody>${i}</tbody></table></div>
    </details>
  </section>`;
}
function xt(t) {
  if (!t.length) return "";
  const n = /* @__PURE__ */ new Map();
  for (const r of t) {
    const o = n.get(r.label) ?? [];
    o.push(r), n.set(r.label, o);
  }
  const e = (r) => {
    const o = [...r].sort((a, c) => a - c), i = Math.floor(o.length / 2);
    return o.length % 2 ? o[i] : (o[i - 1] + o[i]) / 2;
  }, s = [...n.entries()].map(([r, o]) => {
    const i = o.map((d) => d.metrics.reduce((h, y) => h + y.syncTotalMs, 0)).sort((d, h) => d - h), a = i[Math.min(i.length - 1, Math.ceil(i.length * 0.95) - 1)], c = o.map((d) => d.durationMs), l = o.map((d) => d.longTasks.reduce((h, y) => h + y.durationMs, 0));
    return `<tr><td>${b(r)}</td><td>${o.length}</td><td>${$(e(i))}</td><td>${$(a)}</td><td>${$(e(c))}</td><td>${$(e(l))}</td></tr>`;
  }).join("");
  return `<details ${n.size > 1 || t.length > 1 ? "open" : ""}>
    <summary>Capture comparison by exact label</summary>
    <p>Use the same label for repeated runs. Inclusive callback totals can overlap; the capture window includes human start/stop time.</p>
    <div class="hspc-table-wrap"><table><thead><tr><th>Label</th><th>Runs</th><th>Inclusive median</th><th>Inclusive p95</th><th>Window median</th><th>Long-task median</th></tr></thead><tbody>${s}</tbody></table></div>
  </details>`;
}
const Et = Ct();
class at extends Et {
  constructor() {
    super(...arguments);
    R(this, "selectedReportId", null);
  }
  static get defaultOptions() {
    return globalThis.foundry.utils.mergeObject(super.defaultOptions ?? {}, {
      id: g,
      title: S,
      classes: ["hspc-window"],
      popOut: !0,
      resizable: !0,
      width: 980,
      height: 760
    });
  }
  selectedReport() {
    return u.history.find((e) => e.id === this.selectedReportId) ?? u.latest;
  }
  content() {
    const e = u.liveState, s = this.selectedReport(), r = u.history.map((o) => `<option value="${b(o.id)}" ${o.id === (s == null ? void 0 : s.id) ? "selected" : ""}>${b(o.label)} — ${new Date(o.startedAt).toLocaleString()}</option>`).join("");
    return `<main class="hspc-shell">
      <header class="hspc-header">
        <div><p class="hspc-kicker">LOCAL PROFILER</p><h2>${S}</h2><p>Measure one repeatable Foundry action without sending data anywhere.</p></div>
        <div class="hspc-status ${e ? "is-recording" : ""}"><span></span>${e ? `Recording: ${b(e.label)}` : "Ready"}</div>
      </header>
      <section class="hspc-controls">
        <label>Capture label<input type="text" name="capture-label" value="${b((s == null ? void 0 : s.label) ?? `Test ${u.history.length + 1}`)}" ${e ? "disabled" : ""}></label>
        <label class="hspc-check"><input type="checkbox" name="deep-mode" ${e ? "disabled" : ""}> Deep mode</label>
        <button type="button" data-action="start" ${e ? "disabled" : ""}><i class="fa-solid fa-circle"></i> Start clean capture</button>
        <button type="button" data-action="stop" ${e ? "" : "disabled"}><i class="fa-solid fa-stop"></i> Stop</button>
        <button type="button" data-action="mark" ${e ? "" : "disabled"}><i class="fa-solid fa-bookmark"></i> Mark</button>
      </section>
      <section class="hspc-history">
        <label>Completed capture<select name="report">${r || '<option value="">No reports</option>'}</select></label>
        <button type="button" data-action="json" ${s ? "" : "disabled"}>Export JSON</button>
        <button type="button" data-action="csv" ${s ? "" : "disabled"}>Export CSV</button>
        <button type="button" data-action="all-csv" ${u.history.length ? "" : "disabled"}>All CSV</button>
        <button type="button" data-action="copy" ${s ? "" : "disabled"}>Copy summary</button>
        <button type="button" data-action="clear" ${u.history.length && !e ? "" : "disabled"}>Clear</button>
      </section>
      ${xt(u.history)}
      ${At(s)}
    </main>`;
  }
  async _renderInner() {
    return globalThis.$(this.content());
  }
  async _renderHTML() {
    const e = document.createElement("template");
    return e.innerHTML = this.content().trim(), e.content;
  }
  _replaceHTML(e, s) {
    const r = F(s), o = (r == null ? void 0 : r.querySelector(".window-content")) ?? r;
    if (!o) return;
    const i = e instanceof DocumentFragment || e instanceof HTMLElement ? e : F(e);
    i ? o.replaceChildren(i) : o.innerHTML = String(e ?? ""), this.bind(o);
  }
  activateListeners(e) {
    super.activateListeners(e);
    const s = F(e);
    s && this.bind(s);
  }
  bind(e) {
    var s;
    (s = e.querySelector('[name="report"]')) == null || s.addEventListener("change", (r) => {
      this.selectedReportId = r.currentTarget.value || null, this.render(!1);
    });
    for (const r of e.querySelectorAll("[data-action]"))
      r.addEventListener("click", () => this.handleAction(r.dataset.action ?? "", e));
  }
  async handleAction(e, s) {
    var o, i, a, c, l;
    const r = (d) => {
      var h, y, p;
      return (p = (y = (h = globalThis.ui) == null ? void 0 : h.notifications) == null ? void 0 : y.info) == null ? void 0 : p.call(y, d);
    };
    try {
      if (e === "start") {
        const y = (o = s.querySelector('[name="capture-label"]')) == null ? void 0 : o.value, p = ((i = s.querySelector('[name="deep-mode"]')) == null ? void 0 : i.checked) === !0;
        await nt(), await this.close(), window.setTimeout(() => {
          u.start({ label: y, deepMode: p });
        }, 150);
        return;
      }
      if (e === "stop") {
        const y = u.stop();
        this.selectedReportId = y.id, this.render(!1);
        return;
      }
      if (e === "mark") {
        u.mark("Manual marker"), r(`${S}: marker added.`);
        return;
      }
      if (e === "clear") {
        u.clear(), this.selectedReportId = null, this.render(!1);
        return;
      }
      if (e === "all-csv") {
        D("holosuite-performance-captures.csv", rt(u.history), "text/csv;charset=utf-8");
        return;
      }
      const d = this.selectedReport();
      if (!d) return;
      const h = `${kt(d.label)}-${d.id.slice(0, 8)}`;
      e === "json" && D(`${h}.json`, JSON.stringify(d, null, 2), "application/json"), e === "csv" && D(`${h}.csv`, N(d), "text/csv;charset=utf-8"), e === "copy" && (await navigator.clipboard.writeText(it(d)), r(`${S}: summary copied.`));
    } catch (d) {
      console.error(`${g} | Action failed.`, d), (l = (c = (a = globalThis.ui) == null ? void 0 : a.notifications) == null ? void 0 : c.error) == null || l.call(c, `${S}: ${d instanceof Error ? d.message : String(d)}`);
    }
  }
}
R(at, "DEFAULT_OPTIONS", {
  id: g,
  tag: "section",
  classes: ["hspc-window"],
  window: { title: S, resizable: !0 },
  position: { width: 980, height: 760 }
});
let P = null;
function _() {
  return P || (P = new at()), P.render(!0), P;
}
function ct() {
  let t = null;
  u.liveState && (t = u.stop());
  const n = _();
  return t && (n.selectedReportId = t.id), t;
}
function L(t) {
  return t !== null && typeof t == "object" && !Array.isArray(t);
}
function Rt(t) {
  return Array.isArray(t) ? t.find((n) => L(n) && ["tokens", "token"].includes(String(n.name ?? ""))) ?? null : L(t) ? t.tokens ?? t.token ?? Object.values(t).find((n) => L(n) && ["tokens", "token"].includes(String(n.name ?? ""))) ?? null : null;
}
function It(t, n) {
  const e = Rt(t);
  if (!e) return !1;
  const s = e.tools;
  if (Array.isArray(s))
    return s.some((o) => (o == null ? void 0 : o.name) === n.name) ? !1 : (s.push(n), !0);
  if (!L(s) || s[n.name]) return !1;
  const r = Object.values(s).map((o) => Number(o == null ? void 0 : o.order)).filter(Number.isFinite);
  return s[n.name] = { ...n, order: n.order ?? (r.length ? Math.max(...r) + 1 : 0) }, !0;
}
const K = vt();
let Q = 0;
const Y = {
  open: _,
  start: (t = {}) => u.start(t),
  stop: () => u.stop(),
  mark: (t) => u.mark(t),
  get active() {
    return u.liveState;
  },
  get reports() {
    return u.history;
  },
  get latest() {
    return u.latest;
  },
  toCsv: N,
  allToCsv: () => rt(u.history),
  toSummary: it
};
function lt() {
  var e, s;
  const t = globalThis.game;
  t.holosuitePerformanceCheck = Y;
  const n = (s = (e = t.modules) == null ? void 0 : e.get) == null ? void 0 : s.call(e, g);
  if (n)
    try {
      n.api = Y;
    } catch {
    }
}
function Z() {
  const t = Date.now();
  t - Q < 100 || (Q = t, u.liveState ? ct() : _());
}
globalThis.Hooks.once("init", () => {
  globalThis.game.keybindings.register(g, "toggle-capture", {
    name: `${S}: Open / Stop Capture`,
    hint: "Open the profiler when idle, or stop the current capture and show its report.",
    editable: [{ key: "KeyP", modifiers: ["ALT", "SHIFT"] }],
    onDown: () => (u.liveState ? ct() : _(), !0),
    restricted: !1,
    precedence: 0
  }), lt();
});
globalThis.Hooks.on("getSceneControlButtons", (t) => {
  It(t, {
    name: g,
    title: u.liveState ? `${S}: Stop Capture` : S,
    icon: u.liveState ? "fa-solid fa-stop" : "fa-solid fa-chart-line",
    button: !0,
    visible: !0,
    onClick: Z,
    onChange: (...n) => {
      n.some((e) => e === !1) || Z();
    }
  });
});
globalThis.Hooks.once("ready", () => {
  lt(), console.info(`${g} | Ready. Hook instrumentation: ${K.installed ? "active" : "unavailable"}; preexisting callbacks wrapped: ${K.existingWrapped}.`), nt().then((t) => {
    console.info(`${g} | Preexisting hook attribution: ${t.resolved}/${t.total} resolved, ${t.ambiguous} ambiguous, ${t.unresolved} unresolved across ${t.scriptsScanned} scripts.`);
  });
});
