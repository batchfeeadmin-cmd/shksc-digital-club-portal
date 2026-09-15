import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, Trophy, CalendarDays } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { Button } from '../ui/button';
import { CountUp } from './CountUp';
import { scienceQuickStats } from '../../data/clubs/science-portal';

export function ScienceHero() {
  return (
    <div className="relative">
      <section className="relative pt-32 pb-32 lg:pt-44 lg:pb-40 overflow-hidden bg-primary-950">
        {/* Faint lab photo + solid navy wash */}
        <div className="absolute inset-0" aria-hidden>
          <img src="/assets/science-club/lab.jpg" alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-primary-950/80"></div>
        </div>
        <div className="absolute inset-0 grid-overlay" aria-hidden></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <Reveal>
              <Link
                to="/clubs"
                className="inline-flex items-center gap-2 text-primary-100/60 hover:text-white text-xs font-bold uppercase tracking-[0.18em] transition-colors mb-6"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> All Clubs
              </Link>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-400/40 bg-accent-400/10 text-accent-400 text-xs font-bold uppercase tracking-[0.2em] mb-7">
                <Sparkles className="w-3.5 h-3.5" /> SHKSC Science Club · ESTD 2013
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="font-heading font-extrabold text-5xl md:text-7xl text-white leading-[1.04] tracking-tight">
                <span className="hero-word" style={{ animationDelay: '0.1s' }}>Curiosity.</span>
                <br />
                <span className="hero-word" style={{ animationDelay: '0.25s' }}>Discovery.</span>
                <br />
                <span className="hero-word text-accent-400" style={{ animationDelay: '0.4s' }}>Innovation.</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="font-bangla text-xl md:text-2xl text-primary-100 font-semibold mt-7 leading-relaxed">
                কৌতূহল থেকে অনুসন্ধান, অনুসন্ধান থেকে উদ্ভাবন।
              </p>
            </Reveal>
            <Reveal delay={300}>
              <p className="font-bangla text-primary-100/80 mt-4 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                সামসুল হক খান স্কুল অ্যান্ড কলেজ বিজ্ঞান ক্লাব শিক্ষার্থীদের বিজ্ঞানমনস্কতা, সৃজনশীলতা, গবেষণা ও উদ্ভাবনী দক্ষতা বিকাশের একটি প্রাণবন্ত প্ল্যাটফর্ম।
              </p>
            </Reveal>
            <Reveal delay={400}>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600 text-white border-none">
                  <a href="#achievements">Explore Achievements <ArrowRight className="w-4 h-4 ml-2" /></a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  <a href="#activities">Our Activities</a>
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Club logo visual */}
          <Reveal delay={250} className="flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 md:w-96 md:h-96 rounded-full moving-border shine-auto animate-float">
                <img
                  src="/assets/science-club/logo.jpg"
                  alt="SHKSC Science Club Logo"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="absolute -left-4 md:-left-10 top-12 bg-white rounded-2xl shadow-xl px-4 py-3 animate-float-delayed">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-bold text-primary-950">ESTD 2013</span>
                </div>
              </div>
              <div className="absolute -right-2 md:-right-8 bottom-14 bg-white rounded-2xl shadow-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-accent-500" />
                  <span className="text-sm font-bold text-primary-950">100+ Awards</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quick Stats — overlapping cards */}
      <div className="relative z-20 -mt-12 lg:-mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {scienceQuickStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 100} className="h-full">
              <div className="shine group bg-white rounded-2xl border border-gray-100 shadow-lg shadow-primary-950/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 lg:p-7 h-full flex flex-col justify-between gap-6">
                <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  {stat.countUp ? (
                    <div className="font-heading font-extrabold text-3xl lg:text-4xl text-primary-950">
                      <CountUp end={stat.end ?? 0} suffix={stat.suffix} />
                    </div>
                  ) : (
                    <div className="font-heading font-extrabold text-xl lg:text-2xl text-primary-950 leading-tight">
                      {stat.value}
                    </div>
                  )}
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500 mt-2">{stat.label}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
