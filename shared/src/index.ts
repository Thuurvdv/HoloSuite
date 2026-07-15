export interface HoloSuiteAppRegistration {
  id: string;
  title: string;
  icon: string;
  premium?: boolean;
  playerVisible?: boolean;
  description?: string;
  featureId?: string;
  open: () => unknown | Promise<unknown>;
}

export type HoloSuiteWhatsNewTier = "free" | "premium";

export interface HoloSuiteWhatsNewEntry {
  title: string;
  summary?: string;
  tags?: string[];
}

export interface HoloSuiteWhatsNewRegistration {
  moduleId: string;
  title: string;
  tier?: HoloSuiteWhatsNewTier;
  version?: string;
  updated?: string;
  icon?: string;
  url?: string;
  entries: HoloSuiteWhatsNewEntry[];
}

export interface HoloSuiteLicenseResult {
  valid: boolean;
  allowedFeatureIds: string[];
  checkedAt: string;
  message?: string;
}

export interface HoloSuiteApi {
  registerApp(app: HoloSuiteAppRegistration): HoloSuiteAppRegistration | null;
  unregisterApp(id: string): boolean;
  getApps(): HoloSuiteAppRegistration[];
  registerWhatsNew(update: HoloSuiteWhatsNewRegistration): HoloSuiteWhatsNewRegistration | null;
  unregisterWhatsNew(moduleId: string): boolean;
  getWhatsNew(): HoloSuiteWhatsNewRegistration[];
  openLauncher(): unknown | Promise<unknown>;
  checkLicense(force?: boolean): Promise<HoloSuiteLicenseResult>;
  isFeatureAllowed(featureId: string): boolean;
}

export interface HoloSuiteLogger {
  log(message: string, ...details: unknown[]): void;
  warn(message: string, ...details: unknown[]): void;
  error(message: string, ...details: unknown[]): void;
}

export interface HoloSuiteSocketOptions {
  socketName?: string;
  title?: string;
}

export function createHoloSuiteLogger(moduleId: string, title = moduleId): HoloSuiteLogger {
  const prefix = `${title} |`;
  return {
    log: (message, ...details) => console.log(prefix, message, ...details),
    warn: (message, ...details) => console.warn(prefix, message, ...details),
    error: (message, ...details) => console.error(prefix, message, ...details)
  };
}

export function createHoloSuiteSocket(moduleId: string, options: HoloSuiteSocketOptions = {}) {
  const socketName = options.socketName ?? `module.${moduleId}`;
  const logger = createHoloSuiteLogger(moduleId, options.title ?? moduleId);

  return {
    socketName,
    emit(message: Record<string, unknown>) {
      const socket = (globalThis as any).game?.socket;
      if (!socket?.emit) {
        logger.warn("Foundry socket is unavailable.", message);
        return false;
      }
      socket.emit(socketName, message);
      return true;
    },
    isGMSender(userId: unknown) {
      if (!userId) return false;
      return Boolean((globalThis as any).game?.users?.get(String(userId))?.isGM);
    }
  };
}
