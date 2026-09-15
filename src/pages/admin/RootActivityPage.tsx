import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Activity } from 'lucide-react';
import { getActivities, type ActivityEntry } from '../../services/activity/activityService';
import { cn } from '../../lib/utils';

const roleBadge = (role: ActivityEntry['role']) => {
  if (role === 'root_admin')
    return <span className="px-2.5 py-1 rounded-full bg-primary-950 text-white text-[10px] font-bold uppercase tracking-wider shrink-0">Root Admin</span>;
  if (role === 'club_admin')
    return <span className="px-2.5 py-1 rounded-full bg-accent-100 text-accent-800 border border-accent-200 text-[10px] font-bold uppercase tracking-wider shrink-0">Club Admin</span>;
  return <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 border border-green-200 text-[10px] font-bold uppercase tracking-wider shrink-0">Student</span>;
};

export function RootActivityPage() {
  const [activities, setActivities] = useState<ActivityEntry[]>(getActivities());

  useEffect(() => {
    const handleUpdate = () => setActivities(getActivities());
    window.addEventListener('shksc_state_changed', handleUpdate);
    return () => window.removeEventListener('shksc_state_changed', handleUpdate);
  }, []);

  const rows = [...activities].reverse();

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-950 mb-1">Activity Log</h2>
          <p className="text-sm text-gray-500">
            Every admin action across the portal — approvals, edits, admissions, payments &amp; more.
          </p>
        </div>
        <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-xl flex items-center gap-2 border border-primary-100 font-medium">
          <Activity size={18} /> {rows.length} Events
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-heading font-bold text-primary-950">Recent Activity</h3>
        </div>

        {rows.length > 0 ? (
          <ul className="divide-y divide-gray-50">
            {rows.map(entry => (
              <li key={entry.id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors">
                <div
                  className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                    entry.role === 'root_admin'
                      ? 'bg-primary-950 text-accent-400'
                      : entry.role === 'club_admin'
                        ? 'bg-accent-50 text-accent-600 border border-accent-100'
                        : 'bg-green-50 text-green-600 border border-green-100'
                  )}
                >
                  <Activity size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-primary-950 text-sm">{entry.action}</p>
                    {entry.clubName && (
                      <span className="px-2 py-0.5 rounded bg-surface-sec border border-gray-200 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                        {entry.clubName}
                      </span>
                    )}
                    {roleBadge(entry.role)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {entry.actor}
                    {entry.detail ? ` — ${entry.detail}` : ''}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 font-semibold uppercase tracking-wider">
                    {new Date(entry.date).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 py-12 text-center">কোনো activity এখনো রেকর্ড হয়নি।</p>
        )}
      </div>
    </AdminLayout>
  );
}
