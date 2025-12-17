export interface SecuritySettings {
  minPasswordLength: number;
  passwordExpiryDays: number;
  requireSpecialChars: boolean;
  requireUppercaseLetters: boolean;
  sessionTimeoutDays: number;
  maxLoginAttempts: number;
  dataRetentionPolicy: boolean;
  dataRetentionDays: number;
  gdprComplianceMode: boolean;
}

export interface SecuritySettingsResponse {
  success: boolean;
  data: SecuritySettings;
}

export interface UpdateSecuritySettingsRequest extends SecuritySettings {}
