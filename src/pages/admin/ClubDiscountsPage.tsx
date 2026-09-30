import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BadgePercent, CheckCircle2, Clock3, Pencil, Plus, RotateCcw, Search, X, XCircle } from 'lucide-react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { useClubsData, useClubFees } from '../../hooks/useAdminData';
import { getStudentsByClub } from '../../services/students/studentService';
import {
  calculateDiscount,
  createDiscountRequest,
  getDiscountReasons,
  getDiscountsByClub,
  updatePendingDiscountRequest
} from '../../services/discounts/discountService';
import type { DiscountStatus, DiscountType, StudentDiscount } from '../../types';

const statusStyle: Record<DiscountStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-blue-100 text-blue-700',
  Rejected: 'bg-red-100 text-red-700',
  Used: 'bg-green-100 text-green-700'
};

type DiscountStatusFilter = 'All' | DiscountStatus;

export function ClubDiscountsPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { clubs } = useClubsData();
  const { fees } = useClubFees();
  const club = clubs.find(item => item.id === user?.clubId);
  const students = user?.clubId ? getStudentsByClub(user.clubId).filter(student => student.registrationStatus === 'Pending Payment') : [];
  const [requests, setRequests] = useState<StudentDiscount[]>(user?.clubId ? getDiscountsByClub(user.clubId) : []);
  const [showForm, setShowForm] = useState(false);
  const [studentRecordId, setStudentRecordId] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('Fixed Amount');
  const [discountValue, setDiscountValue] = useState('');
  const [reason, setReason] = useState(getDiscountReasons()[0] || 'Other');
  const [reasonDetails, setReasonDetails] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<DiscountStatusFilter>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const originalAmount = user?.clubId
    ? (fees[user.clubId]?.registrationFee ?? 0) + (fees[user.clubId]?.affiliationCost ?? 0)
    : 0;
  const preview = useMemo(
    () => calculateDiscount(originalAmount, discountType, Number(discountValue)),
    [originalAmount, discountType, discountValue]
  );

  useEffect(() => {
    const refresh = () => setRequests(user?.clubId ? getDiscountsByClub(user.clubId) : []);
    window.addEventListener('shksc_state_changed', refresh);
    return () => window.removeEventListener('shksc_state_changed', refresh);
  }, [user?.clubId]);

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setShowForm(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const activeStudentIds = new Set(requests.filter(request => ['Pending', 'Approved'].includes(request.status)).map(request => request.studentRecordId));
  const pendingCount = requests.filter(request => request.status === 'Pending').length;
  const approvedCount = requests.filter(request => request.status === 'Approved').length;
  const rejectedCount = requests.filter(request => request.status === 'Rejected').length;
  const usedCount = requests.filter(request => request.status === 'Used').length;
  const approvedTotal = requests.filter(item => ['Approved', 'Used'].includes(item.status)).reduce((sum, item) => sum + item.discountAmount, 0);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredRequests = requests.filter(request => {
    const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
    const searchable = [request.studentName, request.studentId, request.studentRoll, request.className, request.reason, request.reasonDetails].filter(Boolean).join(' ').toLowerCase();
    return matchesStatus && (!normalizedSearch || searchable.includes(normalizedSearch));
  });
  const hasFilters = Boolean(normalizedSearch) || statusFilter !== 'All';

  const resetForm = () => {
    setStudentRecordId('');
    setDiscountType('Fixed Amount');
    setDiscountValue('');
    setReason(getDiscountReasons()[0] || 'Other');
    setReasonDetails('');
    setEditingId(null);
    setError('');
  };

  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      if (editingId) {
        updatePendingDiscountRequest(editingId, { discountType, discountValue: Number(discountValue), reason, reasonDetails });
        setMessage('Pending discount request updated successfully.');
      } else {
        const student = students.find(item => item.id === studentRecordId);
        if (!student || !club) throw new Error('Please select an eligible student.');
        createDiscountRequest({
          student,
          clubName: club.name,
          originalAmount,
          discountType,
          discountValue: Number(discountValue),
          reason,
          reasonDetails,
          requestedBy: user?.name || 'Club Admin'
        });
        setMessage('Discount request sent to Root Admin.');
      }
      closeForm();
      setTimeout(() => setMessage(''), 4000);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Discount request could not be saved.');
    }
  };

  const editRequest = (request: StudentDiscount, retry = false) => {
    setEditingId(retry ? null : request.id);
    setStudentRecordId(request.studentRecordId);
    setDiscountType(request.discountType);
    setDiscountValue(String(request.discountValue));
    setReason(request.reason);
    setReasonDetails(request.reasonDetails || '');
    setError('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ClubAdminLayout>
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><h1 className="text-2xl font-heading font-bold text-primary-950">Student Discounts</h1><p className="mt-1 text-sm text-gray-500">Request discounts for unpaid students and track every approval decision.</p></div>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="gap-2"><Plus size={16} /> New Discount Request</Button>
      </div>

      {message && <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700"><CheckCircle2 size={17} className="mr-2 inline" />{message}</div>}
      {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"><XCircle size={17} className="mr-2 inline" />{error}</div>}

      <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <button type="button" onClick={() => setStatusFilter('Pending')} className={`rounded-xl border p-4 text-left ${statusFilter === 'Pending' ? 'border-amber-300 bg-amber-50 ring-2 ring-amber-100' : 'border-gray-100 bg-white'}`}><span className="text-2xl font-bold text-amber-700">{pendingCount}</span><span className="mt-1 block text-xs font-semibold text-gray-500">Awaiting Root</span></button>
        <button type="button" onClick={() => setStatusFilter('Approved')} className={`rounded-xl border p-4 text-left ${statusFilter === 'Approved' ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-100' : 'border-gray-100 bg-white'}`}><span className="text-2xl font-bold text-blue-700">{approvedCount}</span><span className="mt-1 block text-xs font-semibold text-gray-500">Ready for Payment</span></button>
        <button type="button" onClick={() => setStatusFilter('Used')} className={`rounded-xl border p-4 text-left ${statusFilter === 'Used' ? 'border-green-300 bg-green-50 ring-2 ring-green-100' : 'border-gray-100 bg-white'}`}><span className="text-2xl font-bold text-green-700">{usedCount}</span><span className="mt-1 block text-xs font-semibold text-gray-500">Used</span></button>
        <button type="button" onClick={() => setStatusFilter('Rejected')} className={`rounded-xl border p-4 text-left ${statusFilter === 'Rejected' ? 'border-red-300 bg-red-50 ring-2 ring-red-100' : 'border-gray-100 bg-white'}`}><span className="text-2xl font-bold text-red-700">{rejectedCount}</span><span className="mt-1 block text-xs font-semibold text-gray-500">Needs Correction</span></button>
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm font-semibold text-green-800"><BadgePercent size={17} className="mr-2 inline" />Approved discount value: <strong>{approvedTotal.toLocaleString()} BDT</strong></p><p className="text-xs text-green-700">{students.length - activeStudentIds.size > 0 ? `${Math.max(0, students.length - activeStudentIds.size)} unpaid students are eligible for a new request.` : 'No unpaid student is currently waiting for a new discount request.'}</p></div>

      {showForm && (
        <form onSubmit={submit} className="mb-7 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4"><div><h2 className="font-bold text-primary-950">{editingId ? 'Edit Pending Request' : 'New Discount Request'}</h2><p className="mt-1 text-xs text-gray-500">Root Admin approval is required before the discount affects payment.</p></div><button type="button" onClick={closeForm} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Close discount form"><X size={19} /></button></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <label className="text-sm font-semibold text-gray-700">Student *
              <select required disabled={!!editingId} value={studentRecordId} onChange={event => setStudentRecordId(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-3 disabled:bg-gray-100">
                <option value="">Select unpaid student</option>
                {students.map(student => <option key={student.id} value={student.id} disabled={!editingId && activeStudentIds.has(student.id)}>{student.name} - Class {student.class} - Roll {student.roll}{activeStudentIds.has(student.id) && student.id !== studentRecordId ? ' (active request exists)' : ''}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold text-gray-700">Discount type *
              <select value={discountType} onChange={event => setDiscountType(event.target.value as DiscountType)} className="mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-3"><option>Fixed Amount</option><option>Percentage</option><option>Full Waiver</option></select>
            </label>
            <label className="text-sm font-semibold text-gray-700">{discountType === 'Percentage' ? 'Percentage *' : 'Discount amount *'}
              <input required={discountType !== 'Full Waiver'} disabled={discountType === 'Full Waiver'} type="number" min="0" max={discountType === 'Percentage' ? 100 : originalAmount} value={discountType === 'Full Waiver' ? '100' : discountValue} onChange={event => setDiscountValue(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3 disabled:bg-gray-100" />
            </label>
            <label className="text-sm font-semibold text-gray-700">Reason *
              <select required value={reason} onChange={event => setReason(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-3">{getDiscountReasons().map(item => <option key={item}>{item}</option>)}</select>
            </label>
            <label className="text-sm font-semibold text-gray-700 md:col-span-2">Reason details / supporting note {reason === 'Other' ? '*' : '(optional)'}
              <input required={reason === 'Other'} value={reasonDetails} onChange={event => setReasonDetails(event.target.value)} placeholder="Explain why this student should receive the discount" className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3" />
            </label>
          </div>
          <div className="mt-5 grid gap-3 rounded-xl border border-primary-100 bg-primary-50 p-4 text-sm sm:grid-cols-3"><p>Original: <strong>{originalAmount.toLocaleString()} BDT</strong></p><p>Discount: <strong className="text-green-700">{preview.discountAmount.toLocaleString()} BDT</strong></p><p>Final payable: <strong className="text-primary-950">{preview.finalAmount.toLocaleString()} BDT</strong></p></div>
          <div className="mt-5 flex justify-end gap-3"><Button type="button" variant="outline" onClick={closeForm}>Cancel</Button><Button type="submit" className="gap-2"><Plus size={16} /> {editingId ? 'Save Changes' : 'Send for Approval'}</Button></div>
        </form>
      )}

      <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="search" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Search student, ID, roll or reason..." className="h-11 w-full rounded-lg border border-gray-200 pl-10 pr-3 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" /></div><select value={statusFilter} onChange={event => setStatusFilter(event.target.value as DiscountStatusFilter)} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium"><option value="All">All Statuses</option><option>Pending</option><option>Approved</option><option>Rejected</option><option>Used</option></select>{hasFilters && <Button variant="ghost" onClick={() => { setSearchTerm(''); setStatusFilter('All'); }} className="gap-2"><RotateCcw size={15} /> Reset</Button>}</div>
        <p className="mt-3 text-xs text-gray-500">Showing <strong className="text-primary-900">{filteredRequests.length}</strong> of {requests.length} requests</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-primary-950">Discount Request History</h2>
        {filteredRequests.map(request => (
          <article key={request.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-primary-950">{request.studentName}</h3><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle[request.status]}`}>{request.status}</span></div><p className="mt-1 text-sm text-gray-500">{request.studentId} - Class {request.className} - Roll {request.studentRoll}</p><p className="mt-3 text-sm"><strong>{request.reason}</strong>{request.reasonDetails ? ` - ${request.reasonDetails}` : ''}</p></div>
              <div className="min-w-[220px] rounded-xl bg-slate-50 p-4 text-sm"><p className="flex justify-between"><span>Original</span><strong>{request.originalAmount.toLocaleString()} BDT</strong></p><p className="mt-1 flex justify-between text-green-700"><span>Discount</span><strong>- {request.discountAmount.toLocaleString()} BDT</strong></p><p className="mt-2 flex justify-between border-t border-gray-200 pt-2"><span>Final payable</span><strong>{request.finalAmount.toLocaleString()} BDT</strong></p></div>
            </div>
            {request.reviewNote && <p className={`mt-4 rounded-lg p-3 text-sm ${request.status === 'Rejected' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}><strong>Root feedback:</strong> {request.reviewNote}</p>}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 text-xs text-gray-500"><span>{request.status === 'Pending' ? <Clock3 size={14} className="mr-1 inline" /> : request.status === 'Rejected' ? <XCircle size={14} className="mr-1 inline text-red-500" /> : <CheckCircle2 size={14} className="mr-1 inline text-green-600" />}Requested {new Date(request.requestedAt).toLocaleString()}</span><div className="flex items-center gap-3">{request.reviewedBy && <span>Reviewed by {request.reviewedBy}</span>}{request.status === 'Pending' && <Button size="sm" variant="outline" onClick={() => editRequest(request)} className="h-8 gap-1"><Pencil size={13} /> Edit</Button>}{request.status === 'Rejected' && <Button size="sm" variant="outline" onClick={() => editRequest(request, true)} className="h-8 gap-1 border-red-200 text-red-700"><RotateCcw size={13} /> Correct & Resubmit</Button>}</div></div>
          </article>
        ))}
        {filteredRequests.length === 0 && <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">{requests.length === 0 ? 'No discount requests yet.' : 'No discount requests match the current filters.'}</div>}
      </div>
    </ClubAdminLayout>
  );
}
