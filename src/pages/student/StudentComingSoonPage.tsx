import React from 'react';
import { StudentLayout } from '../../components/student/StudentLayout';
import { Construction } from 'lucide-react';

interface Props {
  title: string;
}

export function StudentComingSoonPage({ title }: Props) {
  return (
    <StudentLayout>
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
          <Construction size={40} />
        </div>
        <h1 className="text-3xl font-heading font-bold text-primary-950 mb-3">
          {title}
        </h1>
        <p className="text-gray-500 max-w-md">
          This feature is currently under development. Please check back later.
        </p>
      </div>
    </StudentLayout>
  );
}
