import React from 'react';
import { User as UserIcon, Receipt, Download, Bell } from 'lucide-react';
import { Button } from '../ui/button';

export const ProfileCard: React.FC<{ name: string, studentId: string }> = ({ name, studentId }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
    <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-900 flex items-center justify-center shrink-0">
      <UserIcon size={32} />
    </div>
    <div>
      <h2 className="text-2xl font-heading font-bold text-primary-950">{name}</h2>
      <p className="text-gray-500 font-mono mt-1 font-medium">{studentId}</p>
    </div>
  </div>
);

export const RegistrationCard: React.FC<{ clubName: string, status: string }> = ({ clubName, status }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col h-full">
    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Registration Status</h3>
    <div className="flex justify-between items-center mb-2">
      <span className="text-gray-600 font-medium">Selected Club</span>
      <span className="font-bold text-primary-950 text-right">{clubName}</span>
    </div>
    <div className="flex justify-between items-center pt-4 mt-auto border-t border-gray-100">
      <span className="text-gray-600 font-medium">Status</span>
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
        status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
      }`}>
        {status}
      </span>
    </div>
  </div>
);

export const FeeSummary: React.FC<{ regFee: number, affilCost: number, total: number, status: string }> = ({ regFee, affilCost, total, status }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col h-full">
    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Fee Summary</h3>
    <div className="space-y-3 mb-4">
      <div className="flex justify-between">
        <span className="text-gray-600">Registration Fee</span>
        <span className="font-medium text-gray-900">{regFee} TK</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Affiliation Cost</span>
        <span className="font-medium text-gray-900">{affilCost} TK</span>
      </div>
    </div>
    <div className="pt-4 mt-auto border-t border-gray-100 flex justify-between items-center mb-4">
      <span className="font-bold text-primary-950">Total Payable</span>
      <span className="font-bold text-accent-600 text-lg">{total} TK</span>
    </div>
    <div className={`w-full py-2.5 text-center rounded-lg text-sm font-bold uppercase tracking-wide ${
      status === 'Paid' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-700 border border-orange-200'
    }`}>
      {status}
    </div>
  </div>
);

export const ClubInfoCard: React.FC<{ club: any }> = ({ club }) => {
  if (!club) return null;
  return (
    <div className="bg-primary-950 rounded-2xl p-6 text-white relative overflow-hidden shadow-sm">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-800 rounded-full blur-2xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-600 rounded-full blur-2xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
         <div className="w-16 h-16 rounded-xl bg-white text-primary-900 flex items-center justify-center font-bold text-3xl mb-4 shadow-lg overflow-hidden">
           {club.logo?.startsWith('/') ? (
             <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
           ) : (
             club.logo
           )}
         </div>
         <h3 className="text-xl font-heading font-bold mb-1 text-white">{club.name}</h3>
         <p className="text-primary-200 text-sm mb-6">{club.category}</p>
         
         <div className="w-full bg-primary-900/50 rounded-xl p-4 grid grid-cols-2 gap-4 text-left border border-primary-800/50 backdrop-blur-sm">
           <div>
             <p className="text-xs text-primary-300 uppercase tracking-wider mb-1">Coordinator</p>
             <p className="font-medium text-sm text-white">{club.coordinator?.name || 'N/A'}</p>
           </div>
           <div>
             <p className="text-xs text-primary-300 uppercase tracking-wider mb-1">Members</p>
             <p className="font-medium text-sm text-white">{club.memberCount || 0}</p>
           </div>
         </div>
      </div>
    </div>
  );
};

export const ReceiptCard: React.FC<{
  name: string;
  clubName: string;
  regFee: number;
  affilCost: number;
  total: number;
  txnId: string;
  onDownload?: () => void;
}> = ({ name, clubName, regFee, affilCost, total, txnId, onDownload }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
     <div className="bg-primary-50 p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
       <div>
         <h3 className="font-heading font-bold text-primary-950 text-lg">Digital Receipt</h3>
         <p className="text-sm text-gray-500 font-mono mt-1">TXN: {txnId}</p>
       </div>
       <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-primary-400 shrink-0">
         <Receipt className="w-5 h-5" />
       </div>
     </div>
     <div className="p-6 space-y-4 flex-1">
       <div className="flex justify-between border-b border-gray-50 pb-4">
         <span className="text-gray-500">Student Name</span>
         <span className="font-medium text-gray-900 text-right">{name}</span>
       </div>
       <div className="flex justify-between border-b border-gray-50 pb-4">
         <span className="text-gray-500">Club</span>
         <span className="font-medium text-gray-900 text-right">{clubName}</span>
       </div>
       <div className="flex justify-between border-b border-gray-50 pb-4">
         <span className="text-gray-500">Registration Fee</span>
         <span className="font-medium text-gray-900">{regFee} TK</span>
       </div>
       <div className="flex justify-between border-b border-gray-50 pb-4">
         <span className="text-gray-500">Affiliation Cost</span>
         <span className="font-medium text-gray-900">{affilCost} TK</span>
       </div>
       <div className="flex justify-between pt-2">
         <span className="font-bold text-primary-950">Total Paid</span>
         <span className="font-bold text-accent-600 text-lg">{total} TK</span>
       </div>
     </div>
     <div className="p-6 bg-slate-50 border-t border-gray-100 shrink-0 mt-auto">
       <Button className="w-full bg-primary-900 text-white hover:bg-primary-800 gap-2" onClick={onDownload}>
         <Download size={18} /> Download Receipt
       </Button>
     </div>
  </div>
);

export const NoticeCard: React.FC<{ notice: any }> = ({ notice }) => (
  <div className="bg-white rounded-xl p-5 border-l-4 border-l-accent-500 border border-gray-100 shadow-sm flex gap-4 items-start">
    <div className="bg-accent-50 text-accent-600 p-2 rounded-lg shrink-0 mt-1">
      <Bell className="w-5 h-5" />
    </div>
    <div>
      <h4 className="font-bold text-primary-950 mb-1 leading-snug">{notice.title}</h4>
      <p className="text-xs text-gray-400 font-medium mb-2">{notice.date}</p>
      <p className="text-sm text-gray-600 leading-relaxed">{notice.description}</p>
    </div>
  </div>
);
