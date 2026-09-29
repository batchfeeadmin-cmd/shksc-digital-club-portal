import React, { useState } from 'react';
import { StudentLayout } from '../../components/student/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { useClubsData } from '../../hooks/useAdminData';
import { getStudentByEmail } from '../../services/students/studentService';
import { getClubFees, confirmPayment } from '../../services/payments/paymentService';
import { createPaymentSession, validatePayment, generateTranId } from '../../services/payments/sslCommerzService';
import { FeeSummary } from '../../components/student/StudentCards';
import { CreditCard, Loader2, History, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function StudentPaymentPage() {
  const { user } = useAuth();
  const { clubs } = useClubsData();
  const student = user ? getStudentByEmail(user.email) : undefined;
  const club = student ? clubs.find(c => c.id === student.clubId) : undefined;
  
  const fees = student ? getClubFees()[student.clubId] : undefined;
  const regFee = fees?.registrationFee ?? 0;
  const affilCost = fees?.affiliationCost ?? 0;
  const total = regFee + affilCost;
  const isPaid = student?.registrationStatus === 'Confirmed';
  
  const [paying, setPaying] = useState(false);
  const [, setRefresh] = useState(0);

  const handlePayNow = async () => {
    if (!student || !club) return;
    setPaying(true);
    try {
      const tranId = generateTranId();
      await createPaymentSession({
        tranId,
        amount: total,
        student,
        studentName: student.name,
        studentEmail: student.email,
        studentPhone: student.mobile,
        clubName: club.name,
        successUrl: `${window.location.origin}/student/payment`,
        failUrl: `${window.location.origin}/student/payment`,
        cancelUrl: `${window.location.origin}/student/payment`
      });
      const validation = await validatePayment(tranId);
      if (validation.valid) {
        confirmPayment(student, student.clubId, total, tranId, validation.method, student.name, club.name);
        setRefresh(k => k + 1);
      }
    } finally {
      setPaying(false);
    }
  };

  return (
    <StudentLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary-950">Payment Center</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your club fees and view payment history.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-primary-950 text-lg mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent-500" />
              Current Dues
            </h3>
            
            {isPaid ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-bold text-green-900 text-lg mb-1">All Caught Up!</h4>
                <p className="text-sm text-green-700">You have no pending dues for the current session.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <FeeSummary regFee={regFee} affilCost={affilCost} total={total} status="Pending" />
                
                <div className="bg-accent-50 border border-accent-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-primary-950">Complete Payment</p>
                    <p className="text-xs text-gray-600 mt-0.5">Frontend demo simulation only — no real charge occurs.</p>
                  </div>
                  <Button onClick={handlePayNow} disabled={paying} className="bg-accent-500 hover:bg-accent-600 text-white gap-2 shrink-0">
                    {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                    {paying ? 'Simulating...' : `Simulate ${total.toLocaleString()} ৳`}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-primary-950 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-accent-500" />
              Recent Transactions
            </h3>
            
            {isPaid ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <div>
                    <p className="font-bold text-sm text-gray-900">Registration Fee</p>
                    <p className="text-xs text-gray-500 mt-0.5">Txn: {student?.receiptTxnId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-gray-900">{total} ৳</p>
                    <p className="text-xs text-green-600 font-bold mt-0.5">Paid</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">No recent transactions found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
