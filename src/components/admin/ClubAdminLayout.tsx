import React, { useState } from 'react';
import { ClubSidebar } from './ClubSidebar';
import { TopHeader } from './TopHeader';

export const ClubAdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-sec flex">
      <ClubSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
        <TopHeader
          title="Club Admin Portal"
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
