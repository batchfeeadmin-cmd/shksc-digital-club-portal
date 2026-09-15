import React, { useState } from 'react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { Button } from '../../components/ui/button';
import { CircleDollarSign, Send, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getClubs } from '../../services/clubs/clubService';
import { getClubFees, requestFeeUpdate } from '../../services/payments/paymentService';
import { getApprovalRequests } from '../../services/approvals/approvalService';

export function ClubFeePage() {
  const { user } = useAuth();
  const club = getClubs().find(c => c.id === user?.clubId);

  const [registrationFee, setRegistrationFee] = useState<number>(() => {
    const fee = user?.clubId ? getClubFees()[user.clubId] : undefined;
    return fee?.registrationFee ?? 0;
  });
  const [affiliationCost, setAffiliationCost] = useState<number>(() => {
    const fee = user?.clubId ? getClubFees()[user.clubId] : undefined;
    return fee?.affiliationCost ?? 0;
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedAt, setSubmittedAt] = useState('');

  const currentFee = user?.clubId ? getClubFees()[user.clubId] : undefined;
  const pendingRequest = user?.clubId
    ? getApprovalRequests().find(r => r.clubId === user.clubId && r.type === 'Fee Update' && r.status === 'Pending')
    : undefined;

  const dirty =
    registrationFee !== (currentFee?.registrationFee ?? 0) ||
    affiliationCost !== (currentFee?.affiliationCost ?? 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.clubId || !club) return;
    requestFeeUpdate(user.clubId, club.name, Number(registrationFee), Number(affiliationCost));
    setSubmitted(true);
    setSubmittedAt(new Date().toLocaleString());
  };

  const statusBadge = (status?: string) => {
    if (status === 'Pending')
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
          <Clock size={14} /> Awaiting Root Admin Approval
        </span>
      );
    if (status === 'Approved')
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
          <CheckCircle2 size={14} /> Approved
        </span>
      );
    if (status === 'Rejected')
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
          <XCircle size={14} /> Rejected
        </span>
      );
    return null;
  };

  return (
    <ClubAdminLayout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold text-primary-950">Club Fees</h2>
          <p className="text-sm text-gray-500 mt-1">
            {club?.name || 'Your club'} — fee changes require approval from the Root Admin.
          </p>
        </div>

        {/* Current fees */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="font-heading font-bold text-primary-950 mb-5 flex items-center gap-2">
            <CircleDollarSign size={20} className="text-accent-500" /> Current Fee Structure
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Registration Fee</p>
              <p className="text-2xl font-extrabold text-primary-950">{currentFee?.registrationFee ?? 0} ৳</p>
            </div>
            <div className="bg-slate-50 border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Affiliation Cost</p>
              <p className="text-2xl font-extrabold text-primary-950">{currentFee?.affiliationCost ?? 0} ৳</p>
            </div>
            <div className="bg-accent-50 border border-accent-100 rounded-xl p-4 text-center">
              <p className="text-xs text-accent-700 uppercase tracking-wider font-semibold mb-1">Total Payable</p>
              <p className="text-2xl font-extrabold text-accent-600">
                {((currentFee?.registrationFee ?? 0) + (currentFee?.affiliationCost ?? 0)).toLocaleString()} ৳
              </p>
            </div>
          </div>
          {statusBadge(pendingRequest?.status)}
        </div>

        {/* Request change form */}
        {pendingRequest && pendingRequest.status === 'Pending' ? (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
              <Clock size={18} /> Fee update request pending
            </h4>
            <p className="text-sm text-orange-700 mb-4">
              A fee update request is awaiting Root Admin approval. You can submit a new request only after it is reviewed.
            </p>
            <div className="bg-white/70 rounded-xl p-4 grid sm:grid-cols-2 gap-3 text-sm border border-orange-100">
              <div className="flex justify-between"><span className="text-gray-500">Requested Registration Fee</span><span className="font-bold">{pendingRequest.data.registrationFee} ৳</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Requested Affiliation Cost</span><span className="font-bold">{pendingRequest.data.affiliationCost} ৳</span></div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h3 className="font-heading font-bold text-primary-950 flex items-center gap-2">
              <Send size={18} className="text-accent-500" /> Request Fee Change
            </h3>
            <p className="text-xs text-gray-500 -mt-2">
              Proposed changes are sent to the Root Admin and applied only after approval.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Registration Fee (BDT)</label>
                <input
                  type="number"
                  min={0}
                  value={registrationFee}
                  onChange={e => setRegistrationFee(Number(e.target.value))}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Affiliation Cost (BDT)</label>
                <input
                  type="number"
                  min={0}
                  value={affiliationCost}
                  onChange={e => setAffiliationCost(Number(e.target.value))}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                />
              </div>
            </div>

            <div className="bg-accent-50 border border-accent-100 rounded-xl p-4 flex justify-between items-center">
              <span className="font-bold text-primary-950">Proposed Total:</span>
              <span className="text-xl font-extrabold text-accent-600">{(registrationFee + affiliationCost).toLocaleString()} ৳</span>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={!dirty || (submitted && pendingRequest?.status === 'Pending')} className="bg-primary-900 text-white hover:bg-primary-800 gap-2">
                <Send size={16} /> Submit for Approval
              </Button>
            </div>

            {submitted && (
              <p className="text-xs text-green-600 font-medium">
                Request submitted on {submittedAt} — now waiting for Root Admin review.
              </p>
            )}
          </form>
        )}
      </div>
    </ClubAdminLayout>
  );
}
