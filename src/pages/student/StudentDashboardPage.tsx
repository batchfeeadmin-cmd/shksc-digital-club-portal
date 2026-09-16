import React, { useState, useEffect } from 'react';
import { StudentLayout } from '../../components/student/StudentLayout';
import { 
  ProfileCard, 
  RegistrationCard, 
  FeeSummary, 
  ReceiptCard, 
  NoticeCard, 
  ClubInfoCard 
} from '../../components/student/StudentCards';
import { useClubsData } from '../../hooks/useAdminData';
import { useAuth } from '../../context/AuthContext';
import { getStudentByEmail } from '../../services/students/studentService';
import { getClubFees, confirmPayment } from '../../services/payments/paymentService';
import { createPaymentSession, validatePayment, generateTranId } from '../../services/payments/sslCommerzService';
import { getNoticesByClub } from '../../services/notices/noticeService';
import { getSystemAlertsForStudent } from '../../services/communication/communicationService';
import { getEventsByClub, rsvpForEvent, cancelRsvp } from '../../services/events/eventService';
import { ReceiptModal, ReceiptData } from '../../components/payments/ReceiptModal';
import { Button } from '../../components/ui/button';
import { Bell, Loader2, CreditCard, CalendarDays, MapPin, Users, Check } from 'lucide-react';

export function StudentDashboardPage() {
  const { user } = useAuth();
  const { clubs } = useClubsData();
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [paying, setPaying] = useState(false);
  const [, setRefreshKey] = useState(0);

  // Real student record (falls back to the seeded demo student)
  const student = user ? getStudentByEmail(user.email) : undefined;
  const club = student ? clubs.find(c => c.id === student.clubId) : undefined;
  const fees = student ? getClubFees()[student.clubId] : undefined;

  const regFee = fees?.registrationFee ?? 0;
  const affilCost = fees?.affiliationCost ?? 0;
  const total = regFee + affilCost;
  const paid = student?.registrationStatus === 'Confirmed';

  const openReceipt = () => {
    if (!student || !club) return;
    setReceipt({
      receiptNo: student.receiptTxnId || student.studentId,
      date: new Date().toISOString(),
      studentName: student.name,
      studentId: student.studentId,
      className: student.class,
      clubName: club.name,
      clubLogo: club.logo,
      regFee,
      affilCost,
      total,
      txnId: student.receiptTxnId || '—',
      method: 'SSLCommerz',
      status: 'Paid'
    });
    setReceiptOpen(true);
  };

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
        successUrl: `${window.location.origin}/student/dashboard`,
        failUrl: `${window.location.origin}/student/dashboard`,
        cancelUrl: `${window.location.origin}/student/dashboard`
      });
      const validation = await validatePayment(tranId);
      if (validation.valid) {
        confirmPayment(student, student.clubId, total, tranId, validation.method, student.name, club.name);
        setRefreshKey(k => k + 1);
        setReceipt({
          receiptNo: tranId,
          date: new Date().toISOString(),
          studentName: student.name,
          studentId: student.studentId,
          className: student.class,
          clubName: club.name,
          clubLogo: club.logo,
          profilePicture: student.profilePicture,
          regFee,
          affilCost,
          total,
          txnId: tranId,
          method: validation.method,
          status: 'Paid'
        });
      }
    } finally {
      setPaying(false);
    }
  };

  const [events, setEvents] = useState(student ? getEventsByClub(student.clubId) : []);

  useEffect(() => {
    const handleUpdate = () => {
      if (student) setEvents(getEventsByClub(student.clubId));
    };
    window.addEventListener('shksc_state_changed', handleUpdate);
    return () => window.removeEventListener('shksc_state_changed', handleUpdate);
  }, [student]);

  const handleToggleRSVP = (eventId: string, isAttending: boolean) => {
    if (!student) return;
    if (isAttending) {
      cancelRsvp(eventId, student.id);
    } else {
      rsvpForEvent(eventId, student.id);
    }
    setEvents(getEventsByClub(student.clubId));
  };

  const notices = (student ? getNoticesByClub(student.clubId) : []).map(notice => ({
    title: notice.title,
    date: new Date(notice.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    description: notice.message
  }));

  const alerts = getSystemAlertsForStudent(student?.registrationStatus === 'Confirmed' ? 'Confirmed' : 'Pending');

  return (
    <StudentLayout>
      {alerts.length > 0 && (
        <div className="mb-6 space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className="bg-primary-50 border border-primary-200 text-primary-900 px-4 py-3 rounded-xl flex gap-3 shadow-sm">
              <Bell className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm mb-0.5">{alert.subject}</h4>
                <p className="text-sm opacity-90">{alert.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary-950">Student Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your club registration and activities.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8 items-start">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileCard 
            name={student?.name || user?.name || 'Student'} 
            studentId={student?.studentId || '—'} 
            profilePicture={student?.profilePicture || user?.profilePicture}
          />
          
          <div className="grid sm:grid-cols-2 gap-6 items-stretch">
            <RegistrationCard clubName={club?.name || 'No club selected'} status={paid ? 'Confirmed' : 'Pending Payment'} />
            <FeeSummary regFee={regFee} affilCost={affilCost} total={total} status={paid ? 'Paid' : 'Pending'} />
          </div>

          {!paid && (
            <div className="bg-accent-50 border border-accent-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-primary-950">Complete your registration</p>
                <p className="text-xs text-gray-600 mt-0.5">Pay securely through SSLCommerz to confirm your club membership.</p>
              </div>
              <Button onClick={handlePayNow} disabled={paying} className="bg-accent-500 hover:bg-accent-600 text-white gap-2 shrink-0">
                {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                {paying ? 'Processing...' : `Pay ${total.toLocaleString()} ৳`}
              </Button>
            </div>
          )}

          <div className="pt-4 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-heading font-bold text-primary-950 mb-4 flex items-center gap-2">
                <Bell className="text-accent-500 w-5 h-5" /> Recent Notices
              </h3>
              <div className="space-y-4">
                {notices.length > 0 ? (
                  notices.map((notice, idx) => (
                    <NoticeCard key={idx} notice={notice} />
                  ))
                ) : (
                  <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                    <Bell className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 font-medium">No new notices</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-heading font-bold text-primary-950 mb-4 flex items-center gap-2">
                <CalendarDays className="text-accent-500 w-5 h-5" /> Upcoming Events
              </h3>
              <div className="space-y-4">
                {events.length > 0 ? (
                  events.map(event => {
                    const isAttending = student && event.rsvps.includes(student.id);
                    const isFull = event.maxCapacity && event.rsvps.length >= event.maxCapacity;
                    
                    return (
                      <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h4 className="font-bold text-gray-900 mb-1">{event.title}</h4>
                        <div className="flex flex-col gap-1.5 mb-3 text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-3.5 h-3.5" />
                            <span>{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} at {event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{event.venue}</span>
                          </div>
                        </div>
                        
                        {student && (
                          <Button 
                            onClick={() => handleToggleRSVP(event.id, isAttending || false)}
                            disabled={!isAttending && isFull}
                            variant={isAttending ? 'outline' : 'default'}
                            className={`w-full text-xs h-8 ${isAttending ? 'text-green-600 border-green-200 hover:bg-green-50' : 'bg-primary-950 hover:bg-primary-900'}`}
                          >
                            {isAttending ? <><Check className="w-3.5 h-3.5 mr-1" /> Attending</> : (isFull ? 'Event Full' : 'RSVP Now')}
                          </Button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                    <CalendarDays className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 font-medium">No upcoming events</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Side Content) */}
        <div className="space-y-6 flex flex-col h-full">
          <ClubInfoCard club={club} />
          <div className="flex-1 min-h-[400px]">
            {paid ? (
              <ReceiptCard 
                name={student?.name || ''} 
                clubName={club?.name || ''} 
                regFee={regFee} 
                affilCost={affilCost} 
                total={total} 
                txnId={student?.receiptTxnId || ''}
                onDownload={openReceipt}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center h-full flex flex-col items-center justify-center">
                <CreditCard className="w-8 h-8 text-gray-300 mb-3" />
                <p className="font-bold text-gray-500">Receipt available after payment</p>
                <p className="text-xs text-gray-400 mt-1">Your digital receipt will appear here once the payment is confirmed.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ReceiptModal
        isOpen={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        receipt={receipt!}
      />
    </StudentLayout>
  );
}
