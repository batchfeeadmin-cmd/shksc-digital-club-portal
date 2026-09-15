import React from 'react';
import { BookOpen, Bot, Rocket, Trophy } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from './SectionHeading';
import { sciencePrograms, scienceProgramArchive, scienceProjects } from '../../data/clubs/science-portal';

export function SciencePrograms() {
  return (
    <section id="programs" className="py-24 lg:py-28 bg-surface-sec">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Club Programs"
          title="Structured Pathways to Excellence"
          subtitle="লক্ষ্যভিত্তিক প্রোগ্রামের মাধ্যমে প্রতিটি শিক্ষার্থীর দক্ষতা বিকাশ — Olympiad থেকে Robotics পর্যন্ত।"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sciencePrograms.map((program, i) => (
            <Reveal key={program.title} delay={(i % 3) * 100} className="h-full">
              <div className="shine group bg-white border border-gray-100 rounded-2xl p-7 h-full shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-primary-200 transition-all duration-300">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-primary-950 text-accent-400 flex items-center justify-center group-hover:bg-accent-500 group-hover:text-white transition-colors duration-300">
                    <program.icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-success-50 text-success-700 border border-success-100 text-[11px] font-bold uppercase tracking-wider">
                    {program.tag}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-primary-950 mb-2">{program.title}</h3>
                <p className="font-bangla text-sm text-gray-500 leading-relaxed">{program.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8">
          <div className="flex items-center gap-4 bg-white border border-dashed border-accent-300 rounded-2xl px-6 py-5">
            <BookOpen className="w-5 h-5 text-accent-500 shrink-0" />
            <p className="font-bangla text-gray-600 text-sm md:text-base">
              <span className="font-heading font-bold text-primary-950">Archive:</span> {scienceProgramArchive}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ScienceProjectShowcase() {
  return (
    <section id="projects" className="py-24 lg:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Project Showcase"
          title="Ideas That Became Reality"
          subtitle="শিক্ষার্থীদের নিজস্ব প্রজেক্ট, prototype ও innovation — যা ক্লাবকে এগিয়ে নিয়ে যায়।"
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {scienceProjects.map(project => (
            <Reveal key={project.name} className="lg:col-span-2">
              <div className="shine group h-full bg-primary-950 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 opacity-10" aria-hidden>
                  <Bot className="w-64 h-64 text-white" />
                </div>
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full bg-success-500/15 border border-success-500/40 text-success-400 text-xs font-bold uppercase tracking-wider">
                      {project.category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-primary-100 text-xs font-bold uppercase tracking-wider">
                      {project.year}
                    </span>
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-white mb-3">{project.name}</h3>
                  <p className="text-primary-100/70 font-semibold text-sm mb-6">{project.team}</p>
                  <p className="font-bangla text-primary-100/90 leading-8 text-base md:text-lg mb-8 max-w-2xl">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.technologies.map(tech => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-full bg-accent-400/10 border border-accent-400/30 text-accent-400 text-xs font-bold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/15">
                    <Trophy className="w-5 h-5 text-accent-400 shrink-0" />
                    <span className="text-white font-semibold text-sm">{project.award}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={150} className="h-full">
            <div className="h-full border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center min-h-[280px]">
              <Rocket className="w-10 h-10 text-gray-300 mb-4" />
              <h3 className="font-heading font-bold text-primary-950 mb-2">Your Project Here</h3>
              <p className="font-bangla text-gray-500 text-sm leading-relaxed">
                নতুন প্রজেক্ট যোগ হলে এখানে showcase করা হবে।
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
