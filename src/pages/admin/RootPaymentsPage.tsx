import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { Button } from '../../components/ui/button';
import { CreditCard, Eye, Download } from 'lucide-react';
import { useClubsData, useClubFees } from '../../hooks/useAdminData';
import { getPayments } from '../../services/payments/paymentService';
import { getStudents } from '../../services/students/studentService';
import { ReceiptModal, type ReceiptData } from '../../components/payments/ReceiptModal';
import type { Payment } from '../../types';
import { exportToCSV } from '../../utils/exportUtils';

export function RootPaymentsPage() {
  const { clubs } = useClubsData();
  const { fees } = useClubFees();
  const [payments, setPayments] = useState<Payment[]>(getPayments());
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setPayments(getPayments());
    window.addEventListener('shksc_state_changed', handleUpdate);
    return () => window.removeEventListener('shksc_state_changed', handleUpdate);
  }, []);

  const clubNameOf = (clubId: string) => clubs.find(c => c.id === clubId)?.name || '—';

  const paidTotal = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);

  const openReceipt = (payment: Payment) => {
    const club = clubs.find(c => c.id === payment.clubId);
    const student = getStudents().find(
      s => s.studentId === payment.studentId || s.name === payment.studentName
    );
    const fee = payment.clubId ? fees[payment.clubId] : undefined;
    
    setReceipt({
      receiptNo: payment.transactionId || payment.id,
      date: payment.date,
      studentName: payment.studentName || student?.name || '—',
      studentId: payment.studentId || student?.studentId || '—',
      className: student?.class,
      clubName: club?.name || '—',
      clubLogo: club?.logo,
      profilePicture: student?.profilePicture,
      regFee: fee?.registrationFee ?? 0,
      affilCost: fee?.affiliationCost ?? 0,
      originalTotal: payment.originalAmount,
      discountAmount: payment.discountAmount,
      discountReason: payment.discountReason,
      total: payment.amount,
      txnId: payment.transactionId || payment.id,
      method: payment.method || 'Online',
      status: payment.status === 'Paid' ? 'Paid' : 'Pending'
    });
    setReceiptOpen(true);
  };

  const rows = [...payments].reverse().map(p => ({
    id: p.id,
    txId: p.transactionId || p.id,
    student: p.studentName || '—',
    club: clubNameOf(p.clubId),
    amount: `৳ ${p.amount.toLocaleString()}`,
    method: p.method || 'SSLCommerz',
    date: new Date(p.date).toLocaleDateString(),
    status: p.status,
    _payment: p
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
    },
    {
      header: 'Receipt',
      accessor: 'id',
      render: (_val: string, row: any) => (
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs border-gray-200 hover:bg-primary-50"
          onClick={() => openReceipt(row._payment)}
        >
          <Eye size={13} /> View Receipt
        </Button>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-950 mb-1">Payments</h2>
          <p className="text-sm text-gray-500">All online demo and manually recorded transactions across the portal.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => exportToCSV('all_payments.csv', rows.map(({_payment, ...rest}) => rest))}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
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

      {receipt && (
        <ReceiptModal
          isOpen={receiptOpen}
          onClose={() => setReceiptOpen(false)}
          receipt={receipt}
        />
      )}
    </AdminLayout>
  );
}
