import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Settings, ShieldAlert, CreditCard, Save, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { getSystemSettings, saveSystemSettings, SystemSettings } from '../../services/settings/settingsService';

export function RootSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(getSystemSettings());
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const handleUpdate = () => setSettings(getSystemSettings());
    window.addEventListener('shksc_state_changed', handleUpdate);
    return () => window.removeEventListener('shksc_state_changed', handleUpdate);
  }, []);

  const handleChange = (field: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: keyof SystemSettings['paymentSettings'], value: string) => {
    setSettings(prev => ({
      ...prev,
      paymentSettings: { ...prev.paymentSettings, [field]: value }
    }));
  };

  const handleSave = () => {
    saveSystemSettings(settings);
    setSuccessMsg('Settings saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-950 mb-1">System Settings</h2>
          <p className="text-sm text-gray-500">Configure global portal settings and payment gateways.</p>
        </div>
        <Button onClick={handleSave} className="bg-primary-950 hover:bg-primary-900 text-white pl-5 pr-6">
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </Button>
      </div>

      {successMsg && (
        <div className="mb-6 bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-100 font-medium flex items-center gap-2">
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* General / Maintenance */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <ShieldAlert className="text-red-500 w-5 h-5" />
              <h3 className="font-bold text-gray-900">Maintenance Mode</h3>
            </div>

            <label className="flex items-center gap-4 mb-6 cursor-pointer group p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                />
                <div className={`block w-12 h-6 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.maintenanceMode ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <div>
                <p className="font-bold text-gray-900">Enable Maintenance Mode</p>
                <p className="text-xs text-gray-500">When enabled, students cannot log in or register. Only Admins can access the portal.</p>
              </div>
            </label>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Maintenance Message</label>
              <textarea 
                className="w-full h-24 p-4 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none text-sm"
                value={settings.maintenanceMessage}
                onChange={e => handleChange('maintenanceMessage', e.target.value)}
                disabled={!settings.maintenanceMode}
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <CreditCard className="text-blue-500 w-5 h-5" />
              <h3 className="font-bold text-gray-900">Payment Gateway Settings</h3>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-sm font-bold text-gray-800 border-b border-gray-50 pb-2">SSLCommerz API Credentials</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Store ID</label>
                  <input type="text" value={settings.paymentSettings.sslcommerzStoreId} onChange={e => handlePaymentChange('sslcommerzStoreId', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-primary-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Store Password</label>
                  <input type="password" value={settings.paymentSettings.sslcommerzStorePassword} onChange={e => handlePaymentChange('sslcommerzStorePassword', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-primary-500 outline-none text-sm" />
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-sm font-bold text-gray-800 border-b border-gray-50 pb-2">Manual Payment Numbers</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">bKash Number</label>
                  <input type="text" value={settings.paymentSettings.bkashNumber} onChange={e => handlePaymentChange('bkashNumber', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-primary-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nagad Number</label>
                  <input type="text" value={settings.paymentSettings.nagadNumber} onChange={e => handlePaymentChange('nagadNumber', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-primary-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Rocket Number</label>
                  <input type="text" value={settings.paymentSettings.rocketNumber} onChange={e => handlePaymentChange('rocketNumber', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-primary-500 outline-none text-sm" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Payment Instructions (Shown to students)</label>
              <textarea 
                className="w-full h-24 p-4 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none text-sm"
                value={settings.paymentSettings.paymentInstructions}
                onChange={e => handlePaymentChange('paymentInstructions', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
