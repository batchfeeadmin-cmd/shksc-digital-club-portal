import type { RichClub } from '../../../types';
import { scoutGroupRich } from './scout-group';
import { artCultureRich } from './art-culture';
import { sportsRich } from './sports';
import { photographyRich } from './photography';
import { nutritionRich } from './nutrition';
import { englishRich } from './english';
import { computerRich } from './computer';

// slug → rich content. Science club has its own bespoke page, so it's not listed here.
export const richClubsBySlug: Record<string, RichClub> = {
  'scout-group': scoutGroupRich,
  'art-culture': artCultureRich,
  sports: sportsRich,
  photography: photographyRich,
  nutrition: nutritionRich,
  english: englishRich,
  computer: computerRich
};

export const emptyRich: RichClub = {
  achievements: [],
  journey: [],
  leaders: [],
  whyJoin: [],
  events: [],
  news: []
};
