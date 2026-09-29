import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, FileUp, Plus, ReceiptText, Send, Trash2 } from 'lucide-react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { getClubs } from '../../services/clubs/clubService';
import { calculateFinanceTotal, createFinanceRequest, getFinanceRequestsByClub, submitExpenseProof } from '../../services/finance/financeService';
import type { FinanceLineItem, FinanceRequest, FinanceRequestKind } from '../../types';

const blankItem = (): FinanceLineItem => ({ id: `line-${Date.now()}-${Math.random()}`, recipientName: '', designation: '', description: '', amount: 0 });

export function ClubFinancePage() {
  const { user } = useAuth();
  const club = getClubs().find(item => item.id === user?.clubId);
  const [kind, setKind] = useState<FinanceRequestKind>('Honorarium');
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<FinanceLineItem[]>([blankItem()]);
  const [requests, setRequests] = useState<FinanceRequest[]>(club ? getFinanceRequestsByClub(club.id) : []);
  const [message, setMessage] = useState('');

  const refresh = () => setRequests(club ? getFinanceRequestsByClub(club.id) : []);
  useEffect(() => { window.addEventListener('shksc_state_changed', refresh); return () => window.removeEventListener('shksc_state_changed', refresh); }, [club?.id]);
  const total = useMemo(() => calculateFinanceTotal(items), [items]);

  const updateItem = (id: string, field: keyof FinanceLineItem, value: string) => setItems(current => current.map(item => item.id === id ? { ...item, [field]: field === 'amount' ? Number(value) : value } : item));
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!club || !title.trim() || total <= 0 || items.some(item => !item.recipientName.trim() || !item.amount)) { setMessage('Add a title, payee name, and a valid amount for every line.'); return; }
    createFinanceRequest({ clubId: club.id, clubName: club.name, kind, period, title: title.trim(), notes: notes.trim(), items, requestedBy: user?.name || 'Club Admin' });
    setTitle(''); setNotes(''); setItems([blankItem()]); setMessage('Request sent to Root Admin for review.'); refresh();
  };
  const uploadProof = (requestId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => { submitExpenseProof(requestId, String(reader.result), file.name); setMessage('Proof voucher uploaded and sent for final verification.'); refresh(); };
    reader.readAsDataURL(file);
  };

  return <ClubAdminLayout>
    <div className="mb-8"><h1 className="text-2xl font-heading font-bold text-primary-950">Finance Requests</h1><p className="mt-1 text-sm text-gray-500">Submit monthly honorarium and separate club-cost requests. Root Admin approval generates the voucher.</p></div>
    {!club ? <div className="rounded-2xl bg-white p-8 text-center text-gray-500">No club is assigned to this account.</div> : <>
      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={submit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap gap-2"><button type="button" onClick={() => setKind('Honorarium')} className={`rounded-lg px-4 py-2 text-sm font-bold ${kind === 'Honorarium' ? 'bg-primary-950 text-white' : 'bg-gray-100 text-gray-600'}`}>Monthly honorarium</button><button type="button" onClick={() => setKind('Club Expense')} className={`rounded-lg px-4 py-2 text-sm font-bold ${kind === 'Club Expense' ? 'bg-primary-950 text-white' : 'bg-gray-100 text-gray-600'}`}>Club expense</button></div>
          <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-gray-700">Period<input required type="month" value={period} onChange={event => setPeriod(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3" /></label><label className="text-sm font-semibold text-gray-700">Request title<input required value={title} onChange={event => setTitle(event.target.value)} placeholder={kind === 'Honorarium' ? 'October team honorarium' : 'Lab equipment purchase'} className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3" /></label></div>
          <div className="mt-6 space-y-3"><div className="flex items-center justify-between"><h2 className="font-bold text-primary-950">{kind === 'Honorarium' ? 'Recipients' : 'Cost lines'}</h2><button type="button" onClick={() => setItems(current => [...current, blankItem()])} className="inline-flex items-center gap-1 text-sm font-bold text-primary-600"><Plus size={16} /> Add line</button></div>{items.map(item => <div key={item.id} className="rounded-xl border border-gray-200 bg-slate-50 p-4"><div className="grid gap-3 sm:grid-cols-2"><input value={item.recipientName} onChange={event => updateItem(item.id, 'recipientName', event.target.value)} placeholder={kind === 'Honorarium' ? 'Person name' : 'Vendor / payee'} className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm" /><input value={item.designation} onChange={event => updateItem(item.id, 'designation', event.target.value)} placeholder={kind === 'Honorarium' ? 'Moderator / Treasurer / Instructor' : 'Category'} className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm" /><input value={item.description} onChange={event => updateItem(item.id, 'description', event.target.value)} placeholder="Description / purpose" className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm" /><div className="flex gap-2"><input type="number" min="0" value={item.amount || ''} onChange={event => updateItem(item.id, 'amount', event.target.value)} placeholder="Amount (BDT)" className="h-10 min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm" />{items.length > 1 && <button type="button" onClick={() => setItems(current => current.filter(line => line.id !== item.id))} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label="Remove line"><Trash2 size={17} /></button>}</div></div></div>)}</div>
          <label className="mt-5 block text-sm font-semibold text-gray-700">Notes<textarea value={notes} onChange={event => setNotes(event.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-gray-200 p-3" placeholder="Optional approval context or supporting note" /></label>
          <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5"><p className="text-lg font-extrabold text-primary-950">Total: ৳ {total.toLocaleString()}</p><Button type="submit" className="gap-2"><Send size={16} /> Submit request</Button></div>{message && <p className="mt-4 rounded-lg bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700" role="status">{message}</p>}
        </form>
        <div className="space-y-4"><h2 className="text-lg font-bold text-primary-950">Request history</h2>{requests.length === 0 && <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">No finance requests yet.</div>}{requests.slice().reverse().map(request => <div key={request.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-accent-600">{request.kind} · {request.period}</p><h3 className="mt-1 font-bold text-primary-950">{request.title}</h3></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-gray-700">{request.status}</span></div><p className="mt-3 text-lg font-extrabold text-primary-950">৳ {request.totalAmount.toLocaleString()}</p>{request.voucherNo && <p className="mt-1 text-xs text-green-700">Voucher ready: {request.voucherNo}</p>}{request.kind === 'Club Expense' && request.status === 'Approved' && <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-primary-200 bg-primary-50 px-3 py-2 text-sm font-bold text-primary-700"><FileUp size={16} /> Upload proof voucher<input type="file" accept="image/*,.pdf" className="hidden" onChange={event => { const file = event.target.files?.[0]; if (file) uploadProof(request.id, file); }} /></label>}{request.proofFileName && <p className="mt-3 flex items-center gap-2 text-xs text-green-700"><CheckCircle2 size={15} /> Proof: {request.proofFileName}</p>}</div>)}</div>
      </div>
    </>}
  </ClubAdminLayout>;
}
