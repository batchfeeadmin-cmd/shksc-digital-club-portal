import React from 'react';
import { HeartHandshake } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import type { RichClub } from '../../types';

export function RichClubService({ rich }: { rich: RichClub }) {
  const service = rich.service ?? [];
  if (service.length === 0) return null;

  return (
    <section id="service" className="py-24 lg:py-28 bg-surface-sec">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Community Service"
          title="Service Before Self"
          subtitle="Serving People. Strengthening Communities. — নিয়মিত সমাজ উন্নয়ন ও মানবিক কার্যক্রম।"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {service.map((item, i) => (
            <Reveal key={item.name} delay={(i % 4) * 80} className="h-full">
              <div className="shine group bg-white border border-gray-100 rounded-2xl p-6 h-full shadow-sm hover:shadow-xl hover:border-success-300 hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-success-50 border border-success-100 text-success-600 flex items-center justify-center mb-5 group-hover:bg-success-500 group-hover:text-white transition-colors duration-300">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-primary-950 leading-snug mb-2">{item.name}</h3>
                <p className="font-bangla text-sm text-gray-500 leading-relaxed">{item.purpose}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
