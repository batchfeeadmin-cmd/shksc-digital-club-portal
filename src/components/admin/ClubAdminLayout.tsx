import React from 'react';
import { ClubSidebar } from './ClubSidebar';
import { TopHeader } from './TopHeader';

export const ClubAdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-surface-sec flex">
      <ClubSidebar />
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        <TopHeader title="Club Admin Portal" />
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
