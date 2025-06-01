// types.ts
export interface IndustryType {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdByUser: unknown | null;
  updatedBy: unknown | null;
  name: string;
  description: string;
}

export interface ThemeSettings {
  darkMode: boolean;
  fontFamily: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface Logos {
  mobile: string;
  desktop: string;
  favicon: string;
  brandName: string;
}

export interface SocialMedias {
  tiktok: string;
  twitter: string;
  youtube: string;
  facebook: string;
  linkedin: string;
  instagram: string;
}

export interface ContactInformation {
  city: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  postalCode: string;
}

export interface SecuritySettings {
  sessionTimeout: number;
  loginAttemptsLimit: number;
  passwordComplexity: number;
  requireTwoFactorAuth: boolean;
}

export interface PaymentConfiguration {
  apiKey: string;
  currency: string;
  sandboxMode: boolean;
  paymentGateway: string;
}

export interface SeoSettings {
  keywords: string[];
  metaTitle: string;
  canonicalUrl: string;
  metaDescription: string;
}

export interface Localization {
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  defaultLanguage: string;
  supportedLanguages: string[];
}

export interface Analytics {
  trackingPixel: string;
  heatmapEnabled: boolean;
  googleAnalyticsId: string;
}

export interface CustomField {
  fieldName: string;
  fieldType: string;
  fieldValue: string;
}

export interface Configuration {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdByUser: unknown | null;
  updatedBy: unknown | null;
  tenantId: string;
  themeSettings: ThemeSettings;
  logos: Logos;
  socialMedias: SocialMedias;
  enabledModules: unknown[];
  contactInformation: ContactInformation;
  securitySettings: SecuritySettings;
  paymentConfiguration: PaymentConfiguration;
  seoSettings: SeoSettings;
  localization: Localization;
  analytics: Analytics;
  customFields: CustomField[];
}

export interface Tenant {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdByUser: unknown | null;
  updatedBy: unknown | null;
  name: string;
  contactEmail: string | null;
  numberOfBranches: number;
  branches: any[];
  isActive: boolean;
  industryType: IndustryType | null;
  configurations: Configuration;
  currentSubscriptionPlan: unknown | null;
}
