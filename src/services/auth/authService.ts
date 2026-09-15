import { User } from '../../types';

const AUTH_STORAGE_KEY = 'shksc_auth_user';

export const getLoggedInUser = (): User | null => {
  const saved = localStorage.getItem(AUTH_STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const setLoggedInUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};
