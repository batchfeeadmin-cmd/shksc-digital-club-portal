import React from 'react';
import { SectionHeading } from './ui/SectionHeading';
import { Globe2, Mail, LogIn, ExternalLink } from 'lucide-react';
import { Reveal } from './ui/Reveal';

export function HomeSocial() {
  const channels = [
    {
      name: 'School Website',
      description: 'Visit the official SHKSC website',
      icon: <Globe2 className="w-6 h-6" />,
      color: 'bg-primary-800 hover:bg-primary-900',
      link: 'https://shksc.edu.bd',
      external: true
    },
    {
      name: 'Email SHKSC',
      description: 'info.shksc@gmail.com',
      icon: <Mail className="w-6 h-6" />,
      color: 'bg-accent-600 hover:bg-accent-700',
      link: 'mailto:info.shksc@gmail.com',
      external: false
    },
    {
      name: 'Portal Login',
      description: 'Access your assigned dashboard',
      icon: <LogIn className="w-6 h-6" />,
      color: 'bg-slate-700 hover:bg-slate-800',
      link: '/login',
      external: false
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          eyebrow="Official Channels"
          title="Connect With SHKSC"
          subtitle="Use these verified destinations for school information, support, and portal access."
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {channels.map((channel, index) => (
            <Reveal key={channel.name} delay={index * 0.1}>
              <a 
                href={channel.link}
                target={channel.external ? '_blank' : undefined}
                rel={channel.external ? 'noopener noreferrer' : undefined}
                className={`flex h-full flex-col items-center justify-center p-8 rounded-2xl text-white text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl ${channel.color} group`}
              >
                <div className="bg-white/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  {channel.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{channel.name}</h3>
                <p className="text-white/80 text-sm mb-4">{channel.description}</p>
                
                <span className="flex items-center gap-2 text-sm font-medium bg-white/10 px-4 py-2 rounded-full group-hover:bg-white/20 transition-colors">
                  Open <ExternalLink className="w-4 h-4" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
