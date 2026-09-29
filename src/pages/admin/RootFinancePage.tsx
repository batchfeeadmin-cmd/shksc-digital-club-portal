import React, { useEffect, useState } from 'react';
import { Check, Eye, ExternalLink, FileCheck2, X } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { FinanceVoucher } from '../../components/finance/FinanceVoucher';
import { getFinanceRequests, updateFinanceRequestStatus, closeFinanceRequest } from '../../services/finance/financeService';
import type { FinanceRequest } from '../../types';

export function RootFinancePage() {
  const [requests, setRequests] = useState<FinanceRequest[]>(getFinanceRequests());
  const [selected, setSelected] = useState<FinanceRequest | null>(null);
  const [message, setMessage] = useState('');
  const refresh = () => setRequests(getFinanceRequests());
  useEffect(() => { window.addEventListener('shksc_state_changed', refresh); return () => window.removeEventListener('shksc_state_changed', refresh); }, []);

  const review = (request: FinanceRequest, approve: boolean) => {
    if (!approve) {
      const reason = window.prompt('Reason for rejection (optional):') || 'Returned for correction';
      updateFinanceRequestStatus(request.id, 'Rejected', 'Root Admin', reason);
      setMessage(`${request.kind} request rejected.`);
    } else {
      const approved = updateFinanceRequestStatus(request.id, 'Approved');
      setMessage(approved?.voucherNo ? `Approved. Voucher ${approved.voucherNo} is ready to print.` : 'Request approved.');
    }
    refresh();
  };

  const closeRequest = (request: FinanceRequest) => { closeFinanceRequest(request.id); setMessage(`${request.voucherNo || 'Request'} marked closed.`); refresh(); };
  const pending = requests.filter(request => request.status === 'Pending');
  const approved = requests.filter(request => ['Approved', 'Proof Submitted'].includes(request.status));

  return <AdminLayout>
    <div className="mb-8"><h1 className="text-2xl font-heading font-bold text-primary-950">Finance &amp; Vouchers</h1><p className="mt-1 text-sm text-gray-500">Review honorarium and club expense requests. Approval automatically creates a printable voucher with recipient signature lines.</p></div>
    {message && <p className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700" role="status">{message}</p>}
    <section className="mb-8"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold text-primary-950">Awaiting Root Admin approval <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">{pending.length}</span></h2></div>{pending.length === 0 ? <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">No pending finance requests.</div> : <div className="grid gap-4 lg:grid-cols-2">{pending.map(request => <RequestCard key={request.id} request={request} onReview={review} onView={setSelected} />)}</div>}</section>
    <section><h2 className="mb-4 text-lg font-bold text-primary-950">Approved vouchers &amp; proof follow-up</h2>{approved.length === 0 ? <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">Approved vouchers will appear here.</div> : <div className="grid gap-4 lg:grid-cols-2">{approved.map(request => <div key={request.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-accent-600">{request.kind} · {request.clubName}</p><h3 className="mt-1 font-bold text-primary-950">{request.title}</h3><p className="mt-2 text-sm text-gray-600">{request.voucherNo} · ৳ {request.totalAmount.toLocaleString()}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${request.status === 'Proof Submitted' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{request.status}</span></div><div className="mt-4 flex flex-wrap gap-2"><Button variant="outline" onClick={() => setSelected(request)} className="gap-2"><Eye size={15} /> Print voucher</Button>{request.kind === 'Club Expense' && request.status === 'Proof Submitted' && <Button onClick={() => closeRequest(request)} className="gap-2"><FileCheck2 size={15} /> Verify &amp; close</Button>}{request.proofVoucher && <a href={request.proofVoucher} download={request.proofFileName || 'expense-proof'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50"><ExternalLink size={15} /> Open proof</a>}</div>{request.proofFileName && <p className="mt-3 text-xs font-medium text-blue-700">Proof attached: {request.proofFileName}</p>}</div>)}</div>}</section>
    {selected && <FinanceVoucher request={selected} onClose={() => setSelected(null)} />}
  </AdminLayout>;
}

function RequestCard({ request, onReview, onView }: { request: FinanceRequest; onReview: (request: FinanceRequest, approve: boolean) => void; onView: (request: FinanceRequest) => void }) {
  return <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-accent-600">{request.kind} · {request.period}</p><h3 className="mt-1 font-bold text-primary-950">{request.title}</h3><p className="mt-1 text-sm text-gray-500">{request.clubName} · Requested by {request.requestedBy}</p></div><p className="text-lg font-extrabold text-primary-950">৳ {request.totalAmount.toLocaleString()}</p></div><div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-gray-600">{request.items.map(item => <div key={item.id} className="flex justify-between gap-3 py-1"><span>{item.recipientName} <span className="text-gray-400">({item.designation})</span></span><strong className="text-gray-800">৳ {item.amount.toLocaleString()}</strong></div>)}</div><div className="mt-4 flex flex-wrap gap-2"><Button onClick={() => onReview(request, true)} className="gap-2 bg-green-600 hover:bg-green-700"><Check size={15} /> Approve &amp; create voucher</Button><Button variant="outline" onClick={() => onReview(request, false)} className="gap-2 border-red-200 text-red-600 hover:bg-red-50"><X size={15} /> Reject</Button><Button variant="ghost" onClick={() => onView(request)} className="gap-2"><Eye size={15} /> Review</Button></div></div>;
}
