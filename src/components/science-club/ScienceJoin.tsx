import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, CalendarDays, GraduationCap, ExternalLink } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from './SectionHeading';
import { Button } from '../ui/button';
import {
  scienceWhyJoin,
  scienceMembershipFields,
  scienceMembershipInterests,
  scienceUpcomingEvents,
  scienceNews
} from '../../data/clubs/science-portal';

export function ScienceJoin() {
  return (
    <>
      {/* ===== Why Join ===== */}
      <section id="join" className="py-24 lg:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Join Science Club?"
            title={<>Discover. Experiment. <span className="text-accent-500">Create.</span></>}
            subtitle="Science Club শুধু competition জেতার জায়গা নয়। এটি এমন একটি community, যেখানে প্রশ্ন করা, পরীক্ষা করা, ভুল থেকে শেখা, নতুন কিছু তৈরি করা এবং একসঙ্গে problem solve করার সুযোগ তৈরি হয়।"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {scienceWhyJoin.map((item, i) => (
              <Reveal key={item.title} delay={(i % 5) * 80} className="h-full">
                <div className="shine group bg-white border border-gray-100 rounded-2xl p-6 h-full shadow-sm hover:shadow-xl hover:border-success-300 hover:-translate-y-1.5 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-success-50 border border-success-100 text-success-600 flex items-center justify-center mb-5 group-hover:bg-success-500 group-hover:text-white transition-colors duration-300">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-primary-950 leading-snug mb-1">{item.title}</h3>
                  <p className="font-bangla text-xs font-semibold text-success-600 mb-2">{item.titleBn}</p>
                  <p className="font-bangla text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Membership ===== */}
      <section id="membership" className="py-24 lg:py-28 bg-surface-sec">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Become a Member"
                title="Turn Your Curiosity Into Discovery"
              />
              <Reveal>
                <p className="font-bangla text-gray-600 leading-8 text-base md:text-lg">
                  <span className="font-bold text-primary-950">৬ষ্ঠ–১০ম শ্রেণির</span> শিক্ষার্থীদের জন্য ক্লাবটি উন্মুক্ত।
                  Are you curious about how things work? Do you love experiments, mathematics, robotics or technology?
                  Join SHKSC Science Club and turn your curiosity into discovery.
                </p>
              </Reveal>
              <Reveal delay={100}>
                <h4 className="font-heading font-bold text-primary-950 mt-9 mb-4">Interested Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {scienceMembershipInterests.map(interest => (
                    <span
                      key={interest}
                      className="px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-700"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={150}>
              <div className="shine bg-primary-950 rounded-3xl p-8 md:p-10 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-accent-500 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-white">Membership Application</h3>
                </div>
                <ul className="space-y-3 mb-9">
                  {scienceMembershipFields.map(field => (
                    <li key={field} className="flex items-center gap-3 text-primary-100/90">
                      <span className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-success-400" />
                      </span>
                      <span className="text-sm font-medium">{field}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="w-full bg-accent-500 hover:bg-accent-600 text-white border-none">
                  <Link to="/registration?club=c3">
                    Apply for Membership <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <p className="font-bangla text-center text-primary-100/60 text-xs mt-4">
                  অনলাইন আবেদন সম্পন্ন হলে ক্লাব কর্তৃপক্ষ যোগাযোগ করবে।
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== News & Events ===== */}
      <section id="news" className="py-24 lg:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="News & Events" title="What's Happening at the Club" />

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upcoming events */}
            <Reveal className="h-full">
              <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 md:p-10 h-full">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-primary-950">Upcoming Events</h3>
                </div>
                <ul className="space-y-4">
                  {scienceUpcomingEvents.map(event => (
                    <li
                      key={event.title}
                      className="flex items-center gap-4 p-4 rounded-xl bg-surface-sec border border-gray-100 hover:border-primary-200 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 text-primary-600 flex items-center justify-center shrink-0">
                        <event.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-heading font-bold text-primary-950 text-sm md:text-base">{event.title}</p>
                        <p className="text-xs text-gray-500">{event.note}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Latest news */}
            <Reveal delay={120} className="h-full">
              <div className="flex flex-col gap-5 h-full">
                {scienceNews.map((news, i) =>
                  i === 0 ? (
                    <div key={news.title} className="shine group bg-primary-950 rounded-3xl p-8 md:p-10 relative overflow-hidden">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-2.5 py-1 rounded-full bg-accent-400 text-primary-950 text-[11px] font-extrabold uppercase tracking-wider">
                          {news.date}
                        </span>
                        <span className="text-success-400 text-[11px] font-bold uppercase tracking-wider">Latest News</span>
                      </div>
                      <h3 className="font-heading font-extrabold text-xl md:text-2xl text-white mb-3">{news.title}</h3>
                      <p className="text-primary-100/80 text-sm leading-relaxed mb-6">{news.description}</p>
                      {news.link && (
                        <a
                          href={news.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-accent-400 font-bold text-sm hover:text-accent-300 transition-colors"
                        >
                          Read on Official Website <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <div
                      key={news.title}
                      className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-accent-300 transition-colors"
                    >
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-accent-600 w-20 shrink-0">
                        {news.date}
                      </span>
                      <div>
                        <p className="font-heading font-bold text-primary-950 text-sm">{news.title}</p>
                        <p className="font-bangla text-xs text-gray-500">{news.description}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
