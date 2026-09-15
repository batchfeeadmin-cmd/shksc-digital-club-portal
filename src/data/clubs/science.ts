import type { Club } from '../../types';

export const scienceClub: Club = {
  id: 'c3',
  name: 'SHKSC Science Club',
  slug: 'science',
  shortDescription:
    'Established in 2013, the SHKSC Science Club has earned 100+ awards — from national olympiads and carnivals to the World Robot Olympiad global stage.',
  fullDescription:
    'সামসুল হক খান স্কুল অ্যান্ড কলেজ বিজ্ঞান ক্লাব ২০১৩ সালে প্রতিষ্ঠিত হয়। শিক্ষার্থীদের বিজ্ঞান চিন্তার বিকাশ, বৈজ্ঞানিক অনুসন্ধান, উদ্ভাবন, আবিষ্কার ও গবেষণার প্রতি আগ্রহ সৃষ্টি করাই ক্লাবটির অন্যতম প্রধান উদ্দেশ্য। দেশ ও দেশের বাইরের বিজ্ঞান, প্রযুক্তি ও গবেষণার অগ্রগতির সঙ্গে শিক্ষার্থীদের পরিচিত করার পাশাপাশি বিভিন্ন বিজ্ঞান অলিম্পিয়াড, বিজ্ঞান মেলা, কুইজ, প্রজেক্ট, গবেষণাধর্মী কার্যক্রম ও প্রতিযোগিতায় অংশগ্রহণের জন্য শিক্ষার্থীদের উৎসাহিত করা হয়। প্রতিষ্ঠার পর থেকে ক্লাবের সদস্যরা বিভিন্ন জাতীয় ও আন্তর্জাতিক প্রতিযোগিতায় উল্লেখযোগ্য সাফল্য অর্জন করেছে এবং একশতেরও বেশি পুরস্কার অর্জন করেছে।',
  mission:
    'শিক্ষার্থীদের মধ্যে বৈজ্ঞানিক চিন্তা ও problem-solving skill তৈরি করা; হাতে-কলমে experiment ও project-এর মাধ্যমে শেখার সুযোগ সৃষ্টি করা; Science, Mathematics, Robotics ও Technology বিষয়ে আগ্রহ বাড়ানো; জাতীয় ও আন্তর্জাতিক Olympiad ও competition-এর জন্য শিক্ষার্থীদের প্রস্তুত করা; এবং teamwork, research, leadership ও innovation culture গড়ে তোলা।',
  objectives: [
    'বিজ্ঞান, প্রযুক্তি ও গবেষণার প্রতি শিক্ষার্থীদের আগ্রহ সৃষ্টি করা',
    'হাতে-কলমে experiment, project ও prototype development-এ উৎসাহিত করা',
    'জাতীয় ও আন্তর্জাতিক Olympiad, Science Fair ও প্রতিযোগিতায় অংশগ্রহণ',
    'Teamwork, leadership ও research culture গড়ে তোলা',
    'Programming, Robotics ও computational thinking-এর ভিত্তি তৈরি করা'
  ],
  vision:
    'বিজ্ঞানমনস্ক, সৃজনশীল, অনুসন্ধিৎসু ও প্রযুক্তিসচেতন একটি প্রজন্ম তৈরি করা, যারা জ্ঞান ও উদ্ভাবনের মাধ্যমে দেশ ও সমাজের উন্নয়নে অবদান রাখতে সক্ষম হবে।',
  category: 'Academic',
  memberCount: 120,
  achievementCount: 100,
  history:
    '২০১৩ সালে প্রতিষ্ঠিত হওয়ার পর থেকে SHKSC Science Club ধারাবাহিকভাবে জাতীয় ও আন্তর্জাতিক পর্যায়ে সাফল্য অর্জন করে আসছে। ২০২০–২০২১ সালে অনলাইন বিজ্ঞান কার্নিভাল ও কুইজ প্রতিযোগিতায় ধারাবাহিক সাফল্যের পর ২০২২ সালে International Mathematical Olympiad-এ Honourable Mention এবং Asian Pacific Mathematics Olympiad-এ Silver অর্জন করে। ২০২৫ সালে ক্লাবের সদস্যরা Pico Robotics World Robot Olympiad-এর “Future Innovators” category-তে বাংলাদেশ থেকে ফিলিপাইনের Manila-তে অংশগ্রহণের সুযোগ অর্জন করে।',
  logo: '/assets/science-club/logo.jpg',
  coverImage: '/assets/science-club/class.jpg',
  coordinator: 'To be announced',
  president: 'মোঃ মাহবুবুর রহমান মোল্লা',
  generalSecretary: 'মোঃ বদরুল আলম',
  establishedYear: 2013,
  establishedDate: '2013',
  activities: [
    { id: 'sc-act-1', name: 'Science Experiments', description: 'হাতে-কলমে বৈজ্ঞানিক পরীক্ষা ও observation' },
    { id: 'sc-act-2', name: 'Science Projects', description: 'শিক্ষার্থীদের নিজস্ব project ও prototype development' },
    { id: 'sc-act-3', name: 'Robotics', description: 'Robotics, electronics ও automation-based projects' },
    { id: 'sc-act-4', name: 'Olympiad Preparation', description: 'Science ও Mathematics Olympiad preparation' },
    { id: 'sc-act-5', name: 'Science Quiz', description: 'Quiz League এবং knowledge competition' },
    { id: 'sc-act-6', name: 'Programming', description: 'Basic programming ও computational thinking' },
    { id: 'sc-act-7', name: 'Science Fairs', description: 'Inter-school ও national science carnival' },
    { id: 'sc-act-8', name: 'Workshops', description: 'বিজ্ঞান, প্রযুক্তি ও গবেষণাভিত্তিক workshop' },
    { id: 'sc-act-9', name: 'Innovation Challenge', description: 'বাস্তব সমস্যা সমাধানভিত্তিক idea ও innovation' },
    { id: 'sc-act-10', name: 'Team Collaboration', description: 'Group project, discussion ও peer learning' }
  ],
  gallery: [
    '/assets/science-club/lab.jpg',
    '/assets/science-club/class.jpg',
    '/assets/science-club/award-group.jpg',
    '/assets/science-club/award-plaque.jpg',
    '/assets/science-club/award-stage.jpg',
    '/assets/science-club/logo.jpg'
  ]
};
