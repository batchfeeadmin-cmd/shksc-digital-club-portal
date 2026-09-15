import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { achievementsData } from '../data/mockData';
import { ClubHero } from '../components/club-details/ClubHero';
import { ClubInfo } from '../components/club-details/ClubInfo';
import { ActivityCard } from '../components/club-details/ActivityCard';
import { AchievementTimeline } from '../components/club-details/AchievementTimeline';
import { GalleryGrid } from '../components/club-details/GalleryGrid';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useClubsData } from '../hooks/useAdminData';

export function ClubDetailsPage() {
  const { clubs } = useClubsData();
  const { clubSlug } = useParams<{ clubSlug: string }>();
  
  const club = clubs.find(c => c.slug === clubSlug);
  const clubAchievements = achievementsData.filter(a => a.clubName === club?.name);

  if (!club) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-surface text-center px-4">
        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Club Not Found</h2>
        <p className="text-gray-500 mb-8">The club you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/clubs">Back to Clubs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-surface-sec min-h-screen pb-24">
      <ClubHero club={club} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <ClubInfo club={club} />

        {/* Activities Section */}
        {club.activities && club.activities.length > 0 && (
          <section className="mt-24">
            <h2 className="text-3xl font-heading font-bold text-primary-950 mb-8">Key Activities</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {club.activities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {club.gallery && club.gallery.length > 0 && (
          <section className="mt-24">
            <h2 className="text-3xl font-heading font-bold text-primary-950 mb-8">Gallery</h2>
            <GalleryGrid images={club.gallery} />
          </section>
        )}

        {/* Achievements Section */}
        <section className="mt-24">
          <h2 className="text-3xl font-heading font-bold text-primary-950 mb-8">Notable Achievements</h2>
          <div className="max-w-4xl">
            <AchievementTimeline achievements={clubAchievements} />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-32 bg-primary-950 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Interested in joining?</h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Take the first step towards an exciting journey with the {club.name}.
          </p>
          <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600 text-white border-none">
            <Link to={`/registration?club=${club.id}`}>
              Start Registration <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </section>

      </div>
    </div>
  );
}
