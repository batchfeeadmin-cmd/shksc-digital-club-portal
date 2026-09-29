import React from 'react';
import { Button } from '../ui/button';
import { SchoolLogo } from '../ui/SchoolLogo';
import { X, Printer, CheckCircle2, Download } from 'lucide-react';

export interface ReceiptData {
  receiptNo: string;
  date: string;
  studentName: string;
  studentId: string;
  className?: string;
  clubName: string;
  clubLogo?: string;
  profilePicture?: string;
  regFee: number;
  affilCost: number;
  total: number;
  txnId: string;
  method: string;
  status?: 'Paid' | 'Pending';
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: ReceiptData;
}

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

interface ReceiptCopyProps {
  receipt: ReceiptData;
  copyLabel: 'Office Copy' | 'Student Copy';
  paid: boolean;
}

function ReceiptCopy({ receipt, copyLabel, paid }: ReceiptCopyProps) {
  const isOffice = copyLabel === 'Office Copy';

  return (
    <div className="receipt-copy relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 print:shadow-none print:rounded-none print:border-none">
      {/* Decorative top bar */}
      <div className="h-2.5 bg-gradient-to-r from-primary-950 via-primary-600 to-accent-500"></div>

      {/* Copy label banner */}
      <div
        className="flex items-center justify-between px-6 py-2 text-white bg-green-600"
      >
        <span className="text-[11px] font-extrabold uppercase tracking-[0.3em]">{copyLabel}</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest opacity-80">
          {isOffice ? 'ক্লাব অফিসের জন্য সংরক্ষণ করুন' : 'শিক্ষার্থীর জন্য সংরক্ষণ করুন'}
        </span>
      </div>

      <div className="p-6 md:p-10 relative">
        {/* Club logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
          {receipt.clubLogo && receipt.clubLogo.startsWith('/') ? (
            <img
              src={receipt.clubLogo}
              alt=""
              className="w-64 h-64 md:w-80 md:h-80 object-contain opacity-[0.07] -rotate-12"
            />
          ) : (
            <span className="font-heading font-extrabold text-[16rem] leading-none opacity-[0.05] -rotate-12 text-primary-950">
              {receipt.clubLogo || 'S'}
            </span>
          )}
        </div>

        {/* Header */}
        <div className="relative flex items-start justify-between border-b-2 border-dashed border-gray-200 pb-6 mb-6 gap-4">
          <div className="flex items-center gap-4">
            <SchoolLogo className="w-16 h-16 rounded-2xl bg-white shadow-md shrink-0" />
            <div>
              <h1 className="font-heading font-bold text-xl md:text-2xl text-primary-950 leading-tight">
                SHKSC Digital Club Portal
              </h1>
              <p className="text-xs text-gray-500 mt-1">Student Club Registration &amp; Management System</p>
              <p className="text-xs text-gray-400">shksc.edu.bd &bull; +880 1711-000000</p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {receipt.clubLogo && (
              <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-md overflow-hidden flex items-center justify-center">
                {receipt.clubLogo.startsWith('/') ? (
                  <img src={receipt.clubLogo} alt={`${receipt.clubName} logo`} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-heading font-extrabold text-2xl text-primary-900">{receipt.clubLogo}</span>
                )}
              </div>
            )}
            <div
              className={`shrink-0 rotate-6 border-4 ${
                paid ? 'border-green-500 text-green-600' : 'border-amber-500 text-amber-600'
              } rounded-xl px-4 py-2 font-heading font-extrabold tracking-widest text-lg`}
            >
              {paid ? 'PAID' : 'UNPAID'}
            </div>
          </div>
        </div>

        {/* Title + meta */}
        <div className="relative text-center mb-8">
          <h2 className="font-heading font-extrabold text-2xl text-primary-950 uppercase tracking-widest">Payment Receipt</h2>
          <p className="text-xs text-gray-500 mt-2">
            Receipt No: <span className="font-mono font-semibold text-gray-800">{receipt.receiptNo}</span>
            <span className="mx-2">|</span>
            Date: <span className="font-semibold text-gray-800">{formatDate(receipt.date)}</span>
          </p>
        </div>

        {/* Student + club info */}
        <div className="relative grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 flex gap-4">
            {receipt.profilePicture ? (
              <img src={receipt.profilePicture} alt="Student" className="w-16 h-16 rounded-lg object-cover shadow-sm border border-gray-200 shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-200 border border-gray-300 flex items-center justify-center shrink-0">
                <span className="text-gray-400 font-bold text-2xl">{receipt.studentName.charAt(0)}</span>
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Billed To</p>
              <p className="font-bold text-primary-950">{receipt.studentName}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-mono">{receipt.studentId}</p>
              {receipt.className && <p className="text-xs text-gray-500">Class {receipt.className}</p>}
            </div>
          </div>
          <div className="bg-slate-50 border border-gray-200 rounded-xl p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Registration For</p>
            <p className="font-bold text-primary-950">{receipt.clubName}</p>
            <p className="text-xs text-gray-500 mt-0.5">Club Membership Registration</p>
          </div>
        </div>

        {/* Fee table */}
        <table className="relative w-full text-sm mb-6">
          <thead>
            <tr className="bg-primary-950 text-white">
              <th className="text-left px-4 py-3 font-semibold rounded-tl-lg">Description</th>
              <th className="text-right px-4 py-3 font-semibold rounded-tr-lg">Amount (BDT)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-3 text-gray-700">Club Registration Fee</td>
              <td className="px-4 py-3 text-right font-medium text-gray-900 tabular-nums">{receipt.regFee.toLocaleString()} ৳</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-3 text-gray-700">Club Affiliation Cost</td>
              <td className="px-4 py-3 text-right font-medium text-gray-900 tabular-nums">{receipt.affilCost.toLocaleString()} ৳</td>
            </tr>
            <tr className="bg-accent-50">
              <td className="px-4 py-4 font-extrabold text-primary-950">Total Paid</td>
              <td className="px-4 py-4 text-right font-extrabold text-accent-600 text-lg tabular-nums">{receipt.total.toLocaleString()} ৳</td>
            </tr>
          </tbody>
        </table>

        {/* Payment details */}
        <div className="relative grid grid-cols-2 gap-4 mb-8">
          <div className="border border-gray-200 rounded-xl p-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Transaction ID</p>
            <p className="font-mono text-xs font-semibold text-gray-800 break-all">{receipt.txnId}</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment Method</p>
            <p className="text-xs font-semibold text-gray-800">{receipt.method}</p>
          </div>
        </div>

        {/* Signatures */}
        <div className="relative flex justify-between items-end mt-12 mb-6">
          <div className="text-center">
            <div className="w-36 border-t-2 border-gray-300 pt-2">
              <p className="text-xs font-semibold text-gray-600">Student Signature</p>
            </div>
          </div>
          {paid ? (
            <div className="flex items-center gap-2 text-green-600 text-xs font-bold">
              <CheckCircle2 size={16} /> Payment Verified
            </div>
          ) : (
            <div className="text-xs font-bold text-amber-600">Pending Payment</div>
          )}
          <div className="text-center">
            <div className="w-36 border-t-2 border-gray-300 pt-2">
              <p className="text-xs font-semibold text-gray-600">Authorized Signature</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative border-t border-dashed border-gray-200 pt-4 text-center">
          <p className="text-[10px] text-gray-400">
            This is a computer generated receipt and does not require a physical signature.
            For any query please contact the SHKSC club administration office.
          </p>
        </div>
      </div>
    </div>
  );
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, receipt }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("To download the receipt as a PDF, please change the Destination to 'Save as PDF' in the print dialog.");
    window.print();
  };

  const paid = receipt.status !== 'Pending';

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-primary-950/60 backdrop-blur-sm overflow-y-auto" role="dialog" aria-modal="true" aria-label="Payment receipt">
      <div className="w-full max-w-2xl my-auto py-8">
        {/* Toolbar (hidden on print) */}
        <div className="flex items-center justify-between mb-4 print:hidden">
          <h3 className="text-white font-heading font-bold text-lg">Payment Receipt — 2 Copies</h3>
          <div className="flex items-center gap-3">
            <Button onClick={handlePrint} variant="outline" className="bg-white text-primary-950 hover:bg-gray-100 hover:text-primary-900 gap-2 border-0 shadow-lg">
              <Printer size={18} /> Print
            </Button>
            <Button onClick={handleDownload} className="bg-accent-500 text-white hover:bg-accent-600 gap-2 shadow-lg">
              <Download size={18} /> Download PDF
            </Button>
            <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ml-2" aria-label="Close payment receipt">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Receipt documents (print target) */}
        <div id="shksc-receipt-print" className="space-y-8">
          <ReceiptCopy receipt={receipt} copyLabel="Office Copy" paid={paid} />
          <ReceiptCopy receipt={receipt} copyLabel="Student Copy" paid={paid} />
        </div>
      </div>
    </div>
  );
};
