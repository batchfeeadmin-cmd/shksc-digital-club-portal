import React from 'react';
import { CheckCircle2, UserCircle } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import type { RichClub } from '../../types';

export function RichClubSpotlight({ rich }: { rich: RichClub }) {
  const spotlight = rich.spotlight;
  const leaders = rich.leaders ?? [];
  const committeeRoles = rich.committeeRoles ?? [];

  if (!spotlight && leaders.length === 0 && committeeRoles.length === 0) return null;

  return (
    <section id="spotlight" className="py-24 lg:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Hall of Excellence" title="People Behind the Club" subtitle="যারা ক্লাবকে এগিয়ে নিয়ে যাচ্ছে — তাদের পরিচয় ও সাফল্য।" />

        {spotlight && (
          <div className="grid lg:grid-cols-3 gap-6 items-stretch mb-12">
            <Reveal className="h-full">
              <div className="shine h-full bg-primary-950 rounded-3xl p-8 md:p-10 flex flex-col items-center text-center relative overflow-hidden">
                <div className="moving-border w-28 h-28 rounded-full mb-6">
                  <div className="w-full h-full rounded-full bg-accent-500 flex items-center justify-center">
                    <span className="font-heading font-extrabold text-3xl text-white">
                      {spotlight.name
                        .split(' ')
                        .map(w => w[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </span>
                  </div>
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-white">{spotlight.name}</h3>
                {spotlight.nameBn && <p className="font-bangla text-accent-400 font-semibold mt-1">{spotlight.nameBn}</p>}
                <div className="px-3 py-1 rounded-full bg-success-500/15 border border-success-500/40 text-success-400 text-xs font-bold uppercase tracking-wider mt-4">
                  {spotlight.title}
                </div>
                {spotlight.quote && <p className="text-primary-100/80 italic font-medium mt-6 leading-relaxed">{spotlight.quote}</p>}
              </div>
            </Reveal>

            {spotlight.highlights && spotlight.highlights.length > 0 && (
              <Reveal delay={120} className="lg:col-span-2 h-full">
                <div className="h-full bg-white border border-gray-100 rounded-3xl shadow-sm p-8 md:p-10">
                  <h3 className="font-heading font-bold text-xl text-primary-950 mb-6">Achievement Highlights</h3>
                  <ul className="space-y-4">
                    {spotlight.highlights.map(highlight => (
                      <li key={highlight.text} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                        <span className="font-heading font-extrabold text-accent-500 w-14 shrink-0">{highlight.year}</span>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                          <span className="font-medium text-gray-700">{highlight.text}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </div>
        )}

        {leaders.length > 0 && (
          <>
            <SectionHeading eyebrow="Club Leadership" title="The Minds Behind the Club" />
            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
              {leaders.map((leader, i) => (
                <Reveal key={`${leader.role}-${i}`} delay={i * 120} className="h-full">
                  <div className="shine group bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 group-hover:bg-primary-950 group-hover:text-accent-400 transition-colors duration-300">
                      <UserCircle className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-600 mb-1">{leader.role}</p>
                      <h3 className="font-bangla font-bold text-lg text-primary-950 leading-snug">{leader.name}</h3>
                      {leader.confirmed && (
                        <span className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-bold text-success-600 uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </>
        )}

        {committeeRoles.length > 0 && (
          <Reveal>
            <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm">
              <h3 className="font-heading font-bold text-lg text-primary-950 mb-2">Club Committee</h3>
              <p className="font-bangla text-gray-500 text-sm mb-6">নাম নিশ্চিত হওয়ার পর প্রকাশ করা হবে।</p>
              <div className="flex flex-wrap gap-3">
                {committeeRoles.map(role => (
                  <span key={role} className="px-4 py-2 rounded-full bg-surface-sec border border-gray-200 text-sm text-gray-600 font-medium">
                    {role} <span className="text-gray-400 text-xs">— TBA</span>
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
