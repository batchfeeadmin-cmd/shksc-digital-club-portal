import React, { useState, useEffect } from 'react';
import { ToggleSwitch } from './ToggleSwitch';
import { Button } from '../ui/button';
import { useRegistrationState, RegistrationState } from '../../hooks/useAdminData';
import { CalendarDays, Save, CheckCircle2 } from 'lucide-react';

export const RegistrationControlCard = () => {
  const { state, saveState } = useRegistrationState();
  const [formData, setFormData] = useState<RegistrationState>(state);
  const [saved, setSaved] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setFormData(state);
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggle = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isOpen: checked }));
  };

  const handleSave = () => {
    if (formData.startDate && formData.closingDate && formData.startDate > formData.closingDate) {
      setValidationError('Closing date must be the same as or later than the start date.');
      return;
    }

    saveState(formData);
    setValidationError('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
            <CalendarDays size={20} />
          </div>
          <div>
            <h3 className="text-lg font-heading font-bold text-primary-950">Registration Status</h3>
            <p className="text-sm text-gray-500">Manage admission cycle and dates</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm self-start sm:self-auto">
          <span className="text-sm font-bold text-gray-700">Status:</span>
          <ToggleSwitch 
            checked={formData.isOpen} 
            onChange={handleToggle} 
            label={formData.isOpen ? 'OPEN' : 'CLOSED'} 
          />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {validationError && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {validationError}
          </p>
        )}
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Year</label>
            <input 
              type="text" 
              name="year"
              value={formData.year} 
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
            <input 
              required
              type="date" 
              name="startDate"
              value={formData.startDate} 
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Closing Date</label>
            <input 
              required
              type="date" 
              name="closingDate"
              value={formData.closingDate} 
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Public Message</label>
          <textarea 
            name="message"
            value={formData.message} 
            onChange={handleChange}
            rows={2}
            className="w-full p-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
          {saved && (
            <span className="text-green-600 flex items-center gap-1 text-sm font-medium animate-in fade-in">
              <CheckCircle2 size={16} /> Saved successfully
            </span>
          )}
          <Button onClick={handleSave} className="bg-primary-900 hover:bg-primary-800 text-white gap-2">
            <Save size={18} /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
