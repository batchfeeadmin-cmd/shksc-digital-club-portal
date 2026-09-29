import type { AttendanceRecord, AttendanceStatus, ClubBatch } from '../../types';
import { triggerStateUpdate } from '../base';
import { logActivity } from '../activity/activityService';

const BATCHES_KEY = 'shksc_club_batches_v1';
const ATTENDANCE_KEY = 'shksc_batch_attendance_v1';

const seedBatches: ClubBatch[] = [
  {
    id: 'batch-seed-science-1', clubId: 'c3', clubName: 'SHKSC Science Club', name: 'Science Explorers · Class 10', className: '10', section: 'A',
    days: ['Saturday', 'Monday'], startTime: '15:30', endTime: '17:00', instructorName: 'Rashed Karim', instructorContact: '01711-000000',
    studentIds: ['1'], status: 'Approved', requestedBy: 'Science Club Admin', requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), reviewedBy: 'Root Admin', reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  }
];

const readBatches = (): ClubBatch[] => {
  const saved = localStorage.getItem(BATCHES_KEY);
  if (saved) return JSON.parse(saved) as ClubBatch[];
  localStorage.setItem(BATCHES_KEY, JSON.stringify(seedBatches));
  return seedBatches;
};

const readAttendance = (): AttendanceRecord[] => {
  const saved = localStorage.getItem(ATTENDANCE_KEY);
  return saved ? JSON.parse(saved) as AttendanceRecord[] : [];
};

const writeBatches = (batches: ClubBatch[]) => { localStorage.setItem(BATCHES_KEY, JSON.stringify(batches)); triggerStateUpdate(); };
const writeAttendance = (records: AttendanceRecord[]) => { localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records)); triggerStateUpdate(); };

export const getBatches = (): ClubBatch[] => readBatches();
export const getBatchesByClub = (clubId: string): ClubBatch[] => readBatches().filter(batch => batch.clubId === clubId);
export const getApprovedBatches = (): ClubBatch[] => readBatches().filter(batch => batch.status === 'Approved');
export const getAttendanceRecords = (): AttendanceRecord[] => readAttendance();
export const getAttendanceByBatch = (batchId: string): AttendanceRecord[] => readAttendance().filter(record => record.batchId === batchId);

export const createBatchRequest = (batch: Omit<ClubBatch, 'id' | 'status' | 'requestedAt'>): ClubBatch => {
  const created: ClubBatch = { ...batch, id: `batch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, status: 'Pending', requestedAt: new Date().toISOString() };
  writeBatches([...readBatches(), created]);
  logActivity({ actor: batch.requestedBy, role: 'club_admin', clubName: batch.clubName, action: 'Submitted batch request', detail: `${batch.name} (${batch.studentIds.length} students) sent for Root Admin approval` });
  return created;
};

export const reviewBatchRequest = (id: string, status: 'Approved' | 'Rejected', reviewer = 'Root Admin', rejectionReason?: string): ClubBatch | undefined => {
  const batches = readBatches();
  const index = batches.findIndex(batch => batch.id === id);
  if (index === -1) return undefined;
  batches[index] = { ...batches[index], status, reviewedBy: reviewer, reviewedAt: new Date().toISOString(), rejectionReason };
  writeBatches(batches);
  logActivity({ actor: reviewer, role: 'root_admin', clubName: batches[index].clubName, action: `${status} batch request`, detail: `${batches[index].name} — ${batches[index].className}` });
  return batches[index];
};

export const saveAttendance = (batch: ClubBatch, date: string, entries: Record<string, AttendanceStatus>, markedBy: string): AttendanceRecord => {
  const records = readAttendance();
  const existingIndex = records.findIndex(record => record.batchId === batch.id && record.date === date);
  const record: AttendanceRecord = { id: existingIndex >= 0 ? records[existingIndex].id : `attendance-${Date.now()}`, batchId: batch.id, clubId: batch.clubId, date, markedBy, markedAt: new Date().toISOString(), entries };
  if (existingIndex >= 0) records[existingIndex] = record; else records.push(record);
  writeAttendance(records);
  logActivity({ actor: markedBy, role: 'club_admin', clubName: batch.clubName, action: 'Saved batch attendance', detail: `${batch.name} — ${date}` });
  return record;
};

export const getAttendanceSummary = (batchId?: string) => {
  const records = batchId ? readAttendance().filter(record => record.batchId === batchId) : readAttendance();
  return records.reduce((summary, record) => {
    Object.values(record.entries).forEach(status => { summary[status] += 1; });
    summary.total += Object.keys(record.entries).length;
    summary.sessions += 1;
    return summary;
  }, { Present: 0, Absent: 0, Late: 0, total: 0, sessions: 0 });
};
