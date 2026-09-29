import React from 'react';
import { Menu, ShieldCheck, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopHeaderProps {
  onMenuClick?: () => void;
  title?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onMenuClick, title = 'Dashboard' }) => {
  const { user } = useAuth();
  const roleLabel = user?.role === 'root_admin'
    ? 'Root Admin'
    : user?.role === 'sub_admin'
      ? 'Sub Admin'
      : 'Club Admin';
  
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 text-gray-500 hover:text-primary-900 hover:bg-primary-50 rounded-lg lg:hidden transition-colors"
            aria-label="Open dashboard navigation"
          >
            <Menu size={24} />
          </button>
        )}
        <h1 className="text-xl font-heading font-bold text-primary-950 hidden sm:block">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700">
          <ShieldCheck size={14} />
          {roleLabel}
        </div>

        <div className="flex items-center gap-2 p-1 pr-3" aria-label={`Signed in as ${user?.name || 'Admin'}`}>
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0 font-bold overflow-hidden border border-primary-200">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0) || <UserCircle size={20} />
            )}
          </div>
          <span className="text-sm font-semibold text-gray-700 hidden sm:block">{user?.name || 'Admin'}</span>
        </div>
      </div>
    </header>
  );
};
