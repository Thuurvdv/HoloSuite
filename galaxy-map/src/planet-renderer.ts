import {
  AmbientLight, BoxGeometry, Color, CylinderGeometry, DirectionalLight, IcosahedronGeometry, Mesh,
  InstancedMesh, Matrix4, MeshBasicMaterial, MeshStandardMaterial, OctahedronGeometry, PerspectiveCamera,
  Raycaster, Scene, SphereGeometry, SRGBColorSpace, TextureLoader, TorusGeometry, Vector2, Vector3, WebGLRenderer,
  BackSide, DoubleSide, ShaderMaterial, AdditiveBlending
} from "three";

const SURFACE_FINISHES: Record<string, { roughness: number; metalness: number; emissive?: number }> = {
  smooth: { roughness: 0.34, metalness: 0.04 },
  matte: { roughness: 0.92, metalness: 0 },
  holographic: { roughness: 1, metalness: 0 }
};

/** Add deterministic shader detail without generating or loading another image. */
function configureSurfaceFinish(material: MeshStandardMaterial | MeshBasicMaterial, requestedFinish: unknown, requestedStrength: unknown) {
  const finish = String(requestedFinish || "smooth");
  const preset = SURFACE_FINISHES[finish] ?? SURFACE_FINISHES.smooth;
  const strength = Math.min(0.8, Math.max(0, Number(requestedStrength) / 100 * 0.8 || 0));
  if (finish === "holographic") {
    material.transparent = true;
    material.opacity = 0.58;
    material.depthWrite = false;
    material.side = DoubleSide;
    material.onBeforeCompile = shader => {
      shader.uniforms.gmfDetailStrength = { value: strength };
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 gmfObjectPosition;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\ngmfObjectPosition = position;");
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\nvarying vec3 gmfObjectPosition;\nuniform float gmfDetailStrength;")
        .replace("#include <map_fragment>", `#include <map_fragment>
          float gmfScan = 0.5 + 0.5 * sin((gmfObjectPosition.y + gmfObjectPosition.x * 0.12) * 38.0);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.08, 0.78, 0.96), 0.38 + 0.22 * gmfDetailStrength);
          diffuseColor.rgb *= 0.78 + gmfScan * 0.26;
          diffuseColor.a *= 0.72 + gmfScan * 0.18 * gmfDetailStrength;
        `);
    };
    material.customProgramCacheKey = () => "gmf-surface-holographic";
    return;
  }
  const standard = material as MeshStandardMaterial;
  standard.roughness = preset.roughness;
  standard.metalness = preset.metalness;
  standard.emissive.set("#000000");
}

let activeViewer: { dispose: () => void } | null = null;

function remapCubeUvs(geometry: any) {
  const position = geometry.getAttribute("position");
  const normal = geometry.getAttribute("normal");
  const uv = geometry.getAttribute("uv");
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i) / 1.65 + 0.5;
    const y = position.getY(i) / 1.65 + 0.5;
    const z = position.getZ(i) / 1.65 + 0.5;
    const nx = normal.getX(i), ny = normal.getY(i), nz = normal.getZ(i);
    let column = 1, row = 1, localU = x, localV = y;
    if (nz > 0.5) { column = 1; localU = x; }
    else if (nx > 0.5) { column = 2; localU = 1 - z; }
    else if (nz < -0.5) { column = 3; localU = 1 - x; }
    else if (nx < -0.5) { column = 0; localU = z; }
    else if (ny > 0.5) { column = 1; row = 2; localU = x; localV = 1 - z; }
    else { column = 1; row = 0; localU = x; localV = z; }
    uv.setXY(i, (column + localU) / 4, (row + localV) / 3);
  }
  uv.needsUpdate = true;
  return geometry;
}

function remapCylinderUvs(geometry: any) {
  const uv = geometry.getAttribute("uv");
  const index = geometry.getIndex();
  for (const group of geometry.groups) {
    const vertices = new Set<number>();
    for (let i = group.start; i < group.start + group.count; i++) vertices.add(index.getX(i));
    for (const vertex of vertices) {
      const u = uv.getX(vertex), v = uv.getY(vertex);
      if (group.materialIndex === 0) uv.setXY(vertex, u, 0.25 + v * 0.5);
      else if (group.materialIndex === 1) uv.setXY(vertex, 0.125 + u * 0.25, 0.75 + v * 0.25);
      else uv.setXY(vertex, 0.625 + u * 0.25, v * 0.25);
    }
  }
  uv.needsUpdate = true;
  return geometry;
}

function remapCrystalUvs(geometry: any) {
  const uv = geometry.getAttribute("uv");
  for (let face = 0; face < 8; face++) {
    const column = face % 4;
    const start = face * 3;
    if (face < 4) {
      uv.setXY(start, (column + 0.5) / 4, 1);
      uv.setXY(start + 1, column / 4, 0.5);
      uv.setXY(start + 2, (column + 1) / 4, 0.5);
    } else {
      uv.setXY(start, column / 4, 0.5);
      uv.setXY(start + 1, (column + 1) / 4, 0.5);
      uv.setXY(start + 2, (column + 0.5) / 4, 0);
    }
  }
  uv.needsUpdate = true;
  return geometry;
}

/** One local WebGL viewer, with bounded resolution and no post-processing. */
export function createPlanetRenderer(host: HTMLElement, options: any) {
  activeViewer?.dispose();
  let disposed = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let frame = 0;
  let lastTime = 0;
  let textureRequest = 0;
  let texture: any = null;
  let renderer: any = null;
  let dragging: { id: number; x: number; y: number } | null = null;
  let externalDrag = false;
  let hoveredLocationId = "";
  let markerLocations: any[] = [];
  let previewFrame = 0;
  let hoverFrame = 0;
  let pendingHoverPoint: { clientX: number; clientY: number } | null = null;
  let intersecting = true;
  const listeners = new AbortController();
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const effectsDisabled = () => document.documentElement.dataset.holosuiteDebugNoEffects === "true"
    || document.body.dataset.holosuiteDebugNoEffects === "true";
  let paused = reducedMotion.matches || effectsDisabled();
  const scene = new Scene();
  const camera = new PerspectiveCamera(34, 1, 0.1, 50);
  camera.position.z = 4.3;
  const shapes = ["cube", "donut", "asteroid", "crystal", "cylinder"];
  const shape = shapes.includes(options.shape) ? options.shape : "sphere";
  const finish = SURFACE_FINISHES[options.finish] ? String(options.finish) : "smooth";
  const geometry = (() => {
    if (shape === "cube") return remapCubeUvs(new BoxGeometry(1.65, 1.65, 1.65, 4, 4, 4));
    if (shape === "donut") return new TorusGeometry(0.76, 0.34, 32, 80);
    if (shape === "crystal") {
      const crystal = new OctahedronGeometry(1, 0);
      crystal.scale(0.82, 1.2, 0.82);
      return remapCrystalUvs(crystal);
    }
    if (shape === "cylinder") return remapCylinderUvs(new CylinderGeometry(0.72, 0.72, 1.85, 48, 3));
    if (shape === "asteroid") {
      const asteroid = new IcosahedronGeometry(1, 2);
      const positions = asteroid.getAttribute("position");
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
        const variation = 1 + 0.1 * Math.sin(x * 11 + y * 7 + z * 13)
          + 0.055 * Math.sin(x * 23 - y * 17 + z * 5);
        positions.setXYZ(i, x * variation, y * variation * 0.9, z * variation * 1.08);
      }
      positions.needsUpdate = true;
      asteroid.computeVertexNormals();
      return asteroid;
    }
    return new SphereGeometry(1, 64, 40);
  })();
  const material = finish === "holographic"
    ? new MeshBasicMaterial({ color: 0xffffff })
    : new MeshStandardMaterial({ color: 0xffffff, flatShading: shape === "asteroid" || shape === "crystal" });
  configureSurfaceFinish(material, finish, options.detailStrength);
  const planet = new Mesh(geometry, material);
  planet.rotation.set(0.12, 0.5, -0.12);
  scene.add(planet);
  const markerGeometry = new SphereGeometry(0.052, 10, 8);
  const markerMaterial = new MeshBasicMaterial({ color: new Color(options.markerColor || "#58d8ff"), toneMapped: false });
  const markerMesh = new InstancedMesh(markerGeometry, markerMaterial, 64);
  markerMesh.count = 0;
  markerMesh.renderOrder = 4;
  planet.add(markerMesh);
  const markerHitGeometry = new SphereGeometry(0.13, 8, 6);
  const markerHitMaterial = new MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false });
  const markerHitMesh = new InstancedMesh(markerHitGeometry, markerHitMaterial, 64);
  markerHitMesh.count = 0;
  planet.add(markerHitMesh);
  const previewMaterial = new MeshBasicMaterial({ color: new Color(options.markerColor || "#7dffbd"), transparent: true, opacity: 0.48, toneMapped: false });
  const previewMarker = new Mesh(markerGeometry, previewMaterial);
  previewMarker.visible = false;
  planet.add(previewMarker);
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  const markerMatrix = new Matrix4();
  const markerPoint = new Vector3();
  const markerNormal = new Vector3();
  const atmosphereMaterial = new ShaderMaterial({
    uniforms: { tint: { value: new Color(0x8bcaff) } },
    vertexShader: `varying vec3 surfaceNormal; varying vec3 viewDirection;
      void main() { vec4 p = modelViewMatrix * vec4(position, 1.0);
        surfaceNormal = normalize(normalMatrix * normal); viewDirection = -p.xyz;
        gl_Position = projectionMatrix * p; }`,
    fragmentShader: `uniform vec3 tint; varying vec3 surfaceNormal; varying vec3 viewDirection;
      void main() { float rim = pow(1.0 - abs(dot(normalize(surfaceNormal), normalize(viewDirection))), 3.0);
        gl_FragColor = vec4(tint, rim * 0.24); }`,
    side: BackSide, transparent: true, depthWrite: false, blending: AdditiveBlending
  });
  const atmosphere = new Mesh(geometry, atmosphereMaterial);
  atmosphere.scale.setScalar(1.035);
  scene.add(atmosphere);
  scene.add(new AmbientLight(0xc2d6ff, 0.65));
  const sun = new DirectionalLight(0xfff2de, 2.4);
  sun.position.set(-3, 2, 4);
  scene.add(sun);
  const visible = () => !disposed && !document.hidden && intersecting && host.isConnected
    && host.clientWidth > 0 && host.clientHeight > 0 && (options.isVisible?.() ?? true);
  const cancel = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
  };
  const emitMarkerPosition = () => {
    const location = markerLocations.find(candidate => candidate.id === hoveredLocationId);
    if (!location) return;
    markerPoint.fromArray(location.position);
    markerNormal.fromArray(location.normal);
    markerPoint.addScaledVector(markerNormal, 0.07);
    planet.localToWorld(markerPoint);
    markerPoint.project(camera);
    options.onMarkerPosition?.({
      x: (markerPoint.x * 0.5 + 0.5) * host.clientWidth,
      y: (-markerPoint.y * 0.5 + 0.5) * host.clientHeight,
      visible: markerPoint.z >= -1 && markerPoint.z <= 1
    });
  };
  const draw = () => {
    if (!renderer || !visible()) return;
    renderer.render(scene, camera);
    if (hoveredLocationId) emitMarkerPosition();
  };
  const schedule = () => {
    if (disposed || !renderer || paused || effectsDisabled() || !visible() || timer !== null || frame) return;
    timer = setTimeout(() => {
      timer = null;
      frame = requestAnimationFrame(time => {
        frame = 0;
        if (!visible() || paused || effectsDisabled()) { lastTime = 0; return; }
        if (!dragging && !externalDrag && !hoveredLocationId) planet.rotation.y += Math.min(lastTime ? (time - lastTime) / 1000 : 0, 0.1) * 0.13;
        lastTime = time;
        draw();
        schedule();
      });
    }, 1000 / 30);
  };
  const wake = () => { cancel(); draw(); schedule(); };
  const resize = () => {
    if (!renderer || disposed) return;
    const width = Math.max(host.clientWidth, 1), height = Math.max(host.clientHeight, 1);
    // Never allocate a giant framebuffer on high-DPI or very large displays.
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5, 1200 / Math.max(width, height)));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = width < height ? 34 * Math.min(height / width, 1.8) : 34;
    camera.updateProjectionMatrix();
    wake();
  };
  const resizeObserver = new ResizeObserver(resize);
  const intersectionObserver = new IntersectionObserver(entries => {
    intersecting = entries[0]?.isIntersecting ?? false;
    wake();
  });
  const effectObserver = new MutationObserver(wake);
  const api = {
    setLocations(locations: any[] = []) {
      markerLocations = locations.filter(location => location?.shape === shape).slice(0, 64);
      markerMesh.count = markerLocations.length;
      markerHitMesh.count = markerLocations.length;
      markerLocations.forEach((location, index) => {
        markerPoint.fromArray(location.position);
        markerNormal.fromArray(location.normal);
        markerPoint.addScaledVector(markerNormal, 0.07);
        markerMatrix.makeTranslation(markerPoint.x, markerPoint.y, markerPoint.z);
        markerMesh.setMatrixAt(index, markerMatrix);
        markerHitMesh.setMatrixAt(index, markerMatrix);
      });
      markerMesh.instanceMatrix.needsUpdate = true;
      markerHitMesh.instanceMatrix.needsUpdate = true;
      markerMesh.computeBoundingBox();
      markerMesh.computeBoundingSphere();
      markerHitMesh.computeBoundingBox();
      markerHitMesh.computeBoundingSphere();
      if (!markerLocations.some(location => location.id === hoveredLocationId)) {
        hoveredLocationId = "";
        options.onMarkerLeave?.();
      }
      wake();
    },
    async setTexture(path: string | null, color = "#ffffff") {
      if (disposed || !renderer) return;
      const request = ++textureRequest;
      material.color.set(path ? "#ffffff" : color);
      atmosphereMaterial.uniforms.tint.value.set(color);
      if (!path) {
        material.map = null;
        material.needsUpdate = true;
        texture?.dispose();
        texture = null;
        host.dataset.planetReady = "true";
        options.onStatus?.(`${finish.replace("-", " ")} finish · Drag to rotate ${shape} · Scroll to zoom`);
        draw(); schedule();
        return;
      }
      options.onStatus?.("Loading planet surface…");
      let next: any = null;
      try {
        next = await new TextureLoader().loadAsync(path);
        if (disposed || request !== textureRequest) { next.dispose(); return; }
        // Cap oversized user assets before upload; retain the source file unchanged.
        const image = next.image;
        const limit = Math.min(2048, renderer.capabilities.maxTextureSize);
        if (Math.max(image.width, image.height) > limit) {
          const scale = limit / Math.max(image.width, image.height);
          const reduced = document.createElement("canvas");
          reduced.width = Math.max(1, Math.round(image.width * scale));
          reduced.height = Math.max(1, Math.round(image.height * scale));
          reduced.getContext("2d")!.drawImage(image, 0, 0, reduced.width, reduced.height);
          next.image = reduced;
        }
        next.colorSpace = SRGBColorSpace;
        next.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
        material.map = next;
        material.needsUpdate = true;
        texture?.dispose();
        texture = next;
        const ratio = image.width / image.height;
        const expectedRatio = shape === "cube" ? 4 / 3 : shape === "cylinder" ? 1 : 2;
        const recommendedSize = shape === "cube" ? "2048×1536" : shape === "cylinder" ? "2048×2048" : "2048×1024";
        options.onStatus?.(Math.abs(ratio - expectedRatio) > 0.1
          ? `Surface loaded. ${recommendedSize} gives the best fit for this shape.`
          : `${finish.replace("-", " ")} finish · Drag to rotate ${shape} · Scroll to zoom`);
        host.dataset.planetReady = "true";
        draw(); schedule();
      } catch {
        if (next && next !== texture) next.dispose();
        if (!disposed && request === textureRequest) options.onStatus?.("Texture unavailable. Choose another image or a flat color in Edit Entity.");
      }
    },
    setPaused(value: boolean) {
      if (disposed) return;
      paused = value;
      options.onPaused?.(paused);
      wake();
    },
    get paused() { return paused; },
    zoom(delta: number) {
      if (disposed) return;
      camera.position.z = Math.max(3, Math.min(6, camera.position.z + delta));
      draw();
    },
    reset() {
      if (disposed) return;
      camera.position.z = 4.3;
      planet.rotation.set(0.12, 0.5, -0.12);
      draw();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      textureRequest++;
      cancel();
      listeners.abort();
      if (previewFrame) cancelAnimationFrame(previewFrame);
      if (hoverFrame) cancelAnimationFrame(hoverFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      effectObserver.disconnect();
      texture?.dispose();
      material.dispose();
      atmosphereMaterial.dispose();
      markerMaterial.dispose();
      markerHitMaterial.dispose();
      previewMaterial.dispose();
      markerGeometry.dispose();
      markerHitGeometry.dispose();
      geometry.dispose();
      scene.clear();
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
        renderer = null;
      }
      if (activeViewer === api) activeViewer = null;
      delete host.dataset.planetReady;
      options.onStopped?.();
    }
  };
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement as HTMLCanvasElement;
    canvas.tabIndex = 0;
    canvas.setAttribute("aria-label", `3D ${shape}. Drag or use arrow keys to rotate; plus and minus to zoom; space to pause.`);
    host.append(canvas);
    const listen = (target: EventTarget, type: string, fn: any, settings: any = {}) =>
      target.addEventListener(type, fn, { ...settings, signal: listeners.signal });
    const pointRay = (event: { clientX: number; clientY: number }) => {
      const rect = canvas.getBoundingClientRect();
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      scene.updateMatrixWorld(true);
      raycaster.setFromCamera(pointer, camera);
    };
    const surfaceAnchor = (event: { clientX: number; clientY: number }) => {
      pointRay(event);
      const hit = raycaster.intersectObject(planet, false)[0];
      if (!hit?.face) return null;
      const point = planet.worldToLocal(hit.point.clone());
      const normal = hit.face.normal.clone().normalize();
      return { position: point.toArray(), normal: normal.toArray(), shape, surfaceVersion: 1 };
    };
    const visibleMarkerHit = () => {
      const markerHit = raycaster.intersectObject(markerHitMesh, false)[0];
      if (!markerHit) return null;
      const surfaceHit = raycaster.intersectObject(planet, false)[0];
      return !surfaceHit || markerHit.distance <= surfaceHit.distance + 0.025 ? markerHit : null;
    };
    const setHoveredLocation = (id = "") => {
      if (id === hoveredLocationId) return;
      hoveredLocationId = id;
      if (!id) options.onMarkerLeave?.();
      else {
        const location = markerLocations.find(candidate => candidate.id === id);
        if (location) options.onMarkerHover?.(location);
      }
      wake();
    };
    listen(canvas, "pointerdown", (event: PointerEvent) => {
      if (event.button !== 0) return;
      pointRay(event);
      const markerHit = visibleMarkerHit();
      if (markerHit?.instanceId !== undefined) return;
      dragging = { id: event.pointerId, x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
      canvas.focus();
    });
    listen(canvas, "pointermove", (event: PointerEvent) => {
      if (dragging && dragging.id === event.pointerId) {
        setHoveredLocation();
        planet.rotation.y += (event.clientX - dragging.x) * 0.008;
        planet.rotation.x = Math.max(-1.2, Math.min(1.2, planet.rotation.x + (event.clientY - dragging.y) * 0.006));
        dragging.x = event.clientX; dragging.y = event.clientY;
        draw();
        return;
      }
      pendingHoverPoint = { clientX: event.clientX, clientY: event.clientY };
      if (hoverFrame) return;
      hoverFrame = requestAnimationFrame(() => {
        hoverFrame = 0;
        if (!pendingHoverPoint || disposed) return;
        pointRay(pendingHoverPoint);
        const index = visibleMarkerHit()?.instanceId;
        setHoveredLocation(index === undefined ? "" : markerLocations[index]?.id ?? "");
      });
    });
    listen(canvas, "pointerleave", () => setHoveredLocation());
    listen(canvas, "click", (event: PointerEvent) => {
      if (!hoveredLocationId) return;
      event.preventDefault();
      event.stopPropagation();
      const location = markerLocations.find(candidate => candidate.id === hoveredLocationId);
      if (location) options.onMarkerOpen?.(location);
    });
    listen(canvas, "contextmenu", (event: MouseEvent) => {
      pointRay(event);
      const first = visibleMarkerHit();
      const location = first?.instanceId === undefined ? null : markerLocations[first.instanceId];
      if (!location || !options.onMarkerContextMenu) return;
      event.preventDefault();
      event.stopPropagation();
      options.onMarkerContextMenu(location);
    });
    listen(canvas, "dragenter", (event: DragEvent) => {
      if (!options.canPlaceLocations) return;
      event.preventDefault();
      externalDrag = true;
      host.classList.add("is-location-dragover");
      wake();
    });
    listen(canvas, "dragover", (event: DragEvent) => {
      if (!options.canPlaceLocations) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "link";
      externalDrag = true;
      if (previewFrame) return;
      previewFrame = requestAnimationFrame(() => {
        previewFrame = 0;
        const anchor = surfaceAnchor(event);
        previewMarker.visible = Boolean(anchor);
        if (anchor) {
          markerPoint.fromArray(anchor.position);
          markerNormal.fromArray(anchor.normal);
          previewMarker.position.copy(markerPoint.addScaledVector(markerNormal, 0.07));
        }
        draw();
      });
    });
    listen(canvas, "dragleave", () => {
      externalDrag = false;
      previewMarker.visible = false;
      host.classList.remove("is-location-dragover");
      wake();
    });
    listen(canvas, "drop", (event: DragEvent) => {
      if (!options.canPlaceLocations) return;
      event.preventDefault();
      event.stopPropagation();
      externalDrag = false;
      previewMarker.visible = false;
      host.classList.remove("is-location-dragover");
      const anchor = surfaceAnchor(event);
      if (anchor) options.onLocationDrop?.(event, anchor);
      else options.onInvalidLocationDrop?.();
      wake();
    });
    for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) listen(canvas, type, () => { dragging = null; });
    listen(canvas, "wheel", (event: WheelEvent) => { event.preventDefault(); api.zoom(Math.sign(event.deltaY) * 0.18); }, { passive: false });
    listen(canvas, "keydown", (event: KeyboardEvent) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", " "].includes(event.key)) return;
      event.preventDefault(); event.stopPropagation();
      if (event.key === " ") api.setPaused(!paused);
      else if (["+", "=", "-"].includes(event.key)) api.zoom(event.key === "-" ? 0.2 : -0.2);
      else {
        if (event.key === "ArrowLeft") planet.rotation.y -= 0.1;
        if (event.key === "ArrowRight") planet.rotation.y += 0.1;
        if (event.key === "ArrowUp") planet.rotation.x -= 0.1;
        if (event.key === "ArrowDown") planet.rotation.x += 0.1;
        draw();
      }
    });
    listen(document, "visibilitychange", wake);
    listen(reducedMotion, "change", () => api.setPaused(reducedMotion.matches || effectsDisabled()));
    listen(canvas, "webglcontextlost", (event: Event) => {
      event.preventDefault();
      api.dispose();
      options.onStatus?.("3D rendering interrupted. Static preview shown; reopen the planet to retry.");
    });
    resizeObserver.observe(host);
    intersectionObserver.observe(host);
    effectObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-holosuite-debug-no-effects"] });
    effectObserver.observe(document.body, { attributes: true, attributeFilter: ["data-holosuite-debug-no-effects"] });
    const app = host.closest(".application, .app");
    if (app) effectObserver.observe(app, { attributes: true, attributeFilter: ["class", "style"] });
    activeViewer = api;
    resize();
    api.setLocations(options.locations);
    options.onPaused?.(paused);
    void api.setTexture(options.texture, options.color);
  } catch {
    api.dispose();
    options.onStatus?.("3D is unavailable on this device. Static planet preview shown.");
  }
  return api;
}
