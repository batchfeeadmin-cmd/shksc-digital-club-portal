import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Award,
  BadgePercent,
  Bell,
  Calendar,
  CalendarCheck,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  FileEdit,
  Image as ImageIcon,
  Info,
  LayoutDashboard,
  LogOut,
  Mail,
  ReceiptText,
  Shield,
  UserCircle,
  Users,
  X
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ClubSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  name: string;
  icon: LucideIcon;
  path: string;
}

interface NavigationGroup {
  name: string;
  icon: LucideIcon;
  items: NavigationItem[];
}

const navigationGroups: NavigationGroup[] = [
  {
    name: 'Student Management',
    icon: Users,
    items: [
      { name: 'Students', icon: Users, path: '/admin/club/students' },
      { name: 'Batches & Attendance', icon: CalendarCheck, path: '/admin/club/batches' },
      { name: 'Committee', icon: Shield, path: '/admin/club/committee' },
      { name: 'Certificates', icon: Award, path: '/admin/club/certificates' }
    ]
  },
  {
    name: 'Club Content',
    icon: Info,
    items: [
      { name: 'Club Information', icon: Info, path: '/admin/club/information' },
      { name: 'Achievements', icon: Award, path: '/admin/club/achievements' },
      { name: 'Events', icon: Calendar, path: '/admin/club/events' },
      { name: 'Gallery', icon: ImageIcon, path: '/admin/club/gallery' },
      { name: 'Notices', icon: Bell, path: '/admin/club/notices' }
    ]
  },
  {
    name: 'Finance',
    icon: CircleDollarSign,
    items: [
      { name: 'Fees', icon: CircleDollarSign, path: '/admin/club/fees' },
      { name: 'Payments', icon: CreditCard, path: '/admin/club/payments' },
      { name: 'Student Discounts', icon: BadgePercent, path: '/admin/club/discounts' },
      { name: 'Finance Requests', icon: ReceiptText, path: '/admin/club/finance' }
    ]
  },
  {
    name: 'Communication',
    icon: Mail,
    items: [
      { name: 'Communications', icon: Mail, path: '/admin/club/communications' },
      { name: 'My Requests', icon: FileEdit, path: '/admin/club/requests' }
    ]
  }
];

const groupContainingPath = (pathname: string) =>
  navigationGroups.find(group => group.items.some(item => pathname.startsWith(item.path)))?.name;

export function ClubSidebar({ isOpen, onClose }: ClubSidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const activeGroup = groupContainingPath(location.pathname);
    return activeGroup ? { [activeGroup]: true } : {};
  });

  useEffect(() => {
    const activeGroup = groupContainingPath(location.pathname);
    if (activeGroup) {
      setOpenGroups(current => ({ ...current, [activeGroup]: true }));
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleGroup = (name: string) => {
    setOpenGroups(current => ({ ...current, [name]: !current[name] }));
  };

  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-accent-600 text-white shadow-md'
        : 'text-primary-100 hover:bg-primary-900 hover:text-white'
    }`;

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
            <p className="text-xs text-primary-300 mt-1 uppercase tracking-wider font-semibold truncate">
              {user?.name || 'Club Admin'}
            </p>
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

        <nav className="flex-1 py-5 px-3 space-y-2">
          <NavLink
            to="/admin/club/dashboard"
            onClick={onClose}
            className={({ isActive }) => `${linkClassName({ isActive })} px-3 py-2.5`}
          >
            <LayoutDashboard size={19} />
            Dashboard
          </NavLink>

          <div className="pt-2 space-y-1">
            {navigationGroups.map(group => {
              const GroupIcon = group.icon;
              const expanded = Boolean(openGroups[group.name]);
              const hasActiveItem = group.items.some(item => location.pathname.startsWith(item.path));

              return (
                <div key={group.name}>
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      hasActiveItem
                        ? 'text-white bg-primary-900/80'
                        : 'text-primary-200 hover:bg-primary-900 hover:text-white'
                    }`}
                    aria-expanded={expanded}
                  >
                    <GroupIcon size={19} />
                    <span className="flex-1 text-left">{group.name}</span>
                    <ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
                  </button>

                  {expanded && (
                    <div className="mt-1 ml-4 pl-3 border-l border-primary-800 space-y-1">
                      {group.items.map(item => {
                        const ItemIcon = item.icon;
                        return (
                          <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) => `${linkClassName({ isActive })} px-3 py-2`}
                          >
                            <ItemIcon size={17} />
                            <span>{item.name}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        <div className="p-3 border-t border-primary-900/50 space-y-1">
          <NavLink
            to="/admin/club/profile"
            onClick={onClose}
            className={({ isActive }) => `${linkClassName({ isActive })} px-3 py-2.5`}
          >
            <UserCircle size={20} />
            My Profile
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-300 hover:bg-primary-900 hover:text-white transition-colors w-full text-left"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
