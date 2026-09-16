import React from 'react';
import { Menu, Bell, Search, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopHeaderProps {
  onMenuClick?: () => void;
  title?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onMenuClick, title = 'Dashboard' }) => {
  const { user } = useAuth();
  
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 text-gray-500 hover:text-primary-900 hover:bg-primary-50 rounded-lg lg:hidden transition-colors"
          >
            <Menu size={24} />
          </button>
        )}
        <h1 className="text-xl font-heading font-bold text-primary-950 hidden sm:block">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 border border-transparent focus-within:border-primary-200 focus-within:bg-white transition-all w-64">
          <Search size={18} className="text-gray-400 mr-2 shrink-0" />
          <input 
            type="text" 
            placeholder="Search student or ID..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full"
          />
        </div>

        <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1"></div>

        {/* Notifications */}
        <button className="p-2 text-gray-500 hover:text-primary-900 hover:bg-primary-50 rounded-full relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded-full transition-colors pr-3 border border-transparent hover:border-gray-200">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0 font-bold overflow-hidden border border-primary-200">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0) || <UserCircle size={20} />
            )}
          </div>
          <span className="text-sm font-semibold text-gray-700 hidden sm:block">{user?.name || 'Admin'}</span>
        </button>
      </div>
    </header>
  );
};
