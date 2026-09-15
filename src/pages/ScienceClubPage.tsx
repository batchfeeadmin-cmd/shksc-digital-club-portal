import React, { useEffect } from 'react';
import { ScienceHero } from '../components/science-club/ScienceHero';
import { ScienceSectionNav } from '../components/science-club/ScienceSectionNav';
import { ScienceAbout } from '../components/science-club/ScienceAbout';
import { ScienceActivities } from '../components/science-club/ScienceActivities';
import { ScienceAchievements } from '../components/science-club/ScienceAchievements';
import { ScienceJourney } from '../components/science-club/ScienceJourney';
import { SciencePrograms, ScienceProjectShowcase } from '../components/science-club/SciencePrograms';
import { ScienceGallery } from '../components/science-club/ScienceGallery';
import { ScienceSpotlight, ScienceLeadership } from '../components/science-club/ScienceSpotlight';
import { ScienceJoin } from '../components/science-club/ScienceJoin';

export function ScienceClubPage() {
  useEffect(() => {
    document.title = 'Science Club | SHKSC Digital Club Portal';
  }, []);

  return (
    <div className="bg-surface">
      <ScienceHero />
      <ScienceSectionNav />
      <ScienceAbout />
      <ScienceActivities />
      <ScienceAchievements />
      <ScienceJourney />
      <SciencePrograms />
      <ScienceProjectShowcase />
      <ScienceGallery />
      <ScienceSpotlight />
      <ScienceLeadership />
      <ScienceJoin />
    </div>
  );
}
