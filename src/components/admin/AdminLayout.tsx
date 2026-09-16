import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="print:hidden">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0">
        <div className="print:hidden">
          <TopHeader onMenuClick={() => setIsSidebarOpen(true)} />
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto print:p-0 print:overflow-visible">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
