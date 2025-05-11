// stores/configurationStore.ts
import { Configuration } from '@/types/tenant.types';
import { create } from 'zustand';

type ConfigurationStoreState = Configuration & {
  setConfigurations: (configs: Configuration) => void;
};

const useConfigurationStore = create<ConfigurationStoreState>((set) => ({
  id: '',
  createdAt: '',
  updatedAt: '',
  deletedAt: null,
  createdByUser: null,
  updatedBy: null,
  tenantId: '',
  themeSettings: {
    darkMode: false,
    fontFamily: '',
    primaryColor: '',
    secondaryColor: '',
  },
  logos: {
    mobile: '',
    desktop: '',
    favicon: '',
    brandName: '',
  },
  socialMedias: {
    tiktok: '',
    twitter: '',
    youtube: '',
    facebook: '',
    linkedin: '',
    instagram: '',
  },
  enabledModules: [],
  contactInformation: {
    city: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    postalCode: '',
  },
  securitySettings: {
    sessionTimeout: 0,
    loginAttemptsLimit: 0,
    passwordComplexity: 0,
    requireTwoFactorAuth: false,
  },
  paymentConfiguration: {
    apiKey: '',
    currency: '',
    sandboxMode: false,
    paymentGateway: '',
  },
  seoSettings: {
    keywords: [],
    metaTitle: '',
    canonicalUrl: '',
    metaDescription: '',
  },
  localization: {
    timezone: '',
    dateFormat: '',
    timeFormat: '',
    defaultLanguage: '',
    supportedLanguages: [],
  },
  analytics: {
    trackingPixel: '',
    heatmapEnabled: false,
    googleAnalyticsId: '',
  },
  customFields: [],
  setConfigurations: (configs) => set((state) => ({
    ...state,
    ...configs
  })),
}));

export default useConfigurationStore;