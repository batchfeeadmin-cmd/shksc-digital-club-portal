import { Club, RegistrationState } from '../../types';
import { clubsData as initialClubsData } from '../../data/mockData';
import { triggerStateUpdate } from '../base';

const CLUBS_STORAGE_KEY = 'shksc_clubs_data_v3';
const REG_STATE_KEY = 'shksc_reg_state';

const initialRegState: RegistrationState = {
  isOpen: true,
  year: '2026',
  startDate: '2026-01-01',
  closingDate: '2026-12-31',
  message: 'Club Registration is now open. Apply before the deadline.'
};

export const getClubs = (): Club[] => {
  const saved = localStorage.getItem(CLUBS_STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  
  localStorage.setItem(CLUBS_STORAGE_KEY, JSON.stringify(initialClubsData));
  return initialClubsData as Club[];
};

export const updateClub = (updatedClub: Club): void => {
  const clubs = getClubs();
  const index = clubs.findIndex(c => c.id === updatedClub.id);
  if (index !== -1) {
    clubs[index] = updatedClub;
    localStorage.setItem(CLUBS_STORAGE_KEY, JSON.stringify(clubs));
    triggerStateUpdate();
  }
};

export const saveClubs = (clubs: Club[]): void => {
  localStorage.setItem(CLUBS_STORAGE_KEY, JSON.stringify(clubs));
  triggerStateUpdate();
}

export const getRegistrationState = (): RegistrationState => {
  const saved = localStorage.getItem(REG_STATE_KEY);
  if (saved) return JSON.parse(saved);
  
  localStorage.setItem(REG_STATE_KEY, JSON.stringify(initialRegState));
  return initialRegState;
};

export const updateRegistrationState = (state: RegistrationState): void => {
  localStorage.setItem(REG_STATE_KEY, JSON.stringify(state));
  triggerStateUpdate();
};
