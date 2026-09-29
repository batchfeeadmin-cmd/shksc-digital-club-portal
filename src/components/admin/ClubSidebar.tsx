import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Info, 
  Users, 
  Award, 
  Image as ImageIcon, 
  Bell, 
  FileEdit, 
  CircleDollarSign, 
  CreditCard, 
  ReceiptText,
  UserCircle, 
  LogOut,
  Calendar,
  CalendarCheck,
  Shield,
  Mail,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ClubSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ClubSidebar({ isOpen, onClose }: ClubSidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/club/dashboard' },
    { name: 'Club Information', icon: <Info size={20} />, path: '/admin/club/information' },
    { name: 'Students', icon: <Users size={20} />, path: '/admin/club/students' },
    { name: 'Committee', icon: <Shield size={20} />, path: '/admin/club/committee' },
    { name: 'Certificates', icon: <Award size={20} />, path: '/admin/club/certificates' },
    { name: 'Achievements', icon: <Award size={20} />, path: '/admin/club/achievements' },
    { name: 'Events', icon: <Calendar size={20} />, path: '/admin/club/events' },
    { name: 'Batches & Attendance', icon: <CalendarCheck size={20} />, path: '/admin/club/batches' },
    { name: 'Communications', icon: <Mail size={20} />, path: '/admin/club/communications' },
    { name: 'Gallery', icon: <ImageIcon size={20} />, path: '/admin/club/gallery' },
    { name: 'Notices', icon: <Bell size={20} />, path: '/admin/club/notices' },
    { name: 'Fees', icon: <CircleDollarSign size={20} />, path: '/admin/club/fees' },
    { name: 'Payments', icon: <CreditCard size={20} />, path: '/admin/club/payments' },
    { name: 'Finance Requests', icon: <ReceiptText size={20} />, path: '/admin/club/finance' },
    { name: 'Update Requests', icon: <FileEdit size={20} />, path: '/admin/club/requests' },
    { name: 'My Profile', icon: <UserCircle size={20} />, path: '/admin/club/profile' },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-primary-950/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`w-64 bg-primary-950 text-white min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Club admin navigation"
      >
        <div className="p-6 border-b border-primary-900/50 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-heading font-bold text-white tracking-wide">Club Portal</h2>
            <p className="text-xs text-primary-300 mt-1 uppercase tracking-wider font-semibold truncate">{user?.name || 'Club Admin'}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-primary-300 hover:text-white p-1 -mr-2"
            aria-label="Close navigation"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={onClose}
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

        <div className="p-4 border-t border-primary-900/50">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-300 hover:bg-primary-900 hover:text-white transition-colors w-full text-left">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
