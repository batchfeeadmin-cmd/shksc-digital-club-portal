import React, { useState } from 'react';
import { ArrowRight, MapPin, Trophy, Award } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from './SectionHeading';
import { cn } from '../../lib/utils';
import { scienceFeatured, scienceLegacy, scienceArchive, scienceArchiveFilters } from '../../data/clubs/science-portal';

export function ScienceAchievements() {
  const [filter, setFilter] = useState<string>('All');

  const filtered = scienceArchive.filter(item =>
    filter === 'All'
      ? true
      : filter === 'International'
        ? item.tier === 'International'
        : String(item.year) === filter
  );

  return (
    <section id="achievements" className="py-24 lg:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== Featured Achievement — WRO 2025 ===== */}
        <Reveal className="mb-28">
          <div className="moving-border shine-auto relative bg-primary-950 rounded-[2rem] overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 md:p-14">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-400/10 border border-accent-400/40 text-accent-400 text-xs font-bold uppercase tracking-[0.16em] mb-6">
                  <Trophy className="w-3.5 h-3.5" /> Featured Achievement · {scienceFeatured.year}
                </div>
                <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white leading-tight mb-5">
                  {scienceFeatured.emoji} {scienceFeatured.title}
                </h2>
                <p className="text-primary-100/90 text-base md:text-lg leading-relaxed mb-6">
                  {scienceFeatured.description}
                </p>
                <div className="flex items-center gap-2 text-success-400 font-semibold mb-8">
                  <MapPin className="w-4 h-4" /> {scienceFeatured.location}
                </div>
                <a
                  href={scienceFeatured.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors"
                >
                  Read the Story <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="relative min-h-[300px] lg:min-h-full">
                <img
                  src={scienceFeatured.image}
                  alt="World Robot Olympiad award stage"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary-950/40"></div>
                <div className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-success-500 text-white text-xs font-bold uppercase tracking-wider">
                  International
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ===== Legacy of Excellence ===== */}
        <SectionHeading
          eyebrow="A Legacy of Excellence"
          title="Turning Curiosity Into Achievement"
          subtitle="From school-level innovation to international Olympiads — SHKSC Science Club continues to turn curiosity into achievement."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-28">
          {scienceLegacy.map((achievement, i) => (
            <Reveal key={achievement.event} delay={(i % 3) * 100} className="h-full">
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

        {/* ===== Competition Archive ===== */}
        <SectionHeading
          eyebrow="Competition Archive"
          title="2020–2025 Achievement Archive"
          subtitle="বছর ধরে জাতীয় ও আন্তর্জাতিক প্রতিযোগিতায় অংশগ্রহণের পূর্ণাঙ্গ তালিকা — year filter দিয়ে ঘুরে দেখুন।"
        />

        <Reveal className="flex flex-wrap justify-center gap-2 mb-10">
          {scienceArchiveFilters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border',
                filter === f
                  ? 'bg-primary-950 text-white border-primary-950 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-900'
              )}
            >
              {f}
            </button>
          ))}
        </Reveal>

        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, i) => (
              <Reveal key={`${item.name}-${i}`} delay={(i % 3) * 70}>
                <div className="group bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-start gap-4 hover:border-accent-300 hover:shadow-md transition-all duration-300">
                  <span className="font-heading font-extrabold text-accent-600 shrink-0 w-12 text-right">{item.year}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-primary-950 leading-snug">{item.name}</p>
                    <span
                      className={cn(
                        'inline-block mt-1.5 text-[11px] font-bold uppercase tracking-wider',
                        item.tier === 'International' ? 'text-success-600' : 'text-primary-600'
                      )}
                    >
                      {item.tier}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="text-center py-14 bg-surface-sec border border-dashed border-gray-200 rounded-2xl">
              <Award className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="font-bangla text-gray-500">এই বছরের archive তালিকা শীঘ্রই যোগ করা হবে।</p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
