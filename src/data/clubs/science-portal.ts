import type { LucideIcon } from 'lucide-react';
import {
  CalendarDays, Trophy, GraduationCap, Globe2,
  FlaskConical, Rocket, Bot, Calculator, Brain, Code2, BookOpen, Lightbulb, Users,
  Microscope, Globe, Cpu
} from 'lucide-react';

// ============ QUICK STATS ============

export interface ScienceStat {
  label: string;
  value: string;
  countUp?: boolean;
  end?: number;
  suffix?: string;
  icon: LucideIcon;
}

export const scienceQuickStats: ScienceStat[] = [
  { label: 'Established', value: '2013', countUp: true, end: 2013, icon: CalendarDays },
  { label: 'Awards & Achievements', value: '100+', countUp: true, end: 100, suffix: '+', icon: Trophy },
  { label: 'Students', value: 'Class 06–10', icon: GraduationCap },
  { label: 'Reach', value: 'National & International', icon: Globe2 }
];

// ============ WHAT WE DO ============

export interface ScienceActivity {
  icon: LucideIcon;
  title: string;
  titleBn: string;
  description: string;
}

export const scienceActivities: ScienceActivity[] = [
  { icon: FlaskConical, title: 'Science Experiments', titleBn: 'বৈজ্ঞানিক পরীক্ষা', description: 'হাতে-কলমে বৈজ্ঞানিক পরীক্ষা ও observation' },
  { icon: Rocket, title: 'Science Projects', titleBn: 'প্রজেক্ট ও প্রোটোটাইপ', description: 'শিক্ষার্থীদের নিজস্ব project ও prototype development' },
  { icon: Bot, title: 'Robotics', titleBn: 'রোবোটিক্স', description: 'Robotics, electronics ও automation-based projects' },
  { icon: Calculator, title: 'Olympiad Preparation', titleBn: 'অলিম্পিয়াড প্রস্তুতি', description: 'Science ও Mathematics Olympiad preparation' },
  { icon: Brain, title: 'Science Quiz', titleBn: 'কুইজ লিগ', description: 'Quiz League এবং knowledge competition' },
  { icon: Code2, title: 'Programming', titleBn: 'প্রোগ্রামিং', description: 'Basic programming ও computational thinking' },
  { icon: Trophy, title: 'Science Fairs', titleBn: 'বিজ্ঞান মেলা', description: 'Inter-school ও national science carnival' },
  { icon: BookOpen, title: 'Workshops', titleBn: 'ওয়ার্কশপ', description: 'বিজ্ঞান, প্রযুক্তি ও গবেষণাভিত্তিক workshop' },
  { icon: Lightbulb, title: 'Innovation Challenge', titleBn: 'ইনোভেশন চ্যালেঞ্জ', description: 'বাস্তব সমস্যা সমাধানভিত্তিক idea ও innovation' },
  { icon: Users, title: 'Team Collaboration', titleBn: 'টিম ওয়ার্ক', description: 'Group project, discussion ও peer learning' }
];

// ============ FEATURED ACHIEVEMENT (WRO 2025) ============

export const scienceFeatured = {
  badge: 'World Robot Olympiad 2025',
  emoji: '🌏',
  title: 'From SHKSC to the Global Stage',
  description:
    'SHKSC Science Club members earned the opportunity to represent Bangladesh in the “Future Innovators” category of the Pico Robotics World Robot Olympiad 2025 in Manila, Philippines.',
  location: 'Manila, Philippines',
  year: '2025',
  link: 'https://shksc.edu.bd',
  image: '/assets/science-club/award-stage.jpg'
};

// ============ LEGACY OF EXCELLENCE ============

export interface ScienceAchievement {
  year: number;
  event: string;
  result: string;
  tier: 'National' | 'International';
}

export const scienceLegacy: ScienceAchievement[] = [
  { year: 2020, event: 'Iranian Geometry Olympiad', result: 'Achievement by S. M. A. Nahian', tier: 'International' },
  { year: 2021, event: 'Bangladesh Junior Science Olympiad', result: 'Champion — S. M. A. Nahian', tier: 'National' },
  { year: 2021, event: 'National Mathematics Olympiad', result: 'Champion of the Champions — S. M. A. Nahian', tier: 'National' },
  { year: 2022, event: 'National Mathematics Festival', result: 'Secondary Category Achievement', tier: 'National' },
  { year: 2022, event: '63rd International Mathematical Olympiad', result: 'Honourable Mention', tier: 'International' },
  { year: 2022, event: 'Asian Pacific Mathematics Olympiad', result: 'Silver Medal', tier: 'International' }
];

// ============ COMPETITION ARCHIVE (year filter) ============

export interface ScienceArchiveItem {
  year: number;
  tier: 'National' | 'International';
  name: string;
}

export const scienceArchive: ScienceArchiveItem[] = [
  { year: 2020, tier: 'National', name: '1st MSS Online IT Fair 2020' },
  { year: 2020, tier: 'National', name: 'Epistolary: The Quarantine Games' },
  { year: 2020, tier: 'National', name: 'USC Presents Online Science Carnival 2.0' },
  { year: 2020, tier: 'National', name: 'DCSC Deus Ex-Machina 1.0' },
  { year: 2020, tier: 'National', name: 'SPSB Online Quiz' },
  { year: 2020, tier: 'National', name: 'Laboratorians’ Quarantine Mathematics Festival' },
  { year: 2020, tier: 'National', name: 'BSCA Presents Splendour 1.0' },
  { year: 2020, tier: 'National', name: '2nd National Science Carnival 2020' },
  { year: 2020, tier: 'National', name: '7th DCSC National Science Exposition 2020' },
  { year: 2020, tier: 'National', name: '13th DRMC-Evaly National Science Carnival 2020' },
  { year: 2020, tier: 'International', name: 'Iranian Geometry Olympiad' },
  { year: 2021, tier: 'National', name: '3rd National Science Carnival 2021' },
  { year: 2021, tier: 'National', name: '4th BAF Shaheen College Dhaka Science Festival 2021' },
  { year: 2021, tier: 'National', name: '1st RNEC Nature Fest 2021' },
  { year: 2021, tier: 'National', name: 'Notre Dame Annual Science Festival 2021' },
  { year: 2022, tier: 'International', name: '63rd International Mathematical Olympiad — Honourable Mention' },
  { year: 2022, tier: 'International', name: 'Asian Pacific Mathematics Olympiad — Silver Medal' },
  { year: 2025, tier: 'International', name: 'Pico Robotics World Robot Olympiad 2025 — Future Innovators, Manila' }
];

export const scienceArchiveFilters = ['All', '2020', '2021', '2022', '2023', '2024', '2025', 'International'];

// ============ PROGRAMS ============

export interface ScienceProgram {
  icon: LucideIcon;
  title: string;
  description: string;
  tag: string;
}

export const sciencePrograms: ScienceProgram[] = [
  { icon: Microscope, title: 'Science Olympiad Program', description: 'Science ও scientific reasoning preparation।', tag: 'Olympiad' },
  { icon: Calculator, title: 'Mathematics Olympiad Program', description: 'Problem solving, mathematical reasoning ও competition preparation।', tag: 'Olympiad' },
  { icon: Bot, title: 'Robotics & Innovation', description: 'Robotics, electronics, sensors, automation ও prototype development।', tag: 'Technology' },
  { icon: FlaskConical, title: 'Science Project Lab', description: 'Idea → Research → Prototype → Presentation — সম্পূর্ণ journey।', tag: 'Hands-on' },
  { icon: Brain, title: 'Quiz & Knowledge Program', description: 'Science quiz, general science, technology ও current innovation।', tag: 'Competition' },
  { icon: Code2, title: 'Programming Program', description: 'Basic programming, algorithmic thinking ও technology education।', tag: 'Technology' }
];

export const scienceProgramArchive = 'Basic C Learning — Online Learning Program (Archive)';

// ============ JOURNEY TIMELINE ============

export interface ScienceJourneyItem {
  year: string;
  title: string;
  description: string;
  highlight?: boolean;
}

export const scienceJourney: ScienceJourneyItem[] = [
  { year: '2013', title: 'Science Club Established', description: 'বিজ্ঞানমনস্ক শিক্ষার্থীদের জন্য SHKSC Science Club-এর যাত্রা শুরু।' },
  { year: '2020', title: 'Online Carnivals & National Competitions', description: 'Online Science Carnival, Quiz ও জাতীয় প্রতিযোগিতায় ধারাবাহিক সাফল্য।' },
  { year: '2021', title: 'Major Olympiad Achievements', description: 'Bangladesh Junior Science Olympiad ও National Mathematics Olympiad-এ চ্যাম্পিয়ন।' },
  { year: '2022', title: 'IMO Honourable Mention & APMO Silver', description: 'আন্তর্জাতিক গণিত অলিম্পিয়াডে বাংলাদেশের প্রতিনিধিত্ব ও সম্মানজনক সাফল্য।' },
  { year: '2025', title: 'World Robot Olympiad — Global Stage', description: 'Future Innovators category-তে ফিলিপাইনের Manila-তে বাংলাদেশের প্রতিনিধিত্বের সুযোগ।', highlight: true },
  { year: 'Future', title: 'Research • Robotics • Innovation', description: 'Global Excellence-এর দিকে অব্যাহত অগ্রযাত্রা।' }
];

// ============ GALLERY ============

export type ScienceGalleryCategory = 'All' | 'Science Fair' | 'Olympiad' | 'Awards' | 'Club Activities' | 'Club Identity';

export interface ScienceGalleryItem {
  image: string;
  caption: string;
  category: Exclude<ScienceGalleryCategory, 'All'>;
}

export const scienceGalleryFilters: ScienceGalleryCategory[] = ['All', 'Science Fair', 'Olympiad', 'Awards', 'Club Activities', 'Club Identity'];

export const scienceGallery: ScienceGalleryItem[] = [
  { image: '/assets/science-club/lab.jpg', caption: 'হাতে-কলমে ল্যাব এক্সপেরিমেন্ট — কৌতূহল থেকেই শুরু', category: 'Science Fair' },
  { image: '/assets/science-club/award-group.jpg', caption: 'Certificates & trophies — ক্লাব সদস্যদের অর্জন', category: 'Awards' },
  { image: '/assets/science-club/class.jpg', caption: 'Club session — প্রশ্ন, আলোচনা ও শেখার আয়োজন', category: 'Club Activities' },
  { image: '/assets/science-club/award-stage.jpg', caption: 'National stage-এ পুরস্কার গ্রহণ', category: 'Olympiad' },
  { image: '/assets/science-club/award-plaque.jpg', caption: 'Award ceremony — সম্মাননা গ্রহণের মুহূর্ত', category: 'Awards' },
  { image: '/assets/science-club/logo.jpg', caption: 'Official Club Logo — ESTD 2013', category: 'Club Identity' }
];

// ============ PROJECT SHOWCASE ============

export interface ScienceProject {
  name: string;
  category: string;
  team: string;
  year: number;
  description: string;
  technologies: string[];
  award: string;
}

export const scienceProjects: ScienceProject[] = [
  {
    name: 'Future Innovators — WRO 2025',
    category: 'Robotics',
    team: 'SHKSC Science Club Team',
    year: 2025,
    description:
      'বাংলাদেশ থেকে নির্বাচিত হয়ে Pico Robotics World Robot Olympiad 2025-এর “Future Innovators” category-তে ফিলিপাইনের Manila-তে বৈশ্বিক ফাইনালে প্রতিনিধিত্বের সুযোগ অর্জন।',
    technologies: ['Robotics', 'Automation', 'Innovation Design'],
    award: 'Global Finalist Opportunity — Manila, Philippines'
  }
];

// ============ STUDENT SPOTLIGHT ============

export const scienceSpotlight = {
  name: 'S. M. A. Nahian',
  nameBn: 'এস. এম. এ. নাহিয়ান',
  title: 'Champion of the Champions',
  quote: '“Science taught me not just to find answers, but to ask better questions.”',
  highlights: [
    { year: 2020, text: 'Iranian Geometry Olympiad — Achievement' },
    { year: 2021, text: 'Bangladesh Junior Science Olympiad — Champion' },
    { year: 2021, text: 'National Mathematics Olympiad — Champion of the Champions' },
    { year: 2022, text: '63rd International Mathematical Olympiad — Honourable Mention' },
    { year: 2022, text: 'Asian Pacific Mathematics Olympiad — Silver' }
  ]
};

// ============ LEADERSHIP ============

export interface ScienceLeader {
  role: string;
  name: string;
  confirmed: boolean;
}

export const scienceLeaders: ScienceLeader[] = [
  { role: 'President', name: 'মোঃ মাহবুবুর রহমান মোল্লা', confirmed: true },
  { role: 'General Secretary', name: 'মোঃ বদরুল আলম', confirmed: true }
];

export const scienceCommitteeRoles = [
  'Faculty Advisors',
  'Club Coordinators',
  'Student President',
  'Student Vice-President',
  'Joint Secretary',
  'Olympiad Coordinator',
  'Robotics Coordinator',
  'Event Coordinator',
  'Media & Publication Team'
];

// ============ WHY JOIN ============

export interface ScienceWhyJoin {
  icon: LucideIcon;
  title: string;
  titleBn: string;
  description: string;
}

export const scienceWhyJoin: ScienceWhyJoin[] = [
  { icon: Microscope, title: 'Explore Science', titleBn: 'বিজ্ঞানকে জানো', description: 'ক্লাসের বইয়ের বাইরের বিজ্ঞান জানো।' },
  { icon: Rocket, title: 'Build Projects', titleBn: 'প্রজেক্ট বানাও', description: 'নিজের idea-কে বাস্তব project-এ রূপ দাও।' },
  { icon: Trophy, title: 'Compete & Achieve', titleBn: 'প্রতিযোগিতা ও অর্জন', description: 'জাতীয় ও আন্তর্জাতিক competition-এ অংশগ্রহণ করো।' },
  { icon: Users, title: 'Work as a Team', titleBn: 'টিম হিসেবে কাজ', description: 'Teamwork ও leadership skill তৈরি করো।' },
  { icon: Lightbulb, title: 'Think Differently', titleBn: 'ভিন্নভাবে ভাবো', description: 'Problem solving ও creative thinking উন্নত করো।' }
];

// ============ MEMBERSHIP ============

export const scienceMembershipFields = [
  'Student Name',
  'Class',
  'Section',
  'Roll',
  'Version',
  'Interested Area',
  'Phone / Guardian Contact',
  'Why do you want to join?'
];

export const scienceMembershipInterests = [
  'Science',
  'Mathematics',
  'Robotics',
  'Programming',
  'Research',
  'Quiz',
  'Project Development',
  'Event Management'
];

// ============ NEWS & EVENTS ============

export interface ScienceEvent {
  icon: LucideIcon;
  title: string;
  note: string;
}

export const scienceUpcomingEvents: ScienceEvent[] = [
  { icon: Microscope, title: 'Science Olympiad Preparation', note: 'Dates to be announced' },
  { icon: FlaskConical, title: 'Science Project Exhibition', note: 'Dates to be announced' },
  { icon: Bot, title: 'Robotics Workshop', note: 'Dates to be announced' },
  { icon: Brain, title: 'Science Quiz Competition', note: 'Dates to be announced' },
  { icon: Code2, title: 'Programming Workshop', note: 'Dates to be announced' }
];

export interface ScienceNews {
  title: string;
  date: string;
  description: string;
  link?: string;
}

export const scienceNews: ScienceNews[] = [
  {
    title: 'World Robot Olympiad 2025',
    date: 'July 2025',
    description:
      'Science Club members qualified to represent Bangladesh in the “Future Innovators” category in Manila, Philippines.',
    link: 'https://shksc.edu.bd'
  },
  { title: 'Recent Competition Results', date: 'Upcoming', description: 'সাম্প্রতিক প্রতিযোগিতার ফলাফল শীঘ্রই প্রকাশিত হবে।' },
  { title: 'Member Achievements', date: 'Upcoming', description: 'ক্লাব সদস্যদের নতুন অর্জনের খবর আসছে।' },
  { title: 'Workshop Updates', date: 'Upcoming', description: 'নতুন ওয়ার্কশপের সময়সূচি ঘোষণা করা হবে।' },
  { title: 'Award Ceremony', date: 'Upcoming', description: 'বার্ষিক সম্মাননা অনুষ্ঠানের আয়োজন প্রক্রিয়াধীন।' }
];

// ============ COUNTER SECTION ============

export interface ScienceCounter {
  end: number;
  suffix: string;
  label: string;
}

export const scienceCounters: ScienceCounter[] = [
  { end: 100, suffix: '+', label: 'Awards & Recognitions' },
  { end: 10, suffix: '+ Years', label: 'Of Scientific Excellence' }
];

export const scienceCounterBadges = [
  { icon: Globe, label: 'National', sub: 'Competitions' },
  { icon: Cpu, label: 'International', sub: 'Olympiads & Events' }
];
