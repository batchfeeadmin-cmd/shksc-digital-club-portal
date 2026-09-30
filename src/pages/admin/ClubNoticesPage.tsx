import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bell, CheckCircle2, Plus, Search, Send, Trash2, X } from 'lucide-react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { useClubsData } from '../../hooks/useAdminData';
import { addNotice, deleteNotice, getNoticesByClub, type Notice } from '../../services/notices/noticeService';
import { logActivity } from '../../services/activity/activityService';

export function ClubNoticesPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { clubs } = useClubsData();
  const club = clubs.find(item => item.id === user?.clubId);
  const [notices, setNotices] = useState<Notice[]>(user ? getNoticesByClub(user.clubId || '') : []);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setShowForm(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredNotices = notices.filter(notice => !normalizedSearch || `${notice.title} ${notice.message}`.toLowerCase().includes(normalizedSearch));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user?.clubId || !title.trim() || !message.trim()) return;
    addNotice({ id: `nt-${Date.now()}`, clubId: user.clubId, title: title.trim(), message: message.trim(), date: new Date().toISOString() });
    logActivity({ actor: user?.name || 'Club Admin', role: 'club_admin', clubName: club?.name, action: 'Posted Notice', detail: `"${title.trim()}" published to members` });
    setTitle('');
    setMessage('');
    setShowForm(false);
    setPosted(true);
    setTimeout(() => setPosted(false), 4000);
  };

  const handleDelete = (id: string) => {
    const notice = notices.find(item => item.id === id);
    if (!window.confirm(`Delete "${notice?.title || 'this notice'}"?`)) return;
    deleteNotice(id);
    logActivity({ actor: user?.name || 'Club Admin', role: 'club_admin', clubName: club?.name, action: 'Deleted Notice', detail: notice ? `"${notice.title}" removed` : 'Notice removed' });
  };

  return (
    <ClubAdminLayout>
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><h2 className="text-2xl font-heading font-bold text-primary-950">Notices</h2><p className="mt-1 text-sm text-gray-500">Publish instant updates to your club members' dashboards.</p></div>
        <Button onClick={() => setShowForm(true)} className="gap-2"><Plus size={16} /> Create Notice</Button>
      </div>

      {posted && <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700"><CheckCircle2 size={17} /> Notice published successfully.</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 max-w-4xl space-y-4 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between"><div><h3 className="text-lg font-bold text-primary-950">New Notice</h3><p className="mt-1 text-xs text-gray-500">Members will see it immediately after publishing.</p></div><button type="button" onClick={() => setShowForm(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Close notice form"><X size={19} /></button></div>
          <label className="block text-sm font-semibold text-gray-700">Title *<input type="text" value={title} onChange={event => setTitle(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-4 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" placeholder="Annual group camp" required /></label>
          <label className="block text-sm font-semibold text-gray-700">Message *<textarea value={message} onChange={event => setMessage(event.target.value)} rows={4} maxLength={1000} className="mt-2 w-full rounded-lg border border-gray-200 p-4 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" placeholder="Write the notice details..." required /><span className="mt-1 block text-right text-xs text-gray-400">{message.length}/1000</span></label>
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4"><Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button type="submit" className="gap-2"><Send size={16} /> Publish Notice</Button></div>
        </form>
      )}

      <div className="max-w-4xl">
        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-2xl font-bold text-primary-950">{notices.length}</p><p className="text-xs font-semibold text-gray-500">Published Notices</p></div>
          <div className="relative w-full sm:max-w-md"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="search" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Search notices..." className="h-11 w-full rounded-lg border border-gray-200 pl-10 pr-3 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" /></div>
        </div>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-primary-950"><Bell size={20} className="text-accent-500" /> Notice History</h3>
          {filteredNotices.length > 0 ? (
            <div className="space-y-3">
              {filteredNotices.map(notice => (
                <article key={notice.id} className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-slate-50 p-4">
                  <div className="min-w-0"><h4 className="font-bold text-primary-950">{notice.title}</h4><p className="mt-1 whitespace-pre-line text-sm text-gray-600">{notice.message}</p><p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">{new Date(notice.date).toLocaleString()}</p></div>
                  <button type="button" onClick={() => handleDelete(notice.id)} className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${notice.title}`}><Trash2 size={16} /></button>
                </article>
              ))}
            </div>
          ) : <div className="py-10 text-center text-sm text-gray-400">{notices.length === 0 ? 'No notice has been published yet.' : 'No notices match your search.'}</div>}
        </section>
      </div>
    </ClubAdminLayout>
  );
}
