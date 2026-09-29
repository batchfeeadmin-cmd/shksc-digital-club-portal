import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatCard } from '../../components/admin/StatCard';
import { DataTable } from '../../components/admin/DataTable';
import { ApprovalCard } from '../../components/admin/ApprovalCard';
import { Users, BookOpen, DollarSign, CreditCard, Activity, Settings } from 'lucide-react';
import { useClubsData, useUpdateRequests, useClubFees, useRegistrationState } from '../../hooks/useAdminData';
import { isRegistrationCurrentlyOpen } from '../../services/clubs/clubService';
import { getStudents } from '../../services/students/studentService';
import { getPayments } from '../../services/payments/paymentService';
import { approveRequest, rejectRequest } from '../../services/approvals/approvalService';
import type { Student, Payment } from '../../types';

export function AdminDashboardPage() {
  const { clubs } = useClubsData();
  const { requests } = useUpdateRequests();
  const { fees } = useClubFees();
  const { state: regState } = useRegistrationState();
  const registrationOpen = isRegistrationCurrentlyOpen(regState);
  const [students, setStudents] = useState<Student[]>(getStudents());
  const [payments, setPayments] = useState<Payment[]>(getPayments());

  useEffect(() => {
    const handleUpdate = () => {
      setStudents(getStudents());
      setPayments(getPayments());
    };
    window.addEventListener('shksc_state_changed', handleUpdate);
    return () => window.removeEventListener('shksc_state_changed', handleUpdate);
  }, []);

  const clubNameOf = (clubId: string) => clubs.find(c => c.id === clubId)?.name || '—';

  // ---- Real stats ----
  const paidPayments = payments.filter(p => p.status === 'Paid');
  const totalCollection = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const paidStudents = students.filter(s => s.registrationStatus === 'Confirmed').length;
  const pendingStudents = students.filter(s => s.registrationStatus === 'Pending Payment').length;
  const pendingRequests = requests.filter(r => r.status === 'Pending');

  const clubStatsData = clubs.map(club => {
    const clubStudents = students.filter(s => s.clubId === club.id);
    const clubPaid = clubStudents.filter(s => s.registrationStatus === 'Confirmed').length;
    const clubPending = clubStudents.filter(s => s.registrationStatus === 'Pending Payment').length;
    const fee = fees[club.id];
    const feeTotal = fee ? fee.registrationFee + fee.affiliationCost : 0;
    return {
      name: club.name,
      students: clubStudents.length,
      paid: clubPaid,
      pending: clubPending,
      collection: `৳ ${(clubPaid * feeTotal).toLocaleString()}`
    };
  });

  const clubStatsColumns = [
    { header: 'Club Name', accessor: 'name', render: (val: string) => <span className="font-semibold text-primary-950">{val}</span> },
    { header: 'Students', accessor: 'students' },
    { header: 'Paid', accessor: 'paid', render: (val: number) => <span className="text-green-600 font-medium">{val}</span> },
    { header: 'Pending', accessor: 'pending', render: (val: number) => <span className="text-amber-600 font-medium">{val}</span> },
    { header: 'Collection', accessor: 'collection', render: (val: string) => <span className="font-bold text-gray-900">{val}</span> }
  ];

  const recentRegistrations = [...students]
    .reverse()
    .slice(0, 5)
    .map(s => ({
      id: s.studentId || s.id,
      name: s.name,
      class: `Class ${s.class}${s.roll ? ` - ${s.roll}` : ''}`,
      club: clubNameOf(s.clubId),
      status: s.registrationStatus === 'Confirmed' ? 'Paid' : 'Pending'
    }));

  const registrationColumns = [
    { header: 'Student ID', accessor: 'id', render: (val: string) => <span className="font-mono text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-700">{val}</span> },
    { header: 'Name', accessor: 'name', render: (val: string) => <span className="font-medium text-gray-900">{val}</span> },
    { header: 'Class', accessor: 'class' },
    { header: 'Club', accessor: 'club' },
    {
      header: 'Payment Status',
      accessor: 'status',
      render: (val: string) => (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
          val === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>{val}</span>
      )
    }
  ];

  const recentPayments = [...payments].reverse().slice(0, 5).map(p => ({
    txId: p.transactionId || p.id,
    student: p.studentName || '—',
    club: clubNameOf(p.clubId),
    amount: `৳ ${p.amount.toLocaleString()}`,
    status: p.status === 'Paid' ? 'Success' : p.status
  }));

  const paymentColumns = [
    { header: 'Transaction ID', accessor: 'txId', render: (val: string) => <span className="font-mono text-xs">{val}</span> },
    { header: 'Student', accessor: 'student' },
    { header: 'Club', accessor: 'club' },
    { header: 'Amount', accessor: 'amount', render: (val: string) => <span className="font-semibold text-gray-900">{val}</span> },
    {
      header: 'Status',
      accessor: 'status',
      render: (val: string) => (
        <span className={`px-2 py-1 text-xs font-bold rounded-md border ${
          val === 'Success' ? 'border-green-200 text-green-700 bg-green-50' : 'border-red-200 text-red-700 bg-red-50'
        }`}>{val}</span>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h2 className="text-2xl font-heading font-bold text-primary-950">Overview</h2>
            <p className="text-sm text-gray-500">Welcome back, Super Admin. Here's what's happening today.</p>
          </div>
          <Link
            to="/admin/root/reports"
            className="bg-primary-950 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-900 transition-colors self-start sm:self-auto flex items-center gap-2 shadow-sm"
          >
            <Activity size={16} /> Generate Report
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="sm:col-span-2 xl:col-span-2">
            <StatCard title="Total Collection" value={`৳ ${totalCollection.toLocaleString()}`} icon={<DollarSign size={24} />} />
          </div>
          <StatCard title="Total Students" value={students.length.toLocaleString()} icon={<Users size={20} />} />
          <StatCard title="Paid Students" value={paidStudents.toLocaleString()} icon={<CreditCard size={20} />} />
          <StatCard title="Pending Payments" value={pendingStudents.toLocaleString()} icon={<CreditCard size={20} />} />
          <StatCard title="Total Clubs" value={String(clubs.length)} icon={<BookOpen size={20} />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Wider) */}
          <div className="lg:col-span-2 space-y-6">
            <DataTable title="Club Statistics Overview" columns={clubStatsColumns} data={clubStatsData} />
            <DataTable title="Recent Registrations" columns={registrationColumns} data={recentRegistrations} />
          </div>

          {/* Right Column (Narrower) */}
          <div className="space-y-6">
            {/* Registration Status Card */}
            <div className="bg-gradient-to-br from-primary-950 to-primary-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full border border-white/10 translate-x-1/3 -translate-y-1/3"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent-500/20 rounded-full blur-xl"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-lg font-heading font-bold">Registration Status</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${
                    registrationOpen
                      ? 'bg-green-500/20 text-green-300 border-green-500/30'
                      : 'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}>
                    {registrationOpen ? 'OPEN' : 'CLOSED'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-primary-200 text-sm mb-1">Active Cycle</p>
                    <p className="font-semibold text-lg">Club Registration {regState.year}</p>
                  </div>
                  <div>
                    <p className="text-primary-200 text-sm mb-1">Deadline</p>
                    <p className="font-semibold text-lg text-accent-300">{regState.closingDate}</p>
                  </div>
                </div>

                <Link
                  to="/admin/root/registration-control"
                  className="mt-6 w-full py-2.5 bg-white/10 hover:bg-white/20 transition-colors border border-white/20 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Settings size={15} /> Manage Settings
                </Link>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col w-full">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-heading font-bold text-primary-950 flex items-center gap-2">
                  Pending Approvals
                  <span className="bg-accent-100 text-accent-700 text-xs py-0.5 px-2 rounded-full font-bold">{pendingRequests.length}</span>
                </h3>
                <Link to="/admin/root/approvals" className="text-xs font-bold text-primary-600 hover:text-primary-800">
                  View All →
                </Link>
              </div>
              <div className="p-4 space-y-3 bg-slate-50/50 flex-1">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map(req => (
                    <ApprovalCard
                      key={req.id}
                      clubName={req.clubName}
                      requestType={req.type}
                      date={new Date(req.requestDate).toLocaleDateString()}
                      onApprove={() => approveRequest(req)}
                      onReject={() => rejectRequest(req)}
                    />
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-sm text-gray-400 font-medium">No pending approval requests 🎉</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Table */}
        <DataTable title="Recent Payments" columns={paymentColumns} data={recentPayments} />
      </div>
    </AdminLayout>
  );
}
