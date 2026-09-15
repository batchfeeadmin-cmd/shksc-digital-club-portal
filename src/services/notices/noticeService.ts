import { triggerStateUpdate } from '../base';

const NOTICES_STORAGE_KEY = 'shksc_notices';

export interface Notice {
  id: string;
  clubId: string;
  title: string;
  message: string;
  date: string;
}

const seedNotices: Notice[] = [
  {
    id: 'nt-1',
    clubId: 'c3',
    title: 'First Club Meeting',
    message: 'সব সদস্যদের আগামী সপ্তাহে প্রথম ক্লাব মিটিংয়ে উপস্থিত থাকার অনুরোধ করা হলো।',
    date: new Date().toISOString()
  },
  {
    id: 'nt-2',
    clubId: 'c3',
    title: 'Project Submission Deadline',
    message: 'প্রজেক্ট জমা দেওয়ার শেষ তারিখ ঘোষণা করা হবে। সবাই প্রস্তুত থাকো।',
    date: new Date().toISOString()
  }
];

export const getNotices = (): Notice[] => {
  const saved = localStorage.getItem(NOTICES_STORAGE_KEY);
  if (saved) return JSON.parse(saved);

  localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(seedNotices));
  return seedNotices;
};

export const saveNotices = (notices: Notice[]): void => {
  localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(notices));
  triggerStateUpdate();
};

export const addNotice = (notice: Notice): void => {
  const notices = getNotices();
  notices.push(notice);
  saveNotices(notices);
};

export const deleteNotice = (id: string): void => {
  const notices = getNotices().filter(n => n.id !== id);
  saveNotices(notices);
};

export const getNoticesByClub = (clubId: string): Notice[] =>
  getNotices()
    .filter(n => n.clubId === clubId)
    .reverse();
