import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { CreditCard } from 'lucide-react';
import { useClubsData } from '../../hooks/useAdminData';
import { getPayments } from '../../services/payments/paymentService';
import type { Payment } from '../../types';

export function RootPaymentsPage() {
  const { clubs } = useClubsData();
  const [payments, setPayments] = useState<Payment[]>(getPayments());

  useEffect(() => {
    const handleUpdate = () => setPayments(getPayments());
    window.addEventListener('shksc_state_changed', handleUpdate);
    return () => window.removeEventListener('shksc_state_changed', handleUpdate);
  }, []);

  const clubNameOf = (clubId: string) => clubs.find(c => c.id === clubId)?.name || '—';

  const paidTotal = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);

  const rows = [...payments].reverse().map(p => ({
    txId: p.transactionId || p.id,
    student: p.studentName || '—',
    club: clubNameOf(p.clubId),
    amount: `৳ ${p.amount.toLocaleString()}`,
    method: p.method || 'SSLCommerz',
    date: new Date(p.date).toLocaleDateString(),
    status: p.status
  }));

  const columns = [
    { header: 'Transaction ID', accessor: 'txId', render: (val: string) => <span className="font-mono text-xs">{val}</span> },
    { header: 'Student', accessor: 'student', render: (val: string) => <span className="font-bold text-primary-950">{val}</span> },
    { header: 'Club', accessor: 'club' },
    { header: 'Amount', accessor: 'amount', render: (val: string) => <span className="font-semibold text-gray-900">{val}</span> },
    { header: 'Method', accessor: 'method' },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Status',
      accessor: 'status',
      render: (val: string) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          val === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {val}
        </span>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-950 mb-1">Payments</h2>
          <p className="text-sm text-gray-500">All SSLCommerz transactions across the portal.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-xl flex items-center gap-2 border border-primary-100 font-medium">
            <CreditCard size={18} /> {payments.length} Transactions
          </div>
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl flex items-center gap-2 border border-green-100 font-medium">
            Collected: ৳ {paidTotal.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable title="Payment Transactions" columns={columns} data={rows} />
      </div>
    </AdminLayout>
  );
}
