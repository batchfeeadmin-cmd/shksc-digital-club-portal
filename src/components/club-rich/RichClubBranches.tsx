import React from 'react';
import { Compass } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import type { RichClub } from '../../types';

export function RichClubBranches({ rich }: { rich: RichClub }) {
  const branches = rich.branches ?? [];
  if (branches.length === 0) return null;

  return (
    <section id="wings" className="py-24 lg:py-28 bg-surface-sec">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Wings"
          title="Three Wings. One Family."
          subtitle="প্রাইমারি থেকে উচ্চমাধ্যমিক — প্রতিটি স্তরের জন্য আলাদা শাখা ও লক্ষ্য।"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {branches.map((branch, i) => (
            <Reveal key={branch.name} delay={i * 100} className="h-full">
              <div className="shine group bg-white border border-gray-100 rounded-2xl p-7 h-full shadow-sm hover:shadow-xl hover:border-accent-300 hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary-950 text-accent-400 flex items-center justify-center mb-5 group-hover:bg-accent-500 group-hover:text-white transition-colors duration-300">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-success-50 text-success-700 border border-success-100 text-[11px] font-bold uppercase tracking-wider">
                  {branch.level}
                </span>
                <h3 className="font-heading font-bold text-xl text-primary-950 mt-3 mb-2">{branch.name}</h3>
                <p className="font-bangla text-sm text-gray-500 leading-relaxed">{branch.focus}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
