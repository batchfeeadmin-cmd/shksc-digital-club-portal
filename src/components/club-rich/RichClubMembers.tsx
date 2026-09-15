import React from 'react';
import { Quote } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import type { RichClub } from '../../types';

export function RichClubMembers({ rich }: { rich: RichClub }) {
  const members = rich.members ?? [];
  if (members.length === 0) return null;

  return (
    <section id="members" className="py-24 lg:py-28 bg-surface-sec">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Member Spotlight"
          title="Scouts Who Inspire"
          subtitle="প্রতি মাসে একজন সদস্যের গল্প — যারা শৃঙ্খলা, সেবা ও নেতৃত্বে উদাহরণ তৈরি করে।"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((member, i) => (
            <Reveal key={member.name} delay={(i % 3) * 100} className="h-full">
              <div className="shine group bg-white border border-gray-100 rounded-3xl p-7 h-full shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary-950 text-accent-400 flex items-center justify-center shrink-0 font-heading font-extrabold text-xl">
                    {member.name
                      .split(' ')
                      .map(w => w[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-primary-950 leading-snug">{member.name}</h3>
                    <p className="text-xs font-bold text-accent-600 uppercase tracking-wider">{member.branch}</p>
                  </div>
                </div>

                {(member.className || member.award) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {member.className && (
                      <span className="px-2.5 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-[11px] font-bold">
                        {member.className}
                      </span>
                    )}
                    {member.award && (
                      <span className="px-2.5 py-1 rounded-full bg-success-50 border border-success-100 text-success-700 text-[11px] font-bold">
                        {member.award}
                      </span>
                    )}
                  </div>
                )}

                {member.achievement && <p className="text-sm text-gray-600 leading-relaxed mb-2">{member.achievement}</p>}
                {member.international && (
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    <span className="font-bold text-success-600">International:</span> {member.international}
                  </p>
                )}
                {member.quote && (
                  <div className="flex items-start gap-2 mt-auto pt-4 border-t border-gray-100">
                    <Quote className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-500 italic leading-relaxed">{member.quote}</p>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
