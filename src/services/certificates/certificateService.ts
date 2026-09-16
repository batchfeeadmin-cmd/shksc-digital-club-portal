import { triggerStateUpdate } from '../base';

const CERTIFICATE_STORAGE_KEY = 'shksc_certificates_v1';

export interface CertificateRecord {
  id: string;
  clubId: string;
  studentId: string;
  eventName: string;
  issueDate: string;
}

export const getCertificates = (): CertificateRecord[] => {
  const saved = localStorage.getItem(CERTIFICATE_STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
};

export const saveCertificates = (certs: CertificateRecord[]): void => {
  localStorage.setItem(CERTIFICATE_STORAGE_KEY, JSON.stringify(certs));
  triggerStateUpdate();
};

export const getCertificatesByClub = (clubId: string): CertificateRecord[] => {
  return getCertificates().filter(c => c.clubId === clubId);
};

export const getCertificatesByStudent = (studentId: string): CertificateRecord[] => {
  return getCertificates().filter(c => c.studentId === studentId);
};

export const issueCertificate = (clubId: string, studentId: string, eventName: string): CertificateRecord => {
  const certs = getCertificates();
  
  // Prevent duplicate certificates for the same event and student
  const existing = certs.find(c => c.studentId === studentId && c.eventName === eventName);
  if (existing) return existing;

  const newCert: CertificateRecord = {
    id: `cert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    clubId,
    studentId,
    eventName,
    issueDate: new Date().toISOString()
  };
  
  certs.push(newCert);
  saveCertificates(certs);
  return newCert;
};

export const deleteCertificate = (id: string): void => {
  const certs = getCertificates().filter(c => c.id !== id);
  saveCertificates(certs);
};
