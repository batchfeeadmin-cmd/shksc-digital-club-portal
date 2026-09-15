import React from 'react';
import { Button } from '../../components/ui/button';
import { X, Check, XCircle } from 'lucide-react';
import { UpdateRequest } from '../../hooks/useAdminData';
import { getClubFees } from '../../services/payments/paymentService';
import { getUserById } from '../../services/auth/userService';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: UpdateRequest | null;
  currentClubData: any;
  onApprove: (request: UpdateRequest) => void;
  onReject: (request: UpdateRequest) => void;
}

interface DiffField {
  key: string;
  label: string;
  current: string | number | undefined;
  requested: string | number | undefined;
}

const formatLabel = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()).trim();

const buildDiffFields = (request: UpdateRequest, currentClubData: any): DiffField[] => {
  switch (request.type) {
    case 'Fee Update': {
      const currentFee = getClubFees()[request.clubId];
      return [
        { key: 'registrationFee', label: 'Registration Fee (BDT)', current: currentFee?.registrationFee ?? 0, requested: request.data.registrationFee },
        { key: 'affiliationCost', label: 'Affiliation Cost (BDT)', current: currentFee?.affiliationCost ?? 0, requested: request.data.affiliationCost }
      ];
    }

    case 'Profile Update': {
      const account = request.data.userId ? getUserById(request.data.userId) : undefined;
      return [
        { key: 'name', label: 'Full Name', current: account?.name, requested: request.data.name },
        { key: 'email', label: 'Email (Login ID)', current: account?.email, requested: request.data.email },
        { key: 'mobile', label: 'Mobile', current: account?.mobile || '—', requested: request.data.mobile || '—' },
        { key: 'designation', label: 'Designation', current: account?.designation || '—', requested: request.data.designation || '—' }
      ];
    }

    case 'Information Update':
    default: {
      return Object.keys(request.data)
        .filter(key => request.data[key] !== currentClubData?.[key] && !(key.startsWith('coordinator') && request.data[key] === currentClubData?.coordinator?.[key.replace('coordinator', '').toLowerCase()]))
        .map(key => {
          let currentVal = currentClubData?.[key];
          if (key === 'coordinatorName') currentVal = currentClubData?.coordinator?.name;
          if (key === 'coordinatorRole') currentVal = currentClubData?.coordinator?.role;
          return { key, label: formatLabel(key), current: currentVal, requested: request.data[key] };
        });
    }
  }
};

const withSuffix = (field: DiffField, value: string | number | undefined) => {
  if (value === undefined) return <span className="italic text-gray-400">Empty</span>;
  const isFee = field.label.includes('BDT');
  return <>{String(value)}{isFee ? ' ৳' : ''}</>;
};

export function ApprovalModal({ isOpen, onClose, request, currentClubData, onApprove, onReject }: ApprovalModalProps) {
  if (!isOpen || !request) return null;

  const changedFields = buildDiffFields(request, currentClubData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-slate-50 shrink-0">
          <div>
            <h3 className="text-xl font-heading font-bold text-primary-950">Review Update Request</h3>
            <p className="text-sm text-gray-500 mt-1">{request.clubName} • {request.type}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
          <div className="space-y-6">
            {changedFields.map(field => (
              <div key={field.key} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gray-100/50 px-4 py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700 uppercase tracking-wider text-xs">Field: {field.label}</span>
                </div>
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                  <div className="p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Current Information</p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{withSuffix(field, field.current)}</p>
                  </div>
                  <div className="p-4 bg-green-50/30">
                    <p className="text-xs font-bold text-green-600 uppercase mb-2">Requested Change</p>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap font-medium">{withSuffix(field, field.requested)}</p>
                  </div>
                </div>
              </div>
            ))}

            {changedFields.length === 0 && (
              <div className="text-center p-8 text-gray-500">
                No changes detected between requested data and current data.
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Button variant="outline" onClick={() => onReject(request)} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 gap-2">
            <XCircle size={18} /> Reject Change
          </Button>
          <Button onClick={() => onApprove(request)} className="bg-green-600 hover:bg-green-700 text-white gap-2 px-6">
            <Check size={18} /> Approve & Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
