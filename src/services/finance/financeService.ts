import type { FinanceRequest, FinanceRequestStatus, FinanceLineItem } from '../../types';
import { triggerStateUpdate } from '../base';
import { logActivity } from '../activity/activityService';

const FINANCE_REQUESTS_KEY = 'shksc_finance_requests_v1';

const seedFinanceRequests: FinanceRequest[] = [
  {
    id: 'fin-seed-honorarium-1',
    clubId: 'c3',
    clubName: 'SHKSC Science Club',
    kind: 'Honorarium',
    period: '2026-09',
    title: 'September 2026 club team honorarium',
    notes: 'Monthly honorarium request for approved club support roles.',
    items: [
      { id: 'line-1', recipientName: 'Mahfuz Rahman', designation: 'Club Moderator', description: 'Monthly moderator honorarium', amount: 3000 },
      { id: 'line-2', recipientName: 'Nabila Sultana', designation: 'Club Treasurer', description: 'Monthly treasurer honorarium', amount: 2500 },
      { id: 'line-3', recipientName: 'Rashed Karim', designation: 'Science Instructor', description: 'Monthly instructor honorarium', amount: 4000 }
    ],
    totalAmount: 9500,
    status: 'Pending',
    requestedBy: 'Science Club Admin',
    requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
  }
];

const readRequests = (): FinanceRequest[] => {
  const saved = localStorage.getItem(FINANCE_REQUESTS_KEY);
  if (saved) return JSON.parse(saved) as FinanceRequest[];
  localStorage.setItem(FINANCE_REQUESTS_KEY, JSON.stringify(seedFinanceRequests));
  return seedFinanceRequests;
};

const writeRequests = (requests: FinanceRequest[]) => {
  localStorage.setItem(FINANCE_REQUESTS_KEY, JSON.stringify(requests));
  triggerStateUpdate();
};

export const getFinanceRequests = (): FinanceRequest[] => readRequests();

export const getFinanceRequestsByClub = (clubId: string): FinanceRequest[] =>
  readRequests().filter(request => request.clubId === clubId);

export const getFinanceRequestById = (id: string): FinanceRequest | undefined =>
  readRequests().find(request => request.id === id);

export const createFinanceRequest = (request: Omit<FinanceRequest, 'id' | 'status' | 'requestedAt' | 'totalAmount'>): FinanceRequest => {
  const items = request.items.map(item => ({ ...item, amount: Number(item.amount) || 0 }));
  const created: FinanceRequest = {
    ...request,
    id: `fin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: 'Pending',
    requestedAt: new Date().toISOString(),
    items,
    totalAmount: items.reduce((sum, item) => sum + item.amount, 0)
  };
  writeRequests([...readRequests(), created]);
  logActivity({
    actor: request.requestedBy,
    role: 'club_admin',
    clubName: request.clubName,
    action: `Submitted ${request.kind} request`,
    detail: `${request.title} for ${request.period} (${created.totalAmount.toLocaleString()} BDT)`
  });
  return created;
};

export const updateFinanceRequestStatus = (
  id: string,
  status: FinanceRequestStatus,
  reviewer = 'Root Admin',
  rejectionReason?: string
): FinanceRequest | undefined => {
  const requests = readRequests();
  const index = requests.findIndex(request => request.id === id);
  if (index === -1) return undefined;

  const request = requests[index];
  request.status = status;
  request.reviewedBy = reviewer;
  request.reviewedAt = new Date().toISOString();
  request.rejectionReason = rejectionReason;
  if (status === 'Approved' && !request.voucherNo) {
    request.voucherNo = `SHKSC-${request.kind === 'Honorarium' ? 'HON' : 'EXP'}-${new Date().getFullYear()}-${String(index + 1).padStart(4, '0')}`;
  }
  writeRequests(requests);
  logActivity({
    actor: reviewer,
    role: 'root_admin',
    clubName: request.clubName,
    action: `${status} ${request.kind} request`,
    detail: request.voucherNo ? `${request.voucherNo} — ${request.title}` : request.title
  });
  return request;
};

export const submitExpenseProof = (id: string, proofVoucher: string, proofFileName: string): FinanceRequest | undefined => {
  const requests = readRequests();
  const index = requests.findIndex(request => request.id === id);
  if (index === -1) return undefined;
  requests[index] = {
    ...requests[index],
    proofVoucher,
    proofFileName,
    proofSubmittedAt: new Date().toISOString(),
    status: 'Proof Submitted'
  };
  writeRequests(requests);
  return requests[index];
};

export const closeFinanceRequest = (id: string): FinanceRequest | undefined => {
  const requests = readRequests();
  const index = requests.findIndex(request => request.id === id);
  if (index === -1) return undefined;
  requests[index].status = 'Closed';
  writeRequests(requests);
  return requests[index];
};

export const calculateFinanceTotal = (items: FinanceLineItem[]): number =>
  items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
