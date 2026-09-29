import React, { useState } from 'react';
import { Button } from '../ui/button';
import { CheckCircle, Download, Home, CreditCard, Loader2, ShieldCheck, LogIn, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Student } from '../../types';
import { getClubs } from '../../services/clubs/clubService';
import { getClubFees, confirmPayment } from '../../services/payments/paymentService';
import { createPaymentSession, validatePayment, generateTranId } from '../../services/payments/sslCommerzService';
import { ReceiptModal, ReceiptData } from '../payments/ReceiptModal';
import { activateStudentAccount } from '../../services/auth/userService';

interface SuccessScreenProps {
  formData: any;
  submittedStudent: Student;
}

export function SuccessScreen({ formData, submittedStudent }: SuccessScreenProps) {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const club = getClubs().find(c => c.id === submittedStudent.clubId);
  const fees = getClubFees()[submittedStudent.clubId];
  const total = (fees?.registrationFee ?? 0) + (fees?.affiliationCost ?? 0);

  const buildReceipt = (txnId: string, method: string): ReceiptData => ({
    receiptNo: txnId,
    date: new Date().toISOString(),
    studentName: submittedStudent.name,
    studentId: submittedStudent.studentId,
    className: submittedStudent.class,
    clubName: club?.name || 'SHKSC Club',
    clubLogo: club?.logo,
    profilePicture: submittedStudent.profilePicture,
    regFee: fees?.registrationFee ?? 0,
    affilCost: fees?.affiliationCost ?? 0,
    total,
    txnId,
    method,
    status: 'Paid'
  });

  const handlePayNow = async () => {
    if (!club) return;
    setPaying(true);
    setPaymentError('');
    try {
      // Frontend-only simulated payment. Real processing will be server-side.
      const tranId = generateTranId();
      const session = await createPaymentSession({
        tranId,
        amount: total,
        student: submittedStudent,
        studentName: submittedStudent.name,
        studentEmail: submittedStudent.email,
        studentPhone: submittedStudent.mobile,
        clubName: club.name,
        successUrl: `${window.location.origin}/registration/success`,
        failUrl: `${window.location.origin}/registration/fail`,
        cancelUrl: `${window.location.origin}/registration/cancel`
      });

      const validation = await validatePayment(session.tranId);

      if (validation.valid) {
        activateStudentAccount(submittedStudent, formData.password);
        confirmPayment(
          submittedStudent,
          submittedStudent.clubId,
          total,
          session.tranId,
          validation.method,
          submittedStudent.name,
          club.name
        );
        setReceipt(buildReceipt(session.tranId, validation.method));
        setPaid(true);
      }
    } catch (err) {
      console.error('Payment failed', err);
      setPaymentError(err instanceof Error ? err.message : 'Payment could not be completed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10" />
      </div>
      
      <h2 className="text-3xl font-heading font-bold text-primary-950 mb-2">Registration Submitted Successfully</h2>
      <p className="text-gray-600 mb-8">Thank you, {formData.fullName}. Your club registration application has been received.</p>

      <div className="bg-surface-sec p-6 rounded-xl border border-gray-200 mb-6 inline-block text-left w-full sm:w-auto min-w-[300px]">
        <div className="mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Student ID (Auto-generated)</p>
          <p className="font-mono font-bold text-lg text-primary-900">{submittedStudent.studentId}</p>
        </div>
        <div className="mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Student Roll</p>
          <p className="font-semibold text-primary-900">{submittedStudent.roll || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Status</p>
          {paid ? (
            <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-100 text-green-800 text-sm font-semibold">
              Confirmed — Payment Received
            </div>
          ) : (
            <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-sm font-semibold">
              Pending Payment
            </div>
          )}
        </div>
      </div>

      {!paid && (
        <div className="bg-primary-50 border border-primary-100 rounded-xl p-5 mb-8 text-left">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-6 h-6 text-primary-600 shrink-0" />
            <div>
              <p className="font-bold text-primary-950 text-sm">Simulated Demo Payment</p>
              <p className="text-xs text-gray-500">No real charge will occur. Demo total: <span className="font-bold text-accent-600">{total.toLocaleString()} ৳</span> (Registration {fees?.registrationFee ?? 0} ৳ + Affiliation {fees?.affiliationCost ?? 0} ৳)</p>
            </div>
          </div>
          <Button
            onClick={handlePayNow}
            disabled={paying}
            size="lg"
            className="w-full bg-accent-500 hover:bg-accent-600 text-white gap-2 h-12"
          >
            {paying ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
            {paying ? 'Simulating Payment...' : `Simulate Payment (${total.toLocaleString()} ৳)`}
          </Button>
        </div>
      )}

      {paymentError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm text-left" role="alert">
          <p className="font-bold">Payment or account activation failed</p>
          <p className="mt-1">{paymentError}</p>
        </div>
      )}

      {paid && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8 text-left flex items-start gap-3">
          <UserCheck className="w-6 h-6 text-green-600 shrink-0" />
          <div>
            <p className="font-bold text-green-900">Student Portal account activated</p>
            <p className="text-sm text-green-700 mt-1">
              Sign in with <span className="font-semibold">{submittedStudent.email}</span> and the password you created.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {paid && (
          <Button variant="outline" className="gap-2" onClick={() => setReceiptOpen(true)}>
            <Download className="w-4 h-4" />
            Download Receipt
          </Button>
        )}
        {paid && (
          <Button asChild className="gap-2 bg-primary-950 hover:bg-primary-900 text-white">
            <Link to="/login">
              <LogIn className="w-4 h-4" />
              Login to Student Portal
            </Link>
          </Button>
        )}
        <Button asChild className="gap-2">
          <Link to="/">
            <Home className="w-4 h-4" />
            Return to Homepage
          </Link>
        </Button>
      </div>

      {receipt && (
        <ReceiptModal
          isOpen={receiptOpen}
          onClose={() => setReceiptOpen(false)}
          receipt={receipt}
        />
      )}
    </div>
  );
}
