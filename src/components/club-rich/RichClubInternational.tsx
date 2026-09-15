import React from 'react';
import { Globe2, Users } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { CountUp } from '../ui/CountUp';
import { cn } from '../../lib/utils';
import type { RichClub } from '../../types';

export function RichClubInternational({ rich }: { rich: RichClub }) {
  const international = rich.international;
  const national = rich.nationalParticipation ?? [];

  if (!international && national.length === 0) return null;

  return (
    <section id="international" className="py-24 lg:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {international && (
          <>
            <SectionHeading
              eyebrow="International Participation"
              title="Representing Bangladesh Beyond Borders"
            />

            {/* Dark band with world stats */}
            <Reveal className="mb-16">
              <div className="shine relative bg-primary-950 rounded-[2rem] overflow-hidden p-8 md:p-14">
                <div className="absolute inset-0 grid-overlay" aria-hidden></div>
                <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <p className="font-bangla text-primary-100/90 leading-8 text-base md:text-lg">{international.description}</p>
                    <div className="flex flex-wrap gap-3 mt-8">
                      {international.programmes.map(programme => (
                        <span
                          key={programme}
                          className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-primary-100 text-sm font-bold"
                        >
                          {programme}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {international.stats.map((stat, i) => (
                      <Reveal key={stat.label} delay={i * 120}>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                          <div className="w-11 h-11 rounded-xl bg-white/10 text-accent-400 flex items-center justify-center mx-auto mb-4">
                            {i === 0 ? <Globe2 className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                          </div>
                          <div className="font-heading font-extrabold text-4xl text-white">
                            {stat.countUp && stat.end !== undefined ? (
                              <CountUp value={stat.end} suffix={stat.suffix} />
                            ) : (
                              stat.value
                            )}
                          </div>
                          <p className="text-primary-100/70 font-semibold text-sm mt-2">{stat.label}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </>
        )}

        {national.length > 0 && (
          <>
            <SectionHeading eyebrow="National Participation" title="Active on Every Front" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {national.map((item, i) => (
                <Reveal key={item.name} delay={(i % 3) * 80}>
                  <div className="group bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between gap-3 hover:border-accent-300 hover:shadow-md transition-all duration-300">
                    <p className="font-semibold text-primary-950 leading-snug">{item.name}</p>
                    <span
                      className={cn(
                        'shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                        item.type.includes('International')
                          ? 'bg-success-50 text-success-700 border-success-100'
                          : 'bg-primary-50 text-primary-800 border-primary-100'
                      )}
                    >
                      {item.type}
                    </span>
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
