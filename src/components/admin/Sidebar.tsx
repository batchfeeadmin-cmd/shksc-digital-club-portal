import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  BookOpen, 
  UserCog, 
  CircleDollarSign, 
  CreditCard, 
  ReceiptText,
  CheckSquare, 
  BarChart3,
  Activity,
  X,
  LogOut,
  Layout,
  Database,
  CalendarDays,
  CalendarCheck,
  Mail,
  BadgePercent
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SchoolLogo } from '../ui/SchoolLogo';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/root/dashboard' },
    { name: 'Registration Control', icon: <Settings size={20} />, path: '/admin/root/registration-control', requireRoot: true },
    { name: 'Students', icon: <Users size={20} />, path: '/admin/root/students', requiredPerm: 'students_clubs' },
    { name: 'Clubs', icon: <BookOpen size={20} />, path: '/admin/root/clubs', requiredPerm: 'students_clubs' },
    { name: 'Club Admins', icon: <UserCog size={20} />, path: '/admin/root/club-admins', requiredPerm: 'students_clubs' },
    { name: 'Fee Management', icon: <CircleDollarSign size={20} />, path: '/admin/root/fee-management', requiredPerm: 'payments' },
    { name: 'Payments', icon: <CreditCard size={20} />, path: '/admin/root/payments', requiredPerm: 'payments' },
    { name: 'Student Discounts', icon: <BadgePercent size={20} />, path: '/admin/root/discounts', requireRoot: true },
    { name: 'Finance & Vouchers', icon: <ReceiptText size={20} />, path: '/admin/root/finance', requiredPerm: 'payments' },
    { name: 'Batches & Attendance', icon: <CalendarCheck size={20} />, path: '/admin/root/batches', requiredPerm: 'students_clubs' },
    { name: 'Approval Requests', icon: <CheckSquare size={20} />, path: '/admin/root/approvals', requiredPerm: 'students_clubs' },
    { name: 'Reports', icon: <BarChart3 size={20} />, path: '/admin/root/reports', requiredPerm: 'reports' },
    { name: 'Communications', icon: <Mail size={20} />, path: '/admin/root/communications', requiredPerm: 'communications' },
    { name: 'Data (Import/Export)', icon: <Database size={20} />, path: '/admin/root/data', requiredPerm: 'data' },
    { name: 'Session & Year', icon: <CalendarDays size={20} />, path: '/admin/root/session', requiredPerm: 'students_clubs' },
    { name: 'Activity Log', icon: <Activity size={20} />, path: '/admin/root/activity', requiredPerm: 'reports' },
    { name: 'Content (CMS)', icon: <Layout size={20} />, path: '/admin/root/cms', requiredPerm: 'cms' },
    { name: 'System Settings', icon: <Settings size={20} />, path: '/admin/root/settings', requireRoot: true },
  ];

  const visibleLinks = links.filter(link => {
    if (user?.role === 'root_admin') return true; // Root Admin sees everything
    if (link.requireRoot) return false; // Sub-Admins can't see this
    if (link.requiredPerm && user?.permissions) {
      return user.permissions.includes(link.requiredPerm);
    }
    return true; // Unrestricted links (like Dashboard)
  });

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-primary-950/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-primary-950 text-white transform transition-transform duration-300 ease-in-out flex flex-col
        lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 bg-primary-900 shrink-0 border-b border-primary-800">
          <div className="flex items-center gap-3">
            <SchoolLogo className="w-8 h-8 bg-white rounded shadow-sm" />
            <span className="font-heading font-bold text-white text-lg tracking-wide hidden sm:block truncate">SHKSC Admin</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-primary-200 hover:text-white" aria-label="Close admin navigation">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {visibleLinks.map((link, index) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={index}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  isActive 
                    ? 'bg-primary-800 text-white border border-primary-700 shadow-sm' 
                    : 'text-primary-200 hover:bg-primary-900 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className={isActive ? 'text-accent-400' : 'opacity-70'}>{link.icon}</span>
                {link.name}
              </Link>
            )
          })}
        </div>

        {/* Bottom profile minimal info */}
        <div className="p-4 border-t border-primary-800/50 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="truncate flex-1">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-primary-300 truncate">{user?.role === 'root_admin' ? 'Root Access' : 'Admin'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 text-primary-300 hover:text-white text-sm font-medium transition-colors w-full p-2.5 hover:bg-primary-900 rounded-lg">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </>
  );
};
