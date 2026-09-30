import React, { useState } from 'react';
import { StudentLayout } from '../../components/student/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { useClubsData } from '../../hooks/useAdminData';
import { getStudentByEmail } from '../../services/students/studentService';
import { getClubFees, getPaymentByTransactionId } from '../../services/payments/paymentService';
import { ReceiptCard } from '../../components/student/StudentCards';
import { ReceiptModal, ReceiptData } from '../../components/payments/ReceiptModal';
import { ReceiptText } from 'lucide-react';

export function StudentReceiptPage() {
  const { user } = useAuth();
  const { clubs } = useClubsData();
  const student = user ? getStudentByEmail(user.email) : undefined;
  const club = student ? clubs.find(c => c.id === student.clubId) : undefined;
  
  const fees = student ? getClubFees()[student.clubId] : undefined;
  const regFee = fees?.registrationFee ?? 0;
  const affilCost = fees?.affiliationCost ?? 0;
  const originalTotal = regFee + affilCost;
  const isPaid = student?.registrationStatus === 'Confirmed';
  const payment = student?.receiptTxnId ? getPaymentByTransactionId(student.receiptTxnId) : undefined;

  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  const openReceipt = () => {
    if (!student || !club) return;
    const total = payment?.amount ?? originalTotal;
    setReceipt({
      receiptNo: student.receiptTxnId || student.studentId,
      date: new Date().toISOString(),
      studentName: student.name,
      studentId: student.studentId,
      className: student.class,
      clubName: club.name,
      clubLogo: club.logo,
      profilePicture: student.profilePicture,
      regFee,
      affilCost,
      originalTotal: payment?.originalAmount ?? originalTotal,
      discountAmount: payment?.discountAmount,
      discountReason: payment?.discountReason,
      total,
      txnId: student.receiptTxnId || '—',
      method: payment?.method || 'Online',
      status: 'Paid'
    });
    setReceiptOpen(true);
  };

  return (
    <StudentLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary-950">My Receipts</h1>
        <p className="text-sm text-gray-500 mt-1">Download and print your payment receipts.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {isPaid ? (
          <ReceiptCard 
            name={student?.name || ''} 
            clubName={club?.name || ''} 
            regFee={regFee} 
            affilCost={affilCost} 
            total={payment?.amount ?? originalTotal}
            discountAmount={payment?.discountAmount}
            discountReason={payment?.discountReason}
            txnId={student?.receiptTxnId || ''}
            onDownload={openReceipt}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center col-span-full">
            <ReceiptText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">No Receipts Found</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              You haven't made any successful payments yet. Your digital receipts will appear here once you complete a payment.
            </p>
          </div>
        )}
      </div>

      <ReceiptModal
        isOpen={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        receipt={receipt!}
      />
    </StudentLayout>
  );
}
