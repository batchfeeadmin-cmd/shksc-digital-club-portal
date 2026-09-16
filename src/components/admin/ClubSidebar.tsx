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
  UserCircle, 
  LogOut,
  Calendar,
  Shield,
  Mail
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function ClubSidebar() {
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
    { name: 'Communications', icon: <Mail size={20} />, path: '/admin/club/communications' },
    { name: 'Gallery', icon: <ImageIcon size={20} />, path: '/admin/club/gallery' },
    { name: 'Notices', icon: <Bell size={20} />, path: '/admin/club/notices' },
    { name: 'Fees', icon: <CircleDollarSign size={20} />, path: '/admin/club/fees' },
    { name: 'Payments', icon: <CreditCard size={20} />, path: '/admin/club/payments' },
    { name: 'Update Requests', icon: <FileEdit size={20} />, path: '/admin/club/requests' },
    { name: 'My Profile', icon: <UserCircle size={20} />, path: '/admin/club/profile' },
  ];

  return (
    <div className="w-64 bg-primary-950 text-white min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-40 overflow-y-auto">
      <div className="p-6 border-b border-primary-900/50">
        <h2 className="text-xl font-heading font-bold text-white tracking-wide">Club Portal</h2>
        <p className="text-xs text-primary-300 mt-1 uppercase tracking-wider font-semibold">{user?.name || 'Club Admin'}</p>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
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
    </div>
  );
}
