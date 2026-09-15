import React from 'react';

export function GalleryGrid({ images }: { images: string[] }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <div key={index} className={`relative rounded-xl overflow-hidden group cursor-pointer ${index === 0 ? 'col-span-2 row-span-2' : ''}`}>
          <div className="aspect-square w-full">
            <img 
              src={image} 
              alt="Gallery item" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 bg-primary-950/0 group-hover:bg-primary-950/20 transition-colors duration-300"></div>
        </div>
      ))}
    </div>
  );
}
