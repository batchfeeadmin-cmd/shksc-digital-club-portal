export type Role = 'root_admin' | 'sub_admin' | 'club_admin' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  clubId?: string;
  className?: string;
  profilePicture?: string;
  permissions?: string[];
}

export interface UserAccount extends User {
  password: string;
  mobile?: string;
  designation?: string;
  userType?: 'Teacher' | 'Student' | 'Other';
  accessLevel?: 'Full Access' | 'Editor' | 'Viewer';
  department?: string;
  status?: 'Active' | 'Inactive';
  createdAt?: string;
}

export interface Student {
  id: string; // Document ID
  studentId: string; // e.g. SHKSC-REG-2026-001
  schoolStudentId?: string; // Official school-issued ID
  name: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  gender?: string;
  class: string;
  section?: string;
  roll: string;
  mobile: string;
  email: string;
  address?: string;
  clubId: string;
  registrationStatus: 'Confirmed' | 'Pending Payment';
  receiptTxnId?: string;
  profilePicture?: string;
}

export type ClubCategory = 'Academic' | 'Sports' | 'Arts & Culture' | 'Technology' | 'Community Service' | 'General';

export interface Activity {
  id: string;
  name: string;
  description: string;
}

export interface ClubAdmin {
  id: string;
  userId: string;
  clubId: string;
}

export interface Achievement {
  id: string;
  clubId?: string; // Made optional for backward compatibility
  clubName: string; 
  title: string;
  year: number | string; // Backward compat
  eventName?: string;
  competition?: string; // Backward compat
  position?: string; // Backward compat
  award?: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  clubId: string;
  clubName: string; // Denormalized
  image: string;
  caption: string;
  eventName: string;
}

export interface Club {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  mission?: string;
  objectives?: string[];
  vision?: string;
  category: ClubCategory;
  memberCount: number;
  achievementCount?: number;
  history?: string;
  logo: string;
  coverImage: string;
  coordinator?: any; // To allow both string and object during transition
  president?: string;
  generalSecretary?: string;
  establishedYear?: number;
  establishedDate?: string;
  activities?: Activity[];
  gallery?: string[]; 
}

export interface Payment {
  id: string;
  studentId: string;
  clubId: string;
  studentName?: string;
  clubName?: string;
  amount: number;
  originalAmount?: number;
  discountAmount?: number;
  discountReason?: string;
  discountId?: string;
  status: 'Paid' | 'Pending' | 'Failed';
  transactionId?: string;
  method?: string;
  date: string;
}

export type DiscountType = 'Fixed Amount' | 'Percentage' | 'Full Waiver';
export type DiscountStatus = 'Pending' | 'Approved' | 'Rejected' | 'Used';

export interface StudentDiscount {
  id: string;
  studentRecordId: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  className: string;
  clubId: string;
  clubName: string;
  originalAmount: number;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  finalAmount: number;
  reason: string;
  reasonDetails?: string;
  status: DiscountStatus;
  requestedBy: string;
  requestedAt: string;
  updatedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
  usedAt?: string;
  paymentTransactionId?: string;
}

export interface Fee {
  clubId?: string;
  registrationFee: number;
  affiliationCost: number;
  lastUpdated: string;
}

export type ApprovalRequestType = 'Information Update' | 'Gallery Update' | 'Achievement Update' | 'Fee Update' | 'Profile Update';

export interface ApprovalRequest {
  id: string;
  clubId: string;
  clubName: string;
  type: ApprovalRequestType;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestDate: string;
  data: any;
}

export type FinanceRequestKind = 'Honorarium' | 'Club Expense';
export type FinanceRequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'Proof Submitted' | 'Closed';

export interface FinanceLineItem {
  id: string;
  recipientName: string;
  designation: string;
  description: string;
  amount: number;
}

export interface FinanceRequest {
  id: string;
  clubId: string;
  clubName: string;
  kind: FinanceRequestKind;
  period: string;
  title: string;
  notes?: string;
  items: FinanceLineItem[];
  totalAmount: number;
  status: FinanceRequestStatus;
  requestedBy: string;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  voucherNo?: string;
  proofVoucher?: string;
  proofFileName?: string;
  proofSubmittedAt?: string;
}

export type BatchStatus = 'Pending' | 'Approved' | 'Rejected';
export type AttendanceStatus = 'Present' | 'Absent' | 'Late';

export interface ClubBatch {
  id: string;
  clubId: string;
  clubName: string;
  name: string;
  className: string;
  section?: string;
  days: string[];
  startTime: string;
  endTime: string;
  instructorName: string;
  instructorContact?: string;
  studentIds: string[];
  status: BatchStatus;
  requestedBy: string;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface AttendanceRecord {
  id: string;
  batchId: string;
  clubId: string;
  date: string;
  markedBy: string;
  markedAt: string;
  entries: Record<string, AttendanceStatus>;
}

export interface RegistrationState {
  isOpen: boolean;
  year: string;
  startDate: string;
  closingDate: string;
  message: string;
}

// ============ Rich club page content (fill per club in data/clubs/rich/) ============

export interface RichStat {
  label: string;
  value: string;
  countUp?: boolean;
  end?: number;
  suffix?: string;
}

export interface RichFeaturedAchievement {
  badge: string;
  emoji?: string;
  title: string;
  description: string;
  location?: string;
  year?: string;
  link?: string;
  image?: string;
}

export interface RichAchievementItem {
  year: number;
  event: string;
  result: string;
  tier: 'National' | 'International';
}

export interface RichJourneyItem {
  year: string;
  title: string;
  description: string;
  highlight?: boolean;
}

export interface RichWhyJoinItem {
  title: string;
  description: string;
}

export interface RichLeader {
  role: string;
  name: string;
  confirmed?: boolean;
}

export interface RichSpotlightHighlight {
  year: number;
  text: string;
}

export interface RichSpotlight {
  name: string;
  nameBn?: string;
  title: string;
  quote?: string;
  highlights?: RichSpotlightHighlight[];
}

export interface RichEvent {
  title: string;
  note: string;
}

export interface RichNews {
  title: string;
  date: string;
  description: string;
  link?: string;
}

export interface RichBranch {
  name: string;
  level: string;
  focus: string;
}

export interface RichInternational {
  description: string;
  stats: RichStat[];
  programmes: string[];
}

export interface RichParticipation {
  name: string;
  type: string;
}

export interface RichServiceItem {
  name: string;
  purpose: string;
}

export interface RichAwardYear {
  year: number;
  recipients: number;
}

export interface RichAwardStat {
  name: string;
  emoji?: string;
  total: number;
  note?: string;
  highlightYears?: number[];
  yearly?: RichAwardYear[];
}

export interface RichLeaderAwardEntry {
  award: string;
  recipient: string;
}

export interface RichLeaderAwardsYear {
  year: number;
  entries: RichLeaderAwardEntry[];
}

export interface RichValue {
  title: string;
  description: string;
}

export interface RichFounderStory {
  quote?: string;
  paragraphs: string[];
}

export interface RichMember {
  name: string;
  branch: string;
  className?: string;
  award?: string;
  achievement?: string;
  international?: string;
  quote?: string;
}

export interface RichGalleryItem {
  image: string;
  caption: string;
  category: string;
}

export interface RichClub {
  quickStats?: RichStat[];
  featuredAchievement?: RichFeaturedAchievement;
  achievements?: RichAchievementItem[];
  journey?: RichJourneyItem[];
  spotlight?: RichSpotlight;
  leaders?: RichLeader[];
  committeeRoles?: string[];
  whyJoin?: RichWhyJoinItem[];
  events?: RichEvent[];
  news?: RichNews[];
  branches?: RichBranch[];
  international?: RichInternational;
  nationalParticipation?: RichParticipation[];
  service?: RichServiceItem[];
  awardStats?: RichAwardStat[];
  leaderAwards?: RichLeaderAwardsYear[];
  values?: RichValue[];
  founderStory?: RichFounderStory;
  members?: RichMember[];
  galleryFilters?: string[];
  galleryItems?: RichGalleryItem[];
  membershipFields?: string[];
  membershipOptions?: string[];
  activitiesNote?: string;
}
