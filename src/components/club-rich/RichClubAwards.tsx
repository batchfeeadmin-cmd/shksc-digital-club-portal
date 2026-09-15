import React from 'react';
import { Award } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { CountUp } from '../ui/CountUp';
import { cn } from '../../lib/utils';
import type { RichClub } from '../../types';

export function RichClubAwards({ rich }: { rich: RichClub }) {
  const awards = rich.awardStats ?? [];
  if (awards.length === 0) return null;

  const total = awards.reduce((sum, award) => sum + award.total, 0);

  return (
    <section id="awards" className="py-24 lg:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Major Student Awards"
          title={
            <>
              <span className="text-accent-500">
                <CountUp value={total} suffix="+" />
              </span>{' '}
              Major Awards
            </>
          }
          subtitle="Shapla Cub Scout Award, President’s Scout Award ও Community Development Award — বছরে বছরে ধারাবাহিক অর্জন।"
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {awards.map((award, i) => {
            const maxRecipients = award.yearly && award.yearly.length > 0
              ? Math.max(...award.yearly.map(y => y.recipients))
              : 0;

            return (
              <Reveal key={award.name} delay={i * 120} className="h-full">
                <div className="shine group bg-white border border-gray-100 rounded-3xl p-7 md:p-8 h-full shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-primary-950 text-accent-400 flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <div className="font-heading font-extrabold text-4xl text-primary-950">
                        {award.emoji ? `${award.emoji} ` : ''}
                        <CountUp value={award.total} />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">Recipients</p>
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-primary-950 mt-4 mb-1">{award.name}</h3>
                  {award.note && <p className="font-bangla text-xs font-semibold text-accent-600 mb-6">{award.note}</p>}

                  {award.yearly && award.yearly.length > 0 && maxRecipients > 0 && (
                    <div className="space-y-2.5">
                      {award.yearly.map(year => {
                        const highlighted = award.highlightYears?.includes(year.year);
                        return (
                          <div key={year.year} className="flex items-center gap-3">
                            <span className="font-heading font-bold text-xs text-primary-600 w-10 shrink-0 text-right">
                              {year.year}
                            </span>
                            <div className="flex-1 h-6 bg-surface-sec rounded-lg overflow-hidden">
                              <div
                                className={cn(
                                  'h-full rounded-lg transition-all duration-700 flex items-center justify-end pr-2',
                                  highlighted
                                    ? 'bg-accent-500'
                                    : 'bg-primary-950'
                                )}
                                style={{ width: `${Math.max((year.recipients / maxRecipients) * 100, 8)}%` }}
                              >
                                <span
                                  className={cn(
                                    'text-[10px] font-extrabold',
                                    highlighted ? 'text-primary-950' : 'text-accent-400'
                                  )}
                                >
                                  {year.recipients}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
