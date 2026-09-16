import { triggerStateUpdate } from '../base';

const EVENTS_STORAGE_KEY = 'shksc_club_events_v1';

export interface ClubEvent {
  id: string;
  clubId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  maxCapacity?: number;
  rsvps: string[]; // Array of studentIds
  createdAt: string;
}

export const getEvents = (): ClubEvent[] => {
  const saved = localStorage.getItem(EVENTS_STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
};

export const saveEvents = (events: ClubEvent[]): void => {
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  triggerStateUpdate();
};

export const getEventsByClub = (clubId: string): ClubEvent[] => {
  return getEvents().filter(e => e.clubId === clubId);
};

export const createEvent = (event: Omit<ClubEvent, 'id' | 'rsvps' | 'createdAt'>): ClubEvent => {
  const events = getEvents();
  const newEvent: ClubEvent = {
    ...event,
    id: `evt-${Date.now()}`,
    rsvps: [],
    createdAt: new Date().toISOString()
  };
  events.push(newEvent);
  saveEvents(events);
  return newEvent;
};

export const deleteEvent = (id: string): void => {
  const events = getEvents().filter(e => e.id !== id);
  saveEvents(events);
};

export const rsvpForEvent = (eventId: string, studentId: string): void => {
  const events = getEvents();
  const event = events.find(e => e.id === eventId);
  if (event && !event.rsvps.includes(studentId)) {
    event.rsvps.push(studentId);
    saveEvents(events);
  }
};

export const cancelRsvp = (eventId: string, studentId: string): void => {
  const events = getEvents();
  const event = events.find(e => e.id === eventId);
  if (event) {
    event.rsvps = event.rsvps.filter(id => id !== studentId);
    saveEvents(events);
  }
};
