import React, { useState } from 'react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { Button } from '../../components/ui/button';
import { UserCircle, Send, Clock, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserById } from '../../services/auth/userService';
import { getClubs } from '../../services/clubs/clubService';
import { createApprovalRequest, getApprovalRequests } from '../../services/approvals/approvalService';

export function ClubProfilePage() {
  const { user } = useAuth();
  const account = user ? getUserById(user.id) : undefined;
  const club = getClubs().find(c => c.id === user?.clubId);

  const [name, setName] = useState(account?.name || '');
  const [email, setEmail] = useState(account?.email || '');
  const [mobile, setMobile] = useState(account?.mobile || '');
  const [designation, setDesignation] = useState(account?.designation || '');
  const [profilePicture, setProfilePicture] = useState(account?.profilePicture || '');
  const [submitted, setSubmitted] = useState(false);

  const pendingRequest = user
    ? getApprovalRequests().find(
        r => r.type === 'Profile Update' && r.data.userId === user.id && r.status === 'Pending'
      )
    : undefined;

  const dirty =
    name !== account?.name || email !== account?.email ||
    mobile !== (account?.mobile || '') || designation !== (account?.designation || '') ||
    profilePicture !== (account?.profilePicture || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !account || !club) return;
    createApprovalRequest({
      id: `req-${Date.now()}`,
      clubId: user.clubId || '',
      clubName: club.name,
      type: 'Profile Update',
      status: 'Pending',
      requestDate: new Date().toISOString(),
      data: {
        userId: user.id,
        name,
        email,
        mobile,
        designation,
        profilePicture
      }
    });
    setSubmitted(true);
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
          <h2 className="text-2xl font-heading font-bold text-primary-950">My Profile</h2>
          <p className="text-sm text-gray-500 mt-1">
            Profile changes require approval from the Root Admin before they are applied.
          </p>
        </div>

        {/* Profile summary card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-primary-950 text-white flex items-center justify-center font-heading font-bold text-2xl shrink-0 relative overflow-hidden border-2 border-primary-100">
              {account?.profilePicture ? (
                <img src={account.profilePicture} alt={account.name} className="w-full h-full object-cover" />
              ) : (
                (account?.name || 'A').charAt(0)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-heading font-bold text-primary-950">{account?.name}</h3>
              <p className="text-sm text-gray-500 font-mono">{account?.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                {club?.name || 'No club assigned'} • {account?.designation || 'Club Admin'}
              </p>
            </div>
            <div className="shrink-0 hidden sm:flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full text-xs font-bold">
              <ShieldCheck size={14} /> Verified Admin
            </div>
          </div>
          {statusBadge(pendingRequest?.status)}
        </div>

        {/* Edit form */}
        {pendingRequest && pendingRequest.status === 'Pending' ? (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
              <Clock size={18} /> Profile update request pending
            </h4>
            <p className="text-sm text-orange-700">
              Your profile update is awaiting Root Admin approval. Once approved, the changes will be visible everywhere.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h3 className="font-heading font-bold text-primary-950 flex items-center gap-2">
              <UserCircle size={20} className="text-accent-500" /> Edit Profile Information
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email (Login ID) *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  placeholder="017XX-XXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  placeholder="e.g. Club Moderator"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Profile Picture URL</label>
                <input
                  type="text"
                  value={profilePicture}
                  onChange={e => setProfilePicture(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-100 pt-5">
              <Button type="submit" disabled={!dirty} className="bg-primary-900 text-white hover:bg-primary-800 gap-2">
                <Send size={16} /> Submit for Approval
              </Button>
            </div>

            {submitted && !pendingRequest && (
              <p className="text-xs text-green-600 font-medium">
                Request submitted — waiting for Root Admin review.
              </p>
            )}
          </form>
        )}
      </div>
    </ClubAdminLayout>
  );
}
