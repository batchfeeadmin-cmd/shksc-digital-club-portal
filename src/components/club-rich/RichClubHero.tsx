import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, CalendarDays, Users, Trophy, Tag } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { Button } from '../ui/button';
import { CountUp } from '../ui/CountUp';
import type { Club, RichStat } from '../../types';

interface RichClubHeroProps {
  club: Club;
  richStats?: RichStat[];
  hasActivities: boolean;
}

function buildDerivedStats(club: Club): RichStat[] {
  const stats: RichStat[] = [];
  if (club.establishedYear && club.establishedYear > 0) {
    stats.push({ label: 'Established', value: String(club.establishedYear), countUp: true, end: club.establishedYear });
  }
  if (club.memberCount > 0) {
    stats.push({ label: 'Members', value: String(club.memberCount), countUp: true, end: club.memberCount });
  }
  if (club.achievementCount && club.achievementCount > 0) {
    stats.push({ label: 'Awards', value: `${club.achievementCount}+`, countUp: true, end: club.achievementCount, suffix: '+' });
  }
  if (club.category) {
    stats.push({ label: 'Category', value: club.category });
  }
  return stats;
}

export function RichClubHero({ club, richStats, hasActivities }: RichClubHeroProps) {
  const stats = richStats && richStats.length > 0 ? richStats : buildDerivedStats(club);
  const words = club.name.split(' ').filter(Boolean);
  const description =
    club.fullDescription || club.shortDescription || 'এই ক্লাবের বিস্তারিত তথ্য শীঘ্রই যুক্ত করা হবে — SHKSC Digital Club Portal।';

  return (
    <div className="relative">
      <section className="relative pt-32 pb-32 lg:pt-44 lg:pb-40 overflow-hidden bg-primary-950">
        {club.coverImage ? (
          <div className="absolute inset-0" aria-hidden>
            <img src={club.coverImage} alt="" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-primary-950/80"></div>
          </div>
        ) : null}
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
                <Sparkles className="w-3.5 h-3.5" /> {club.category}
                {club.establishedYear ? ` · ESTD ${club.establishedYear}` : ''}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="font-heading font-extrabold text-4xl md:text-6xl text-white leading-[1.06] tracking-tight">
                {words.map((word, i) => (
                  <React.Fragment key={i}>
                    <span className="hero-word" style={{ animationDelay: `${0.1 + i * 0.15}s` }}>
                      {word}
                    </span>
                    {i < words.length - 1 ? ' ' : ''}
                  </React.Fragment>
                ))}
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="font-bangla text-primary-100/80 mt-6 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                {description}
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-accent-500 hover:bg-accent-600 text-white border-none">
                  <Link to={`/registration?club=${club.id}`}>
                    Join This Club <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <a href={hasActivities ? '#activities' : '#about'}>{hasActivities ? 'Our Activities' : 'About Us'}</a>
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Club logo visual — institutional badge */}
          <Reveal delay={250} className="flex justify-center">
            <div className="relative">
              {club.logo.startsWith('/') ? (
                <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-primary-950 moving-border shine-auto animate-float relative">
                  {/* Rotating ring text */}
                  <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100" aria-hidden>
                    <defs>
                      <path
                        id={`ring-path-${club.slug}`}
                        d="M50,50 m-33,0 a33,33 0 1,1 66,0 a33,33 0 1,1 -66,0"
                      />
                    </defs>
                    <text fill="#ffffff" style={{ fontSize: 5.5, fontWeight: 700, letterSpacing: 0.22 }}>
                      <textPath
                        href={`#ring-path-${club.slug}`}
                        textLength="206"
                        lengthAdjust="spacingAndGlyphs"
                      >
                        {`${club.name.toUpperCase()} • ESTD ${club.establishedYear || ''} • `}
                      </textPath>
                    </text>
                  </svg>
                  {/* White center with emblem */}
                  <div className="absolute inset-[26%] rounded-full bg-white overflow-hidden flex items-center justify-center p-5 md:p-7 shadow-[inset_0_0_24px_rgba(23,37,84,0.12)]">
                    <img
                      src={club.logo}
                      alt={`${club.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-72 h-72 md:w-96 md:h-96 rounded-full moving-border shine-auto animate-float bg-primary-900/40 flex items-center justify-center overflow-hidden">
                  <span className="font-heading font-extrabold text-7xl md:text-8xl text-white">{club.logo}</span>
                </div>
              )}
              {club.establishedYear ? (
                <div className="absolute -left-4 md:-left-10 top-12 bg-white rounded-2xl shadow-xl px-4 py-3 animate-float-delayed">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-bold text-primary-950">ESTD {club.establishedYear}</span>
                  </div>
                </div>
              ) : null}
              {club.memberCount > 0 && (
                <div className="absolute -right-2 md:-right-8 bottom-14 bg-white rounded-2xl shadow-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent-500" />
                    <span className="text-sm font-bold text-primary-950">{club.memberCount} Members</span>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quick Stats — overlapping cards */}
      {stats.length > 0 && (
        <div className="relative z-20 -mt-12 lg:-mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100} className="h-full">
                <div className="shine group bg-white rounded-2xl border border-gray-100 shadow-lg shadow-primary-950/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 lg:p-7 h-full flex flex-col justify-between gap-6">
                  <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    {stat.label === 'Established' ? (
                      <CalendarDays className="w-5 h-5" />
                    ) : stat.label === 'Members' ? (
                      <Users className="w-5 h-5" />
                    ) : stat.label === 'Awards' ? (
                      <Trophy className="w-5 h-5" />
                    ) : (
                      <Tag className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    {stat.countUp && stat.end !== undefined ? (
                      <div className="font-heading font-extrabold text-3xl lg:text-4xl text-primary-950">
                        <CountUp value={stat.end} suffix={stat.suffix} />
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
      )}
    </div>
  );
}
