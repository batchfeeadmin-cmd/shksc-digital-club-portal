import type { Club } from '../../types';
import { scoutGroupClub } from './scout-group';
import { artCultureClub } from './art-culture';
import { scienceClub } from './science';
import { sportsClub } from './sports';
import { photographyClub } from './photography';
import { nutritionClub } from './nutrition';
import { englishClub } from './english';
import { computerClub } from './computer';

// Add a newly created club file here too (copy _template.ts first)
export const clubsData: Club[] = [
  scoutGroupClub,
  artCultureClub,
  scienceClub,
  sportsClub,
  photographyClub,
  nutritionClub,
  englishClub,
  computerClub
];
