import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Check, ExternalLink, GraduationCap, Sparkles } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/button';
import type { Club, RichClub } from '../../types';

export function RichClubJoin({ club, rich }: { club: Club; rich: RichClub }) {
  const whyJoin = rich.whyJoin ?? [];
  const events = rich.events ?? [];
  const news = rich.news ?? [];
  const membershipFields = rich.membershipFields ?? [];
  const membershipOptions = rich.membershipOptions ?? [];

  return (
    <>
      {whyJoin.length > 0 && (
        <section id="why-join" className="py-24 lg:py-28 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow={`Why Join ${club.name}?`}
              title={<>Learn. Grow. <span className="text-accent-500">Belong.</span></>}
              subtitle="শুধু competition জেতার জায়গা নয় — এটি এমন একটি community, যেখানে শেখা, বন্ধুত্ব ও আত্মবিকাশ একসঙ্গে চলে।"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {whyJoin.map((item, i) => (
                <Reveal key={item.title} delay={(i % 4) * 80} className="h-full">
                  <div className="shine group bg-white border border-gray-100 rounded-2xl p-6 h-full shadow-sm hover:shadow-xl hover:border-success-300 hover:-translate-y-1.5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-success-50 border border-success-100 text-success-600 flex items-center justify-center mb-5 group-hover:bg-success-500 group-hover:text-white transition-colors duration-300">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading font-bold text-primary-950 leading-snug mb-2">{item.title}</h3>
                    <p className="font-bangla text-sm text-gray-500 leading-relaxed">{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="join" className="py-24 lg:py-28 bg-surface-sec">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Become a Member"
                title="Take the First Step Today"
              />
              <Reveal>
                <p className="font-bangla text-gray-600 leading-8 text-base md:text-lg">
                  {club.shortDescription ||
                    `${club.name}-এ যোগ দিতে চাইলে এখনই অনলাইন আবেদন সম্পন্ন করো। আবেদন জমা হলে ক্লাব কর্তৃপক্ষ যোগাযোগ করবে।`}
                </p>
              </Reveal>
              {club.coordinator && (
                <Reveal delay={100}>
                  <p className="mt-6 text-sm text-gray-500">
                    <span className="font-heading font-bold text-primary-950">Coordinator:</span> {String(club.coordinator)}
                  </p>
                </Reveal>
              )}
            </div>

            <Reveal delay={150}>
              <div className="shine bg-primary-950 rounded-3xl p-8 md:p-10 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-accent-500 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-white">Membership Application</h3>
                </div>

                {membershipOptions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {membershipOptions.map(option => (
                      <span
                        key={option}
                        className="px-3.5 py-1.5 rounded-full bg-accent-400/10 border border-accent-400/40 text-accent-400 text-sm font-bold"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                )}

                {membershipFields.length > 0 && (
                  <ul className="space-y-3 mb-9">
                    {membershipFields.map(field => (
                      <li key={field} className="flex items-center gap-3 text-primary-100/90">
                        <span className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-success-400" />
                        </span>
                        <span className="text-sm font-medium">{field}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {membershipFields.length === 0 && (
                  <p className="font-bangla text-primary-100/80 leading-relaxed mb-9">
                    অনলাইন আবেদন সম্পন্ন হলে ক্লাব কর্তৃপক্ষ তোমার সাথে যোগাযোগ করবে। Admission ও membership প্রক্রিয়া সম্পূর্ণ ডিজিটাল।
                  </p>
                )}

                <Button asChild size="lg" className="w-full bg-accent-500 hover:bg-accent-600 text-white border-none">
                  <Link to={`/registration?club=${club.id}`}>
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

      {(events.length > 0 || news.length > 0) && (
        <section id="news" className="py-24 lg:py-28 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="News & Events" title="What's Happening at the Club" />

            <div className="grid lg:grid-cols-2 gap-8">
              {events.length > 0 && (
                <Reveal className="h-full">
                  <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 md:p-10 h-full">
                    <div className="flex items-center gap-3 mb-7">
                      <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                        <CalendarDays className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading font-bold text-xl text-primary-950">Upcoming Events</h3>
                    </div>
                    <ul className="space-y-4">
                      {events.map(event => (
                        <li
                          key={event.title}
                          className="flex items-center gap-4 p-4 rounded-xl bg-surface-sec border border-gray-100 hover:border-primary-200 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 text-primary-600 flex items-center justify-center shrink-0">
                            <CalendarDays className="w-5 h-5" />
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
              )}

              {news.length > 0 && (
                <Reveal delay={120} className="h-full">
                  <div className="flex flex-col gap-5 h-full">
                    {news.map((item, i) =>
                      i === 0 ? (
                        <div key={item.title} className="shine group bg-primary-950 rounded-3xl p-8 md:p-10 relative overflow-hidden">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="px-2.5 py-1 rounded-full bg-accent-400 text-primary-950 text-[11px] font-extrabold uppercase tracking-wider">
                              {item.date}
                            </span>
                            <span className="text-success-400 text-[11px] font-bold uppercase tracking-wider">Latest News</span>
                          </div>
                          <h3 className="font-heading font-extrabold text-xl md:text-2xl text-white mb-3">{item.title}</h3>
                          <p className="text-primary-100/80 text-sm leading-relaxed mb-6">{item.description}</p>
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-accent-400 font-bold text-sm hover:text-accent-300 transition-colors"
                            >
                              Read More <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      ) : (
                        <div
                          key={item.title}
                          className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-accent-300 transition-colors"
                        >
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-accent-600 w-20 shrink-0">
                            {item.date}
                          </span>
                          <div>
                            <p className="font-heading font-bold text-primary-950 text-sm">{item.title}</p>
                            <p className="font-bangla text-xs text-gray-500">{item.description}</p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
