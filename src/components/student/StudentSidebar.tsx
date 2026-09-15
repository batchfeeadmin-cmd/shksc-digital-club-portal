import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, BookOpen, ClipboardList, CreditCard, ReceiptText, Bell, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface StudentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StudentSidebar({ isOpen, onClose }: StudentSidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/student/dashboard' },
    { name: 'My Profile', icon: <User size={20} />, path: '/student/profile' },
    { name: 'My Club', icon: <BookOpen size={20} />, path: '#' },
    { name: 'Registration', icon: <ClipboardList size={20} />, path: '#' },
    { name: 'Payment', icon: <CreditCard size={20} />, path: '#' },
    { name: 'Receipt', icon: <ReceiptText size={20} />, path: '#' },
    { name: 'Notices', icon: <Bell size={20} />, path: '#' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-primary-950/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
          onClick={onClose}
        />
      )}
      
      <div className={`fixed lg:static inset-y-0 left-0 w-64 bg-primary-950 text-white min-h-screen flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-primary-900/50 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-heading font-bold text-white tracking-wide">SHKSC Portal</h2>
            <p className="text-xs text-primary-300 mt-1 uppercase tracking-wider font-semibold">Student Dashboard</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-primary-300 hover:text-white p-1">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => { if(window.innerWidth < 1024) onClose(); }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive && link.path !== '#'
                    ? 'bg-accent-600 text-white shadow-md'
                    : 'text-primary-100 hover:bg-primary-900 hover:text-white'
                }`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-primary-900/50 shrink-0">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-300 hover:bg-primary-900 hover:text-white transition-colors w-full text-left">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
