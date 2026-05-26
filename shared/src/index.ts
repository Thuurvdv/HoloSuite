export interface HoloSuiteAppRegistration {
  id: string;
  title: string;
  icon: string;
  premium?: boolean;
  description?: string;
  featureId?: string;
  open: () => unknown | Promise<unknown>;
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
  openLauncher(): unknown | Promise<unknown>;
  checkLicense(force?: boolean): Promise<HoloSuiteLicenseResult>;
  isFeatureAllowed(featureId: string): boolean;
}
