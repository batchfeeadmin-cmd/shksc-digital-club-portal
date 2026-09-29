import React, { useState } from 'react';
import { SectionHeading } from './ui/SectionHeading';
import { Reveal } from './ui/Reveal';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Arafat Rahman',
    role: 'Former President, Science Club',
    image: 'https://i.pravatar.cc/150?u=arafat',
    quote: "Being a part of the Science Club was the highlight of my school years. It helped me develop leadership skills and a deep passion for research. The digital portal makes it so much easier for new students to discover these opportunities."
  },
  {
    id: 2,
    name: 'Nusrat Jahan Faria',
    role: 'Member, Debating Society',
    image: 'https://i.pravatar.cc/150?u=nusrat',
    quote: "The debating society gave me the confidence to speak my mind. From local competitions to national events, the support from our teachers and alumni was incredible. I encourage everyone to join a club that aligns with their interests."
  },
  {
    id: 3,
    name: 'Tahmid Hasan Siam',
    role: 'General Secretary, IT Club',
    image: 'https://i.pravatar.cc/150?u=tahmid',
    quote: "Organizing workshops and tech fests taught me more about teamwork than any textbook could. The experiences and connections I made here are invaluable. The new digital registration process is a game-changer!"
  }
];

export function HomeTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-primary-950 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading 
          eyebrow="Student Voices"
          title="What Our Members Say"
          subtitle="Hear from students who have transformed their school experience through our clubs."
        />

        <div className="mt-16 max-w-4xl mx-auto relative">
          <Reveal>
            <div className="bg-primary-900/50 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-primary-800 relative">
              <Quote className="absolute top-8 left-8 w-12 h-12 text-primary-700 opacity-50" />
              
              <div className="relative z-10 text-center">
                <p className="text-xl md:text-2xl font-medium leading-relaxed mb-10 text-primary-50">
                  "{testimonials[currentIndex].quote}"
                </p>
                
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-accent-500 p-1 mb-4">
                    <img 
                      src={testimonials[currentIndex].image} 
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h4 className="font-bold text-lg text-white">{testimonials[currentIndex].name}</h4>
                  <p className="text-primary-300 text-sm">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="flex justify-center gap-4 mt-8">
            <button 
              onClick={prevTestimonial}
              className="p-3 rounded-full bg-primary-900 text-white hover:bg-accent-500 transition-colors border border-primary-800 hover:border-accent-500 focus:outline-none"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextTestimonial}
              className="p-3 rounded-full bg-primary-900 text-white hover:bg-accent-500 transition-colors border border-primary-800 hover:border-accent-500 focus:outline-none"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Show testimonial ${idx + 1}`}
                aria-current={currentIndex === idx}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'bg-accent-500 w-8' : 'bg-primary-800 hover:bg-primary-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
