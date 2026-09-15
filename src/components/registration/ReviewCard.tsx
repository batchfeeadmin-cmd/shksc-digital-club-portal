import React from 'react';
import { Button } from '../ui/button';
import { User, Book, CreditCard } from 'lucide-react';
import { useClubFees, useClubsData } from '../../hooks/useAdminData';

interface ReviewCardProps {
  formData: any;
  onNext: () => void;
  onEdit: () => void;
}

export function ReviewCard({ formData, onNext, onEdit }: ReviewCardProps) {
  const { fees } = useClubFees();
  const { clubs } = useClubsData();
  const selectedClub = clubs.find(c => c.id === formData.selectedClubId);

  const selectedFees = formData.selectedClubId ? fees[formData.selectedClubId] || { registrationFee: 0, affiliationCost: 0 } : null;
  const registrationFee = selectedFees?.registrationFee || 0;
  const affiliationCost = selectedFees?.affiliationCost || 0;
  const totalAmount = registrationFee + affiliationCost;

  const handleSubmit = () => {
    onNext();
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-heading font-bold text-primary-950 mb-2">Please review your information</h3>
        <p className="text-gray-500">Ensure all details are correct before final submission.</p>
      </div>

      <div className="space-y-8">
        
        {/* Student Info */}
        <div className="bg-surface-sec p-6 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-primary-900 border-b border-gray-200 pb-2">
            <User className="w-5 h-5" />
            <h4 className="font-bold">Student Information</h4>
          </div>
          <div className="flex flex-col sm:flex-row gap-6">
            {formData.profilePicture && (
              <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden border border-gray-200 bg-white">
                <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8 text-sm flex-1">
              <div><span className="text-gray-500 block text-xs">Full Name</span><span className="font-medium">{formData.fullName}</span></div>
              <div><span className="text-gray-500 block text-xs">Student ID</span><span className="font-medium">{formData.studentId}</span></div>
              <div><span className="text-gray-500 block text-xs">Class & Sec</span><span className="font-medium">Class {formData.class} {formData.section ? `- ${formData.section}` : ''}</span></div>
              <div><span className="text-gray-500 block text-xs">Roll Number</span><span className="font-medium">{formData.rollNumber || 'N/A'}</span></div>
              <div><span className="text-gray-500 block text-xs">Mobile</span><span className="font-medium">{formData.mobile}</span></div>
              <div><span className="text-gray-500 block text-xs">Email</span><span className="font-medium">{formData.email || 'N/A'}</span></div>
            </div>
          </div>
        </div>

        {/* Club Info */}
        <div className="bg-surface-sec p-6 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-primary-900 border-b border-gray-200 pb-2">
            <Book className="w-5 h-5" />
            <h4 className="font-bold">Selected Club</h4>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-bold text-primary-900 shadow-sm border border-gray-100 overflow-hidden">
              {selectedClub?.logo?.startsWith('/') ? (
                <img src={selectedClub.logo} alt={selectedClub.name} className="w-full h-full object-cover" />
              ) : (
                selectedClub?.logo
              )}
            </div>
            <div>
              <p className="font-bold text-gray-900">{selectedClub?.name}</p>
              <p className="text-sm text-gray-500">{selectedClub?.category}</p>
            </div>
          </div>
        </div>

        {/* Fee Info */}
        <div className="bg-surface-sec p-6 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-primary-900 border-b border-gray-200 pb-2">
            <CreditCard className="w-5 h-5" />
            <h4 className="font-bold">Fee Breakdown</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Registration Fee</span>
              <span className="font-medium">{registrationFee} TK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Affiliation Cost</span>
              <span className="font-medium">{affiliationCost} TK</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
              <span className="font-bold text-gray-900">Total Payable</span>
              <span className="font-bold text-accent-600">{totalAmount} TK</span>
            </div>
          </div>
        </div>

      </div>

      <div className="pt-8 mt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
        <Button variant="outline" onClick={onEdit} className="w-full sm:w-auto">Edit Information</Button>
        <Button onClick={handleSubmit} size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">Confirm & Continue</Button>
      </div>
    </div>
  );
}
