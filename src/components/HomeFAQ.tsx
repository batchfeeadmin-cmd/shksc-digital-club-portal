import React, { useState } from 'react';
import { SectionHeading } from './ui/SectionHeading';
import { Reveal } from './ui/Reveal';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Can I join more than one club?",
    answer: "Yes, you can join multiple clubs as long as their activity schedules do not overlap. However, we recommend focusing on 1-2 clubs to ensure you can dedicate enough time to their activities and your academics."
  },
  {
    question: "What is the registration fee?",
    answer: "The registration fee varies slightly depending on the club's specific activities and requirements. Typically, there is a one-time registration fee at the beginning of the academic year, followed by a small monthly or yearly affiliation cost. You can view the exact fees on the registration page."
  },
  {
    question: "How do I pay the club fees?",
    answer: "All club fees must be paid digitally through our integrated SSLCommerz payment gateway. You can use bKash, Nagad, credit/debit cards, or internet banking directly from your student dashboard."
  },
  {
    question: "Who can I contact if I face issues during registration?",
    answer: "If you encounter any technical issues, you can reach out to the Root Admin team or your respective Club Coordinator. Their contact information is available on the Contact Us page."
  },
  {
    question: "Are certificates provided for participating in club events?",
    answer: "Yes! Active members receive digital certificates for participating in events, organizing programs, and completing their tenure. These certificates are highly valuable for your extracurricular portfolio."
  }
];

export function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <SectionHeading 
          eyebrow="Questions & Answers"
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about club registration and activities."
        />

        <div className="space-y-4 mt-12">
          {faqs.map((faq, index) => (
            <Reveal key={index} delay={index * 0.1}>
              <div 
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'border-primary-500 bg-primary-50 shadow-md' : 'border-gray-200 bg-white hover:border-primary-300'
                }`}
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className={`font-bold text-lg ${openIndex === index ? 'text-primary-900' : 'text-gray-800'}`}>
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform duration-300 ${
                      openIndex === index ? 'transform rotate-180 text-primary-600' : 'text-gray-400'
                    }`} 
                  />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
