import React, { useEffect, useState } from 'react';
import { BadgePercent, Banknote, CreditCard, Download, Eye, RotateCcw, Search } from 'lucide-react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { Button } from '../../components/ui/button';
import { ReceiptModal, type ReceiptData } from '../../components/payments/ReceiptModal';
import { useAuth } from '../../context/AuthContext';
import { useClubsData, useClubFees } from '../../hooks/useAdminData';
import { getPayments } from '../../services/payments/paymentService';
import { getStudents } from '../../services/students/studentService';
import { exportToCSV } from '../../utils/exportUtils';
import type { Payment } from '../../types';

type PaymentStatusFilter = 'All' | Payment['status'];
type PaymentMethodFilter = 'All' | 'Cash' | 'Online';

export function ClubPaymentsPage() {
  const { user } = useAuth();
  const { clubs } = useClubsData();
  const { fees } = useClubFees();
  const [payments, setPayments] = useState<Payment[]>(getPayments());
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>('All');
  const [methodFilter, setMethodFilter] = useState<PaymentMethodFilter>('All');

  const club = clubs.find(item => item.id === user?.clubId);

  useEffect(() => {
    const handleUpdate = () => setPayments(getPayments());
    window.addEventListener('shksc_state_changed', handleUpdate);
    return () => window.removeEventListener('shksc_state_changed', handleUpdate);
  }, []);

  const clubPayments = payments.filter(payment => payment.clubId === user?.clubId).reverse();
  const paidTotal = clubPayments.filter(payment => payment.status === 'Paid').reduce((sum, payment) => sum + payment.amount, 0);
  const cashTotal = clubPayments.filter(payment => payment.status === 'Paid' && payment.method === 'Cash').reduce((sum, payment) => sum + payment.amount, 0);
  const discountTotal = clubPayments.filter(payment => payment.status === 'Paid').reduce((sum, payment) => sum + (payment.discountAmount || 0), 0);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredPayments = clubPayments.filter(payment => {
    const matchesStatus = statusFilter === 'All' || payment.status === statusFilter;
    const isCash = payment.method === 'Cash';
    const matchesMethod = methodFilter === 'All' || (methodFilter === 'Cash' ? isCash : !isCash);
    const searchable = [payment.transactionId, payment.id, payment.studentName, payment.studentId, payment.method, payment.amount]
      .filter(value => value !== undefined)
      .join(' ')
      .toLowerCase();
    return matchesStatus && matchesMethod && (!normalizedSearch || searchable.includes(normalizedSearch));
  });
  const hasFilters = Boolean(normalizedSearch) || statusFilter !== 'All' || methodFilter !== 'All';

  const openReceipt = (payment: Payment) => {
    if (!club) return;
    const student = getStudents().find(item => item.studentId === payment.studentId || item.name === payment.studentName);
    const fee = user?.clubId ? fees[user.clubId] : undefined;
    setReceipt({
      receiptNo: payment.transactionId || payment.id,
      date: payment.date,
      studentName: payment.studentName || student?.name || '-',
      studentId: payment.studentId || student?.studentId || '-',
      className: student?.class,
      clubName: club.name,
      clubLogo: club.logo,
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

  const rows = filteredPayments.map(payment => ({
    id: payment.id,
    txId: payment.transactionId || payment.id,
    student: payment.studentName || '-',
    amount: `৳ ${payment.amount.toLocaleString()}`,
    discount: payment.discountAmount ? `৳ ${payment.discountAmount.toLocaleString()}` : '-',
    method: payment.method || 'SSLCommerz',
    date: new Date(payment.date).toLocaleDateString(),
    status: payment.status,
    _payment: payment
  }));

  const columns = [
    { header: 'Transaction ID', accessor: 'txId', render: (value: string) => <span className="font-mono text-xs">{value}</span> },
    { header: 'Student', accessor: 'student', render: (value: string) => <span className="font-bold text-primary-950">{value}</span> },
    { header: 'Amount', accessor: 'amount', render: (value: string) => <span className="font-semibold text-gray-900">{value}</span> },
    { header: 'Discount', accessor: 'discount', render: (value: string) => <span className={value === '-' ? 'text-gray-400' : 'font-semibold text-blue-700'}>{value}</span> },
    {
      header: 'Method',
      accessor: 'method',
      render: (value: string) => (
        <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${value === 'Cash' ? 'border-green-100 bg-green-50 text-green-700' : 'border-primary-100 bg-primary-50 text-primary-700'}`}>{value}</span>
      )
    },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Status',
      accessor: 'status',
      render: (value: string) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${value === 'Paid' ? 'bg-green-100 text-green-700' : value === 'Failed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{value}</span>
      )
    },
    {
      header: 'Receipt',
      accessor: 'id',
      render: (_value: string, row: any) => (
        <Button variant="outline" size="sm" className="h-8 gap-1.5 border-gray-200 text-xs hover:bg-primary-50" onClick={() => openReceipt(row._payment)}>
          <Eye size={13} /> View
        </Button>
      )
    }
  ];

  return (
    <ClubAdminLayout>
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><h2 className="text-2xl font-heading font-bold text-primary-950">Payments</h2><p className="mt-1 text-sm text-gray-500">{club?.name || 'Your club'} - search transactions and print receipts.</p></div>
        <Button variant="outline" disabled={rows.length === 0} onClick={() => exportToCSV('club_payments.csv', rows.map(({ _payment, ...row }) => row))} className="gap-2"><Download size={16} /> Export {hasFilters ? 'Results' : 'CSV'}</Button>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-white p-4"><CreditCard size={18} className="mb-2 text-primary-700" /><span className="text-2xl font-bold text-primary-950">{clubPayments.length}</span><span className="mt-1 block text-xs font-semibold text-gray-500">Transactions</span></div>
        <div className="rounded-xl border border-gray-100 bg-white p-4"><span className="mb-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-green-100 text-[11px] font-black text-green-700">৳</span><span className="text-xl sm:text-2xl font-bold text-green-700">৳ {paidTotal.toLocaleString()}</span><span className="mt-1 block text-xs font-semibold text-gray-500">Total Collected</span></div>
        <button type="button" onClick={() => setMethodFilter('Cash')} className={`rounded-xl border p-4 text-left ${methodFilter === 'Cash' ? 'border-emerald-300 bg-emerald-50 ring-2 ring-emerald-100' : 'border-gray-100 bg-white'}`}><Banknote size={18} className="mb-2 text-emerald-700" /><span className="text-xl sm:text-2xl font-bold text-emerald-700">৳ {cashTotal.toLocaleString()}</span><span className="mt-1 block text-xs font-semibold text-gray-500">Cash Collection</span></button>
        <div className="rounded-xl border border-gray-100 bg-white p-4"><BadgePercent size={18} className="mb-2 text-blue-700" /><span className="text-xl sm:text-2xl font-bold text-blue-700">৳ {discountTotal.toLocaleString()}</span><span className="mt-1 block text-xs font-semibold text-gray-500">Discount Given</span></div>
      </div>

      <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="search" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Search transaction, student, ID or amount..." className="h-11 w-full rounded-lg border border-gray-200 pl-10 pr-3 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" /></div>
          <select value={methodFilter} onChange={event => setMethodFilter(event.target.value as PaymentMethodFilter)} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium"><option value="All">All Methods</option><option value="Online">Online / SSLCommerz</option><option value="Cash">Cash</option></select>
          <select value={statusFilter} onChange={event => setStatusFilter(event.target.value as PaymentStatusFilter)} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium"><option value="All">All Statuses</option><option>Paid</option><option>Pending</option><option>Failed</option></select>
          {hasFilters && <Button variant="ghost" onClick={() => { setSearchTerm(''); setStatusFilter('All'); setMethodFilter('All'); }} className="gap-2"><RotateCcw size={15} /> Reset</Button>}
        </div>
        <p className="mt-3 text-xs text-gray-500">Showing <strong className="text-primary-900">{filteredPayments.length}</strong> of {clubPayments.length} transactions</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <DataTable title="Payment Transactions" columns={columns} data={rows} emptyMessage={hasFilters ? 'No transactions match the current search or filters.' : 'No payment transactions are available for this club yet.'} />
      </div>

      {receipt && <ReceiptModal isOpen={receiptOpen} onClose={() => setReceiptOpen(false)} receipt={receipt} />}
    </ClubAdminLayout>
  );
}
