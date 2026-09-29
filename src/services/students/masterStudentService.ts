import { triggerStateUpdate } from '../base';

const MASTER_STUDENTS_STORAGE_KEY = 'shksc_master_students_data_v1';

export interface MasterStudent {
  studentId: string;
  name: string;
  class: string;
  roll: string;
  section?: string;
}

export const getMasterStudents = (): MasterStudent[] => {
  const saved = localStorage.getItem(MASTER_STUDENTS_STORAGE_KEY);
  if (saved !== null) return JSON.parse(saved) as MasterStudent[];
  
  // Demo Data
  const demoData: MasterStudent[] = [
    { studentId: 'SHKSC-2026-001', name: 'Arafat Rahman', class: '10', roll: '12', section: 'A' },
    { studentId: 'SHKSC-2026-002', name: 'Nusrat Jahan', class: '9', roll: '45', section: 'B' },
    { studentId: 'SHKSC-2026-003', name: 'Tahsin Ahmed', class: '8', roll: '03', section: 'A' },
    { studentId: 'SHKSC-2026-004', name: 'Farhana Akter', class: '10', roll: '21', section: 'C' },
    { studentId: 'SHKSC-2026-005', name: 'Sajid Islam', class: '7', roll: '08', section: 'A' },
  ];
  localStorage.setItem(MASTER_STUDENTS_STORAGE_KEY, JSON.stringify(demoData));
  return demoData;
};

export const saveMasterStudents = (students: MasterStudent[]): void => {
  localStorage.setItem(MASTER_STUDENTS_STORAGE_KEY, JSON.stringify(students));
  triggerStateUpdate();
};

export const clearMasterStudents = (): void => {
  // Persist an intentional empty list. Removing the key would restore demo data
  // on the next read and make manual-registration mode impossible to enable.
  localStorage.setItem(MASTER_STUDENTS_STORAGE_KEY, '[]');
  triggerStateUpdate();
};

export const findMasterStudent = (studentId: string): MasterStudent | undefined => {
  const normalized = studentId.trim().toUpperCase();
  return getMasterStudents().find(s => s.studentId.trim().toUpperCase() === normalized);
};
