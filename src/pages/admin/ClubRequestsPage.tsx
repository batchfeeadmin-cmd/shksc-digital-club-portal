import React from 'react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { FileEdit, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUpdateRequests } from '../../hooks/useAdminData';

export function ClubRequestsPage() {
  const { user } = useAuth();
  const { requests } = useUpdateRequests();

  const clubRequests = requests
    .filter(r => r.clubId === user?.clubId)
    .reverse();

  const statusBadge = (status: string) => {
    if (status === 'Pending')
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider shrink-0">
          <Clock size={13} /> Pending
        </span>
      );
    if (status === 'Approved')
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider shrink-0">
          <CheckCircle2 size={13} /> Approved
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider shrink-0">
        <XCircle size={13} /> Rejected
      </span>
    );
  };

  return (
    <ClubAdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-primary-950">Update Requests</h2>
        <p className="text-sm text-gray-500">
          Track the status of every change you submitted for Root Admin review.
        </p>
      </div>

      <div className="max-w-3xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-heading font-bold text-lg text-primary-950 mb-4 flex items-center gap-2">
            <FileEdit size={20} className="text-accent-500" /> Request History ({clubRequests.length})
          </h3>
          {clubRequests.length > 0 ? (
            <ul className="space-y-3">
              {clubRequests.map(req => (
                <li key={req.id} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-surface-sec border border-gray-100">
                  <div className="min-w-0">
                    <p className="font-bold text-primary-950 text-sm">{req.type}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {new Date(req.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                  {statusBadge(req.status)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-bangla text-sm text-gray-400 py-6 text-center">
              কোনো update request এখনো submit করা হয়নি।
            </p>
          )}
        </div>
      </div>
    </ClubAdminLayout>
  );
}
