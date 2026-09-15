import React from 'react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from './SectionHeading';
import { scienceActivities } from '../../data/clubs/science-portal';

export function ScienceActivities() {
  return (
    <section id="activities" className="py-24 lg:py-28 bg-surface-sec">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What We Do"
          title="Hands-On Science. Real Discovery."
          subtitle="ক্লাসের বাইরে বিজ্ঞানকে কাছে থেকে ছুঁয়ে দেখা — পরীক্ষা, প্রজেক্ট ও প্রতিযোগিতার মাধ্যমে শেখা।"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {scienceActivities.map((activity, i) => (
            <Reveal key={activity.title} delay={(i % 5) * 80} className="h-full">
              <div className="shine group bg-white border border-gray-100 rounded-2xl p-6 h-full shadow-sm hover:shadow-xl hover:border-accent-300 hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-5 group-hover:bg-primary-950 group-hover:text-accent-400 transition-colors duration-300">
                  <activity.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-primary-950 leading-snug mb-1">{activity.title}</h3>
                <p className="font-bangla text-xs font-semibold text-accent-600 mb-2">{activity.titleBn}</p>
                <p className="font-bangla text-sm text-gray-500 leading-relaxed">{activity.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
