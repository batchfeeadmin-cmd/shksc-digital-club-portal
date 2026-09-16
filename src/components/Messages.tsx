import React, { useState, useEffect } from 'react';
import { Quote, X, ZoomIn } from 'lucide-react';
import { Reveal } from './ui/Reveal';
import { getCMSData, AuthorityMessage } from '../services/cms/cmsService';

export function Messages() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<AuthorityMessage[]>([]);

  useEffect(() => {
    const fetchMessages = () => {
      setMessages(getCMSData().messages);
    };
    
    fetchMessages();
    window.addEventListener('shksc_state_update', fetchMessages);
    return () => window.removeEventListener('shksc_state_update', fetchMessages);
  }, []);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center mb-16 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-950 via-primary-600 to-primary-950 bg-[length:200%_auto] animate-gradient-x mb-5">
              Messages from the Authority
            </h2>
            <div className="w-0 h-1.5 bg-gradient-to-r from-accent-400 to-accent-600 rounded-full expand-line opacity-0"></div>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-10">
          
          {messages.map((msg, index) => (
            <Reveal key={msg.id} delay={(index + 1) * 100}>
              <div className="group shine bg-gradient-to-br from-white to-surface-sec rounded-3xl p-8 md:p-10 border border-primary-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 relative h-full flex flex-col">
                <Quote className="absolute top-8 right-8 w-14 h-14 text-primary-50 opacity-60 group-hover:text-primary-100 group-hover:scale-110 transition-all duration-500" fill="currentColor" />
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 relative z-10">
                  <div 
                    className="w-40 h-40 md:w-48 md:h-48 shrink-0 rounded-[1.4rem] p-1.5 bg-white shadow-xl moving-border cursor-pointer group/img relative"
                    onClick={() => setSelectedImage(msg.image)}
                  >
                    <div className="w-full h-full rounded-2xl overflow-hidden relative">
                      <img 
                        src={msg.image} 
                        alt={msg.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                      />
                      <div className="absolute inset-0 bg-primary-900/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <ZoomIn className="text-white w-8 h-8" />
                      </div>
                    </div>
                  </div>
                  <div className="text-center sm:text-left pt-3">
                    <h3 className="text-2xl font-heading font-extrabold text-primary-950 mb-1.5">{msg.name}</h3>
                    <p className="text-xs font-bold text-accent-600 mb-2 uppercase tracking-[0.2em]">{msg.title}</p>
                  </div>
                </div>
                
                <div className="flex-1 relative z-10">
                  <p className="text-gray-600 leading-loose italic text-[1.1rem] font-medium">
                    "{msg.quote}"
                  </p>
                </div>
              </div>
            </Reveal>
          ))}

        </div>
      </div>

      {/* Image Lightbox / Zoom Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-all"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 md:top-10 md:right-10 text-white hover:text-accent-400 transition-colors bg-white/10 hover:bg-white/20 p-3 rounded-full flex items-center justify-center group"
            onClick={() => setSelectedImage(null)}
            title="Close (Minus)"
          >
            <X className="w-8 h-8 group-hover:scale-90 transition-transform" />
          </button>
          
          <img 
            src={selectedImage} 
            alt="Expanded view" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()} /* Prevent closing when clicking the image itself */
          />
        </div>
      )}
    </section>
  );
}
