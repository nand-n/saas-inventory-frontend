export type ConfigFormData = {
  tenantId: string;
  themeSettings?: {
    primaryColor: string;
    secondaryColor: string;
    darkMode: boolean;
    fontFamily: string;
  };
  logos?: {
    desktop: string;
    mobile: string;
    favicon: string;
    brandName: string;
  };
  socialMedias?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  enabledModules?: {
    moduleName: string;
    isEnabled: boolean;
    permissions: string[];
  }[];
  securitySettings?: {
    requireTwoFactorAuth: boolean;
    passwordComplexity: number;
    sessionTimeout: number;
    loginAttemptsLimit: number;
  };
  paymentConfiguration?: {
    currency: string;
    paymentGateway: string;
    apiKey: string;
    sandboxMode: boolean;
  };
  seoSettings?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl: string;
  };
  localization?: {
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    defaultLanguage: string;
    supportedLanguages: string[];
  };
  analytics?: {
    googleAnalyticsId: string;
    trackingPixel: string;
    heatmapEnabled: boolean;
  };
  customFields?: Array<{
    fieldName: string;
    fieldType: string;
    fieldValue: any;
  }>;
  contactInformation?: {
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
};
