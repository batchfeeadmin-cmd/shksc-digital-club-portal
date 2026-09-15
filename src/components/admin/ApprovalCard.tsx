import React from 'react';
import { Button } from '../ui/button';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

interface ApprovalCardProps {
  clubName: string;
  requestType: string;
  date: string;
  onApprove: () => void;
  onReject: () => void;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({ clubName, requestType, date, onApprove, onReject }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:border-accent-200 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-primary-950 text-sm">{clubName}</h4>
          <p className="text-xs font-semibold text-accent-600 uppercase tracking-wider mt-0.5">{requestType}</p>
        </div>
        <span className="flex items-center text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md font-medium border border-amber-100">
          <Clock className="w-3 h-3 mr-1" /> Pending
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-4">{date}</p>
      
      <div className="flex items-center gap-2 mt-auto">
        <Button size="sm" variant="outline" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200" onClick={onReject}>
          <XCircle className="w-4 h-4 mr-1.5" /> Reject
        </Button>
        <Button size="sm" className="flex-1 bg-primary-900 hover:bg-primary-800 text-white" onClick={onApprove}>
          <CheckCircle2 className="w-4 h-4 mr-1.5" /> Approve
        </Button>
      </div>
    </div>
  );
};
