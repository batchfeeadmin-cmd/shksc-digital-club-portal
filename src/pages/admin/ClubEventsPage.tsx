import React, { useEffect, useState } from 'react';
import { Calendar, CalendarDays, Clock, MapPin, Plus, RotateCcw, Search, Trash2, Users, X } from 'lucide-react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { getEventsByClub, createEvent, deleteEvent, type ClubEvent } from '../../services/events/eventService';

type EventFilter = 'All' | 'Upcoming' | 'Past';

const getLocalDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export function ClubEventsPage() {
  const { user } = useAuth();
  const today = getLocalDate();
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<EventFilter>('Upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [message, setMessage] = useState('');

  const loadEvents = () => {
    if (user?.clubId) {
      setEvents(getEventsByClub(user.clubId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    }
  };

  useEffect(() => {
    loadEvents();
    window.addEventListener('shksc_state_changed', loadEvents);
    return () => window.removeEventListener('shksc_state_changed', loadEvents);
  }, [user?.clubId]);

  const upcomingEvents = events.filter(event => event.date >= today);
  const pastEvents = events.filter(event => event.date < today);
  const totalRsvps = events.reduce((sum, event) => sum + event.rsvps.length, 0);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredEvents = events.filter(event => {
    const matchesTime = filter === 'All' || (filter === 'Upcoming' ? event.date >= today : event.date < today);
    const searchable = [event.title, event.description, event.venue, event.date].join(' ').toLowerCase();
    return matchesTime && (!normalizedSearch || searchable.includes(normalizedSearch));
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setVenue('');
    setMaxCapacity('');
  };

  const handleCreateEvent = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user?.clubId) return;
    createEvent({
      clubId: user.clubId,
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      venue: venue.trim(),
      maxCapacity: maxCapacity ? Number(maxCapacity) : undefined
    });
    resetForm();
    setShowAddForm(false);
    setFilter('Upcoming');
    setMessage('Event published successfully.');
    setTimeout(() => setMessage(''), 4000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) deleteEvent(id);
  };

  return (
    <ClubAdminLayout>
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><h2 className="text-2xl font-heading font-bold text-primary-950">Events & Workshops</h2><p className="mt-1 text-sm text-gray-500">Publish club events and monitor student RSVP interest.</p></div>
        <Button onClick={() => setShowAddForm(true)} className="gap-2"><Plus size={16} /> Create Event</Button>
      </div>

      {message && <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{message}</div>}

      <div className="mb-5 grid grid-cols-3 gap-3">
        <button type="button" onClick={() => setFilter('All')} className={`rounded-xl border p-4 text-left ${filter === 'All' ? 'border-primary-300 bg-primary-50 ring-2 ring-primary-100' : 'border-gray-100 bg-white'}`}><span className="text-2xl font-bold text-primary-950">{events.length}</span><span className="mt-1 block text-xs font-semibold text-gray-500">All Events</span></button>
        <button type="button" onClick={() => setFilter('Upcoming')} className={`rounded-xl border p-4 text-left ${filter === 'Upcoming' ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-100' : 'border-gray-100 bg-white'}`}><span className="text-2xl font-bold text-blue-700">{upcomingEvents.length}</span><span className="mt-1 block text-xs font-semibold text-gray-500">Upcoming</span></button>
        <button type="button" onClick={() => setFilter('Past')} className={`rounded-xl border p-4 text-left ${filter === 'Past' ? 'border-gray-300 bg-gray-50 ring-2 ring-gray-100' : 'border-gray-100 bg-white'}`}><span className="text-2xl font-bold text-gray-700">{pastEvents.length}</span><span className="mt-1 block text-xs font-semibold text-gray-500">Past</span></button>
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="search" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Search event or venue..." className="h-11 w-full rounded-lg border border-gray-200 pl-10 pr-3 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" /></div>
        <div className="rounded-lg bg-slate-50 px-4 py-2 text-sm font-semibold text-gray-600"><Users size={16} className="mr-2 inline text-accent-600" />{totalRsvps} total RSVPs</div>
        {(searchTerm || filter !== 'Upcoming') && <Button variant="ghost" onClick={() => { setSearchTerm(''); setFilter('Upcoming'); }} className="gap-2"><RotateCcw size={15} /> Reset</Button>}
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateEvent} className="mb-7 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between"><div><h3 className="font-bold text-gray-900">Create New Event</h3><p className="mt-1 text-xs text-gray-500">The event will be visible to students immediately.</p></div><button type="button" onClick={() => { setShowAddForm(false); resetForm(); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Close event form"><X size={19} /></button></div>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="text-sm font-semibold text-gray-700 md:col-span-2">Event title *<input type="text" value={title} onChange={event => setTitle(event.target.value)} placeholder="Robotics Workshop 2026" className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-4 outline-none focus:border-primary-500" required /></label>
            <label className="text-sm font-semibold text-gray-700">Date *<span className="relative mt-2 block"><CalendarDays className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input type="date" min={today} value={date} onChange={event => setDate(event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-4 outline-none focus:border-primary-500" required /></span></label>
            <label className="text-sm font-semibold text-gray-700">Time *<span className="relative mt-2 block"><Clock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input type="time" value={time} onChange={event => setTime(event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-4 outline-none focus:border-primary-500" required /></span></label>
            <label className="text-sm font-semibold text-gray-700">Venue *<span className="relative mt-2 block"><MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input type="text" value={venue} onChange={event => setVenue(event.target.value)} placeholder="Physics Lab" className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-4 outline-none focus:border-primary-500" required /></span></label>
            <label className="text-sm font-semibold text-gray-700">Maximum capacity<span className="relative mt-2 block"><Users className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" /><input type="number" min="1" value={maxCapacity} onChange={event => setMaxCapacity(event.target.value)} placeholder="Optional" className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-4 outline-none focus:border-primary-500" /></span></label>
            <label className="text-sm font-semibold text-gray-700 md:col-span-2">Description *<textarea value={description} onChange={event => setDescription(event.target.value)} placeholder="Event details and agenda..." className="mt-2 h-24 w-full resize-none rounded-xl border border-gray-200 p-4 outline-none focus:border-primary-500" required /></label>
          </div>
          <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5"><Button type="button" variant="outline" onClick={() => { setShowAddForm(false); resetForm(); }}>Cancel</Button><Button type="submit">Publish Event</Button></div>
        </form>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredEvents.map(event => {
          const isPast = event.date < today;
          return (
            <article key={event.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-3"><div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${isPast ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'}`}>{isPast ? 'Past' : 'Upcoming'}</span><h3 className="mt-3 text-lg font-bold leading-tight text-gray-900">{event.title}</h3></div><button type="button" onClick={() => handleDelete(event.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500" aria-label={`Delete ${event.title}`}><Trash2 size={17} /></button></div>
              <p className="mb-4 line-clamp-2 text-sm text-gray-500">{event.description}</p>
              <div className="mb-5 space-y-2 text-sm text-gray-600"><p className="flex items-center gap-2"><CalendarDays size={16} className="text-primary-500" />{new Date(`${event.date}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} at {event.time}</p><p className="flex items-center gap-2"><MapPin size={16} className="text-primary-500" />{event.venue}</p></div>
              <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4"><span className="text-xs font-bold uppercase tracking-wider text-gray-400">Student RSVPs</span><span className="font-bold text-primary-950">{event.rsvps.length}{event.maxCapacity ? ` / ${event.maxCapacity}` : ''}</span></div>
            </article>
          );
        })}
        {filteredEvents.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-white py-12 text-center text-gray-500"><Calendar className="mx-auto mb-3 h-10 w-10 text-gray-300" /><p>{events.length === 0 ? 'No events yet. Create one to get started.' : 'No events match the current view.'}</p></div>}
      </div>
    </ClubAdminLayout>
  );
}
