import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Reveal } from './ui/Reveal';

export function About() {
  const features = [
    'Discover new interests and passions',
    'Build essential leadership skills',
    'Develop creativity and innovation',
    'Improve communication and public speaking',
    'Gain valuable teamwork experience',
    'Participate in national competitions',
  ];

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-100 rounded-full blur-3xl opacity-50 animate-float"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Content */}
          <Reveal>
            <div className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold mb-6">
              About SHKSC Clubs
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-950 mb-6 leading-tight">
              More Than Clubs.<br />
              <span className="text-accent-600">A Place to Grow.</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              At SHKSC, we believe that education extends far beyond the classroom walls. Our diverse range of student clubs provides the perfect platform to explore your talents, build lifelong friendships, and develop practical skills that prepare you for the future.
            </p>

            <ul className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5 group-hover:scale-125 transition-transform duration-300" />
                  <span className="text-gray-700 font-medium group-hover:text-primary-900 transition-colors">{feature}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Visual */}
          <Reveal delay={120} className="relative">
            <div className="moving-border rounded-[1.6rem] bg-white p-2 shadow-xl relative z-10">
              <div className="aspect-[4/3] rounded-[1.2rem] overflow-hidden group">
                <img 
                  src="/about-students.jpg" 
                  alt="SHKSC students collaborating on a robotics project together"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-surface-sec rounded-2xl border border-gray-100 -z-10 hidden md:block"></div>
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-primary-100 rounded-full blur-3xl opacity-70 -z-10 animate-float-delayed"></div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
