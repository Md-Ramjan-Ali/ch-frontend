export interface PlatformSettings {
  platformName: string;
  platformTitle: string;
  platformDescription: string;
  defaultLanguage: string;
  defaultTimezone: string;
  allowNewRegistration: boolean;
  freeTrialEnabled: boolean;
  freeTrialPeriodDays: number;
  maintenanceMode: boolean;
}

export interface UpdatePlatformSettingsRequest extends PlatformSettings {}

export interface PlatformSettingsResponse {
  success: boolean;
  data: PlatformSettings;
}
