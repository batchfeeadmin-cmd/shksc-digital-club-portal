import React from 'react';
import { Shield, Flag, HeartHandshake, Zap, Users, Sparkles } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import type { RichClub } from '../../types';

const iconByTitle: Record<string, React.ComponentType<{ className?: string }>> = {
  Discipline: Shield,
  Leadership: Flag,
  Service: HeartHandshake,
  Courage: Zap,
  Teamwork: Users,
  Patriotism: Flag,
  Friendship: Users
};

export function RichClubValues({ rich }: { rich: RichClub }) {
  const values = rich.values ?? [];
  if (values.length === 0) return null;

  return (
    <section id="values" className="py-24 lg:py-28 bg-surface-sec">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Values"
          title="The Scout Spirit"
          subtitle="যে মূল্যবোধগুলো প্রতিটি সদস্যের চরিত্র গঠন করে।"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {values.map((value, i) => {
            const Icon = iconByTitle[value.title] ?? Sparkles;
            return (
              <Reveal key={value.title} delay={(i % 6) * 70} className="h-full">
                <div className="shine group bg-white border border-gray-100 rounded-2xl p-6 h-full shadow-sm hover:shadow-xl hover:border-accent-300 hover:-translate-y-1.5 transition-all duration-300 text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-950 group-hover:text-accent-400 transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-primary-950 text-sm leading-snug mb-2">{value.title}</h3>
                  <p className="font-bangla text-xs text-gray-500 leading-relaxed">{value.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
