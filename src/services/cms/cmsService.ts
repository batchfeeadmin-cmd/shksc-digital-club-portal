import { triggerStateUpdate } from '../base';

const CMS_STORAGE_KEY = 'shksc_cms_data';

export interface GlobalNotice {
  id: number;
  title: string;
  date: string;
  content: string;
  isNew: boolean;
}

export interface AuthorityMessage {
  id: string;
  name: string;
  title: string;
  quote: string;
  image: string;
}

export interface CMSData {
  hero: {
    headline: string;
    subHeadline: string;
  };
  messages: AuthorityMessage[];
  notices: GlobalNotice[];
}

const defaultCMSData: CMSData = {
  hero: {
    headline: 'Welcome to the SHKSC Digital Club Portal',
    subHeadline: 'Explore, engage, and excel with our vibrant community of student clubs. Discover your passion beyond the classroom.'
  },
  messages: [
    {
      id: 'chairman',
      name: 'Honorable Chairman',
      title: 'SHKSC GOVERNING BODY',
      quote: "Education is not just about academic excellence, but also about building character, creativity, and leadership. Our digital club portal is a stepping stone for students to explore their hidden talents and prepare for a brilliant future. I strongly encourage every student to participate actively.",
      image: '/chairman.jpg'
    },
    {
      id: 'principal',
      name: 'Respected Principal',
      title: 'SHKSC PRINCIPAL',
      quote: "The diverse clubs at SHKSC offer a fantastic platform for students to grow beyond the classroom. By engaging in these extracurricular activities, students build teamwork, discipline, and lifelong skills. We are proud to launch this digital portal to make club activities more accessible.",
      image: '/principle.jpg'
    }
  ],
  notices: [
    {
      id: 1,
      title: 'Club Registration Open',
      date: 'Sep 15, 2026',
      content: 'Registration for all clubs for the 2026-27 academic year is now open. Please register before the deadline.',
      isNew: true
    },
    {
      id: 2,
      title: 'Science Fair 2026',
      date: 'Sep 20, 2026',
      content: 'The annual science fair will be held on October 10th. Submit your project proposals to the Science Club president.',
      isNew: true
    },
    {
      id: 3,
      title: 'Monthly Subscription Fee',
      date: 'Sep 10, 2026',
      content: 'Please clear your monthly subscription dues by the 25th of this month to continue enjoying club benefits.',
      isNew: false
    }
  ]
};

export const getCMSData = (): CMSData => {
  const saved = localStorage.getItem(CMS_STORAGE_KEY);
  if (saved) {
    const data = JSON.parse(saved) as CMSData;
    const principal = data.messages.find(message => message.id === 'principal');
    if (principal?.title === 'Shaheed Police Smrity College') {
      principal.title = 'SHKSC PRINCIPAL';
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
    }
    return data;
  }
  
  localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(defaultCMSData));
  return defaultCMSData;
};

export const saveCMSData = (data: CMSData): void => {
  localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
  triggerStateUpdate();
};

export const updateGlobalNotices = (notices: GlobalNotice[]): void => {
  const data = getCMSData();
  data.notices = notices;
  saveCMSData(data);
};

export const updateHeroData = (hero: CMSData['hero']): void => {
  const data = getCMSData();
  data.hero = hero;
  saveCMSData(data);
};

export const updateAuthorityMessages = (messages: AuthorityMessage[]): void => {
  const data = getCMSData();
  data.messages = messages;
  saveCMSData(data);
};
