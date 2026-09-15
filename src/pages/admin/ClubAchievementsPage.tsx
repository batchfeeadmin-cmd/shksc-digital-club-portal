import React, { useEffect, useState } from 'react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { AchievementForm } from '../../components/admin/AchievementForm';
import { useAuth } from '../../context/AuthContext';
import { useClubsData, useUpdateRequests } from '../../hooks/useAdminData';
import { getApprovedAchievements, type ApprovedAchievement } from '../../services/approvals/approvalService';
import { Award, Clock, CheckCircle2, XCircle } from 'lucide-react';

export function ClubAchievementsPage() {
  const { user } = useAuth();
  const { clubs } = useClubsData();
  const { requests } = useUpdateRequests();
  const club = clubs.find(c => c.id === user?.clubId);
  const [approved, setApproved] = useState<ApprovedAchievement[]>(getApprovedAchievements());

  useEffect(() => {
    const handleUpdate = () => setApproved(getApprovedAchievements());
    window.addEventListener('shksc_state_changed', handleUpdate);
    return () => window.removeEventListener('shksc_state_changed', handleUpdate);
  }, []);

  const clubApproved = approved.filter(a => a.clubId === user?.clubId);
  const clubRequests = requests.filter(r => r.clubId === user?.clubId && r.type === 'Achievement Update');

  return (
    <ClubAdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-primary-950">Achievements</h2>
        <p className="text-sm text-gray-500">
          {club?.name || 'Your club'} — new achievements go live after Root Admin approval.
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Live achievements */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-heading font-bold text-lg text-primary-950 mb-4 flex items-center gap-2">
            <Award size={20} className="text-accent-500" /> Live Achievements ({clubApproved.length})
          </h3>
          {clubApproved.length > 0 ? (
            <ul className="space-y-3">
              {clubApproved.map(item => (
                <li key={item.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-sec border border-gray-100">
                  <span className="font-heading font-extrabold text-accent-600 w-12 shrink-0 text-right">{item.year}</span>
                  <div>
                    <p className="font-bold text-primary-950 text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      {[item.eventName, item.award].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-bangla text-sm text-gray-400 py-6 text-center">
              এখনো কোনো approved achievement নেই — নিচে থেকে নতুন achievement submit করো।
            </p>
          )}
        </div>

        {/* Pending requests */}
        {clubRequests.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-heading font-bold text-lg text-primary-950 mb-4">Submitted Requests</h3>
            <ul className="space-y-3">
              {clubRequests.map(req => (
                <li key={req.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-sec border border-gray-100">
                  <div>
                    <p className="font-bold text-primary-950 text-sm">{req.data.title}</p>
                    <p className="text-xs text-gray-500">{req.data.year} · {req.data.award}</p>
                  </div>
                  {req.status === 'Pending' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                      <Clock size={13} /> Pending
                    </span>
                  ) : req.status === 'Approved' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                      <CheckCircle2 size={13} /> Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                      <XCircle size={13} /> Rejected
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <AchievementForm clubId={user?.clubId || ''} clubName={club?.name || 'Your Club'} />
      </div>
    </ClubAdminLayout>
  );
}
