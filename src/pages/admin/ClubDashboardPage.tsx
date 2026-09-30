import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BadgePercent,
  Bell,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  ReceiptText,
  UserCheck,
  UserPlus,
  Users
} from 'lucide-react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { StatCard } from '../../components/admin/StatCard';
import { DataTable } from '../../components/admin/DataTable';
import { useAuth } from '../../context/AuthContext';
import { useClubsData, useUpdateRequests } from '../../hooks/useAdminData';
import { getStudents } from '../../services/students/studentService';
import { getAttendanceByBatch, getBatchesByClub } from '../../services/batches/batchService';
import { getDiscountsByClub } from '../../services/discounts/discountService';
import { getFinanceRequestsByClub } from '../../services/finance/financeService';
import type { ClubBatch, FinanceRequest, Student, StudentDiscount } from '../../types';

const getLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function ClubDashboardPage() {
  const { user } = useAuth();
  const { clubs } = useClubsData();
  const { requests } = useUpdateRequests();
  const clubId = user?.clubId || '';
  const [students, setStudents] = useState<Student[]>(getStudents());
  const [batches, setBatches] = useState<ClubBatch[]>(() => clubId ? getBatchesByClub(clubId) : []);
  const [discounts, setDiscounts] = useState<StudentDiscount[]>(() => clubId ? getDiscountsByClub(clubId) : []);
  const [financeRequests, setFinanceRequests] = useState<FinanceRequest[]>(() => clubId ? getFinanceRequestsByClub(clubId) : []);

  const club = clubs.find(item => item.id === clubId);

  useEffect(() => {
    const handleUpdate = () => {
      setStudents(getStudents());
      setBatches(clubId ? getBatchesByClub(clubId) : []);
      setDiscounts(clubId ? getDiscountsByClub(clubId) : []);
      setFinanceRequests(clubId ? getFinanceRequestsByClub(clubId) : []);
    };

    handleUpdate();
    window.addEventListener('shksc_state_changed', handleUpdate);
    return () => window.removeEventListener('shksc_state_changed', handleUpdate);
  }, [clubId]);

  const clubStudents = students.filter(student => student.clubId === clubId);
  const paidCount = clubStudents.filter(student => student.registrationStatus === 'Confirmed').length;
  const pendingPaymentCount = clubStudents.filter(student => student.registrationStatus === 'Pending Payment').length;

  const now = new Date();
  const todayDate = getLocalDate(now);
  const todayDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const attendanceDue = batches.filter(batch =>
    batch.status === 'Approved' &&
    batch.days.includes(todayDay) &&
    !getAttendanceByBatch(batch.id).some(record => record.date === todayDate)
  ).length;

  const approvedDiscounts = discounts.filter(discount => discount.status === 'Approved').length;
  const proofUploadDue = financeRequests.filter(request => request.kind === 'Club Expense' && request.status === 'Approved').length;
  const rejectedGeneral = requests.filter(request => request.clubId === clubId && request.status === 'Rejected').length;
  const rejectedBatches = batches.filter(batch => batch.status === 'Rejected').length;
  const rejectedDiscounts = discounts.filter(discount => discount.status === 'Rejected').length;
  const rejectedFinance = financeRequests.filter(request => request.status === 'Rejected').length;
  const correctionCount = rejectedGeneral + rejectedBatches + rejectedDiscounts + rejectedFinance;

  const pendingRootCount =
    requests.filter(request => request.clubId === clubId && request.status === 'Pending').length +
    batches.filter(batch => batch.status === 'Pending').length +
    discounts.filter(discount => discount.status === 'Pending').length +
    financeRequests.filter(request => request.status === 'Pending').length;

  const correctionLink = rejectedDiscounts > 0
    ? '/admin/club/discounts'
    : rejectedFinance > 0
      ? '/admin/club/finance'
      : rejectedBatches > 0
        ? '/admin/club/batches'
        : '/admin/club/requests';

  const recentStudents = [...clubStudents]
    .reverse()
    .slice(0, 6)
    .map(student => ({
      id: student.studentId || student.id,
      name: student.name,
      class: `Class ${student.class}${student.roll ? ` - Roll ${student.roll}` : ''}`,
      status: student.registrationStatus === 'Confirmed' ? 'Paid' : 'Pending'
    }));

  const studentColumns = [
    { header: 'Student ID', accessor: 'id', render: (value: string) => <span className="font-mono text-gray-500">{value}</span> },
    { header: 'Name', accessor: 'name', render: (value: string) => <span className="font-bold text-primary-950">{value}</span> },
    { header: 'Class', accessor: 'class' },
    {
      header: 'Payment Status',
      accessor: 'status',
      render: (value: string) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          value === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
        }`}>
          {value}
        </span>
      )
    }
  ];

  const tasks = [
    {
      name: 'Review pending registrations',
      description: 'Confirm students after receiving their fee.',
      count: pendingPaymentCount,
      icon: UserPlus,
      to: '/admin/club/students',
      tone: 'orange'
    },
    {
      name: "Take today's attendance",
      description: `${todayDay}'s approved batches without attendance.`,
      count: attendanceDue,
      icon: CalendarCheck,
      to: '/admin/club/batches',
      tone: 'blue'
    },
    {
      name: 'Complete discounted payments',
      description: 'Approved discounts waiting to be used at payment.',
      count: approvedDiscounts,
      icon: BadgePercent,
      to: '/admin/club/discounts',
      tone: 'green'
    },
    {
      name: 'Upload expense proof',
      description: 'Approved club expenses still need a proof voucher.',
      count: proofUploadDue,
      icon: ReceiptText,
      to: '/admin/club/finance',
      tone: 'purple'
    },
    {
      name: 'Correct rejected requests',
      description: 'Review the feedback and submit corrected information.',
      count: correctionCount,
      icon: AlertTriangle,
      to: correctionLink,
      tone: 'red'
    }
  ].filter(task => task.count > 0);

  const taskTones: Record<string, string> = {
    orange: 'bg-orange-50 text-orange-700 border-orange-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    red: 'bg-red-50 text-red-700 border-red-100'
  };

  const quickActions = [
    { name: 'Admit Student', description: 'Add a new student directly', icon: UserPlus, to: '/admin/club/students?action=admit' },
    { name: 'Take Attendance', description: 'Open approved batches', icon: CalendarCheck, to: '/admin/club/batches' },
    { name: 'Request Discount', description: 'Apply for a student discount', icon: BadgePercent, to: '/admin/club/discounts?action=create' },
    { name: 'Create Notice', description: 'Notify club members', icon: Bell, to: '/admin/club/notices?action=create' }
  ];

  return (
    <ClubAdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-7 gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-600 mb-2">Club workspace</p>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary-950 mb-1">Good to see you, {user?.name?.split(' ')[0] || 'Admin'}</h2>
          <p className="text-sm text-gray-500">Your priorities and club activity are together in one place.</p>
        </div>

        {club && (
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm max-w-full">
            <div className="w-11 h-11 rounded-lg bg-primary-50 text-primary-900 flex items-center justify-center font-bold text-lg overflow-hidden shrink-0">
              {club.logo.startsWith('/') ? (
                <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
              ) : (
                club.logo
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-primary-950 truncate">{club.name}</h3>
              <p className="text-xs text-gray-500 truncate">{club.category}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-7">
        <StatCard title="Total Students" value={String(clubStudents.length)} icon={<Users size={20} />} />
        <StatCard title="Paid & Active" value={String(paidCount)} icon={<UserCheck size={20} />} />
        <StatCard title="Payment Due" value={String(pendingPaymentCount)} icon={<Clock3 size={20} />} />
        <StatCard title="Awaiting Root" value={String(pendingRootCount)} icon={<ReceiptText size={20} />} />
      </div>

      <div className="grid xl:grid-cols-[1.25fr_0.75fr] gap-6 mb-7">
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h3 className="font-heading font-bold text-lg text-primary-950">Today's Work</h3>
              <p className="text-sm text-gray-500 mt-1">Only the items that currently need action.</p>
            </div>
            {tasks.length > 0 && (
              <span className="shrink-0 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                {tasks.reduce((sum, task) => sum + task.count, 0)} due
              </span>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-8 text-center">
              <CheckCircle2 className="mx-auto mb-3 text-emerald-600" size={30} />
              <p className="font-bold text-emerald-900">All caught up</p>
              <p className="text-sm text-emerald-700 mt-1">There are no pending actions for your club right now.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => {
                const TaskIcon = task.icon;
                return (
                  <Link
                    key={task.name}
                    to={task.to}
                    className="group flex items-center gap-3 sm:gap-4 rounded-xl border border-gray-100 p-3.5 hover:border-primary-200 hover:shadow-sm transition-all"
                  >
                    <span className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${taskTones[task.tone]}`}>
                      <TaskIcon size={19} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-primary-950">{task.name}</span>
                      <span className="hidden sm:block text-xs text-gray-500 mt-0.5 truncate">{task.description}</span>
                    </span>
                    <span className="text-lg font-heading font-bold text-primary-950">{task.count}</span>
                    <ArrowRight size={17} className="text-gray-300 group-hover:text-accent-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="bg-primary-950 rounded-2xl shadow-sm p-5 sm:p-6 text-white">
          <h3 className="font-heading font-bold text-lg">Quick Actions</h3>
          <p className="text-sm text-primary-300 mt-1 mb-5">Start a common task in one click.</p>
          <div className="grid sm:grid-cols-2 xl:grid-cols-1 gap-3">
            {quickActions.map(action => {
              const ActionIcon = action.icon;
              return (
                <Link
                  key={action.name}
                  to={action.to}
                  className="group flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3.5 hover:bg-white/10 hover:border-white/20 transition-colors"
                >
                  <span className="w-9 h-9 rounded-lg bg-accent-600 text-white flex items-center justify-center shrink-0">
                    <ActionIcon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold">{action.name}</span>
                    <span className="block text-xs text-primary-300 mt-0.5 truncate">{action.description}</span>
                  </span>
                  <ArrowRight size={16} className="text-primary-400 group-hover:text-white transition-colors" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <div className="rounded-2xl shadow-sm overflow-hidden">
        <DataTable
          title="Recent Registrations"
          columns={studentColumns}
          data={recentStudents}
          action={(
            <Link to="/admin/club/students" className="text-xs sm:text-sm font-bold text-accent-600 hover:text-accent-700">
              View all
            </Link>
          )}
        />
      </div>
    </ClubAdminLayout>
  );
}
