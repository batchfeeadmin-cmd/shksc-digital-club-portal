import { triggerStateUpdate } from '../base';

const ACTIVITY_STORAGE_KEY = 'shksc_activity_log';

export interface ActivityEntry {
  id: string;
  actor: string;
  role: 'root_admin' | 'club_admin' | 'student';
  clubName?: string;
  action: string;
  detail?: string;
  date: string;
}

const seedActivities: ActivityEntry[] = [
  {
    id: 'act-seed-1',
    actor: 'Root Administrator',
    role: 'root_admin',
    action: 'System Initialized',
    detail: 'SHKSC Digital Club Portal activity log started',
    date: new Date().toISOString()
  }
];

export const getActivities = (): ActivityEntry[] => {
  const saved = localStorage.getItem(ACTIVITY_STORAGE_KEY);
  if (saved) return JSON.parse(saved);

  localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(seedActivities));
  return seedActivities;
};

export const saveActivities = (activities: ActivityEntry[]): void => {
  localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activities));
  triggerStateUpdate();
};

export const logActivity = (
  entry: Omit<ActivityEntry, 'id' | 'date'>
): void => {
  const activities = getActivities();
  activities.push({
    ...entry,
    id: `act-${Date.now()}`,
    date: new Date().toISOString()
  });
  saveActivities(activities);
};
