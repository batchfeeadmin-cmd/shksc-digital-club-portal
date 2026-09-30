import { triggerStateUpdate } from '../base';

const COMMUNICATIONS_STORAGE_KEY = 'shksc_communications_v1';

export type CommunicationChannel = 'Email' | 'SMS' | 'System Alert';
export type CommunicationAudience = 'All Students' | 'Pending Payment Students' | 'Confirmed Students' | 'Club Admins' | string;

export interface CommunicationMessage {
  id: string;
  channel: CommunicationChannel;
  audience: CommunicationAudience;
  subject: string;
  body: string;
  sender: string;
  sentAt: string;
  clubId?: string;
}

export const getCommunications = (): CommunicationMessage[] => {
  const saved = localStorage.getItem(COMMUNICATIONS_STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const saveCommunications = (messages: CommunicationMessage[]): void => {
  localStorage.setItem(COMMUNICATIONS_STORAGE_KEY, JSON.stringify(messages));
  triggerStateUpdate();
};

export const sendCommunication = (
  channel: CommunicationChannel,
  audience: CommunicationAudience,
  subject: string,
  body: string,
  sender: string,
  clubId?: string
): CommunicationMessage => {
  const messages = getCommunications();
  
  const newMessage: CommunicationMessage = {
    id: `msg-${Date.now()}`,
    channel,
    audience,
    subject,
    body,
    sender,
    sentAt: new Date().toISOString(),
    clubId
  };
  
  messages.push(newMessage);
  saveCommunications(messages);
  
  return newMessage;
};

export const getSystemAlertsForStudent = (studentStatus: 'Pending' | 'Confirmed', clubId?: string): CommunicationMessage[] => {
  const messages = getCommunications();
  return messages.filter(msg => {
    if (msg.channel !== 'System Alert') return false;
    if (msg.audience === 'All Students') return true;
    if (msg.audience === 'Pending Payment Students' && studentStatus === 'Pending') return true;
    if (msg.audience === 'Confirmed Students' && studentStatus === 'Confirmed') return true;
    if (msg.clubId && clubId && msg.clubId === clubId) return true;
    return false;
  }).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
};
