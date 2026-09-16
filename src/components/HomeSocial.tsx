import React from 'react';
import { SectionHeading } from './ui/SectionHeading';
import { Facebook, Youtube, Instagram, Twitter, ExternalLink } from 'lucide-react';
import { Reveal } from './ui/Reveal';

export function HomeSocial() {
  const socials = [
    {
      name: 'Facebook Page',
      icon: <Facebook className="w-6 h-6" />,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      link: '#',
      followers: '15K+'
    },
    {
      name: 'YouTube Channel',
      icon: <Youtube className="w-6 h-6" />,
      color: 'bg-red-600',
      hoverColor: 'hover:bg-red-700',
      link: '#',
      followers: '5K+'
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-6 h-6" />,
      color: 'bg-pink-600',
      hoverColor: 'hover:bg-pink-700',
      link: '#',
      followers: '8K+'
    },
    {
      name: 'Twitter (X)',
      icon: <Twitter className="w-6 h-6" />,
      color: 'bg-slate-800',
      hoverColor: 'hover:bg-slate-900',
      link: '#',
      followers: '3K+'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          eyebrow="Connect With Us"
          title="Join Our Social Community"
          subtitle="Follow us on social media to get instant updates, live event coverage, and behind-the-scenes moments."
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {socials.map((social, index) => (
            <Reveal key={social.name} delay={index * 0.1}>
              <a 
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center p-8 rounded-2xl text-white transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl ${social.color} ${social.hoverColor} group`}
              >
                <div className="bg-white/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  {social.icon}
                </div>
                <h3 className="font-bold text-lg mb-1">{social.name}</h3>
                <p className="text-white/80 text-sm mb-4">{social.followers} Followers</p>
                
                <span className="flex items-center gap-2 text-sm font-medium bg-white/10 px-4 py-2 rounded-full group-hover:bg-white/20 transition-colors">
                  Follow Us <ExternalLink className="w-4 h-4" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
