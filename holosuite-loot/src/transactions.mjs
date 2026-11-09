import { clone, LootError, SerialQueue, validateAccess, validateActor, validLootRequest, actorKey } from "./model.mjs";

function awardEntry(entry) {
  if (!entry.claim.quantityRoll) return entry;
  const data = clone(entry.data);
  data.system.quantity = entry.claim.quantityRoll.quantity;
  return { ...entry, data };
}

/** Injected document operations keep ordering and crash recovery testable without Foundry. */
export class LootTransactions {
  queue = new SerialQueue();
  constructor(io) { this.io = io; }
  async collected(token, actor, entry, adapter) {
    const awarded = awardEntry(entry);
    if (entry.claim.quantityRoll) {
      try { await this.io.quantityRolled?.(awarded, adapter); }
      catch (error) { console.warn("HoloSuite Loot | Could not post quantity roll", error); }
      if (!entry.claim.quantityRoll.quantity) return;
    }
    try { await this.io.collected?.({ token, actor, entry: awarded, adapter }); }
    catch (error) { console.warn("HoloSuite Loot | Could not post loot to chat", error); }
  }
  async execute(request, user) {
    if (!validLootRequest(request)) throw new LootError("InvalidRequest");
    return this.queue.run(request.tokenUuid, async () => {
      const io = this.io;
      const token = await io.token(request.tokenUuid);
      if (!token) throw new LootError("Unavailable");
      const check = (actor, environment = io.environment()) => {
        if (!io.authority()) throw new LootError("NoGM");
        validateAccess(token, user, environment, actor);
      };
      const access = io.environment();
      check(undefined, access);
      if (!user.isGM && access.inRange && (request.action === "view" || request.action === "inspect")) {
        const recipient = await io.destination?.({ ...request, actorId: undefined }, user);
        if (recipient) check(recipient);
      }
      const adapter = io.adapter();
      if (!adapter) throw new LootError("Unsupported");
      let state = await io.load(token, adapter);
      // Resume persisted claims before displaying or granting anything new.
      for (const entry of state.entries.filter(e => e.claim && !e.taken)) {
        check();
        const actor = await io.actor(entry.claim.actorId);
        if (!actor) throw new LootError("RecoveryRequired");
        const received = entry.claim.quantityRoll?.quantity === 0 || (adapter.received
          ? adapter.received(actor, entry, entry.claim)
          : actor.items.get(entry.claim.itemId)?.getFlag(io.moduleId, "claim") === entry.claim.id);
        if (received) {
          await adapter.removeSource?.(token, entry, entry.claim);
          const next = clone(state);
          next.entries.find(e => e.id === entry.id).taken = true;
          await io.save(token, next); state = next;
          await this.collected(token, actor, entry, adapter);
          await adapter.cleanup?.(token, actor, entry, entry.claim);
        }
        // No automatic retry of an ambiguous creation. The same request may resume below.
      }
      if (request.action === "view") return io.summary(token, state);
      if (request.action === "inspect") {
        const entry = state.entries.find(e => e.id === request.entryId && !e.taken && !e.hidden);
        if (!entry || entry.currency) throw new LootError("Unavailable");
        return { item: adapter.preview ? adapter.preview(entry) : clone(entry.data) };
      }
      const actor = io.destination ? await io.destination(request, user) : await io.actor(request.actorId);
      validateActor(actor, user, adapter);
      check(actor);
      const entries = state.entries.filter(e => !e.taken && !e.hidden && (request.action === "all" || e.id === request.entryId));
      if (!entries.length && request.action === "take") return io.summary(token, state);
      const failures = [];
      for (const source of entries) {
        try {
          check(actor); validateActor(actor, user, adapter);
          let entry = state.entries.find(e => e.id === source.id);
          if (entry.claim && (entry.claim.userId !== user.id || ![actor.id, actorKey(actor)].includes(entry.claim.actorId))) {
            throw new LootError("RecoveryRequired");
          }
          if (!entry.claim) {
            const sourcePlan = await adapter.sourceClaim?.(token, entry);
            check(actor);
            let quantityRoll;
            if (entry.formula) {
              if (!sourcePlan || !adapter.removeSource) throw new LootError("SourceChanged");
              quantityRoll = await io.rollQuantity(entry.formula);
              check(actor);
            }
            const next = clone(state);
            next.entries.find(e => e.id === entry.id).claim = {
              id: io.id(), itemId: io.id(), userId: user.id, actorId: actorKey(actor),
              ...(quantityRoll ? { quantityRoll } : {}),
              ...(sourcePlan ? { source: sourcePlan } : {})
            };
            // Write-ahead reservation: a failed write must never create an Item.
            await io.save(token, next); state = next;
            entry = state.entries.find(e => e.id === source.id);
          }
          check(actor);
          adapter.validateSourcePlan?.(token, entry, entry.claim);
          if (entry.claim.quantityRoll?.quantity !== 0) {
            await adapter.create(actor, awardEntry(entry), entry.claim, async () => {
              const next = clone(state);
              next.entries.find(e => e.id === entry.id).claim.currencyAttempted = true;
              await io.save(token, next); state = next;
              entry.claim.currencyAttempted = true;
            });
          }
          await adapter.removeSource?.(token, entry, entry.claim);
          const next = clone(state);
          next.entries.find(e => e.id === entry.id).taken = true;
          await io.save(token, next); state = next;
          await this.collected(token, actor, entry, adapter);
          await adapter.cleanup?.(token, actor, entry, entry.claim);
        } catch (error) {
          // Keep a pending claim when Item creation or persistence has an ambiguous outcome.
          // Never release it to a different player: that would permit a duplicate.
          failures.push({ name: source.data.name, code: error.code ?? "TransferFailed" });
          if (!io.authority()) break;
        }
      }
      return { ...io.summary(token, state), failures };
    });
  }
}
