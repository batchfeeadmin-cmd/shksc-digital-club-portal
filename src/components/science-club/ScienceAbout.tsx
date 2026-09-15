import React from 'react';
import { Eye, Target, Trophy, GraduationCap, Globe2 } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from './SectionHeading';

const aboutParagraphOne =
  'সামসুল হক খান স্কুল অ্যান্ড কলেজ বিজ্ঞান ক্লাব ২০১৩ সালে প্রতিষ্ঠিত হয়। শিক্ষার্থীদের বিজ্ঞান চিন্তার বিকাশ, বৈজ্ঞানিক অনুসন্ধান, উদ্ভাবন, আবিষ্কার ও গবেষণার প্রতি আগ্রহ সৃষ্টি করাই ক্লাবটির অন্যতম প্রধান উদ্দেশ্য।';

const aboutParagraphTwo =
  'দেশ ও দেশের বাইরের বিজ্ঞান, প্রযুক্তি ও গবেষণার অগ্রগতির সঙ্গে শিক্ষার্থীদের পরিচিত করার পাশাপাশি বিভিন্ন বিজ্ঞান অলিম্পিয়াড, বিজ্ঞান মেলা, কুইজ, প্রজেক্ট, গবেষণাধর্মী কার্যক্রম ও প্রতিযোগিতায় অংশগ্রহণের জন্য শিক্ষার্থীদের উৎসাহিত করা হয়। প্রতিষ্ঠার পর থেকে ক্লাবের সদস্যরা বিভিন্ন জাতীয় ও আন্তর্জাতিক প্রতিযোগিতায় উল্লেখযোগ্য সাফল্য অর্জন করেছে এবং একশতেরও বেশি পুরস্কার অর্জন করেছে।';

const aboutChips = [
  { icon: Trophy, label: '100+ Awards', color: 'text-accent-600 bg-accent-50 border-accent-100' },
  { icon: GraduationCap, label: 'Class 06–10', color: 'text-primary-600 bg-primary-50 border-primary-100' },
  { icon: Globe2, label: 'National & International', color: 'text-success-700 bg-success-50 border-success-100' }
];

export function ScienceAbout() {
  return (
    <section id="about" className="py-24 lg:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="About the Club"
          title={<>More Than a Club. <span className="text-accent-500">A Place to Discover.</span></>}
        />

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Image collage */}
          <Reveal className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-primary-950/15">
              <img
                src="/assets/science-club/lab.jpg"
                alt="Science Club lab experiment"
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-3 md:-right-8 w-44 md:w-60 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
              <img
                src="/assets/science-club/class.jpg"
                alt="Science Club session"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
            <div className="absolute -top-5 -left-3 md:-left-6 w-20 h-20 rounded-full bg-accent-500 text-white flex flex-col items-center justify-center shadow-lg animate-float">
              <span className="font-heading font-extrabold text-xl leading-none">2013</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">ESTD</span>
            </div>
          </Reveal>

          {/* Text */}
          <div>
            <Reveal>
              <h3 className="font-bangla font-bold text-2xl md:text-3xl text-primary-950 mb-6 leading-snug">
                ২০১৩ সাল থেকে বিজ্ঞানের পথে
              </h3>
              <p className="font-bangla text-gray-600 leading-8 text-base md:text-lg">
                {aboutParagraphOne}
              </p>
              <p className="font-bangla text-gray-600 leading-8 text-base md:text-lg mt-5">
                {aboutParagraphTwo}
              </p>
            </Reveal>
            <Reveal delay={150}>
              <div className="flex flex-wrap gap-3 mt-9">
                {aboutChips.map(chip => (
                  <span
                    key={chip.label}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${chip.color}`}
                  >
                    <chip.icon className="w-4 h-4" />
                    {chip.label}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-6 mt-28">
          <Reveal className="h-full">
            <div className="shine h-full bg-primary-950 rounded-3xl p-8 md:p-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-accent-500 flex items-center justify-center shrink-0">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-white">Our Vision</h3>
              </div>
              <p className="font-bangla text-primary-100 leading-8 text-base md:text-lg">
                বিজ্ঞানমনস্ক, সৃজনশীল, অনুসন্ধিৎসু ও প্রযুক্তিসচেতন একটি প্রজন্ম তৈরি করা, যারা জ্ঞান ও উদ্ভাবনের মাধ্যমে দেশ ও সমাজের উন্নয়নে অবদান রাখতে সক্ষম হবে।
              </p>
            </div>
          </Reveal>
          <Reveal delay={120} className="h-full">
            <div className="shine h-full bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-success-50 border border-success-100 flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6 text-success-600" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-primary-950">Our Mission</h3>
              </div>
              <p className="font-bangla text-gray-600 leading-8 text-base md:text-lg">
                শিক্ষার্থীদের মধ্যে বৈজ্ঞানিক চিন্তা ও problem-solving skill তৈরি করা; হাতে-কলমে experiment ও project-এর মাধ্যমে শেখার সুযোগ সৃষ্টি করা; Science, Mathematics, Robotics ও Technology বিষয়ে আগ্রহ বাড়ানো; জাতীয় ও আন্তর্জাতিক Olympiad ও competition-এর জন্য শিক্ষার্থীদের প্রস্তুত করা; এবং teamwork, research, leadership ও innovation culture গড়ে তোলা।
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
