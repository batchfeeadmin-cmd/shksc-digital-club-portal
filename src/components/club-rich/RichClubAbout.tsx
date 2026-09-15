import React from 'react';
import { Eye, Target, CheckCircle2 } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import type { Club } from '../../types';

export function RichClubAbout({ club }: { club: Club }) {
  const aboutText = club.history || club.fullDescription;
  const hasText = !!aboutText;
  const hasVisionMission = !!(club.vision || club.mission);
  const hasObjectives = !!(club.objectives && club.objectives.length > 0);

  if (!hasText && !hasVisionMission && !hasObjectives) return null;

  return (
    <section id="about" className="py-24 lg:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="About the Club" title={<>Inside <span className="text-accent-500">{club.name}</span></>} />

        {hasText && (
          <Reveal>
            <p className="font-bangla text-gray-600 leading-8 text-base md:text-lg max-w-4xl mx-auto text-center">
              {aboutText}
            </p>
          </Reveal>
        )}

        {hasVisionMission && (
          <div className="grid md:grid-cols-2 gap-6 mt-16">
            {club.vision && (
              <Reveal className="h-full">
                <div className="shine h-full bg-primary-950 rounded-3xl p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-accent-500 flex items-center justify-center shrink-0">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-heading font-bold text-2xl text-white">Our Vision</h3>
                  </div>
                  <p className="font-bangla text-primary-100 leading-8 text-base md:text-lg">{club.vision}</p>
                </div>
              </Reveal>
            )}
            {club.mission && (
              <Reveal delay={120} className="h-full">
                <div className="shine h-full bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-success-50 border border-success-100 flex items-center justify-center shrink-0">
                      <Target className="w-6 h-6 text-success-600" />
                    </div>
                    <h3 className="font-heading font-bold text-2xl text-primary-950">Our Mission</h3>
                  </div>
                  <p className="font-bangla text-gray-600 leading-8 text-base md:text-lg">{club.mission}</p>
                </div>
              </Reveal>
            )}
          </div>
        )}

        {hasObjectives && (
          <Reveal className="mt-16">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm">
              <h3 className="font-heading font-bold text-xl text-primary-950 mb-6">Club Objectives</h3>
              <ul className="grid sm:grid-cols-2 gap-4">
                {club.objectives!.map((objective, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success-500 mt-0.5 shrink-0" />
                    <span className="font-bangla text-gray-600 leading-relaxed">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
