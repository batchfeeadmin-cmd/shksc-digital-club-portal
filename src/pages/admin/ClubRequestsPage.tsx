import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock3, FileEdit, RotateCcw, Search, XCircle } from 'lucide-react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { useUpdateRequests } from '../../hooks/useAdminData';
import { getBatchesByClub } from '../../services/batches/batchService';
import { getDiscountsByClub } from '../../services/discounts/discountService';
import { getFinanceRequestsByClub } from '../../services/finance/financeService';
import type { ClubBatch, FinanceRequest, StudentDiscount } from '../../types';

type RequestGroupStatus = 'Pending' | 'Approved' | 'Rejected';
type RequestStatusFilter = 'All' | RequestGroupStatus;

interface UnifiedRequest {
  key: string;
  category: string;
  title: string;
  detail: string;
  status: string;
  groupStatus: RequestGroupStatus;
  date: string;
  href: string;
  feedback?: string;
}

const routeForGeneralRequest = (type: string) => {
  if (type === 'Information Update') return '/admin/club/information';
  if (type === 'Gallery Update') return '/admin/club/gallery';
  if (type === 'Achievement Update') return '/admin/club/achievements';
  if (type === 'Fee Update') return '/admin/club/fees';
  return '/admin/club/profile';
};

const groupOperationalStatus = (status: string): RequestGroupStatus => {
  if (status === 'Pending') return 'Pending';
  if (status === 'Rejected') return 'Rejected';
  return 'Approved';
};

const badgeStyle: Record<RequestGroupStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700'
};

export function ClubRequestsPage() {
  const { user } = useAuth();
  const { requests } = useUpdateRequests();
  const clubId = user?.clubId || '';
  const [batches, setBatches] = useState<ClubBatch[]>(() => clubId ? getBatchesByClub(clubId) : []);
  const [discounts, setDiscounts] = useState<StudentDiscount[]>(() => clubId ? getDiscountsByClub(clubId) : []);
  const [financeRequests, setFinanceRequests] = useState<FinanceRequest[]>(() => clubId ? getFinanceRequestsByClub(clubId) : []);
  const [statusFilter, setStatusFilter] = useState<RequestStatusFilter>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const refresh = () => {
      setBatches(clubId ? getBatchesByClub(clubId) : []);
      setDiscounts(clubId ? getDiscountsByClub(clubId) : []);
      setFinanceRequests(clubId ? getFinanceRequestsByClub(clubId) : []);
    };
    refresh();
    window.addEventListener('shksc_state_changed', refresh);
    return () => window.removeEventListener('shksc_state_changed', refresh);
  }, [clubId]);

  const unifiedRequests: UnifiedRequest[] = [
    ...requests.filter(request => request.clubId === clubId).map(request => ({
      key: `general-${request.id}`,
      category: request.type,
      title: request.data?.title || request.data?.name || request.type,
      detail: 'Club content or account update',
      status: request.status,
      groupStatus: request.status,
      date: request.requestDate,
      href: routeForGeneralRequest(request.type)
    })),
    ...batches.map(batch => ({
      key: `batch-${batch.id}`,
      category: 'Batch Request',
      title: batch.name,
      detail: `Class ${batch.className} - ${batch.studentIds.length} students - ${batch.instructorName}`,
      status: batch.status,
      groupStatus: batch.status,
      date: batch.requestedAt,
      href: '/admin/club/batches',
      feedback: batch.rejectionReason
    })),
    ...discounts.map(discount => ({
      key: `discount-${discount.id}`,
      category: 'Student Discount',
      title: discount.studentName,
      detail: `${discount.discountAmount.toLocaleString()} BDT discount - ${discount.reason}`,
      status: discount.status,
      groupStatus: groupOperationalStatus(discount.status),
      date: discount.requestedAt,
      href: '/admin/club/discounts',
      feedback: discount.reviewNote
    })),
    ...financeRequests.map(request => ({
      key: `finance-${request.id}`,
      category: request.kind,
      title: request.title,
      detail: `${request.totalAmount.toLocaleString()} BDT - ${request.period}`,
      status: request.status,
      groupStatus: groupOperationalStatus(request.status),
      date: request.requestedAt,
      href: '/admin/club/finance',
      feedback: request.rejectionReason
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const pendingCount = unifiedRequests.filter(request => request.groupStatus === 'Pending').length;
  const approvedCount = unifiedRequests.filter(request => request.groupStatus === 'Approved').length;
  const rejectedCount = unifiedRequests.filter(request => request.groupStatus === 'Rejected').length;
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredRequests = unifiedRequests.filter(request => {
    const matchesStatus = statusFilter === 'All' || request.groupStatus === statusFilter;
    const searchable = [request.category, request.title, request.detail, request.status, request.feedback].filter(Boolean).join(' ').toLowerCase();
    return matchesStatus && (!normalizedSearch || searchable.includes(normalizedSearch));
  });
  const hasFilters = Boolean(normalizedSearch) || statusFilter !== 'All';

  return (
    <ClubAdminLayout>
      <div className="mb-7">
        <h2 className="text-2xl font-heading font-bold text-primary-950">My Requests</h2>
        <p className="mt-1 text-sm text-gray-500">All content, batch, discount, and finance approvals in one timeline.</p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <button type="button" onClick={() => setStatusFilter('All')} className={`rounded-xl border p-4 text-left ${statusFilter === 'All' ? 'border-primary-300 bg-primary-50 ring-2 ring-primary-100' : 'border-gray-100 bg-white'}`}><span className="text-2xl font-bold text-primary-950">{unifiedRequests.length}</span><span className="mt-1 block text-xs font-semibold text-gray-500">All Requests</span></button>
        <button type="button" onClick={() => setStatusFilter('Pending')} className={`rounded-xl border p-4 text-left ${statusFilter === 'Pending' ? 'border-amber-300 bg-amber-50 ring-2 ring-amber-100' : 'border-gray-100 bg-white'}`}><span className="text-2xl font-bold text-amber-700">{pendingCount}</span><span className="mt-1 block text-xs font-semibold text-gray-500">Awaiting Root</span></button>
        <button type="button" onClick={() => setStatusFilter('Approved')} className={`rounded-xl border p-4 text-left ${statusFilter === 'Approved' ? 'border-green-300 bg-green-50 ring-2 ring-green-100' : 'border-gray-100 bg-white'}`}><span className="text-2xl font-bold text-green-700">{approvedCount}</span><span className="mt-1 block text-xs font-semibold text-gray-500">Approved / Complete</span></button>
        <button type="button" onClick={() => setStatusFilter('Rejected')} className={`rounded-xl border p-4 text-left ${statusFilter === 'Rejected' ? 'border-red-300 bg-red-50 ring-2 ring-red-100' : 'border-gray-100 bg-white'}`}><span className="text-2xl font-bold text-red-700">{rejectedCount}</span><span className="mt-1 block text-xs font-semibold text-gray-500">Needs Correction</span></button>
      </div>

      <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="search" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Search any request..." className="h-11 w-full rounded-lg border border-gray-200 pl-10 pr-3 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" /></div>
          <select value={statusFilter} onChange={event => setStatusFilter(event.target.value as RequestStatusFilter)} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium"><option value="All">All Statuses</option><option>Pending</option><option>Approved</option><option>Rejected</option></select>
          {hasFilters && <Button variant="ghost" onClick={() => { setSearchTerm(''); setStatusFilter('All'); }} className="gap-2"><RotateCcw size={15} /> Reset</Button>}
        </div>
        <p className="mt-3 text-xs text-gray-500">Showing <strong className="text-primary-900">{filteredRequests.length}</strong> of {unifiedRequests.length} requests</p>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-primary-950"><FileEdit size={20} className="text-accent-500" /> Request Timeline</h3>
        {filteredRequests.length > 0 ? (
          <div className="space-y-3">
            {filteredRequests.map(request => (
              <article key={request.key} className="rounded-xl border border-gray-100 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wider text-accent-600">{request.category}</p><h4 className="mt-1 font-bold text-primary-950">{request.title}</h4><p className="mt-1 text-sm text-gray-500">{request.detail}</p></div>
                  <span className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${badgeStyle[request.groupStatus]}`}>{request.groupStatus === 'Pending' ? <Clock3 size={13} /> : request.groupStatus === 'Rejected' ? <XCircle size={13} /> : <CheckCircle2 size={13} />}{request.status}</span>
                </div>
                {request.feedback && <p className={`mt-3 rounded-lg p-3 text-sm ${request.groupStatus === 'Rejected' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}><strong>Root feedback:</strong> {request.feedback}</p>}
                <div className="mt-4 flex items-center justify-between border-t border-gray-200/70 pt-3"><span className="text-xs text-gray-400">Submitted {new Date(request.date).toLocaleString()}</span><Link to={request.href} className="inline-flex items-center gap-1 text-xs font-bold text-primary-700 hover:text-accent-600">Open workflow <ArrowRight size={14} /></Link></div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-sm text-gray-400">{unifiedRequests.length === 0 ? 'No requests have been submitted yet.' : 'No requests match the selected filters.'}</div>
        )}
      </section>
    </ClubAdminLayout>
  );
}
