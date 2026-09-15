import React, { useEffect, useState } from 'react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { Button } from '../../components/ui/button';
import { Bell, Plus, Trash2, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClubsData } from '../../hooks/useAdminData';
import { getNoticesByClub, addNotice, deleteNotice, type Notice } from '../../services/notices/noticeService';
import { logActivity } from '../../services/activity/activityService';

export function ClubNoticesPage() {
  const { user } = useAuth();
  const { clubs } = useClubsData();
  const club = clubs.find(c => c.id === user?.clubId);
  const [notices, setNotices] = useState<Notice[]>(user ? getNoticesByClub(user.clubId || '') : []);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [posted, setPosted] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      if (user) setNotices(getNoticesByClub(user.clubId || ''));
    };
    window.addEventListener('shksc_state_changed', handleUpdate);
    return () => window.removeEventListener('shksc_state_changed', handleUpdate);
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.clubId || !title.trim() || !message.trim()) return;
    addNotice({
      id: `nt-${Date.now()}`,
      clubId: user.clubId,
      title: title.trim(),
      message: message.trim(),
      date: new Date().toISOString()
    });
    logActivity({
      actor: user?.name || 'Club Admin',
      role: 'club_admin',
      clubName: club?.name,
      action: 'Posted Notice',
      detail: `"${title.trim()}" published to members`
    });
    setTitle('');
    setMessage('');
    setPosted(true);
    setTimeout(() => setPosted(false), 4000);
  };

  const handleDelete = (id: string) => {
    const notice = notices.find(n => n.id === id);
    if (window.confirm('Delete this notice?')) {
      deleteNotice(id);
      logActivity({
        actor: user?.name || 'Club Admin',
        role: 'club_admin',
        clubName: club?.name,
        action: 'Deleted Notice',
        detail: notice ? `"${notice.title}" removed` : 'Notice removed'
      });
    }
  };

  return (
    <ClubAdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-primary-950">Notices</h2>
        <p className="text-sm text-gray-500">Post notices — members see them instantly on the student dashboard.</p>
      </div>

      <div className="max-w-3xl space-y-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-heading font-bold text-lg text-primary-950 flex items-center gap-2">
            <Plus size={20} className="text-accent-500" /> Post New Notice
          </h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
              placeholder="e.g. Annual Group Camp"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              className="w-full p-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
              placeholder="বিস্তারিত লিখো..."
              required
            />
          </div>
          <div className="flex items-center justify-end gap-4">
            {posted && <span className="text-green-600 text-sm font-medium">Notice posted ✓</span>}
            <Button type="submit" className="bg-primary-900 text-white hover:bg-primary-800 gap-2">
              <Send size={16} /> Post Notice
            </Button>
          </div>
        </form>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-heading font-bold text-lg text-primary-950 mb-4 flex items-center gap-2">
            <Bell size={20} className="text-accent-500" /> Posted Notices ({notices.length})
          </h3>
          {notices.length > 0 ? (
            <ul className="space-y-3">
              {notices.map(notice => (
                <li key={notice.id} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-surface-sec border border-gray-100">
                  <div>
                    <p className="font-bold text-primary-950 text-sm">{notice.title}</p>
                    <p className="font-bangla text-xs text-gray-500 mt-1">{notice.message}</p>
                    <p className="text-[10px] text-gray-400 mt-2 font-semibold uppercase tracking-wider">
                      {new Date(notice.date).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(notice.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-bangla text-sm text-gray-400 py-6 text-center">কোনো notice এখনো পোস্ট করা হয়নি।</p>
          )}
        </div>
      </div>
    </ClubAdminLayout>
  );
}
