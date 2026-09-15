import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
        <div className="p-2 bg-slate-50 rounded-lg text-primary-900 border border-gray-100">
          {icon}
        </div>
      </div>
      <div className="mt-auto">
        <p className="text-3xl font-heading font-bold text-primary-950 mb-1">{value}</p>
        {trend && (
          <p className={`text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
            {trendUp ? '↑' : '↓'} {trend} <span className="text-gray-400 font-normal">from last month</span>
          </p>
        )}
      </div>
      {/* Decorative gradient blur */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary-50 rounded-full blur-2xl opacity-60"></div>
    </div>
  );
};
