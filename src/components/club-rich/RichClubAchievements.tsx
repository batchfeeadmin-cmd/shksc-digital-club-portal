import React from 'react';
import { ArrowRight, MapPin, Trophy } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { cn } from '../../lib/utils';
import { getApprovedAchievements } from '../../services/approvals/approvalService';
import type { RichClub } from '../../types';

export function RichClubAchievements({ rich, clubId }: { rich: RichClub; clubId?: string }) {
  // Static rich achievements + achievements approved by root admin (live).
  const approvedItems = (clubId ? getApprovedAchievements().filter(a => a.clubId === clubId) : []).map(a => ({
    year: Number(a.year) || new Date().getFullYear(),
    event: a.eventName || a.title,
    result: a.award || a.title,
    tier: 'National' as const
  }));

  const achievements = [...(rich.achievements ?? []), ...approvedItems];
  const featured = rich.featuredAchievement;

  if (!featured && achievements.length === 0) return null;

  return (
    <section id="achievements" className="py-24 lg:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {featured && (
          <Reveal className="mb-28">
            <div className="moving-border shine-auto relative bg-primary-950 rounded-[2rem] overflow-hidden">
              <div className="grid lg:grid-cols-2">
                <div className="p-8 md:p-14">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-400/10 border border-accent-400/40 text-accent-400 text-xs font-bold uppercase tracking-[0.16em] mb-6">
                    <Trophy className="w-3.5 h-3.5" /> {featured.badge}
                  </div>
                  <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white leading-tight mb-5">
                    {featured.emoji ? `${featured.emoji} ` : ''}
                    {featured.title}
                  </h2>
                  <p className="text-primary-100/90 text-base md:text-lg leading-relaxed mb-6">{featured.description}</p>
                  {featured.location && (
                    <div className="flex items-center gap-2 text-success-400 font-semibold mb-8">
                      <MapPin className="w-4 h-4" /> {featured.location}
                    </div>
                  )}
                  {featured.link && (
                    <a
                      href={featured.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors"
                    >
                      Read the Story <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
                {featured.image && (
                  <div className="relative min-h-[300px] lg:min-h-full">
                    <img src={featured.image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-primary-950/40"></div>
                    <div className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-success-500 text-white text-xs font-bold uppercase tracking-wider">
                      {featured.year || 'Featured'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        )}

        {achievements.length > 0 && (
          <>
            <SectionHeading
              eyebrow="A Legacy of Excellence"
              title="Turning Effort Into Achievement"
              subtitle="ক্লাবের উল্লেখযোগ্য অর্জনসমূহ — জাতীয় ও আন্তর্জাতিক পর্যায়ে।"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {achievements.map((achievement, i) => (
                <Reveal key={`${achievement.event}-${i}`} delay={(i % 3) * 100} className="h-full">
                  <div className="shine group bg-white border border-gray-100 rounded-2xl p-7 h-full shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-heading font-extrabold text-3xl text-accent-500">{achievement.year}</span>
                      <span
                        className={cn(
                          'px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border',
                          achievement.tier === 'International'
                            ? 'bg-success-50 text-success-700 border-success-100'
                            : 'bg-primary-50 text-primary-800 border-primary-100'
                        )}
                      >
                        {achievement.tier}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-lg text-primary-950 leading-snug mb-2">{achievement.event}</h3>
                    <p className="text-sm text-gray-500">{achievement.result}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
