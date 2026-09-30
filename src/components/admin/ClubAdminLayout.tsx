import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ClubSidebar } from './ClubSidebar';
import { TopHeader } from './TopHeader';

const pageTitles: Record<string, string> = {
  '/admin/club/dashboard': 'Dashboard',
  '/admin/club/information': 'Club Information',
  '/admin/club/students': 'Students',
  '/admin/club/committee': 'Committee',
  '/admin/club/certificates': 'Certificates',
  '/admin/club/achievements': 'Achievements',
  '/admin/club/events': 'Events & Workshops',
  '/admin/club/batches': 'Batches & Attendance',
  '/admin/club/communications': 'Communications',
  '/admin/club/gallery': 'Gallery',
  '/admin/club/notices': 'Notices',
  '/admin/club/fees': 'Club Fees',
  '/admin/club/payments': 'Payments',
  '/admin/club/discounts': 'Student Discounts',
  '/admin/club/finance': 'Finance Requests',
  '/admin/club/requests': 'My Requests',
  '/admin/club/profile': 'My Profile'
};

export const ClubAdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Club Admin Portal';

  return (
    <div className="min-h-screen bg-surface-sec flex">
      <div className="print:hidden">
        <ClubSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
      <div className="flex-1 lg:pl-64 print:pl-0 flex flex-col min-h-screen transition-all duration-300">
        <div className="print:hidden">
          <TopHeader
            title={title}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
        </div>
        <main className="flex-1 p-4 md:p-8 print:p-0 overflow-x-hidden print:overflow-visible">
          {children}
        </main>
      </div>
    </div>
  );
};
