import { Student } from '../../types';
import { triggerStateUpdate } from '../base';

const STUDENTS_STORAGE_KEY = 'shksc_students_data_v3';

const initialStudents: Student[] = [
  {
    id: '1',
    studentId: 'SHKSC-REG-2026-001',
    schoolStudentId: 'SHKSC-2026-001',
    name: 'Arafat Rahman',
    class: '10',
    section: 'A',
    roll: '12',
    mobile: '01711-123456',
    email: 'student@shksc.edu',
    clubId: 'c3',
    registrationStatus: 'Confirmed',
    receiptTxnId: 'TXN-SHKSC-001'
  },
  {
    id: '2',
    studentId: 'SHKSC-REG-2026-002',
    name: 'Nusrat Jahan Faria',
    class: '9',
    roll: '45',
    mobile: '01819-654321',
    email: 'nusrat.faria@shksc.edu.bd',
    clubId: 'c1',
    registrationStatus: 'Confirmed',
    receiptTxnId: 'TXN-SHKSC-002'
  },
  {
    id: '3',
    studentId: 'SHKSC-REG-2026-003',
    name: 'Tahmid Hasan Siam',
    class: '8',
    roll: '05',
    mobile: '01911-789012',
    email: 'tahmid.siam@shksc.edu.bd',
    clubId: 'c2',
    registrationStatus: 'Confirmed',
    receiptTxnId: 'TXN-SHKSC-003'
  },
  {
    id: '4',
    studentId: 'SHKSC-REG-2026-004',
    name: 'Sumaiya Akhter',
    class: '10',
    roll: '21',
    mobile: '01611-345678',
    email: 'sumaiya.akhter@shksc.edu.bd',
    clubId: 'c4',
    registrationStatus: 'Confirmed',
    receiptTxnId: 'TXN-SHKSC-004'
  },
  {
    id: '5',
    studentId: 'SHKSC-REG-2026-005',
    name: 'Tanvir Ahmed Joy',
    class: '7',
    roll: '55',
    mobile: '01511-901234',
    email: 'tanvir.joy@shksc.edu.bd',
    clubId: 'c5',
    registrationStatus: 'Confirmed',
    receiptTxnId: 'TXN-SHKSC-005'
  },
  {
    id: '6',
    studentId: 'SHKSC-REG-2026-006',
    name: 'Mehedi Hasan',
    class: '6',
    roll: '102',
    mobile: '01722-234567',
    email: 'mehedi.hasan@shksc.edu.bd',
    clubId: 'c3',
    registrationStatus: 'Pending Payment',
  },
  {
    id: '7',
    studentId: 'SHKSC-REG-2026-007',
    name: 'Jannatul Ferdous',
    class: '9',
    roll: '18',
    mobile: '01833-345678',
    email: 'jannatul.ferdous@shksc.edu.bd',
    clubId: 'c6',
    registrationStatus: 'Confirmed',
    receiptTxnId: 'TXN-SHKSC-007'
  },
  {
    id: '8',
    studentId: 'SHKSC-REG-2026-008',
    name: 'Rakibul Islam',
    class: '10',
    roll: '03',
    mobile: '01944-456789',
    email: 'rakibul.islam@shksc.edu.bd',
    clubId: 'c1',
    registrationStatus: 'Confirmed',
    receiptTxnId: 'TXN-SHKSC-008'
  },
  {
    id: '9',
    studentId: 'SHKSC-REG-2026-009',
    name: 'Farzana Yesmin',
    class: '8',
    roll: '32',
    mobile: '01655-567890',
    email: 'farzana.yesmin@shksc.edu.bd',
    clubId: 'c7',
    registrationStatus: 'Confirmed',
    receiptTxnId: 'TXN-SHKSC-009'
  },
  {
    id: '10',
    studentId: 'SHKSC-REG-2026-010',
    name: 'Ashiqur Rahman',
    class: '7',
    roll: '14',
    mobile: '01566-678901',
    email: 'ashiqur.rahman@shksc.edu.bd',
    clubId: 'c8',
    registrationStatus: 'Pending Payment',
  }
];

export const getStudents = (): Student[] => {
  const saved = localStorage.getItem(STUDENTS_STORAGE_KEY);
  if (saved) {
    const parsed: Student[] = JSON.parse(saved);
    // Legacy migration: old prototype used 'science-club' as club id
    let changed = false;
    parsed.forEach((s: Student) => {
      if (s.clubId === 'science-club') {
        s.clubId = 'c3';
        changed = true;
      }

      // Keep the original seeded student connected to the demo login account.
      if (
        s.id === '1' &&
        s.studentId === 'SHKSC-REG-2026-001' &&
        s.email === 'arafat.rahman@shksc.edu.bd'
      ) {
        s.email = 'student@shksc.edu';
        changed = true;
      }

      if (
        s.id === '1' &&
        s.studentId === 'SHKSC-REG-2026-001' &&
        !s.schoolStudentId
      ) {
        s.schoolStudentId = 'SHKSC-2026-001';
        s.section = s.section || 'A';
        changed = true;
      }
    });
    if (changed) localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(parsed));
    return parsed;
  }
  
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(initialStudents));
  return initialStudents;
};

export const getStudentsByClub = (clubId: string): Student[] => {
  return getStudents().filter(s => s.clubId === clubId);
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

export const promoteAllStudents = (): void => {
  const students = getStudents();
  
  const promotedStudents = students.map(student => {
    let newClass = student.class;
    
    // Attempt to increment numerical classes
    const classNum = parseInt(student.class, 10);
    if (!isNaN(classNum)) {
      if (classNum >= 12) {
        newClass = 'Alumni';
      } else {
        newClass = (classNum + 1).toString();
      }
    } else if (student.class === 'SSC') {
      newClass = '11';
    } else if (student.class === 'HSC') {
      newClass = 'Alumni';
    }
    
    return {
      ...student,
      class: newClass,
      clubId: '', // Reset club membership so they have to re-register
      registrationStatus: 'Pending Payment' as const,
      receiptTxnId: undefined
    };
  });
  
  saveStudents(promotedStudents);
};

export const purgePendingRegistrations = (): void => {
  const students = getStudents();
  const activeStudents = students.filter(s => s.registrationStatus === 'Confirmed');
  saveStudents(activeStudents);
};
