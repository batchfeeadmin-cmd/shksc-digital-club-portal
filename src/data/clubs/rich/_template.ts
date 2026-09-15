import type { RichClub } from '../../../types';

// ==== RICH INFO ENTRY — one file per club ====
// Fill ONLY the sections you have real info for. Leave missing sections as
// empty arrays / undefined and the page will hide them automatically.
// Example entries are commented below — copy the shape, replace with real info.

export const templateRich: RichClub = {
  // Hero quick stats (optional — hero also auto-shows Established/Members/Awards from base club data)
  // quickStats: [
  //   { label: 'Established', value: '2015', countUp: true, end: 2015 },
  //   { label: 'Awards & Achievements', value: '50+', countUp: true, end: 50, suffix: '+' }
  // ],

  // featuredAchievement: {
  //   badge: 'Featured Achievement · 2025',
  //   emoji: '🏆',
  //   title: 'From SHKSC to the National Stage',
  //   description: 'Club members represented the school at the national competition...',
  //   location: 'Dhaka, Bangladesh',
  //   year: '2025',
  //   link: 'https://shksc.edu.bd',
  //   image: '/assets/<club>/award.jpg'
  // },

  achievements: [
    // { year: 2024, event: 'Competition name', result: 'Champion', tier: 'National' }
  ],

  journey: [
    // { year: '2015', title: 'Club Established', description: 'ক্লাবের যাত্রা শুরু।' },
    // { year: '2025', title: 'Milestone', description: '...', highlight: true }
  ],

  // spotlight: {
  //   name: 'Student Name',
  //   nameBn: 'শিক্ষার্থীর নাম',
  //   title: 'Champion',
  //   quote: '“A quote from the student.”',
  //   highlights: [{ year: 2024, text: 'Achievement description' }]
  // },

  leaders: [
    // { role: 'President', name: 'নাম', confirmed: true }
  ],

  // committeeRoles: ['Faculty Advisors', 'Event Coordinator', 'Media & Publication Team'],

  whyJoin: [
    // { title: 'Learn & Grow', description: 'কেন join করবে — ১ লাইনে।' }
  ],

  events: [
    // { title: 'Upcoming event name', note: 'Dates to be announced' }
  ],

  news: [
    // { title: 'News title', date: 'July 2025', description: 'News description...', link: 'https://shksc.edu.bd' }
  ]
};
