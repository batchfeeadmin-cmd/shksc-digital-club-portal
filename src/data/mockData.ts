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
    image: '/assets/science-club award-group.jpg'
  },
  {
    id: 'a4',
    year: 2024,
    clubName: 'SHKSC Scout Group',
    title: 'National Scouting Award',
    competition: 'Annual Scout Jamboree',
    position: 'Best Scout Unit',
    image: '/assets/scout-group award-ceremony.jpg'
  },
  {
    id: 'a5',
    year: 2024,
    clubName: 'SHKSC Scout Group',
    title: 'National Museum Visit',
    competition: 'Educational Tour',
    position: 'Participant',
    image: '/assets/scout-group museum-visit.jpg'
  }
];
