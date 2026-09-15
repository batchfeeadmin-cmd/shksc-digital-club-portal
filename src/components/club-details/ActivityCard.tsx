import React from 'react';
import { Activity } from '../../types';
import { Zap } from 'lucide-react';

export const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => {
  return (
    <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-2xl hover:shadow-md transition-shadow">
      <div className="w-10 h-10 bg-accent-100 text-accent-600 rounded-lg flex items-center justify-center mb-4">
        <Zap className="w-5 h-5" />
      </div>
      <h4 className="text-lg font-bold text-gray-900 mb-2">{activity.name}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{activity.description}</p>
    </div>
  );
}
