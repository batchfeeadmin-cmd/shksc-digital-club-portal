import { triggerStateUpdate } from '../base';

const SETTINGS_STORAGE_KEY = 'shksc_system_settings';

export interface PaymentSettings {
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
    bkashNumber: '01711-000000 (Personal)',
    nagadNumber: '01711-000000 (Personal)',
    rocketNumber: '01711-000000-0',
    paymentInstructions: 'Online payment is simulated in this frontend demo. Real gateway processing and verification will be enabled after the backend is approved and implemented.'
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
