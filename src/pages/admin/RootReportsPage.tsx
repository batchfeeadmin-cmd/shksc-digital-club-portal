import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { Printer, Users, CreditCard, BookOpen, DollarSign } from 'lucide-react';
import { useClubsData, useClubFees } from '../../hooks/useAdminData';
import { getStudents } from '../../services/students/studentService';
import { getPayments } from '../../services/payments/paymentService';
import type { Student, Payment } from '../../types';

export function RootReportsPage() {
  const { clubs } = useClubsData();
  const { fees } = useClubFees();
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

  const paidStudents = students.filter(s => s.registrationStatus === 'Confirmed').length;
  const pendingStudents = students.filter(s => s.registrationStatus === 'Pending Payment').length;
  const paidPayments = payments.filter(p => p.status === 'Paid');
  const totalCollection = paidPayments.reduce((sum, p) => sum + p.amount, 0);

  const rows = clubs.map(club => {
    const clubStudents = students.filter(s => s.clubId === club.id);
    const clubPaid = clubStudents.filter(s => s.registrationStatus === 'Confirmed').length;
    const clubPending = clubStudents.filter(s => s.registrationStatus === 'Pending Payment').length;
    const fee = fees[club.id];
    const feeTotal = fee ? fee.registrationFee + fee.affiliationCost : 0;
    return {
      name: club.name,
      category: club.category,
      students: clubStudents.length,
      paid: clubPaid,
      pending: clubPending,
      collection: `৳ ${(clubPaid * feeTotal).toLocaleString()}`
    };
  });

  const columns = [
    { header: 'Club Name', accessor: 'name', render: (val: string) => <span className="font-semibold text-primary-950">{val}</span> },
    { header: 'Category', accessor: 'category' },
    { header: 'Students', accessor: 'students' },
    { header: 'Paid', accessor: 'paid', render: (val: number) => <span className="text-green-600 font-medium">{val}</span> },
    { header: 'Pending', accessor: 'pending', render: (val: number) => <span className="text-amber-600 font-medium">{val}</span> },
    { header: 'Collection', accessor: 'collection', render: (val: string) => <span className="font-bold text-gray-900">{val}</span> }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-950 mb-1">Reports</h2>
          <p className="text-sm text-gray-500">Portal-wide summary for the current registration cycle.</p>
        </div>
        <button
          onClick={() => window.print()}
          className="bg-primary-950 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-900 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Printer size={16} /> Print Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center"><Users size={20} /></div>
            <p className="text-sm font-semibold text-gray-500">Total Students</p>
          </div>
          <p className="text-3xl font-heading font-extrabold text-primary-950">{students.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center"><CreditCard size={20} /></div>
            <p className="text-sm font-semibold text-gray-500">Paid Students</p>
          </div>
          <p className="text-3xl font-heading font-extrabold text-primary-950">{paidStudents}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><CreditCard size={20} /></div>
            <p className="text-sm font-semibold text-gray-500">Pending Payments</p>
          </div>
          <p className="text-3xl font-heading font-extrabold text-primary-950">{pendingStudents}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center"><DollarSign size={20} /></div>
            <p className="text-sm font-semibold text-gray-500">Total Collection</p>
          </div>
          <p className="text-3xl font-heading font-extrabold text-primary-950">৳ {totalCollection.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable title="Club-wise Report" columns={columns} data={rows} />
      </div>

      <div className="mt-8 bg-primary-950 rounded-2xl p-6 text-primary-100 text-sm flex items-center gap-3">
        <BookOpen size={18} className="text-accent-400 shrink-0" />
        <p>
          <span className="font-bold text-white">{clubs.length} clubs</span> are active on the portal. Registration cycle data
          updates in real time as students apply and pay.
        </p>
      </div>
    </AdminLayout>
  );
}
