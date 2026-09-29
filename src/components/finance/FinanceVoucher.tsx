import React from 'react';
import { Printer, X } from 'lucide-react';
import type { FinanceRequest } from '../../types';

interface FinanceVoucherProps {
  request: FinanceRequest;
  onClose?: () => void;
}

export function FinanceVoucher({ request, onClose }: FinanceVoucherProps) {
  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-primary-950/60 p-4 backdrop-blur-sm print:static print:overflow-visible print:bg-white print:p-0">
      <div className="mx-auto my-4 max-w-4xl print:my-0 print:max-w-none">
        <div className="mb-4 flex items-center justify-between print:hidden">
          <h2 className="text-lg font-bold text-white">Payment Voucher · {request.voucherNo}</h2>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-primary-950 hover:bg-gray-100">
              <Printer size={16} /> Print voucher
            </button>
            {onClose && <button onClick={onClose} className="rounded-full p-2 text-white hover:bg-white/10" aria-label="Close voucher"><X size={20} /></button>}
          </div>
        </div>

        <article className="finance-voucher rounded-2xl bg-white p-8 shadow-2xl print:rounded-none print:p-10 print:shadow-none">
          <header className="flex items-start justify-between border-b-2 border-primary-950 pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-600">SHKSC Digital Club Portal</p>
              <h1 className="mt-2 text-3xl font-heading font-extrabold text-primary-950">Payment Voucher</h1>
              <p className="mt-1 text-sm text-gray-500">{request.kind} · {request.clubName}</p>
            </div>
            <dl className="text-right text-sm">
              <div><dt className="inline text-gray-500">Voucher No: </dt><dd className="inline font-bold text-primary-950">{request.voucherNo || 'Pending approval'}</dd></div>
              <div className="mt-1"><dt className="inline text-gray-500">Period: </dt><dd className="inline font-bold text-primary-950">{request.period}</dd></div>
              <div className="mt-1"><dt className="inline text-gray-500">Status: </dt><dd className="inline font-bold text-green-700">{request.status}</dd></div>
            </dl>
          </header>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-sm">
            <div><p className="text-xs font-bold uppercase tracking-wider text-gray-400">Request</p><p className="mt-1 font-semibold text-gray-900">{request.title}</p></div>
            <div><p className="text-xs font-bold uppercase tracking-wider text-gray-400">Requested by</p><p className="mt-1 font-semibold text-gray-900">{request.requestedBy}</p></div>
          </div>

          <table className="mt-6 w-full border-collapse text-sm">
            <thead><tr className="border-b-2 border-primary-950 text-left text-xs uppercase tracking-wider text-gray-500"><th className="py-3 pr-3">Recipient / Payee</th><th className="py-3 pr-3">Role / Description</th><th className="py-3 text-right">Amount (BDT)</th><th className="w-40 py-3 pl-4">Receiver signature</th></tr></thead>
            <tbody>
              {request.items.map(item => <tr key={item.id} className="border-b border-gray-200"><td className="py-4 pr-3 font-semibold text-gray-900">{item.recipientName}</td><td className="py-4 pr-3 text-gray-600"><span className="font-medium text-gray-800">{item.designation}</span><br />{item.description}</td><td className="py-4 text-right font-bold text-primary-950">{item.amount.toLocaleString()}</td><td className="border-b border-dashed border-gray-400 py-4 pl-4 align-bottom text-xs text-gray-400">Signature</td></tr>)}
            </tbody>
            <tfoot><tr><td colSpan={2} className="pt-5 text-right font-bold text-gray-700">Total payable</td><td className="pt-5 text-right text-lg font-extrabold text-primary-950">৳ {request.totalAmount.toLocaleString()}</td><td /></tr></tfoot>
          </table>

          {request.notes && <p className="mt-6 rounded-lg border border-gray-200 p-3 text-sm text-gray-600"><strong>Notes:</strong> {request.notes}</p>}

          <div className="mt-16 grid grid-cols-3 gap-8 text-center text-xs text-gray-500">
            <div className="border-t border-gray-400 pt-2">Prepared by<br /><span className="font-semibold text-gray-800">{request.requestedBy}</span></div>
            <div className="border-t border-gray-400 pt-2">Approved by<br /><span className="font-semibold text-gray-800">{request.reviewedBy || 'Root Admin'}</span></div>
            <div className="border-t border-gray-400 pt-2">Treasurer / Accounts<br /><span className="font-semibold text-gray-800">Signature &amp; seal</span></div>
          </div>
          <p className="mt-8 text-center text-[10px] text-gray-400">This voucher is generated from the SHKSC Digital Club Portal. Attach supporting documents where required.</p>
        </article>
      </div>
    </div>
  );
}
