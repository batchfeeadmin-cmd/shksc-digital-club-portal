import React, { useEffect, useState } from 'react';
import { BadgePercent, Check, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { getDiscountReasons, getDiscounts, reviewDiscountRequest, saveDiscountReasons } from '../../services/discounts/discountService';
import type { StudentDiscount } from '../../types';

const statusStyle: Record<string, string> = { Pending: 'bg-amber-100 text-amber-700', Approved: 'bg-blue-100 text-blue-700', Rejected: 'bg-red-100 text-red-700', Used: 'bg-green-100 text-green-700' };

export function RootDiscountsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<StudentDiscount[]>(getDiscounts());
  const [reasons, setReasons] = useState<string[]>(getDiscountReasons());
  const [newReason, setNewReason] = useState('');
  const [editingReason, setEditingReason] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    const refresh = () => { setRequests(getDiscounts()); setReasons(getDiscountReasons()); };
    window.addEventListener('shksc_state_changed', refresh);
    return () => window.removeEventListener('shksc_state_changed', refresh);
  }, []);

  const review = (request: StudentDiscount, approved: boolean) => {
    const note = window.prompt(approved ? 'Approval note (optional)' : 'Rejection reason (required)') || '';
    if (!approved && !note.trim()) return;
    reviewDiscountRequest(request.id, approved, user?.name || 'Root Admin', note);
  };

  const addReason = () => {
    if (!newReason.trim()) return;
    saveDiscountReasons([...reasons, newReason]);
    setNewReason('');
  };

  const saveReasonEdit = (index: number) => {
    if (!editingText.trim()) return;
    saveDiscountReasons(reasons.map((reason, itemIndex) => itemIndex === index ? editingText : reason));
    setEditingReason(null);
  };

  const removeReason = (index: number) => {
    if (reasons[index] === 'Other') return;
    saveDiscountReasons(reasons.filter((_, itemIndex) => itemIndex !== index));
  };

  const pending = requests.filter(request => request.status === 'Pending');
  const approved = requests.filter(request => ['Approved', 'Used'].includes(request.status));
  const totalDiscount = approved.reduce((sum, request) => sum + request.discountAmount, 0);
  const totalFinal = approved.reduce((sum, request) => sum + request.finalAmount, 0);

  return (
    <AdminLayout>
      <div className="mb-8"><h1 className="text-2xl font-heading font-bold text-primary-950">Student Discount Control</h1><p className="mt-1 text-sm text-gray-500">Approve club requests, manage editable reasons, and audit discount usage across all clubs.</p></div>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat label="All requests" value={requests.length} /><Stat label="Pending approval" value={pending.length} tone="amber" /><Stat label="Approved discount" value={`${totalDiscount.toLocaleString()} BDT`} tone="green" /><Stat label="Final payable" value={`${totalFinal.toLocaleString()} BDT`} /></div>

      <section className="mb-8"><h2 className="mb-4 text-lg font-bold text-primary-950">Pending Root approval ({pending.length})</h2><div className="grid gap-4 lg:grid-cols-2">{pending.map(request => <div key={request.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-accent-600">{request.clubName}</p><h3 className="mt-1 font-bold text-primary-950">{request.studentName}</h3><p className="text-sm text-gray-500">{request.studentId} · Class {request.className} · Roll {request.studentRoll}</p></div><BadgePercent className="text-primary-600" /></div><div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm"><p><strong>Reason:</strong> {request.reason}{request.reasonDetails ? ` — ${request.reasonDetails}` : ''}</p><p className="mt-2 text-gray-500">Requested by {request.requestedBy} · {new Date(request.requestedAt).toLocaleString()}</p><div className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-200 pt-3 text-center"><div><span className="block text-xs text-gray-500">Original</span><strong>{request.originalAmount}</strong></div><div><span className="block text-xs text-gray-500">Discount</span><strong className="text-green-700">{request.discountAmount}</strong></div><div><span className="block text-xs text-gray-500">Payable</span><strong>{request.finalAmount}</strong></div></div></div><div className="mt-4 flex gap-2"><Button onClick={() => review(request, true)} className="gap-1 bg-green-600 hover:bg-green-700"><Check size={15} /> Approve</Button><Button variant="outline" onClick={() => review(request, false)} className="gap-1 border-red-200 text-red-600 hover:bg-red-50"><X size={15} /> Reject</Button></div></div>)}</div>{pending.length === 0 && <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">No pending discount requests.</div>}</section>

      <section className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"><div className="mb-4"><h2 className="font-bold text-primary-950">Editable discount reasons</h2><p className="mt-1 text-xs text-gray-500">Changes affect future selections only. Existing request records keep their original reason snapshot.</p></div><div className="mb-4 flex gap-2"><input value={newReason} onChange={event => setNewReason(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); addReason(); } }} placeholder="Add a new discount reason" className="h-10 flex-1 rounded-lg border border-gray-200 px-3 text-sm" /><Button onClick={addReason} className="gap-1"><Plus size={15} /> Add</Button></div><div className="grid gap-2 md:grid-cols-2">{reasons.map((reason, index) => <div key={`${reason}-${index}`} className="flex items-center gap-2 rounded-lg border border-gray-100 bg-slate-50 p-2">{editingReason === index ? <><input autoFocus value={editingText} onChange={event => setEditingText(event.target.value)} className="h-8 min-w-0 flex-1 rounded border border-gray-200 px-2 text-sm" /><button onClick={() => saveReasonEdit(index)} className="p-1 text-green-600" aria-label="Save reason"><Save size={16} /></button></> : <><span className="min-w-0 flex-1 text-sm text-gray-700">{reason}</span><button onClick={() => { setEditingReason(index); setEditingText(reason); }} className="p-1 text-primary-600" aria-label={`Edit ${reason}`}><Pencil size={15} /></button>{reason !== 'Other' && <button onClick={() => removeReason(index)} className="p-1 text-red-500" aria-label={`Delete ${reason}`}><Trash2 size={15} /></button>}</>}</div>)}</div></section>

      <section><h2 className="mb-4 text-lg font-bold text-primary-950">Complete discount record</h2><div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm"><table className="w-full min-w-[1050px] text-left text-sm"><thead><tr className="border-b border-gray-100 bg-slate-50 text-xs uppercase tracking-wider text-gray-500"><th className="px-4 py-4">Student</th><th className="px-4 py-4">Club</th><th className="px-4 py-4">Reason</th><th className="px-4 py-4">Original</th><th className="px-4 py-4">Discount</th><th className="px-4 py-4">Final</th><th className="px-4 py-4">Status</th><th className="px-4 py-4">Requested / Reviewed</th></tr></thead><tbody>{requests.map(request => <tr key={request.id} className="border-b border-gray-100 last:border-0"><td className="px-4 py-4"><strong className="text-primary-950">{request.studentName}</strong><span className="block text-xs text-gray-500">{request.studentId} · Roll {request.studentRoll}</span></td><td className="px-4 py-4">{request.clubName}</td><td className="max-w-[240px] px-4 py-4">{request.reason}<span className="block text-xs text-gray-500">{request.reasonDetails}</span></td><td className="px-4 py-4">{request.originalAmount.toLocaleString()}</td><td className="px-4 py-4 font-bold text-green-700">{request.discountAmount.toLocaleString()}</td><td className="px-4 py-4 font-bold">{request.finalAmount.toLocaleString()}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle[request.status]}`}>{request.status}</span>{request.paymentTransactionId && <span className="mt-1 block text-xs text-gray-500">Txn: {request.paymentTransactionId}</span>}</td><td className="px-4 py-4 text-xs text-gray-500"><span className="block">By {request.requestedBy}</span><span className="block">{new Date(request.requestedAt).toLocaleDateString()}</span>{request.reviewedBy && <span className="mt-1 block">Reviewed: {request.reviewedBy}</span>}</td></tr>)}</tbody></table>{requests.length === 0 && <div className="p-10 text-center text-gray-500">No discount records yet.</div>}</div></section>
    </AdminLayout>
  );
}

function Stat({ label, value, tone = 'blue' }: { label: string; value: string | number; tone?: 'blue' | 'amber' | 'green' }) {
  const colors = tone === 'green' ? 'bg-green-50 text-green-700' : tone === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-primary-50 text-primary-950';
  return <div className={`rounded-2xl border border-gray-100 p-5 ${colors}`}><p className="text-xs font-bold uppercase tracking-wider opacity-70">{label}</p><p className="mt-2 text-2xl font-extrabold">{value}</p></div>;
}
