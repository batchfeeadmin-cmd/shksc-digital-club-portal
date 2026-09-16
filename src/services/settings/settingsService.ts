import { triggerStateUpdate } from '../base';

const SETTINGS_STORAGE_KEY = 'shksc_system_settings';

export interface PaymentSettings {
  sslcommerzStoreId: string;
  sslcommerzStorePassword: string;
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  paymentInstructions: string;
}

export interface SystemSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  paymentSettings: PaymentSettings;
}

const defaultSettings: SystemSettings = {
  maintenanceMode: false,
  maintenanceMessage: 'The system is currently undergoing scheduled maintenance. Please check back later.',
  paymentSettings: {
    sslcommerzStoreId: 'shksc_live',
    sslcommerzStorePassword: '****************',
    bkashNumber: '01711-000000 (Personal)',
    nagadNumber: '01711-000000 (Personal)',
    rocketNumber: '01711-000000-0',
    paymentInstructions: 'Please use the SSLCommerz gateway for instant automatic confirmation. For manual payments, send money to the numbers above and contact your Club Admin with the TrxID.'
  }
};

export const getSystemSettings = (): SystemSettings => {
  const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (saved) {
    return { ...defaultSettings, ...JSON.parse(saved) };
  }
  return defaultSettings;
};

export const saveSystemSettings = (settings: SystemSettings): void => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  triggerStateUpdate();
};
