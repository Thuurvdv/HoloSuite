interface Consumer {
  deliver(frame: string): void | Promise<void>;
  active(): boolean;
  background?: boolean;
  lastFrame?: string;
}

interface Producer {
  camera: any;
  version: string;
  generation: number;
  pending: boolean;
  rerun: boolean;
  lastStarted: number;
  consumers: Map<any, Consumer>;
}

/** One capture supplies every visible local preview and remote viewer of a camera. */
export function createFrameScheduler(options: {
  capture(camera: any): Promise<string>;
  interval(): number;
  idle(): void;
  active?(cameraIds: Set<string>): void;
  error(error: unknown): void;
}) {
  const producers = new Map<string, Producer>();
  let timer: number | null = null;

  function visible(consumer: Consumer) {
    return (consumer.background || document.visibilityState !== "hidden") && consumer.active();
  }

  function hasActiveConsumers() {
    return [...producers.values()].some(producer => [...producer.consumers.values()].some(visible));
  }

  function notifyActive() {
    options.active?.(new Set([...producers].filter(([, producer]) => [...producer.consumers.values()].some(visible)).map(([id]) => id)));
  }

  async function refresh(producer: Producer) {
    if (producer.pending) { producer.rerun = true; return; }
    if (![...producer.consumers.values()].some(visible)) return;
    if (Date.now() - producer.lastStarted < options.interval()) return;
    producer.lastStarted = Date.now();
    producer.pending = true;
    const generation = producer.generation;
    try {
      const frame = await options.capture(producer.camera);
      if (!frame || generation !== producer.generation) return;
      for (const consumer of [...producer.consumers.values()]) {
        if (generation !== producer.generation) break;
        if (!visible(consumer) || consumer.lastFrame === frame) continue;
        await consumer.deliver(frame);
        consumer.lastFrame = frame;
      }
    } catch (error) {
      options.error(error);
    } finally {
      producer.pending = false;
      if (!hasActiveConsumers()) options.idle();
      if (producer.rerun) {
        producer.rerun = false;
        void refresh(producer);
      }
    }
  }

  function tick() {
    notifyActive();
    let active = false;
    for (const producer of producers.values()) {
      if (![...producer.consumers.values()].some(visible)) continue;
      active = true;
      void refresh(producer);
    }
    if (!active) options.idle();
  }

  function resetTimer() {
    if (timer !== null) window.clearInterval(timer);
    timer = producers.size ? window.setInterval(tick, Math.min(250, options.interval())) : null;
    if (!producers.size) options.idle();
  }

  document.addEventListener("visibilitychange", tick);

  return {
    subscribe(camera: any, key: any, deliver: Consumer["deliver"], active: Consumer["active"] = () => true, background = false) {
      const id = String(camera.id);
      const version = JSON.stringify(camera);
      let producer = producers.get(id);
      if (!producer) {
        producer = { camera, version, generation: 0, pending: false, rerun: false, lastStarted: -Infinity, consumers: new Map() };
        producers.set(id, producer);
        resetTimer();
      } else if (producer.version !== version) {
        producer.camera = camera;
        producer.version = version;
        producer.generation++;
        for (const consumer of producer.consumers.values()) consumer.lastFrame = undefined;
      }
      producer.consumers.set(key, { deliver, active, background });
      notifyActive();
      void refresh(producer);
    },
    unsubscribe(key: any) {
      for (const [id, producer] of producers) {
        producer.consumers.delete(key);
        if (!producer.consumers.size) {
          producer.generation++;
          producers.delete(id);
        }
      }
      notifyActive();
      resetTimer();
    },
    invalidate(sceneId?: string) {
      for (const producer of producers.values()) {
        if (!sceneId || !producer.camera.sceneId || producer.camera.sceneId === sceneId) producer.generation++;
      }
      tick();
    },
    reconfigure() {
      for (const producer of producers.values()) producer.lastStarted = -Infinity;
      resetTimer(); tick();
    },
    wake: tick
  };
}
