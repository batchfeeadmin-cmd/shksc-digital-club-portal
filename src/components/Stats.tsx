import React from 'react';
import { CountUp } from './ui/CountUp';
import { Reveal } from './ui/Reveal';
import { useClubsData } from '../hooks/useAdminData';

export function Stats() {
  const { clubs } = useClubsData();
  const knownMembers = clubs.reduce((total, club) => total + club.memberCount, 0);
  const knownAchievements = clubs.reduce((total, club) => total + (club.achievementCount ?? 0), 0);
  const listedActivities = clubs.reduce((total, club) => total + (club.activities?.length ?? 0), 0);
  const stats = [
    { label: 'Active Clubs', value: clubs.length, suffix: '' },
    { label: 'Documented Members', value: knownMembers, suffix: knownMembers > 0 ? '+' : '' },
    { label: 'Documented Achievements', value: knownAchievements, suffix: knownAchievements > 0 ? '+' : '' },
    { label: 'Listed Activities', value: listedActivities, suffix: '' },
  ];

  return (
    <section className="py-16 bg-white relative overflow-hidden border-y border-gray-100">
      {/* Gradient hairline on top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-accent-400 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Reveal key={index} delay={index * 100} className="text-center group">
              <p className="text-4xl md:text-5xl font-heading font-extrabold text-primary-900 mb-2 transition-transform duration-300 group-hover:scale-110 origin-bottom">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
