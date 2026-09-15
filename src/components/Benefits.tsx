import React from 'react';
import { Target, Users, Lightbulb, Compass, Link2, Award } from 'lucide-react';
import { Reveal } from './ui/Reveal';

export function Benefits() {
  const benefits = [
    {
      icon: <Compass className="w-6 h-6" />,
      title: "Discover Leadership",
      description: "Take charge of projects and learn to inspire and guide your peers."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Teamwork Experience",
      description: "Collaborate with diverse students towards common organizational goals."
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Foster Creativity",
      description: "Express your ideas in a supportive environment that values innovation."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Skill Development",
      description: "Build practical, real-world skills outside the traditional classroom setting."
    },
    {
      icon: <Link2 className="w-6 h-6" />,
      title: "Valuable Networking",
      description: "Connect with alumni, mentors, and peers who share your academic interests."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Competition Experience",
      description: "Represent SHKSC in regional and national inter-school events."
    }
  ];

  return (
    <section className="py-24 bg-primary-950 text-white relative overflow-hidden">
      {/* Floating glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary-800/40 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent-600/15 rounded-full blur-3xl animate-float-delayed"></div>
      {/* Gradient hairline */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-accent-400/60 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-4 py-1 bg-primary-800/60 text-accent-400 rounded-full text-sm font-semibold mb-4 border border-primary-700">
            Member Benefits
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Why Join an <span className="text-accent-400">SHKSC Club?</span>
          </h2>
          <p className="text-primary-100 text-lg">
            Elevate your high school experience by becoming an active member of our dynamic club community.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Reveal key={index} delay={(index % 3) * 110} className="h-full">
              <div className="group bg-gradient-to-b from-primary-900/60 to-primary-900/20 border border-primary-800 p-8 rounded-2xl h-full transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-400/50 hover:shadow-2xl hover:shadow-accent-500/10">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-700 to-primary-900 rounded-xl flex items-center justify-center text-accent-400 mb-6 border border-primary-700 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:text-accent-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:text-accent-300 transition-colors">{benefit.title}</h3>
                <p className="text-primary-100 leading-relaxed text-sm">
                  {benefit.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
