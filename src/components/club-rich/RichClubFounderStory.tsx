import React from 'react';
import { Quote } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import type { RichClub } from '../../types';

export function RichClubFounderStory({ rich }: { rich: RichClub }) {
  const story = rich.founderStory;
  if (!story || story.paragraphs.length === 0) return null;

  return (
    <section id="history" className="py-24 lg:py-28 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Our Roots" title="Where the Journey Began" />

        <Reveal>
          <div className="shine relative bg-primary-950 rounded-[2rem] overflow-hidden p-8 md:p-14">
            <Quote className="w-10 h-10 text-accent-400/40 absolute top-8 right-8" aria-hidden />
            {story.quote && (
              <p className="font-heading font-bold text-xl md:text-2xl text-accent-400 leading-relaxed mb-8 max-w-2xl">
                {story.quote}
              </p>
            )}
            <div className="space-y-6">
              {story.paragraphs.map((paragraph, i) => (
                <p key={i} className="font-bangla text-primary-100/90 leading-8 text-base md:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
