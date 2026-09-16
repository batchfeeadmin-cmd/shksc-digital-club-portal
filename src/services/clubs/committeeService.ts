import { triggerStateUpdate } from '../base';

const COMMITTEE_STORAGE_KEY = 'shksc_committee_v1';

export interface CommitteeMember {
  id: string;
  clubId: string;
  studentId: string;
  roleName: string;
  assignedAt: string;
}

export const getCommitteeMembers = (): CommitteeMember[] => {
  const saved = localStorage.getItem(COMMITTEE_STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
};

export const saveCommitteeMembers = (members: CommitteeMember[]): void => {
  localStorage.setItem(COMMITTEE_STORAGE_KEY, JSON.stringify(members));
  triggerStateUpdate();
};

export const getCommitteeByClub = (clubId: string): CommitteeMember[] => {
  return getCommitteeMembers().filter(m => m.clubId === clubId);
};

export const assignCommitteeRole = (clubId: string, studentId: string, roleName: string): CommitteeMember => {
  const members = getCommitteeMembers();
  
  // Remove existing role for this student in this club if any
  const filtered = members.filter(m => !(m.clubId === clubId && m.studentId === studentId));
  
  const newMember: CommitteeMember = {
    id: `com-${Date.now()}`,
    clubId,
    studentId,
    roleName,
    assignedAt: new Date().toISOString()
  };
  
  filtered.push(newMember);
  saveCommitteeMembers(filtered);
  return newMember;
};

export const removeCommitteeRole = (id: string): void => {
  const members = getCommitteeMembers().filter(m => m.id !== id);
  saveCommitteeMembers(members);
};
