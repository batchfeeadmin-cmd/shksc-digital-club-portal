import React from 'react';
import { SectionHeading } from './ui/SectionHeading';
import { Reveal } from './ui/Reveal';
import { Camera } from 'lucide-react';

const galleryImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80',
    title: 'Science Fair 2023',
    span: 'col-span-1 md:col-span-2 row-span-2'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80',
    title: 'Debate Championship',
    span: 'col-span-1 row-span-1'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80',
    title: 'IT Club Workshop',
    span: 'col-span-1 row-span-1'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&q=80',
    title: 'Cultural Festival',
    span: 'col-span-1 md:col-span-2 row-span-1'
  }
];

export function HomeGallery() {
  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          eyebrow="Moments"
          title="Recent Highlights"
          subtitle="Glimpses of vibrant club activities, events, and memories created by our students."
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 grid-rows-none md:grid-rows-2 gap-4 max-w-6xl mx-auto h-auto md:h-[600px]">
          {galleryImages.map((image, index) => (
            <div 
              key={image.id} 
              className={`${image.span} relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-64 md:h-auto`}
            >
              <Reveal className="w-full h-full" delay={index * 0.1}>
                <img 
                  src={image.url} 
                  alt={image.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex items-center gap-2 text-white">
                    <Camera className="w-5 h-5 text-accent-500" />
                    <h3 className="font-bold text-lg">{image.title}</h3>
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
