import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { cn } from '../../lib/utils';
import type { Club, RichClub } from '../../types';

export function RichClubGallery({ club, rich }: { club: Club; rich: RichClub }) {
  const richItems = rich.galleryItems ?? [];
  const filters = rich.galleryFilters ?? [];
  const [filter, setFilter] = useState<string>('All');

  const hasRichGallery = richItems.length > 0;
  const plainImages = club.gallery ?? [];

  if (!hasRichGallery && plainImages.length === 0) return null;

  const items = hasRichGallery
    ? richItems
    : plainImages.map(image => ({ image, caption: club.name, category: 'Gallery' }));

  const filtered = filter === 'All' ? items : items.filter(item => item.category === filter);

  return (
    <section id="gallery" className="py-24 lg:py-28 bg-surface-sec">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Gallery" title="Moments That Matter" subtitle="ক্লাবের কার্যক্রম ও অর্জনের কিছু বাছাই করা মুহূর্ত।" />

        {filters.length > 1 && (
          <Reveal className="flex flex-wrap justify-center gap-2 mb-10">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border',
                  filter === f
                    ? 'bg-primary-950 text-white border-primary-950 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-900'
                )}
              >
                {f}
              </button>
            ))}
          </Reveal>
        )}

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.map((item, i) => (
              <Reveal key={`${item.image}-${i}`} delay={(i % 4) * 70} className={cn(i === 0 && filtered.length >= 5 && 'col-span-2 row-span-2')}>
                <div className="group relative rounded-2xl overflow-hidden h-full shine cursor-pointer">
                  <div className={cn('w-full', i === 0 && filtered.length >= 5 ? 'aspect-square h-full min-h-[200px]' : 'aspect-square')}>
                    <img
                      src={item.image}
                      alt={item.caption}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-primary-950/0 group-hover:bg-primary-950/50 transition-colors duration-300"></div>
                  <div className="absolute bottom-0 inset-x-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="font-bangla text-white text-sm font-semibold leading-snug">{item.caption}</p>
                    <span className="text-accent-400 text-[11px] font-bold uppercase tracking-wider">{item.category}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="text-center py-14 bg-white border border-dashed border-gray-200 rounded-2xl">
              <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="font-bangla text-gray-500">এই category-র ছবি শীঘ্রই যোগ হবে।</p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
