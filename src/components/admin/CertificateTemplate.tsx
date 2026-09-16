import React from 'react';
import { SchoolLogo } from '../ui/SchoolLogo';

interface CertificateTemplateProps {
  studentName: string;
  eventName: string;
  clubName: string;
  issueDate: string;
  certificateId: string;
}

export const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  studentName,
  eventName,
  clubName,
  issueDate,
  certificateId
}) => {
  return (
    <div className="w-[800px] h-[560px] bg-white text-gray-900 font-sans relative overflow-hidden flex flex-col items-center justify-center border-[12px] border-double border-primary-950/20 p-12">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-100/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute opacity-5 pointer-events-none">
        <SchoolLogo className="w-96 h-96 grayscale" />
      </div>

      {/* Header */}
      <div className="text-center relative z-10 w-full mb-8">
        <SchoolLogo className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold uppercase tracking-widest text-primary-950 mb-1">Sheikh Kamal School & College</h1>
        <h2 className="text-lg text-gray-600 font-medium">{clubName}</h2>
      </div>

      {/* Title */}
      <div className="text-center relative z-10 w-full mb-8">
        <h3 className="text-4xl font-serif italic text-gray-800 mb-2">Certificate of Participation</h3>
        <p className="text-sm text-gray-500 uppercase tracking-widest">This is proudly presented to</p>
      </div>

      {/* Student Name */}
      <div className="text-center relative z-10 w-full mb-8 border-b-2 border-gray-300 pb-2 max-w-lg mx-auto">
        <h2 className="text-3xl font-bold text-accent-700">{studentName}</h2>
      </div>

      {/* Description */}
      <div className="text-center relative z-10 w-full max-w-xl mx-auto mb-12">
        <p className="text-gray-600 leading-relaxed">
          For their active participation and outstanding contribution in <br/>
          <strong className="text-gray-900">{eventName}</strong>.
        </p>
      </div>

      {/* Footer / Signatures */}
      <div className="w-full flex justify-between items-end relative z-10 px-12 mt-auto">
        <div className="text-center">
          <div className="w-40 border-t border-gray-400 mb-2"></div>
          <p className="text-xs font-bold text-gray-700">Club Moderator</p>
          <p className="text-[10px] text-gray-500">{clubName}</p>
        </div>
        
        <div className="text-center">
          <div className="w-32 h-32 absolute bottom-0 left-1/2 -translate-x-1/2 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Seal_of_Bangladesh.svg/200px-Seal_of_Bangladesh.svg.png')] bg-contain bg-no-repeat bg-center mix-blend-multiply"></div>
        </div>

        <div className="text-center">
          <div className="w-40 border-t border-gray-400 mb-2"></div>
          <p className="text-xs font-bold text-gray-700">Principal</p>
          <p className="text-[10px] text-gray-500">Sheikh Kamal School & College</p>
        </div>
      </div>

      {/* Meta */}
      <div className="absolute bottom-4 left-4 text-[10px] text-gray-400 font-mono">
        ID: {certificateId}
      </div>
      <div className="absolute bottom-4 right-4 text-[10px] text-gray-400 font-mono">
        Date: {new Date(issueDate).toLocaleDateString('en-GB')}
      </div>
    </div>
  );
};
