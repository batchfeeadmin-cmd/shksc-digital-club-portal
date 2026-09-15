import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { num: 1, label: 'Personal Info' },
    { num: 2, label: 'Select Club' },
    { num: 3, label: 'Review' },
  ];

  return (
    <div className="flex items-center justify-center w-full mb-12">
      {steps.map((step, index) => (
        <React.Fragment key={step.num}>
          <div className="flex flex-col items-center relative">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors ${
                currentStep > step.num 
                  ? 'bg-green-500 text-white' 
                  : currentStep === step.num 
                    ? 'bg-primary-900 text-white ring-4 ring-primary-100' 
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              {currentStep > step.num ? <Check className="w-5 h-5" /> : step.num}
            </div>
            <span className={`absolute top-12 text-xs font-semibold whitespace-nowrap ${
              currentStep >= step.num ? 'text-primary-950' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-4 rounded-full transition-colors ${
              currentStep > step.num ? 'bg-green-500' : 'bg-gray-100'
            }`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
