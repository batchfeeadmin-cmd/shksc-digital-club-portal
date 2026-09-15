import React from 'react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from './SectionHeading';
import { CountUp } from './CountUp';
import { cn } from '../../lib/utils';
import { scienceCounters, scienceCounterBadges, scienceJourney } from '../../data/clubs/science-portal';

export function ScienceJourney() {
  return (
    <>
      {/* ===== Achievement Counter — dark navy band ===== */}
      <section className="bg-primary-950 py-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay" aria-hidden></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 text-center">
            {scienceCounters.map((counter, i) => (
              <Reveal key={counter.label} delay={i * 100}>
                <div className="font-heading font-extrabold text-5xl md:text-6xl text-accent-400">
                  <CountUp end={counter.end} suffix={counter.suffix} />
                </div>
                <p className="text-primary-100/80 font-semibold mt-3">{counter.label}</p>
              </Reveal>
            ))}
            {scienceCounterBadges.map((badge, i) => (
              <Reveal key={badge.label} delay={200 + i * 100}>
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-success-400 mx-auto mb-4">
                  <badge.icon className="w-6 h-6" />
                </div>
                <div className="font-heading font-extrabold text-2xl md:text-3xl text-white">{badge.label}</div>
                <p className="text-primary-100/80 font-semibold mt-2">{badge.sub}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Journey Timeline ===== */}
      <section id="journey" className="py-24 lg:py-28 bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Our Journey" title="From 2013 to the Global Stage" />

          <div className="relative border-l-2 border-primary-100 ml-4 md:ml-8 pl-8 md:pl-12 space-y-12">
            {scienceJourney.map((item, i) => (
              <Reveal key={item.year} delay={i * 60} className="relative">
                {/* Timeline marker */}
                <div
                  className={cn(
                    'absolute -left-[50px] md:-left-[66px] top-0 w-8 h-8 rounded-full border-4 bg-white flex items-center justify-center',
                    item.highlight
                      ? 'border-accent-500'
                      : item.year === 'Future'
                        ? 'border-success-500'
                        : 'border-primary-200'
                  )}
                >
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      item.highlight ? 'bg-accent-500' : item.year === 'Future' ? 'bg-success-500' : 'bg-primary-400'
                    )}
                  ></span>
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
    </>
  );
}
