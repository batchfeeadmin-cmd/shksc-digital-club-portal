import React from 'react';
import { Button } from '../ui/button';
import { useClubFees, useClubsData } from '../../hooks/useAdminData';

interface ClubSelectionFormProps {
  formData: any;
  updateData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ClubSelectionForm({ formData, updateData, onNext, onBack }: ClubSelectionFormProps) {
  const { fees } = useClubFees();
  const { clubs } = useClubsData();
  
  const selectedClub = clubs.find(c => c.id === formData.selectedClubId);
  
  // Real dynamic fees
  const selectedFees = formData.selectedClubId ? fees[formData.selectedClubId] || { registrationFee: 0, affiliationCost: 0 } : null;
  const registrationFee = selectedFees?.registrationFee || 0;
  const affiliationCost = selectedFees?.affiliationCost || 0;
  const totalAmount = registrationFee + affiliationCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selectedClubId) return;
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      
      <div>
        <h3 className="text-xl font-heading font-bold text-primary-950 mb-6 pb-4 border-b border-gray-100">Select Your Club</h3>
        
        <label className="block text-sm font-semibold text-gray-700 mb-3">Available Clubs *</label>
        <select 
          required 
          value={formData.selectedClubId} 
          onChange={(e) => updateData({ selectedClubId: e.target.value })} 
          className="w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white text-base"
        >
          <option value="">-- Choose a Club --</option>
          {clubs.map(club => (
            <option key={club.id} value={club.id}>{club.name}</option>
          ))}
        </select>
      </div>

      {selectedClub && selectedFees && (
        <div className="bg-surface-sec p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-100 text-primary-900 rounded-lg flex items-center justify-center font-bold text-xl shrink-0 overflow-hidden border border-primary-200">
              {selectedClub.logo?.startsWith('/') ? (
                <img src={selectedClub.logo} alt={selectedClub.name} className="w-full h-full object-cover" />
              ) : (
                selectedClub.logo
              )}
            </div>
            <div>
              <h4 className="font-bold text-primary-950">{selectedClub.name}</h4>
              <p className="text-sm text-gray-500">{selectedClub.category}</p>
            </div>
          </div>

          <h5 className="font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Fee Breakdown</h5>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Registration Fee</span>
              <span className="font-medium text-gray-900">{registrationFee} TK</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Affiliation Cost</span>
              <span className="font-medium text-gray-900">{affiliationCost} TK</span>
            </div>
            <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total Payable</span>
              <span className="font-bold text-accent-600 text-lg">{totalAmount} TK</span>
            </div>
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-gray-100 flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit" size="lg" disabled={!formData.selectedClubId}>Review Information</Button>
      </div>
    </form>
  );
}
