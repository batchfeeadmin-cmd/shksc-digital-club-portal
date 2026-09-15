import React, { useState } from 'react';
import { ChevronDown, Medal } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { cn } from '../../lib/utils';
import type { RichClub } from '../../types';

export function RichClubLeaderAwards({ rich }: { rich: RichClub }) {
  const leaderAwards = rich.leaderAwards ?? [];
  const [openYear, setOpenYear] = useState<number | null>(leaderAwards[0]?.year ?? null);

  if (leaderAwards.length === 0) return null;

  return (
    <section id="hall-of-honour" className="py-24 lg:py-28 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Hall of Honour"
          title="Leaders Who Built the Legacy"
          subtitle="জাতীয় পর্যায়ে নেতৃত্বের স্বীকৃতি — বছরে বছরে।"
        />

        <div className="space-y-4">
          {leaderAwards.map((yearGroup, i) => {
            const isOpen = openYear === yearGroup.year;
            return (
              <Reveal key={yearGroup.year} delay={i * 60}>
                <div
                  className={cn(
                    'bg-white border rounded-2xl overflow-hidden transition-all duration-300 shadow-sm',
                    isOpen ? 'border-accent-300 shadow-lg shadow-accent-500/10' : 'border-gray-100'
                  )}
                >
                  <button
                    onClick={() => setOpenYear(isOpen ? null : yearGroup.year)}
                    className="w-full flex items-center justify-between gap-4 p-6 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                        <Medal className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-heading font-extrabold text-xl text-primary-950">{yearGroup.year} National Awards</h3>
                        <p className="text-xs text-gray-500 font-semibold">
                          {yearGroup.entries.length} {yearGroup.entries.length === 1 ? 'award' : 'awards'}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={cn('w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0', isOpen && 'rotate-180')}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 space-y-3">
                      {yearGroup.entries.map(entry => (
                        <div
                          key={`${entry.award}-${entry.recipient}`}
                          className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 p-4 rounded-xl bg-surface-sec border border-gray-100"
                        >
                          <span className="px-2.5 py-1 rounded-full bg-accent-50 border border-accent-100 text-accent-700 text-[11px] font-bold uppercase tracking-wider sm:w-56 shrink-0">
                            {entry.award}
                          </span>
                          <span className="font-bangla text-gray-700 font-medium">{entry.recipient}</span>
                        </div>
                      ))}
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
