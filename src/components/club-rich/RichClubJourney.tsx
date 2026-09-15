import React from 'react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { cn } from '../../lib/utils';
import type { RichClub } from '../../types';

export function RichClubJourney({ rich }: { rich: RichClub }) {
  const journey = rich.journey ?? [];
  if (journey.length === 0) return null;

  return (
    <section id="journey" className="py-24 lg:py-28 bg-surface">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Our Journey" title="From the First Day to Today" />

        <div className="relative border-l-2 border-primary-100 ml-4 md:ml-8 pl-8 md:pl-12 space-y-12">
          {journey.map((item, i) => (
            <Reveal key={`${item.year}-${i}`} delay={i * 60} className="relative">
              <div
                className={cn(
                  'absolute -left-[50px] md:-left-[66px] top-0 w-8 h-8 rounded-full border-4 bg-white flex items-center justify-center',
                  item.highlight ? 'border-accent-500' : 'border-primary-200'
                )}
              >
                <span className={cn('w-2 h-2 rounded-full', item.highlight ? 'bg-accent-500' : 'bg-primary-400')}></span>
              </div>
              <div
                className={cn(
                  'shine bg-white border rounded-2xl p-7 md:p-8',
                  item.highlight ? 'border-accent-400 shadow-lg shadow-accent-500/10' : 'border-gray-100 shadow-sm'
                )}
              >
                <span className={cn('inline-block font-heading font-extrabold text-2xl mb-3', item.highlight ? 'text-accent-600' : 'text-primary-600')}>
                  {item.year}
                </span>
                <h3 className="font-heading font-bold text-xl text-primary-950 mb-2">{item.title}</h3>
                <p className="font-bangla text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
