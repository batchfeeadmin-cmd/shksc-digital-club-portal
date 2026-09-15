import { Fee, Payment, Student } from '../../types';
import { triggerStateUpdate } from '../base';
import { getClubs } from '../clubs/clubService';
import { createApprovalRequest } from '../approvals/approvalService';
import { updateStudent } from '../students/studentService';

const FEES_STORAGE_KEY = 'shksc_club_fees';
const FEES_VERSION = 2;
const PAYMENTS_STORAGE_KEY = 'shksc_payments_v2';

// Default fee structure (BDT)
export const DEFAULT_REGISTRATION_FEE = 100;
export const DEFAULT_AFFILIATION_COST = 2000;

interface FeesStore {
  version: number;
  fees: Record<string, Fee>;
}

// Generate default fees for every club (registration 100 TK, affiliation 2000 TK)
const buildDefaultFees = (): Record<string, Fee> => {
  const clubs = getClubs();
  const defaultFees: Record<string, Fee> = {};

  clubs.forEach(club => {
    defaultFees[club.id] = {
      clubId: club.id,
      registrationFee: DEFAULT_REGISTRATION_FEE,
      affiliationCost: DEFAULT_AFFILIATION_COST,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  });

  return defaultFees;
};

export const getClubFees = (): Record<string, Fee> => {
  const saved = localStorage.getItem(FEES_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.version === FEES_VERSION && parsed.fees) {
        return parsed.fees;
      }
      // Legacy unversioned store with old default fees (500/300) -> rebuild with new defaults
    } catch {
      // corrupted storage -> rebuild
    }
  }

  const defaultFees = buildDefaultFees();
  saveClubFees(defaultFees);
  return defaultFees;
};

export const saveClubFees = (fees: Record<string, Fee>): void => {
  const store: FeesStore = { version: FEES_VERSION, fees };
  localStorage.setItem(FEES_STORAGE_KEY, JSON.stringify(store));
  triggerStateUpdate();
};

// Root admin: apply fee changes immediately
export const updateClubFee = (clubId: string, updates: Partial<Fee>): void => {
  const fees = getClubFees();

  if (!fees[clubId]) {
    fees[clubId] = {
      clubId,
      registrationFee: DEFAULT_REGISTRATION_FEE,
      affiliationCost: DEFAULT_AFFILIATION_COST,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  }

  fees[clubId] = { ...fees[clubId], ...updates, lastUpdated: new Date().toISOString().split('T')[0] };
  saveClubFees(fees);
};

// Club admin: fee changes require root admin approval
export const requestFeeUpdate = (
  clubId: string,
  clubName: string,
  registrationFee: number,
  affiliationCost: number
): void => {
  createApprovalRequest({
    id: `req-${Date.now()}`,
    clubId,
    clubName,
    type: 'Fee Update',
    status: 'Pending',
    requestDate: new Date().toISOString(),
    data: { registrationFee, affiliationCost }
  });
};

export const applyFeeUpdate = (clubId: string, data: any): void => {
  updateClubFee(clubId, {
    registrationFee: Number(data.registrationFee),
    affiliationCost: Number(data.affiliationCost)
  });
};

// ---------- Payments ----------

const initialPayments: Payment[] = [
  {
    id: 'pay-1',
    studentId: 'SHKSC-REG-2026-001',
    clubId: 'c3',
    studentName: 'Md. Shafiqul Islam',
    clubName: 'SHKSC Science Club',
    amount: 2100,
    status: 'Paid',
    transactionId: 'TXN-987654321',
    method: 'SSLCommerz (Sandbox)',
    date: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'pay-2',
    studentId: 'SHKSC-REG-2026-002',
    clubId: 'c1',
    studentName: 'Sadia Rahman',
    clubName: 'SHKSC Cultural Club',
    amount: 2100,
    status: 'Paid',
    transactionId: 'TXN-987654322',
    method: 'Cash',
    date: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'pay-3',
    studentId: 'SHKSC-REG-2026-003',
    clubId: 'c2',
    studentName: 'Tahmid Hasan',
    clubName: 'SHKSC Debate Club',
    amount: 2100,
    status: 'Paid',
    transactionId: 'TXN-987654323',
    method: 'SSLCommerz (Sandbox)',
    date: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

export const getPayments = (): Payment[] => {
  const saved = localStorage.getItem(PAYMENTS_STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  
  localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(initialPayments));
  return initialPayments;
};

export const savePayments = (payments: Payment[]): void => {
  localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
  triggerStateUpdate();
};

export const recordPayment = (payment: Payment): void => {
  const payments = getPayments();
  payments.push(payment);
  savePayments(payments);
};

export const getPaymentByTransactionId = (transactionId: string): Payment | undefined => {
  return getPayments().find(p => p.transactionId === transactionId);
};

export const getPaymentsByStudentId = (studentId: string): Payment[] => {
  return getPayments().filter(p => p.studentId === studentId);
};

// Mark a student's payment as confirmed and update their registration status
export const confirmPayment = (
  student: Student,
  clubId: string,
  amount: number,
  transactionId: string,
  method: string,
  studentName: string,
  clubName: string
): Payment => {
  const payment: Payment = {
    id: `pay-${Date.now()}`,
    studentId: student.studentId,
    clubId,
    studentName,
    clubName,
    amount,
    status: 'Paid',
    transactionId,
    method,
    date: new Date().toISOString()
  };

  recordPayment(payment);
  updateStudent(student.studentId, {
    registrationStatus: 'Confirmed',
    receiptTxnId: transactionId
  });

  return payment;
};
