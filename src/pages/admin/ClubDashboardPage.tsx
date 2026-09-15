import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { StatCard } from '../../components/admin/StatCard';
import { DataTable } from '../../components/admin/DataTable';
import { Users, UserCheck, UserPlus, Award, FileEdit, Info, Bell, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClubsData, useUpdateRequests } from '../../hooks/useAdminData';
import { getStudents } from '../../services/students/studentService';
import { getApprovedAchievements } from '../../services/approvals/approvalService';
import type { Student } from '../../types';

export function ClubDashboardPage() {
  const { user } = useAuth();
  const { clubs } = useClubsData();
  const { requests } = useUpdateRequests();
  const [students, setStudents] = useState<Student[]>(getStudents());

  const club = clubs.find(c => c.id === user?.clubId);

  useEffect(() => {
    const handleUpdate = () => setStudents(getStudents());
    window.addEventListener('shksc_state_changed', handleUpdate);
    return () => window.removeEventListener('shksc_state_changed', handleUpdate);
  }, []);

  const clubStudents = students.filter(s => s.clubId === user?.clubId);
  const paidCount = clubStudents.filter(s => s.registrationStatus === 'Confirmed').length;
  const pendingCount = clubStudents.filter(s => s.registrationStatus === 'Pending Payment').length;
  const achievementCount = club?.achievementCount ?? getApprovedAchievements().filter(a => a.clubId === user?.clubId).length;
  const pendingRequests = requests.filter(r => r.clubId === user?.clubId && r.status === 'Pending');

  const recentStudents = [...clubStudents]
    .reverse()
    .slice(0, 6)
    .map(s => ({
      id: s.studentId || s.id,
      name: s.name,
      class: `Class ${s.class}${s.roll ? ` - ${s.roll}` : ''}`,
      status: s.registrationStatus === 'Confirmed' ? 'Paid' : 'Pending'
    }));

  const studentColumns = [
    { header: 'Student ID', accessor: 'id', render: (val: string) => <span className="font-mono text-gray-500">{val}</span> },
    { header: 'Name', accessor: 'name', render: (val: string) => <span className="font-bold text-primary-950">{val}</span> },
    { header: 'Class', accessor: 'class' },
    {
      header: 'Payment Status',
      accessor: 'status',
      render: (val: string) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          val === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
        }`}>
          {val}
        </span>
      )
    }
  ];

  const quickActions = [
    { name: 'Update Information', desc: 'Submit changes for root approval', icon: <Info size={18} />, to: '/admin/club/information' },
    { name: 'Post New Notice', desc: 'Alert your members instantly', icon: <Bell size={18} />, to: '/admin/club/notices' },
    { name: 'Add Achievement', desc: "Showcase your club's success", icon: <Award size={18} />, to: '/admin/club/achievements' },
    { name: 'Upload Gallery Photo', desc: 'Photos go live after approval', icon: <ImageIcon size={18} />, to: '/admin/club/gallery' }
  ];

  return (
    <ClubAdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-950 mb-1">Dashboard Overview</h2>
          <p className="text-sm text-gray-500">Welcome back to the {club?.name || 'your club'} control panel.</p>
        </div>

        {club && (
          <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-primary-50 text-primary-900 flex items-center justify-center font-bold text-xl overflow-hidden">
              {club.logo.startsWith('/') ? (
                <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
              ) : (
                club.logo
              )}
            </div>
            <div>
              <h3 className="font-bold text-primary-950">{club.name}</h3>
              <p className="text-xs text-gray-500">{club.category}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Members" value={String(clubStudents.length)} icon={<Users size={20} />} />
        <StatCard title="Paid Registrations" value={String(paidCount)} icon={<UserCheck size={20} />} />
        <StatCard title="Pending Registrations" value={String(pendingCount)} icon={<UserPlus size={20} />} />
        <StatCard title="Total Achievements" value={String(achievementCount)} icon={<Award size={20} />} />
        <StatCard title="Pending Requests" value={String(pendingRequests.length)} icon={<FileEdit size={20} />} trend="Awaiting Root Admin" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <DataTable title="Recent Registrations" columns={studentColumns} data={recentStudents} />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-primary-950 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map(action => (
                <Link
                  key={action.name}
                  to={action.to}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg border border-gray-100 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <span className="text-accent-500 shrink-0">{action.icon}</span>
                  <span>
                    <span className="block font-bold text-primary-900 text-sm">{action.name}</span>
                    <span className="block text-xs text-gray-500 mt-0.5">{action.desc}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ClubAdminLayout>
  );
}
