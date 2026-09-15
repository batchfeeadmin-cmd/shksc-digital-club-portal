import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { ClubFee } from '../../hooks/useAdminData';

interface FeeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubId: string;
  clubName: string;
  initialFee: ClubFee;
  onSave: (clubId: string, fee: ClubFee) => void;
}

export const FeeEditModal: React.FC<FeeEditModalProps> = ({ isOpen, onClose, clubId, clubName, initialFee, onSave }) => {
  const [registrationFee, setRegistrationFee] = useState(initialFee.registrationFee);
  const [affiliationCost, setAffiliationCost] = useState(initialFee.affiliationCost);

  useEffect(() => {
    if (isOpen) {
      setRegistrationFee(initialFee.registrationFee);
      setAffiliationCost(initialFee.affiliationCost);
    }
  }, [isOpen, initialFee]);

  if (!isOpen) return null;

  const total = Number(registrationFee) + Number(affiliationCost);

  const handleSave = () => {
    onSave(clubId, {
      registrationFee: Number(registrationFee),
      affiliationCost: Number(affiliationCost),
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-slate-50">
          <h3 className="text-lg font-heading font-bold text-primary-950">Edit Club Fees</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">Club Name</label>
            <p className="font-bold text-gray-900 text-lg">{clubName}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Fee (TK)</label>
            <input 
              type="number" 
              value={registrationFee} 
              onChange={(e) => setRegistrationFee(Number(e.target.value))}
              className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Affiliation Cost (TK)</label>
            <input 
              type="number" 
              value={affiliationCost} 
              onChange={(e) => setAffiliationCost(Number(e.target.value))}
              className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
            />
          </div>

          <div className="bg-accent-50 border border-accent-100 rounded-xl p-4 flex justify-between items-center mt-4">
            <span className="font-bold text-primary-950">Total Payable:</span>
            <span className="text-xl font-extrabold text-accent-600">{total} TK</span>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 bg-slate-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-primary-900 text-white hover:bg-primary-800">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
