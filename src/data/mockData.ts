import { Achievement } from '../types';
import { clubsData } from './clubs';

export const registrationOpen = true;

export { clubsData };

export const achievementsData: Achievement[] = [
  {
    id: 'a1',
    year: 2025,
    clubName: 'SHKSC Science Club',
    title: 'World Robot Olympiad 2025',
    competition: '“Future Innovators” category — Manila, Philippines',
    position: 'Global Stage Qualifier',
    image: '/assets/science-club/award-stage.jpg'
  },
  {
    id: 'a2',
    year: 2025,
    clubName: 'SHKSC Computer Club',
    title: 'Youth Coding Olympiad',
    competition: 'Regional Tech Championship',
    position: 'Gold Medalist',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'a3',
    year: 2025,
    clubName: 'SHKSC English Language Club',
    title: 'Interschool Debate Tournament',
    competition: 'National Debate League',
    position: '1st Runner Up',
    image: 'https://images.unsplash.com/photo-1475721025870-2440125b01ce?w=800&auto=format&fit=crop&q=60'
  }
];
