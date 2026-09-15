import { User, UserAccount } from '../../types';
import { triggerStateUpdate } from '../base';

const USERS_STORAGE_KEY = 'shksc_users';

const seedUsers: UserAccount[] = [
  {
    id: 'u-root',
    name: 'Root Administrator',
    email: 'admin@shksc.edu',
    password: 'admin123',
    role: 'root_admin',
    designation: 'Super Admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 'u-science',
    name: 'Science Club Admin',
    email: 'science@shksc.edu',
    password: 'club123',
    role: 'club_admin',
    clubId: 'c3',
    designation: 'Club Moderator',
    mobile: '01711-000000',
    createdAt: new Date().toISOString()
  },
  {
    id: 'u-student',
    name: 'Rahim Ahmed',
    email: 'student@shksc.edu',
    password: 'student123',
    role: 'student',
    clubId: 'c3',
    className: '10',
    createdAt: new Date().toISOString()
  }
];

export const getAllUsers = (): UserAccount[] => {
  const saved = localStorage.getItem(USERS_STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    // Legacy migration: old prototype used 'science-club' as club id
    let changed = false;
    parsed.forEach((u: UserAccount) => {
      if (u.clubId === 'science-club') {
        u.clubId = 'c3';
        changed = true;
      }
    });
    if (changed) localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(parsed));
    return parsed;
  }

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seedUsers));
  return seedUsers;
};

export const saveUsers = (users: UserAccount[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  triggerStateUpdate();
};

export const getUserById = (id: string): UserAccount | undefined => {
  return getAllUsers().find(u => u.id === id);
};

export const getUserByEmail = (email: string): UserAccount | undefined => {
  return getAllUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const getClubAdmins = (): UserAccount[] => {
  return getAllUsers().filter(u => u.role === 'club_admin');
};

export const createUser = (user: UserAccount): void => {
  const users = getAllUsers();
  users.push({ ...user, createdAt: new Date().toISOString() });
  saveUsers(users);
};

export const updateUser = (id: string, updates: Partial<UserAccount>): void => {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
  }
};

export const deleteUser = (id: string): void => {
  const users = getAllUsers().filter(u => u.id !== id);
  saveUsers(users);
};

// Strip password/private fields before exposing a user to the app session
export const toPublicUser = (account: UserAccount): User => {
  const { password, designation, mobile, createdAt, ...publicUser } = account;
  return publicUser;
};

// Authenticate against stored accounts
export const authenticate = (email: string, password: string): User => {
  const account = getUserByEmail(email);
  if (!account || account.password !== password) {
    throw new Error('Invalid email or password');
  }
  return toPublicUser(account);
};
