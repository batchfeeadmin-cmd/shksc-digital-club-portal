import React from 'react';
import { Reveal } from './ui/Reveal';

export function RegistrationProcess() {
  const steps = [
    { num: '01', title: 'Explore Clubs', desc: 'Browse the club directory to find your interests.' },
    { num: '02', title: 'Choose Your Club', desc: 'Select the club that aligns with your goals.' },
    { num: '03', title: 'Complete Registration Form', desc: 'Fill out your student details securely online.' },
    { num: '04', title: 'Review Your Information', desc: 'Double-check your application details.' },
    { num: '05', title: 'Complete Payment', desc: 'Pay the required Registration Fee and Affiliation Cost.' },
    { num: '06', title: 'Receive Digital Receipt', desc: 'Get your official club membership confirmation.' },
  ];

  return (
    <section id="registration" className="py-24 bg-surface-sec relative overflow-hidden">
      <div className="absolute -top-16 left-1/3 w-80 h-80 bg-primary-100 rounded-full blur-3xl opacity-60 animate-float-delayed"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold mb-4">
            Simple Steps
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-950 mb-4">
            How Registration Works
          </h2>
          <p className="text-lg text-gray-600">
            A simple, secure, and fully digital process to join your favorite SHKSC club.
          </p>
        </Reveal>

        <div className="relative">
          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary-300 to-transparent -z-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {steps.map((step, index) => (
              <Reveal key={index} delay={index * 100} className="h-full">
                <div className="relative bg-white lg:bg-transparent p-6 lg:p-0 rounded-xl border border-gray-100 lg:border-none shadow-sm lg:shadow-none flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-0 h-full">
                  <div className="shrink-0 lg:mx-auto lg:mb-6 p-[3px] rounded-full bg-primary-600 shadow-lg shadow-primary-900/10 transition-transform duration-300 hover:scale-110">
                    <div className="w-14 h-14 lg:w-[5.5rem] lg:h-[5.5rem] rounded-full bg-white flex items-center justify-center text-xl lg:text-2xl font-heading font-bold text-primary-900">
                      {step.num}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary-950 mb-2 lg:text-center">{step.title}</h3>
                    <p className="text-sm text-gray-600 lg:text-center">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
