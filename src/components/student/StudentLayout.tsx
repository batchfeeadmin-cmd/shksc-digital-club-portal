import React, { useState } from 'react';
import { StudentSidebar } from './StudentSidebar';
import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-surface-sec flex">
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:text-primary-950 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-primary-950">Student Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-900 flex items-center justify-center font-bold overflow-hidden border border-primary-100">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || <User size={16} />
              )}
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 bg-white border-b border-gray-100 items-center justify-between px-8 sticky top-0 z-30">
          <h2 className="font-bold text-primary-950 text-lg">Welcome back!</h2>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-500 relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{user?.name || 'Student'}</p>
                <p className="text-xs text-gray-500">Class {user?.className || '10'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-900 flex items-center justify-center font-bold overflow-hidden border border-primary-200">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || <User size={20} />
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
