import React from 'react';
import {
  FlaskConical, Rocket, Trophy, Users, BookOpen, Lightbulb,
  Code2, CalendarDays, Camera, HeartPulse, Globe2, Palette
} from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import type { Club, RichClub } from '../../types';

const iconPool = [FlaskConical, Rocket, Trophy, Users, BookOpen, Lightbulb, Code2, CalendarDays, Camera, HeartPulse, Globe2, Palette];

export function RichClubActivities({ club, rich }: { club: Club; rich: RichClub }) {
  const activities = club.activities ?? [];
  if (activities.length === 0) return null;

  return (
    <section id="activities" className="py-24 lg:py-28 bg-surface-sec">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What We Do"
          title="Hands-On. Real Experience."
          subtitle="ক্লাবের মূল কার্যক্রমগুলো — যা দিয়ে শিক্ষার্থীরা প্রতিদিন শেখে ও বেড়ে ওঠে।"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {activities.map((activity, i) => {
            const Icon = iconPool[i % iconPool.length];
            return (
              <Reveal key={activity.id} delay={(i % 4) * 80} className="h-full">
                <div className="shine group bg-white border border-gray-100 rounded-2xl p-6 h-full shadow-sm hover:shadow-xl hover:border-accent-300 hover:-translate-y-1.5 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-5 group-hover:bg-primary-950 group-hover:text-accent-400 transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-primary-950 leading-snug mb-2">{activity.name}</h3>
                  <p className="font-bangla text-sm text-gray-500 leading-relaxed">{activity.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {rich.activitiesNote && (
          <Reveal className="mt-8">
            <div className="flex items-center gap-4 bg-white border border-dashed border-accent-300 rounded-2xl px-6 py-5">
              <CalendarDays className="w-5 h-5 text-accent-500 shrink-0" />
              <p className="font-bangla text-gray-600 text-sm md:text-base">{rich.activitiesNote}</p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
