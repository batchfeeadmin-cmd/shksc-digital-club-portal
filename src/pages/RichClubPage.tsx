import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useClubsData } from '../hooks/useAdminData';
import { richClubsBySlug, emptyRich } from '../data/clubs/rich';
import { getApprovedAchievements } from '../services/approvals/approvalService';
import { Button } from '../components/ui/button';
import { Reveal } from '../components/ui/Reveal';
import { SectionNav, type SectionNavItem } from '../components/ui/SectionNav';
import { RichClubHero } from '../components/club-rich/RichClubHero';
import { RichClubAbout } from '../components/club-rich/RichClubAbout';
import { RichClubBranches } from '../components/club-rich/RichClubBranches';
import { RichClubValues } from '../components/club-rich/RichClubValues';
import { RichClubActivities } from '../components/club-rich/RichClubActivities';
import { RichClubAchievements } from '../components/club-rich/RichClubAchievements';
import { RichClubJourney } from '../components/club-rich/RichClubJourney';
import { RichClubInternational } from '../components/club-rich/RichClubInternational';
import { RichClubAwards } from '../components/club-rich/RichClubAwards';
import { RichClubLeaderAwards } from '../components/club-rich/RichClubLeaderAwards';
import { RichClubService } from '../components/club-rich/RichClubService';
import { RichClubFounderStory } from '../components/club-rich/RichClubFounderStory';
import { RichClubGallery } from '../components/club-rich/RichClubGallery';
import { RichClubSpotlight } from '../components/club-rich/RichClubSpotlight';
import { RichClubMembers } from '../components/club-rich/RichClubMembers';
import { RichClubJoin } from '../components/club-rich/RichClubJoin';

export function RichClubPage() {
  const { clubs } = useClubsData();
  const { clubSlug } = useParams<{ clubSlug: string }>();

  const club = clubs.find(c => c.slug === clubSlug);
  const rich = (clubSlug && richClubsBySlug[clubSlug]) || emptyRich;

  useEffect(() => {
    if (club) document.title = `${club.name} | SHKSC Digital Club Portal`;
  }, [club]);

  if (!club) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-surface text-center px-4">
        <h2 className="text-3xl font-heading font-bold text-primary-950 mb-4">Club Not Found</h2>
        <p className="text-gray-500 mb-8">The club you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/clubs">Back to Clubs</Link>
        </Button>
      </div>
    );
  }

  const hasAbout = !!(club.fullDescription || club.history || club.vision || club.mission || (club.objectives && club.objectives.length > 0));
  const hasBranches = !!(rich.branches && rich.branches.length > 0);
  const hasValues = !!(rich.values && rich.values.length > 0);
  const hasActivities = !!(club.activities && club.activities.length > 0);
  const approvedAchievementsCount = getApprovedAchievements().filter(a => a.clubId === club.id).length;
  const hasAchievements = !!(rich.featuredAchievement || (rich.achievements && rich.achievements.length > 0) || approvedAchievementsCount > 0);
  const hasJourney = !!(rich.journey && rich.journey.length > 0);
  const hasInternational = !!(rich.international || (rich.nationalParticipation && rich.nationalParticipation.length > 0));
  const hasAwards = !!(rich.awardStats && rich.awardStats.length > 0);
  const hasLeaderAwards = !!(rich.leaderAwards && rich.leaderAwards.length > 0);
  const hasService = !!(rich.service && rich.service.length > 0);
  const hasFounderStory = !!(rich.founderStory && rich.founderStory.paragraphs.length > 0);
  const hasGallery = !!(club.gallery && club.gallery.length > 0) || !!(rich.galleryItems && rich.galleryItems.length > 0);
  const hasSpotlight = !!(rich.spotlight || (rich.leaders && rich.leaders.length > 0) || (rich.committeeRoles && rich.committeeRoles.length > 0));
  const hasMembers = !!(rich.members && rich.members.length > 0);
  const hasWhyJoin = !!(rich.whyJoin && rich.whyJoin.length > 0);
  const hasNews = !!((rich.events && rich.events.length > 0) || (rich.news && rich.news.length > 0));

  const anyContent =
    hasAbout || hasBranches || hasValues || hasActivities || hasAchievements || hasJourney ||
    hasInternational || hasAwards || hasLeaderAwards || hasService || hasFounderStory ||
    hasGallery || hasSpotlight || hasMembers || hasWhyJoin || hasNews;

  const sectionIds: Record<string, boolean> = {
    about: hasAbout,
    wings: hasBranches,
    journey: hasJourney,
    achievements: hasAchievements,
    international: hasInternational,
    awards: hasAwards,
    service: hasService,
    gallery: hasGallery,
    spotlight: hasSpotlight,
    join: true
  };

  const navOrder: SectionNavItem[] = [
    { id: 'about', label: 'About' },
    { id: 'wings', label: 'Wings' },
    { id: 'journey', label: 'Journey' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'international', label: 'International' },
    { id: 'awards', label: 'Awards' },
    { id: 'service', label: 'Service' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'spotlight', label: 'Spotlight' },
    { id: 'join', label: 'Join' }
  ].filter(item => sectionIds[item.id]);

  return (
    <div className="bg-surface">
      <RichClubHero club={club} richStats={rich.quickStats} hasActivities={hasActivities} />
      <SectionNav items={navOrder} />

      <RichClubAbout club={club} />
      <RichClubBranches rich={rich} />
      <RichClubValues rich={rich} />
      <RichClubActivities club={club} rich={rich} />
      <RichClubAchievements rich={rich} clubId={club.id} />
      <RichClubJourney rich={rich} />
      <RichClubInternational rich={rich} />
      <RichClubAwards rich={rich} />
      <RichClubLeaderAwards rich={rich} />
      <RichClubService rich={rich} />
      <RichClubFounderStory rich={rich} />
      <RichClubGallery club={club} rich={rich} />
      <RichClubSpotlight rich={rich} />
      <RichClubMembers rich={rich} />
      <RichClubJoin club={club} rich={rich} />

      {!anyContent && (
        <section className="pb-24 lg:pb-28 bg-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="shine bg-white border-2 border-dashed border-accent-300 rounded-3xl p-12 md:p-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-accent-50 border border-accent-100 text-accent-600 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-primary-950 mb-3">Details Coming Soon</h3>
                <p className="font-bangla text-gray-500 leading-relaxed max-w-xl mx-auto">
                  ক্লাবের বিস্তারিত তথ্য শীঘ্রই যুক্ত করা হবে — কার্যক্রম, অর্জন, গ্যালারি ও আরও অনেক কিছু।
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </div>
  );
}
