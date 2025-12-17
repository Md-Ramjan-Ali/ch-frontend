export interface BrandingSettingsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: BrandingSettings;
}

export interface BrandingSettings {
  id: number;
  platformLogoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateBrandingSettingsRequest {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  headingFont?: string;
  bodyFont?: string;
  logo?: File | string | null;
  favicon?: File | string | null;
}

