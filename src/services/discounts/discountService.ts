import type { DiscountType, Student, StudentDiscount } from '../../types';
import { triggerStateUpdate } from '../base';
import { logActivity } from '../activity/activityService';

const DISCOUNTS_KEY = 'shksc_student_discounts_v1';
const REASONS_KEY = 'shksc_discount_reasons_v1';

export const DEFAULT_DISCOUNT_REASONS = [
  'Financial hardship',
  'Merit-based discount',
  'Sibling discount',
  'Multiple club membership',
  'Special achievement',
  'Scholarship holder',
  'Teacher/staff child',
  'Orphan/student welfare support',
  'Disability support',
  'Special permission',
  'Campaign/seasonal discount',
  'Other'
];

const readDiscounts = (): StudentDiscount[] => {
  const saved = localStorage.getItem(DISCOUNTS_KEY);
  if (!saved) return [];
  try { return JSON.parse(saved); } catch { return []; }
};

const saveDiscounts = (discounts: StudentDiscount[]) => {
  localStorage.setItem(DISCOUNTS_KEY, JSON.stringify(discounts));
  triggerStateUpdate();
};

export const getDiscounts = (): StudentDiscount[] => readDiscounts();

export const getDiscountsByClub = (clubId: string): StudentDiscount[] =>
  readDiscounts().filter(discount => discount.clubId === clubId);

export const getDiscountReasons = (): string[] => {
  const saved = localStorage.getItem(REASONS_KEY);
  if (!saved) {
    localStorage.setItem(REASONS_KEY, JSON.stringify(DEFAULT_DISCOUNT_REASONS));
    return DEFAULT_DISCOUNT_REASONS;
  }
  try { return JSON.parse(saved); } catch { return DEFAULT_DISCOUNT_REASONS; }
};

export const saveDiscountReasons = (reasons: string[]): void => {
  const cleaned = Array.from(new Set(reasons.map(reason => reason.trim()).filter(Boolean)));
  if (!cleaned.includes('Other')) cleaned.push('Other');
  localStorage.setItem(REASONS_KEY, JSON.stringify(cleaned));
  triggerStateUpdate();
};

export const calculateDiscount = (originalAmount: number, type: DiscountType, value: number) => {
  const safeOriginal = Math.max(0, Number(originalAmount) || 0);
  let discountAmount = 0;
  if (type === 'Full Waiver') discountAmount = safeOriginal;
  if (type === 'Fixed Amount') discountAmount = Math.max(0, Number(value) || 0);
  if (type === 'Percentage') discountAmount = safeOriginal * Math.min(100, Math.max(0, Number(value) || 0)) / 100;
  discountAmount = Math.min(safeOriginal, Math.round(discountAmount));
  return { discountAmount, finalAmount: Math.max(0, safeOriginal - discountAmount) };
};

interface DiscountInput {
  student: Student;
  clubName: string;
  originalAmount: number;
  discountType: DiscountType;
  discountValue: number;
  reason: string;
  reasonDetails?: string;
  requestedBy: string;
}

export const createDiscountRequest = (input: DiscountInput): StudentDiscount => {
  const discounts = readDiscounts();
  const duplicate = discounts.find(discount =>
    discount.studentId === input.student.studentId &&
    discount.clubId === input.student.clubId &&
    ['Pending', 'Approved'].includes(discount.status)
  );
  if (duplicate) throw new Error('This student already has an active discount request.');
  if (input.student.registrationStatus === 'Confirmed') throw new Error('Discount cannot be requested after payment is confirmed.');
  const calculated = calculateDiscount(input.originalAmount, input.discountType, input.discountValue);
  if (calculated.discountAmount <= 0) throw new Error('Discount amount must be greater than zero.');

  const request: StudentDiscount = {
    id: `discount-${Date.now()}`,
    studentRecordId: input.student.id,
    studentId: input.student.studentId,
    studentName: input.student.name,
    studentRoll: input.student.roll,
    className: input.student.class,
    clubId: input.student.clubId,
    clubName: input.clubName,
    originalAmount: input.originalAmount,
    discountType: input.discountType,
    discountValue: input.discountType === 'Full Waiver' ? 100 : Number(input.discountValue),
    discountAmount: calculated.discountAmount,
    finalAmount: calculated.finalAmount,
    reason: input.reason,
    reasonDetails: input.reasonDetails?.trim(),
    status: 'Pending',
    requestedBy: input.requestedBy,
    requestedAt: new Date().toISOString()
  };
  discounts.unshift(request);
  saveDiscounts(discounts);
  logActivity({ actor: input.requestedBy, role: 'club_admin', clubName: input.clubName, action: 'Requested student discount', detail: `${input.student.name}: ${request.discountAmount} BDT discount requested for ${request.reason}` });
  return request;
};

export const updatePendingDiscountRequest = (
  id: string,
  updates: Pick<DiscountInput, 'discountType' | 'discountValue' | 'reason' | 'reasonDetails'>
): StudentDiscount => {
  const discounts = readDiscounts();
  const index = discounts.findIndex(discount => discount.id === id);
  if (index === -1 || discounts[index].status !== 'Pending') throw new Error('Only pending requests can be edited.');
  const calculated = calculateDiscount(discounts[index].originalAmount, updates.discountType, updates.discountValue);
  if (calculated.discountAmount <= 0) throw new Error('Discount amount must be greater than zero.');
  discounts[index] = {
    ...discounts[index],
    discountType: updates.discountType,
    discountValue: updates.discountType === 'Full Waiver' ? 100 : Number(updates.discountValue),
    discountAmount: calculated.discountAmount,
    finalAmount: calculated.finalAmount,
    reason: updates.reason,
    reasonDetails: updates.reasonDetails?.trim(),
    updatedAt: new Date().toISOString()
  };
  saveDiscounts(discounts);
  return discounts[index];
};

export const reviewDiscountRequest = (id: string, approved: boolean, reviewedBy: string, note?: string): StudentDiscount => {
  const discounts = readDiscounts();
  const index = discounts.findIndex(discount => discount.id === id);
  if (index === -1 || discounts[index].status !== 'Pending') throw new Error('This discount request is no longer pending.');
  discounts[index] = {
    ...discounts[index],
    status: approved ? 'Approved' : 'Rejected',
    reviewedBy,
    reviewedAt: new Date().toISOString(),
    reviewNote: note?.trim()
  };
  saveDiscounts(discounts);
  logActivity({ actor: reviewedBy, role: 'root_admin', clubName: discounts[index].clubName, action: approved ? 'Approved student discount' : 'Rejected student discount', detail: `${discounts[index].studentName}: ${discounts[index].discountAmount} BDT` });
  return discounts[index];
};

export const getApprovedDiscountForStudent = (studentId: string, clubId: string): StudentDiscount | undefined =>
  readDiscounts().find(discount => discount.studentId === studentId && discount.clubId === clubId && discount.status === 'Approved');

export const markDiscountUsed = (id: string, transactionId: string): void => {
  const discounts = readDiscounts();
  const index = discounts.findIndex(discount => discount.id === id);
  if (index === -1 || discounts[index].status !== 'Approved') return;
  discounts[index] = { ...discounts[index], status: 'Used', usedAt: new Date().toISOString(), paymentTransactionId: transactionId };
  saveDiscounts(discounts);
};
