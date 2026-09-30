import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileUp,
  Plus,
  Printer,
  ReceiptText,
  RotateCcw,
  Search,
  Send,
  Trash2,
  X
} from 'lucide-react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { Button } from '../../components/ui/button';
import { FinanceVoucher } from '../../components/finance/FinanceVoucher';
import { useAuth } from '../../context/AuthContext';
import { getClubs } from '../../services/clubs/clubService';
import { calculateFinanceTotal, createFinanceRequest, getFinanceRequestsByClub, submitExpenseProof } from '../../services/finance/financeService';
import type { FinanceLineItem, FinanceRequest, FinanceRequestKind, FinanceRequestStatus } from '../../types';

const blankItem = (): FinanceLineItem => ({
  id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  recipientName: '',
  designation: '',
  description: '',
  amount: 0
});

const statusStyle: Record<FinanceRequestStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  'Proof Submitted': 'bg-blue-100 text-blue-700',
  Closed: 'bg-slate-200 text-slate-700'
};

type FinanceStatusFilter = 'All' | FinanceRequestStatus;
type FinanceKindFilter = 'All' | FinanceRequestKind;

export function ClubFinancePage() {
  const { user } = useAuth();
  const club = getClubs().find(item => item.id === user?.clubId);
  const [showForm, setShowForm] = useState(false);
  const [kind, setKind] = useState<FinanceRequestKind>('Honorarium');
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<FinanceLineItem[]>([blankItem()]);
  const [requests, setRequests] = useState<FinanceRequest[]>(club ? getFinanceRequestsByClub(club.id) : []);
  const [statusFilter, setStatusFilter] = useState<FinanceStatusFilter>('All');
  const [kindFilter, setKindFilter] = useState<FinanceKindFilter>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<FinanceRequest | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const refresh = () => setRequests(club ? getFinanceRequestsByClub(club.id) : []);
  useEffect(() => {
    window.addEventListener('shksc_state_changed', refresh);
    return () => window.removeEventListener('shksc_state_changed', refresh);
  }, [club?.id]);

  const total = useMemo(() => calculateFinanceTotal(items), [items]);
  const pendingCount = requests.filter(request => request.status === 'Pending').length;
  const proofDueCount = requests.filter(request => request.kind === 'Club Expense' && request.status === 'Approved').length;
  const rejectedCount = requests.filter(request => request.status === 'Rejected').length;
  const approvedTotal = requests
    .filter(request => ['Approved', 'Proof Submitted', 'Closed'].includes(request.status))
    .reduce((sum, request) => sum + request.totalAmount, 0);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredRequests = requests
    .filter(request => {
      const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
      const matchesKind = kindFilter === 'All' || request.kind === kindFilter;
      const searchable = [request.title, request.period, request.voucherNo, request.status, ...request.items.flatMap(item => [item.recipientName, item.designation, item.description])].filter(Boolean).join(' ').toLowerCase();
      return matchesStatus && matchesKind && (!normalizedSearch || searchable.includes(normalizedSearch));
    })
    .slice()
    .reverse();
  const hasFilters = Boolean(normalizedSearch) || statusFilter !== 'All' || kindFilter !== 'All';

  const updateItem = (id: string, field: keyof FinanceLineItem, value: string) => {
    setItems(current => current.map(item => item.id === id
      ? { ...item, [field]: field === 'amount' ? Number(value) : value }
      : item));
  };

  const resetForm = () => {
    setKind('Honorarium');
    setPeriod(new Date().toISOString().slice(0, 7));
    setTitle('');
    setNotes('');
    setItems([blankItem()]);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback(null);
    if (!club || !title.trim() || total <= 0 || items.some(item => !item.recipientName.trim() || !item.description.trim() || !item.amount)) {
      setFeedback({ type: 'error', text: 'Add a title, payee, purpose, and valid amount for every line.' });
      return;
    }
    createFinanceRequest({
      clubId: club.id,
      clubName: club.name,
      kind,
      period,
      title: title.trim(),
      notes: notes.trim(),
      items,
      requestedBy: user?.name || 'Club Admin'
    });
    resetForm();
    setShowForm(false);
    setFeedback({ type: 'success', text: 'Finance request sent to Root Admin for review.' });
    refresh();
  };

  const uploadProof = (requestId: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ type: 'error', text: 'Proof file must be 5 MB or smaller.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      submitExpenseProof(requestId, String(reader.result), file.name);
      setFeedback({ type: 'success', text: 'Proof voucher uploaded and sent for final verification.' });
      refresh();
    };
    reader.readAsDataURL(file);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setKindFilter('All');
  };

  return (
    <ClubAdminLayout>
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-950">Finance Requests</h1>
          <p className="mt-1 text-sm text-gray-500">Request honorarium or club expenses, print approved vouchers, and submit expense proof.</p>
        </div>
        <Button onClick={() => { setShowForm(true); setFeedback(null); }} className="gap-2"><Plus size={16} /> New Request</Button>
      </div>

      {feedback && (
        <div className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${feedback.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`} role="status">
          {feedback.type === 'success' ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}{feedback.text}
        </div>
      )}

      {!club ? (
        <div className="rounded-2xl bg-white p-8 text-center text-gray-500">No club is assigned to this account.</div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <button type="button" onClick={() => setStatusFilter('All')} className={`rounded-xl border p-4 text-left ${statusFilter === 'All' ? 'border-primary-300 bg-primary-50 ring-2 ring-primary-100' : 'border-gray-100 bg-white'}`}><span className="text-2xl font-bold text-primary-950">{requests.length}</span><span className="mt-1 block text-xs font-semibold text-gray-500">All Requests</span></button>
            <button type="button" onClick={() => setStatusFilter('Pending')} className={`rounded-xl border p-4 text-left ${statusFilter === 'Pending' ? 'border-amber-300 bg-amber-50 ring-2 ring-amber-100' : 'border-gray-100 bg-white'}`}><span className="text-2xl font-bold text-amber-700">{pendingCount}</span><span className="mt-1 block text-xs font-semibold text-gray-500">Awaiting Root</span></button>
            <button type="button" onClick={() => { setStatusFilter('Approved'); setKindFilter('Club Expense'); }} className={`rounded-xl border p-4 text-left ${statusFilter === 'Approved' && kindFilter === 'Club Expense' ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-100' : 'border-gray-100 bg-white'}`}><span className="text-2xl font-bold text-blue-700">{proofDueCount}</span><span className="mt-1 block text-xs font-semibold text-gray-500">Proof Upload Due</span></button>
            <div className="rounded-xl border border-gray-100 bg-white p-4"><span className="text-xl sm:text-2xl font-bold text-green-700">৳ {approvedTotal.toLocaleString()}</span><span className="mt-1 block text-xs font-semibold text-gray-500">Approved Value</span></div>
          </div>

          {rejectedCount > 0 && (
            <button type="button" onClick={() => setStatusFilter('Rejected')} className="mb-6 flex w-full items-center justify-between rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-700">
              <span><AlertCircle size={17} className="mr-2 inline" />{rejectedCount} rejected request{rejectedCount > 1 ? 's need' : ' needs'} correction.</span><span className="text-xs font-bold">View feedback</span>
            </button>
          )}

          {showForm && (
            <form onSubmit={submit} className="mb-7 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
              <div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="text-lg font-bold text-primary-950">New Finance Request</h2><p className="mt-1 text-xs text-gray-500">Root approval automatically creates a printable voucher with signature lines.</p></div><button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Close finance request form"><X size={19} /></button></div>
              <div className="mb-6 flex flex-wrap gap-2">
                <button type="button" onClick={() => setKind('Honorarium')} className={`rounded-lg px-4 py-2 text-sm font-bold ${kind === 'Honorarium' ? 'bg-primary-950 text-white' : 'bg-gray-100 text-gray-600'}`}>Monthly Honorarium</button>
                <button type="button" onClick={() => setKind('Club Expense')} className={`rounded-lg px-4 py-2 text-sm font-bold ${kind === 'Club Expense' ? 'bg-primary-950 text-white' : 'bg-gray-100 text-gray-600'}`}>Club Expense</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-gray-700">Period *<input required type="month" value={period} onChange={event => setPeriod(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3" /></label>
                <label className="text-sm font-semibold text-gray-700">Request title *<input required value={title} onChange={event => setTitle(event.target.value)} placeholder={kind === 'Honorarium' ? 'October team honorarium' : 'Lab equipment purchase'} className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3" /></label>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between"><h3 className="font-bold text-primary-950">{kind === 'Honorarium' ? 'Recipients' : 'Cost Lines'}</h3><button type="button" onClick={() => setItems(current => [...current, blankItem()])} className="inline-flex items-center gap-1 text-sm font-bold text-primary-600"><Plus size={16} /> Add Line</button></div>
                {items.map((item, index) => (
                  <div key={item.id} className="rounded-xl border border-gray-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wider text-gray-500">Line {index + 1}</p>{items.length > 1 && <button type="button" onClick={() => setItems(current => current.filter(line => line.id !== item.id))} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50" aria-label={`Remove line ${index + 1}`}><Trash2 size={16} /></button>}</div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="text-xs font-semibold text-gray-600">{kind === 'Honorarium' ? 'Recipient name' : 'Vendor / payee'} *<input required value={item.recipientName} onChange={event => updateItem(item.id, 'recipientName', event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm" /></label>
                      <label className="text-xs font-semibold text-gray-600">{kind === 'Honorarium' ? 'Designation' : 'Category'}<input value={item.designation} onChange={event => updateItem(item.id, 'designation', event.target.value)} placeholder={kind === 'Honorarium' ? 'Moderator / Treasurer / Instructor' : 'Equipment / Transport'} className="mt-1 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm" /></label>
                      <label className="text-xs font-semibold text-gray-600">Purpose *<input required value={item.description} onChange={event => updateItem(item.id, 'description', event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm" /></label>
                      <label className="text-xs font-semibold text-gray-600">Amount (BDT) *<input required type="number" min="1" value={item.amount || ''} onChange={event => updateItem(item.id, 'amount', event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm" /></label>
                    </div>
                  </div>
                ))}
              </div>
              <label className="mt-5 block text-sm font-semibold text-gray-700">Supporting note (optional)<textarea value={notes} onChange={event => setNotes(event.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-gray-200 p-3" placeholder="Add context that helps Root Admin review this request" /></label>
              <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-lg font-extrabold text-primary-950">Total: ৳ {total.toLocaleString()}</p><div className="flex gap-2"><Button type="button" variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button><Button type="submit" className="gap-2"><Send size={16} /> Submit Request</Button></div></div>
            </form>
          )}

          <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="search" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Search title, recipient or voucher number..." className="h-11 w-full rounded-lg border border-gray-200 pl-10 pr-3 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" /></div>
              <select value={kindFilter} onChange={event => setKindFilter(event.target.value as FinanceKindFilter)} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium"><option value="All">All Request Types</option><option>Honorarium</option><option>Club Expense</option></select>
              <select value={statusFilter} onChange={event => setStatusFilter(event.target.value as FinanceStatusFilter)} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium"><option value="All">All Statuses</option><option>Pending</option><option>Approved</option><option>Rejected</option><option>Proof Submitted</option><option>Closed</option></select>
              {hasFilters && <Button variant="ghost" onClick={resetFilters} className="gap-2"><RotateCcw size={15} /> Reset</Button>}
            </div>
            <p className="mt-3 text-xs text-gray-500">Showing <strong className="text-primary-900">{filteredRequests.length}</strong> of {requests.length} requests</p>
          </div>

          <section>
            <h2 className="mb-4 text-lg font-bold text-primary-950">Request History</h2>
            {filteredRequests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">{requests.length === 0 ? 'No finance requests yet.' : 'No requests match the selected filters.'}</div>
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {filteredRequests.map(request => (
                  <article key={request.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${request.kind === 'Club Expense' && request.status === 'Approved' ? 'border-blue-200 ring-2 ring-blue-50' : 'border-gray-100'}`}>
                    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wider text-accent-600">{request.kind} - {request.period}</p><h3 className="mt-1 truncate font-bold text-primary-950">{request.title}</h3></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle[request.status]}`}>{request.status}</span></div>
                    <div className="mt-4 flex items-end justify-between gap-3"><div><p className="text-xl font-extrabold text-primary-950">৳ {request.totalAmount.toLocaleString()}</p><p className="mt-1 text-xs text-gray-500">{request.items.length} line item{request.items.length > 1 ? 's' : ''}</p></div>{request.voucherNo && <p className="text-right text-xs font-semibold text-green-700">{request.voucherNo}</p>}</div>
                    {request.rejectionReason && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"><strong>Root feedback:</strong> {request.rejectionReason}</p>}
                    {request.kind === 'Club Expense' && request.status === 'Approved' && <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm font-semibold text-blue-700"><FileUp size={16} className="mr-2 inline" />Approval complete. Upload the purchase/expense proof now.</p>}
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                      {request.voucherNo && <Button size="sm" variant="outline" onClick={() => setSelectedVoucher(request)} className="gap-2"><Printer size={15} /> Print Voucher</Button>}
                      {request.kind === 'Club Expense' && request.status === 'Approved' && <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md bg-primary-900 px-3 text-sm font-medium text-white hover:bg-primary-800"><FileUp size={15} /> Upload Proof<input type="file" accept="image/*,.pdf" className="hidden" onChange={event => { const file = event.target.files?.[0]; if (file) uploadProof(request.id, file); event.currentTarget.value = ''; }} /></label>}
                      {request.proofVoucher && <a href={request.proofVoucher} download={request.proofFileName || 'expense-proof'} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-2 rounded-md border border-blue-200 px-3 text-sm font-bold text-blue-700 hover:bg-blue-50"><ExternalLink size={15} /> Open Proof</a>}
                      <span className="ml-auto text-xs text-gray-400">{new Date(request.requestedAt).toLocaleDateString()}</span>
                    </div>
                    {request.proofFileName && <p className="mt-3 flex items-center gap-2 text-xs font-medium text-blue-700"><CheckCircle2 size={14} /> Proof submitted: {request.proofFileName}</p>}
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {selectedVoucher && <FinanceVoucher request={selectedVoucher} onClose={() => setSelectedVoucher(null)} />}
    </ClubAdminLayout>
  );
}
