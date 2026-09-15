import type { RichClub } from '../../../types';

// ==== SHKSC SCOUT GROUP — RICH CONTENT ====
// Real info দিয়ে fill করা হয়েছে। নতুন তথ্য এলে এখানে যোগ করো।
// Example shape-এর জন্য data/clubs/rich/_template.ts দেখো।

export const scoutGroupRich: RichClub = {
  // ============ HERO QUICK STATS (6 cards) ============
  quickStats: [
    { label: 'Established', value: '18 February 2001' },
    { label: 'Registered Team', value: 'No. 380' },
    { label: 'Charter No.', value: '7631/2001' },
    { label: 'International Representation', value: '9 Countries', countUp: true, end: 9, suffix: ' Countries' },
    { label: 'Scouts & Leaders Abroad', value: '92', countUp: true, end: 92 },
    { label: 'Major Student Awards', value: '361+', countUp: true, end: 361, suffix: '+' }
  ],

  // ============ FEATURED ACHIEVEMENT ============
  featuredAchievement: {
    badge: 'National Education Week · 2017–2023',
    emoji: '🏆',
    title: '5× Best Scout Group of Bangladesh',
    description:
      'গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের শিক্ষা মন্ত্রণালয় আয়োজিত জাতীয় শিক্ষা সপ্তাহে SHKSC Scout Group দেশের শ্রেষ্ঠ Scout Group হিসেবে নির্বাচিত হওয়ার মর্যাদা অর্জন করেছে — ২০১৭, ২০১৮, ২০১৯, ২০২২ ও ২০২৩ সালে।',
    location: 'Bangladesh',
    year: '2017–2023'
  },

  // ============ A LEGACY OF EXCELLENCE ============
  achievements: [
    { year: 2023, event: 'National Education Week', result: 'Best Scout Group of Bangladesh', tier: 'National' },
    { year: 2022, event: 'National Education Week', result: 'Best Scout Group of Bangladesh', tier: 'National' },
    { year: 2019, event: 'National Education Week', result: 'Best Scout Group of Bangladesh', tier: 'National' },
    { year: 2018, event: 'National Education Week', result: 'Best Scout Group of Bangladesh', tier: 'National' },
    { year: 2017, event: 'National Education Week', result: 'Best Scout Group of Bangladesh', tier: 'National' },
    { year: 2001, event: 'Official Registration', result: 'Team No. 380 · Charter No. 7631/2001', tier: 'National' }
  ],

  // ============ OUR JOURNEY (timeline) ============
  journey: [
    {
      year: '2001',
      title: 'The Beginning',
      description:
        'প্রিন্সিপাল মো. মাহবুবুর রহমান মোল্লার উদ্যোগে শিক্ষার্থীদের মানসিক, চারিত্রিক ও সামাজিক বিকাশের জন্য প্রতিষ্ঠানে স্কাউটিং কার্যক্রম শুরু করার পরিকল্পনা গ্রহণ করা হয়। শিক্ষক জনাব মো. রমজান হোসেনকে প্রাতিষ্ঠানিক Scout Leader training-এর জন্য পাঠানো হয় এবং প্রশিক্ষণ শেষে তিনি শিক্ষার্থীদের নিয়ে প্রাথমিক Scout দল গঠনের কাজ শুরু করেন।'
    },
    {
      year: '18 February 2001',
      title: 'Official Recognition',
      description:
        'এই দিনে SHKSC Scout Group আনুষ্ঠানিকভাবে বাংলাদেশ স্কাউটস, ঢাকা মেট্রোপলিটনের Team No. 380 এবং বাংলাদেশ স্কাউটস, ঢাকা অঞ্চলের Charter No. 7631/2001 লাভ করে।',
      highlight: true
    },
    {
      year: '2011',
      title: 'President’s Scout Award Archive Begins',
      description: 'President’s Scout Award-এর ধারাবাহিক অর্জনের রেকর্ড শুরু হয়।'
    },
    {
      year: '2013',
      title: 'Shapla Cub Scout Award Milestones',
      description: 'Cub Scouting-এর সর্বোচ্চ Shapla Award-এ ধারাবাহিক সাফল্য আসতে থাকে।'
    },
    {
      year: '2015',
      title: 'National Leadership Awards',
      description: 'President Award ও National Certificate-সহ জাতীয় পর্যায়ে নেতৃত্বের স্বীকৃতি।'
    },
    {
      year: '2017–2019',
      title: 'Three Consecutive Best Scout Group Titles',
      description: 'জাতীয় শিক্ষা সপ্তাহে টানা তিন বছর দেশের শ্রেষ্ঠ Scout Group হিসেবে স্বীকৃতি।'
    },
    {
      year: '2020–2021',
      title: 'Major National Awards & Service',
      description: 'Medal of Merit, National Service Award ও COVID-19 response কার্যক্রমে উল্লেখযোগ্য অবদান।'
    },
    {
      year: '2022–2023',
      title: 'Among the Best Again',
      description: 'আবারও দেশের শ্রেষ্ঠ Scout Group-দের তালিকায় স্বীকৃতি।'
    },
    {
      year: 'Today',
      title: 'A Proud Legacy',
      description: 'শৃঙ্খলা, সেবা ও নেতৃত্বের একটি গৌরবময় ঐতিহ্য — যা প্রতিদিন এগিয়ে চলছে।',
      highlight: true
    }
  ],

  // ============ LEADERSHIP ============
  leaders: [
    { role: 'President', name: 'প্রিন্সিপাল মো. মাহবুবুর রহমান মোল্লা', confirmed: true },
    { role: 'Secretary', name: 'মো. ইসমাইল হোসেন জাবেদ', confirmed: true }
  ],

  committeeRoles: [
    'Group Scout Leader',
    'Cub Scout Leader',
    'Scout Leader',
    'Girl-in-Scout Leader',
    'Rover Scout Leader',
    'Assistant Scout Leaders',
    'Group Committee'
  ],

  // ============ OUR THREE WINGS ============
  branches: [
    { name: 'Cub Scout', level: 'Primary', focus: 'Discipline, teamwork, basic scouting' },
    { name: 'Scout', level: 'Secondary', focus: 'Leadership, service, outdoor skills' },
    { name: 'Rover Scout', level: 'Higher Secondary', focus: 'Responsibility, advanced leadership, community service' }
  ],

  // ============ INTERNATIONAL PARTICIPATION ============
  international: {
    description:
      'সামসুল হক খান স্কুল অ্যান্ড কলেজ Scout Group-এর ৯২ জন Scout ও Scout Leader বিশ্বের ৯টি দেশে বিভিন্ন Scout programme-এ Bangladesh Scouts-এর প্রতিনিধিত্ব করার গৌরব অর্জন করেছেন।',
    stats: [
      { label: 'Countries Represented', value: '9', countUp: true, end: 9 },
      { label: 'Scouts & Leaders Abroad', value: '92', countUp: true, end: 92 }
    ],
    programmes: [
      'World Scout Jamboree',
      'International Jamboree',
      'Scout Training Camps',
      'International Competitions',
      'Exchange & Leadership Programmes'
    ]
  },

  nationalParticipation: [
    { name: 'National Jamboree', type: 'National' },
    { name: 'National Rover Moot', type: 'National' },
    { name: 'National Cub Camporee', type: 'National' },
    { name: 'National COMDECA', type: 'National' },
    { name: 'Day Camp', type: 'Institutional / National' },
    { name: 'International Jamboree', type: 'International' },
    { name: 'Training Camps', type: 'National & International' }
  ],

  // ============ COMMUNITY SERVICE ============
  service: [
    { name: 'Free Blood Grouping', purpose: 'স্বাস্থ্য সচেতনতা' },
    { name: 'Cleanliness Campaign', purpose: 'পরিচ্ছন্ন পরিবেশ' },
    { name: 'Winter Clothes Distribution', purpose: 'মানবিক সহায়তা' },
    { name: 'Dengue Awareness', purpose: 'জনসচেতনতা' },
    { name: 'Child Health Awareness', purpose: 'শিশু স্বাস্থ্য' },
    { name: 'Food Distribution', purpose: 'দুর্যোগ / সংকটকালীন সহায়তা' },
    { name: 'Hand Sanitizer Distribution', purpose: 'জনস্বাস্থ্য' },
    { name: 'Mask Distribution', purpose: 'COVID-19 response' }
  ],

  // ============ MAJOR STUDENT AWARDS (361+) ============
  awardStats: [
    {
      name: 'Shapla Cub Scout Award',
      emoji: '🌿',
      total: 64,
      note: 'Cub Scouting-এর সর্বোচ্চ Award',
      yearly: [
        { year: 2013, recipients: 6 },
        { year: 2014, recipients: 1 },
        { year: 2016, recipients: 12 },
        { year: 2017, recipients: 8 },
        { year: 2018, recipients: 2 },
        { year: 2019, recipients: 4 },
        { year: 2020, recipients: 16 },
        { year: 2021, recipients: 15 }
      ]
    },
    {
      name: 'President’s Scout Award',
      emoji: '🏅',
      total: 145,
      note: 'Scouting-এর সর্বোচ্চ স্বীকৃতি',
      highlightYears: [2019],
      yearly: [
        { year: 2011, recipients: 3 },
        { year: 2012, recipients: 6 },
        { year: 2013, recipients: 7 },
        { year: 2014, recipients: 14 },
        { year: 2015, recipients: 16 },
        { year: 2016, recipients: 28 },
        { year: 2017, recipients: 9 },
        { year: 2018, recipients: 18 },
        { year: 2019, recipients: 35 },
        { year: 2020, recipients: 9 }
      ]
    },
    {
      name: 'Community Development Award',
      emoji: '🤝',
      total: 152,
      note: 'সমাজসেবায় বিশেষ অবদানের স্বীকৃতি',
      highlightYears: [2017, 2018],
      yearly: [
        { year: 2015, recipients: 18 },
        { year: 2016, recipients: 16 },
        { year: 2017, recipients: 40 },
        { year: 2018, recipients: 40 },
        { year: 2019, recipients: 13 },
        { year: 2020, recipients: 12 },
        { year: 2021, recipients: 13 }
      ]
    }
  ],

  // ============ NATIONAL AWARDS — LEADERS (accordion) ============
  leaderAwards: [
    {
      year: 2015,
      entries: [
        { award: 'President Award', recipient: 'Scout Leader মো. মাহবুবুর রহমান মোল্লা' },
        { award: 'National Certificate', recipient: 'Scout Leader মো. ইসমাইল হোসেন (Wood Badger)' }
      ]
    },
    {
      year: 2017,
      entries: [
        { award: 'CNC’s Award', recipient: 'মো. মাহবুবুর রহমান মোল্লা' },
        { award: 'Medal of Merit', recipient: 'মো. ইসমাইল হোসেন' },
        { award: 'National Certificate', recipient: 'মো. সোহরাব হোসেন' },
        { award: 'National Certificate', recipient: 'মো. নুরুল আমিন' },
        { award: 'National Certificate', recipient: 'মো. তানভির রহমান' }
      ]
    },
    {
      year: 2019,
      entries: [
        { award: 'National Certificate', recipient: 'গোলাম মুর্শিদ মিঞা' },
        { award: 'National Certificate', recipient: 'মো. রাসেল' }
      ]
    },
    {
      year: 2020,
      entries: [
        { award: 'Bar to the Medal of Merit', recipient: 'মো. ইসমাইল হোসেন' },
        { award: 'National Certificate', recipient: 'শংকরী রানী সাহা' }
      ]
    },
    {
      year: 2021,
      entries: [
        { award: 'Medal of Merit', recipient: 'মো. আব্দুল মতিন' },
        { award: 'Medal of Merit', recipient: 'সালমা কবির' },
        { award: 'Medal of Merit', recipient: 'আতিকুর রহমান' },
        { award: 'Medal of Merit', recipient: 'কামরুন নাহার নিপা' },
        { award: 'Medal of Merit', recipient: 'মো. তানভির রহমান' },
        { award: 'National Certificate', recipient: 'মো. আলমগীর হোসেন' },
        { award: 'National Certificate', recipient: 'ইখতিয়ার উদ্দিন বিশ্বাস' },
        { award: 'National Service Award', recipient: 'মো. ইসমাইল হোসেন' }
      ]
    }
  ],

  // ============ SCOUT VALUES ============
  values: [
    { title: 'Discipline', description: 'শৃঙ্খলা ও দায়িত্ববোধ।' },
    { title: 'Leadership', description: 'নিজে নেতৃত্ব দেওয়া এবং অন্যকে অনুপ্রাণিত করা।' },
    { title: 'Service', description: 'মানবতার কল্যাণে কাজ করা।' },
    { title: 'Courage', description: 'চ্যালেঞ্জের সামনে দৃঢ় থাকা।' },
    { title: 'Teamwork', description: 'একসঙ্গে কাজ করে লক্ষ্য অর্জন।' },
    { title: 'Patriotism', description: 'দেশ ও সমাজের প্রতি দায়িত্বশীল থাকা।' }
  ],

  // ============ FOUNDER'S STORY ============
  founderStory: {
    quote: '“একটি দীর্ঘ যাত্রার শুরু হয় একটি ছোট পদক্ষেপের মাধ্যমে।”',
    paragraphs: [
      'স্কাউটিংয়ের শুরুতে আধুনিক Scout Den বা বিপুল সরঞ্জাম ছিল না। ছিল কয়েকজন নিবেদিত শিক্ষক, একঝাঁক উৎসাহী শিক্ষার্থী এবং একটি বড় স্বপ্ন—শৃঙ্খলা ও সেবার মাধ্যমে শিক্ষার্থীদের সুনাগরিক হিসেবে গড়ে তোলা।',
      'প্রিন্সিপাল মো. মাহবুবুর রহমান মোল্লার দিকনির্দেশনায় শিক্ষক মো. রমজান হোসেন Scout Leader training গ্রহণ করেন। তাঁর প্রত্যাবর্তনের পর বিদ্যালয় প্রাঙ্গণে প্রথম Scout দল গঠনের উদ্যোগ শুরু হয় এবং ১৮ ফেব্রুয়ারি ২০০১ সালে তা আনুষ্ঠানিক স্বীকৃতি লাভ করে।'
    ]
  },

  // ============ WHY JOIN ============
  whyJoin: [
    { title: 'Discipline', description: 'শৃঙ্খলা ও দায়িত্ববোধ গড়ে ওঠে।' },
    { title: 'Courage', description: 'চ্যালেঞ্জের সামনে দৃঢ় থাকা শেখা যায়।' },
    { title: 'Leadership', description: 'নিজে নেতৃত্ব দেওয়া ও অন্যকে অনুপ্রাণিত করা।' },
    { title: 'Friendship', description: 'টিমের সঙ্গে বন্ধুত্ব ও দলগত কাজ।' },
    { title: 'Service', description: 'মানবতার কল্যাণে কাজ করার সুযোগ।' }
  ],

  // ============ GROUP CAMP TRADITION ============
  activitiesNote:
    'প্রায় ২০ বছর ধরে গ্রুপ পর্যায়ে নিয়মিত ৫ দিনব্যাপী Group Camp আয়োজন করা হয়ে আসছে — শিক্ষার্থীদের শারীরিক, মানসিক ও আধ্যাত্মিক বিকাশের লক্ষ্যে।',

  // ============ MEMBERSHIP ============
  membershipFields: [
    'Student Name',
    'Class',
    'Section',
    'Roll',
    'Branch',
    'Blood Group',
    'Guardian Contact',
    'Previous Scouting Experience',
    'Why do you want to join?'
  ],

  membershipOptions: ['Cub Scout', 'Scout', 'Rover Scout'],

  // ============ NEWS & EVENTS ============
  events: [
    { title: 'Annual Group Camp', note: '5-Day Camp — Dates to be announced' },
    { title: 'National Jamboree', note: 'Dates to be announced' },
    { title: 'National Rover Moot', note: 'Dates to be announced' },
    { title: 'National Cub Camporee', note: 'Dates to be announced' },
    { title: 'Training Camp', note: 'Dates to be announced' },
    { title: 'Community Service', note: 'Ongoing' },
    { title: 'Award Ceremony', note: 'Dates to be announced' },
    { title: 'International Programme', note: 'Dates to be announced' },
    { title: 'Scout Day', note: 'Dates to be announced' },
    { title: 'Blood Grouping Campaign', note: 'Ongoing' }
  ],

  news: [
    {
      title: '5× Best Scout Group of Bangladesh',
      date: '2017–2023',
      description:
        'জাতীয় শিক্ষা সপ্তাহে দেশের শ্রেষ্ঠ Scout Group হিসেবে স্বীকৃতি — ২০১৭, ২০১৮, ২০১৯, ২০২২ ও ২০২৩।'
    },
    { title: 'International Participation', date: 'Upcoming', description: '৯টি দেশে ৯২ জনের প্রতিনিধিত্বের নতুন অধ্যায় আসছে।' },
    { title: 'Award Achievements', date: 'Upcoming', description: 'সদস্যদের নতুন অর্জনের খবর শীঘ্রই প্রকাশিত হবে।' },
    { title: 'Camp Updates', date: 'Upcoming', description: 'বার্ষিক Group Camp-এর সময়সূচি ঘোষণা করা হবে।' }
  ],

  // ============ GALLERY (real photos — category filter soho) ============
  galleryFilters: ['All', 'Camp', 'Jamboree', 'Awards', 'Community Service', 'International', 'Training', 'Parade', 'Campfire', 'Group'],
  galleryItems: [
    {
      image: '/assets/scout-group/principal-speech.jpg',
      caption: 'আন্তর্জাতিক অনুষ্ঠানে অধ্যক্ষ মহোদয়ের বক্তব্য',
      category: 'International'
    },
    {
      image: '/assets/scout-group/award-ceremony.jpg',
      caption: 'জাতীয় সম্মাননা অনুষ্ঠান — সম্মাননা গ্রহণের মুহূর্ত',
      category: 'Awards'
    },
    {
      image: '/assets/scout-group/awards-group.jpg',
      caption: 'সনদ হাতে ক্লাব সদস্যরা',
      category: 'Awards'
    },
    {
      image: '/assets/scout-group/award-plaque.jpg',
      caption: 'সম্মাননা ক্রেস্ট গ্রহণ',
      category: 'Awards'
    },
    {
      image: '/assets/scout-group/certificate.jpg',
      caption: 'সনদ গ্রহণ — স্বীকৃতির মুহূর্ত',
      category: 'Awards'
    },
    {
      image: '/assets/scout-group/award-exchange.jpg',
      caption: 'উপহার ও সম্মাননা বিনিময়',
      category: 'Awards'
    },
    {
      image: '/assets/scout-group/national-council-2017.jpg',
      caption: '৪৬তম জাতীয় কাউন্সিল সাধারণ সভা ২০১৭',
      category: 'Group'
    },
    {
      image: '/assets/scout-group/group-auditorium.jpg',
      caption: 'অনুষ্ঠানে অংশগ্রহণকারীদের সম্মিলিত ছবি',
      category: 'Group'
    },
    {
      image: '/assets/scout-group/workshop-cadet.jpg',
      caption: 'কর্মশালা ২০২৪ — প্রশিক্ষণ পর্ব',
      category: 'Training'
    },
    {
      image: '/assets/scout-group/workshop-stage.jpg',
      caption: 'সম্প্রসারণ কর্মশালা — মঞ্চে নেতৃবৃন্দ',
      category: 'Training'
    },
    {
      image: '/assets/scout-group/seminar-stage.jpg',
      caption: 'সেমিনার — অতিথি ও ক্লাব নেতৃবৃন্দ',
      category: 'Training'
    },
    {
      image: '/assets/scout-group/flag-outdoors.jpg',
      caption: 'বাংলাদেশের পতাকা হাতে — আন্তর্জাতিক প্রোগ্রামে',
      category: 'International'
    },
    {
      image: '/assets/scout-group/museum-visit.jpg',
      caption: 'আন্তর্জাতিক প্রোগ্রামে জাদুঘর পরিদর্শন',
      category: 'International'
    },
    {
      image: '/assets/scout-group/food-distribution.jpg',
      caption: 'খাদ্য ও উপহার বিতরণ — মানবিক সহায়তা',
      category: 'Community Service'
    },
    {
      image: '/assets/scout-group/vintage-scouts.jpg',
      caption: 'পুরনো দিনের স্কাউটিং স্মৃতি',
      category: 'Camp'
    }
  ],

  // ============ MEMBER SPOTLIGHT (নাম ও তথ্য এলে fill করো) ============
  members: []
};
