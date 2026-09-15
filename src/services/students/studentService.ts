import { Student } from '../../types';
import { triggerStateUpdate } from '../base';

const STUDENTS_STORAGE_KEY = 'shksc_students_data_v2';

const initialStudents: Student[] = [
  {
    id: '1',
    studentId: 'SHKSC-REG-2026-001',
    name: 'Md. Shafiqul Islam',
    class: '10',
    roll: '12',
    mobile: '01711-123456',
    email: 'shafiqul@shksc.edu',
    clubId: 'c3',
    registrationStatus: 'Confirmed',
    receiptTxnId: 'TXN-987654321'
  },
  {
    id: '2',
    studentId: 'SHKSC-REG-2026-002',
    name: 'Sadia Rahman',
    class: '9',
    roll: '45',
    mobile: '01819-654321',
    email: 'sadia.rahman@shksc.edu',
    clubId: 'c1',
    registrationStatus: 'Confirmed',
    receiptTxnId: 'TXN-987654322'
  },
  {
    id: '3',
    studentId: 'SHKSC-REG-2026-003',
    name: 'Tahmid Hasan',
    class: '8',
    roll: '05',
    mobile: '01911-789012',
    email: 'tahmid@shksc.edu',
    clubId: 'c2',
    registrationStatus: 'Confirmed',
    receiptTxnId: 'TXN-987654323'
  },
  {
    id: '4',
    studentId: 'SHKSC-REG-2026-004',
    name: 'Nusrat Jahan',
    class: '10',
    roll: '21',
    mobile: '01611-345678',
    email: 'nusrat.j@shksc.edu',
    clubId: 'c4',
    registrationStatus: 'Confirmed',
    receiptTxnId: 'TXN-987654324'
  },
  {
    id: '5',
    studentId: 'SHKSC-REG-2026-005',
    name: 'Tanvir Ahmed',
    class: '7',
    roll: '55',
    mobile: '01511-901234',
    email: 'tanvir@shksc.edu',
    clubId: 'c5',
    registrationStatus: 'Confirmed',
    receiptTxnId: 'TXN-987654325'
  }
];

export const getStudents = (): Student[] => {
  const saved = localStorage.getItem(STUDENTS_STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    // Legacy migration: old prototype used 'science-club' as club id
    let changed = false;
    parsed.forEach((s: Student) => {
      if (s.clubId === 'science-club') {
        s.clubId = 'c3';
        changed = true;
      }
    });
    if (changed) localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(parsed));
    return parsed;
  }
  
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(initialStudents));
  return initialStudents;
};

export const saveStudents = (students: Student[]): void => {
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  triggerStateUpdate();
};

export const getStudentByEmail = (email: string): Student | undefined => {
  return getStudents().find(s => s.email.toLowerCase() === email.toLowerCase());
};

export const getStudentByStudentId = (studentId: string): Student | undefined => {
  return getStudents().find(s => s.studentId === studentId);
};

// Sequential registration id: SHKSC-REG-<year>-<NNN>
export const generateStudentId = (): string => {
  const students = getStudents();
  const year = new Date().getFullYear();
  const prefix = `SHKSC-REG-${year}-`;
  const existingNumbers = students
    .map(s => s.studentId)
    .filter(id => id && id.startsWith(prefix))
    .map(id => parseInt(id.replace(prefix, ''), 10))
    .filter(n => !isNaN(n));
  const next = (existingNumbers.length ? Math.max(...existingNumbers) : 0) + 1;
  return `${prefix}${String(next).padStart(3, '0')}`;
};

export const addStudent = (student: Student): Student => {
  const students = getStudents();
  const withId = { ...student, studentId: student.studentId || generateStudentId() };
  students.push(withId);
  saveStudents(students);
  return withId;
};

export const updateStudent = (studentId: string, updates: Partial<Student>): void => {
  const students = getStudents();
  const index = students.findIndex(s => s.id === studentId || s.studentId === studentId);
  
  if (index !== -1) {
    students[index] = { ...students[index], ...updates };
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
    triggerStateUpdate();
  }
};
