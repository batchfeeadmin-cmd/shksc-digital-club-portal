import React, { useEffect, useState } from 'react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { Button } from '../../components/ui/button';
import { CreditCard, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClubsData, useClubFees } from '../../hooks/useAdminData';
import { getPayments } from '../../services/payments/paymentService';
import { getStudents } from '../../services/students/studentService';
import { ReceiptModal, type ReceiptData } from '../../components/payments/ReceiptModal';
import type { Payment } from '../../types';

export function ClubPaymentsPage() {
  const { user } = useAuth();
  const { clubs } = useClubsData();
  const { fees } = useClubFees();
  const [payments, setPayments] = useState<Payment[]>(getPayments());
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const club = clubs.find(c => c.id === user?.clubId);

  useEffect(() => {
    const handleUpdate = () => setPayments(getPayments());
    window.addEventListener('shksc_state_changed', handleUpdate);
    return () => window.removeEventListener('shksc_state_changed', handleUpdate);
  }, []);

  const clubPayments = payments.filter(p => p.clubId === user?.clubId).reverse();
  const paidTotal = clubPayments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);

  const openReceipt = (payment: Payment) => {
    if (!club) return;
    const student = getStudents().find(
      s => s.studentId === payment.studentId || s.name === payment.studentName
    );
    const fee = user?.clubId ? fees[user.clubId] : undefined;
    setReceipt({
      receiptNo: payment.transactionId || payment.id,
      date: payment.date,
      studentName: payment.studentName || student?.name || '—',
      studentId: payment.studentId || student?.studentId || '—',
      className: student?.class,
      clubName: club.name,
      clubLogo: club.logo,
      profilePicture: student?.profilePicture,
      regFee: fee?.registrationFee ?? 0,
      affilCost: fee?.affiliationCost ?? 0,
      total: payment.amount,
      txnId: payment.transactionId || payment.id,
      method: payment.method || 'Online',
      status: payment.status === 'Paid' ? 'Paid' : 'Pending'
    });
    setReceiptOpen(true);
  };

  const rows = clubPayments.map(p => ({
    id: p.id,
    txId: p.transactionId || p.id,
    student: p.studentName || '—',
    amount: `৳ ${p.amount.toLocaleString()}`,
    method: p.method || 'SSLCommerz',
    date: new Date(p.date).toLocaleDateString(),
    status: p.status,
    _payment: p
  }));

  const columns = [
    { header: 'Transaction ID', accessor: 'txId', render: (val: string) => <span className="font-mono text-xs">{val}</span> },
    { header: 'Student', accessor: 'student', render: (val: string) => <span className="font-bold text-primary-950">{val}</span> },
    { header: 'Amount', accessor: 'amount', render: (val: string) => <span className="font-semibold text-gray-900">{val}</span> },
    {
      header: 'Method',
      accessor: 'method',
      render: (val: string) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
          val === 'Cash' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-primary-50 text-primary-700 border border-primary-100'
        }`}>
          {val}
        </span>
      )
    },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Status',
      accessor: 'status',
      render: (val: string) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          val === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
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
    <ClubAdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-950 mb-1">Payments</h2>
          <p className="text-sm text-gray-500">{club?.name || 'Your club'} — all payment transactions with receipts.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-xl flex items-center gap-2 border border-primary-100 font-medium">
            <CreditCard size={18} /> {clubPayments.length} Transactions
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
    </ClubAdminLayout>
  );
}
