import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Calendar, Plus, Users, Trash2, MapPin, Clock, CalendarDays, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { getEventsByClub, createEvent, deleteEvent, ClubEvent } from '../../services/events/eventService';

export function ClubEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');

  const loadEvents = () => {
    if (user?.clubId) {
      setEvents(getEventsByClub(user.clubId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  };

  useEffect(() => {
    loadEvents();
    window.addEventListener('shksc_state_changed', loadEvents);
    return () => window.removeEventListener('shksc_state_changed', loadEvents);
  }, [user]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.clubId) return;

    createEvent({
      clubId: user.clubId,
      title,
      description,
      date,
      time,
      venue,
      maxCapacity: maxCapacity ? parseInt(maxCapacity) : undefined
    });

    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setVenue('');
    setMaxCapacity('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to cancel and delete this event?')) {
      deleteEvent(id);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-950 mb-1">Events & Workshops</h2>
          <p className="text-sm text-gray-500">Manage internal club events, bootcamps, and track RSVPs.</p>
        </div>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="bg-primary-950 hover:bg-primary-900 text-white">
            <Plus className="w-4 h-4 mr-2" /> Create Event
          </Button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Create New Event</h3>
          <form onSubmit={handleCreateEvent} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Robotics Workshop 2026" className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Venue</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" value={venue} onChange={e => setVenue(e.target.value)} placeholder="e.g. Physics Lab" className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Max Capacity (Optional)</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="number" value={maxCapacity} onChange={e => setMaxCapacity(e.target.value)} placeholder="Leave blank for unlimited" className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Event details and agenda..." className="w-full h-24 p-4 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none" required />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary-950 hover:bg-primary-900 text-white">Publish Event</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.length === 0 && !showAddForm ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No upcoming events. Create one to get started!</p>
          </div>
        ) : (
          events.map(event => {
            const eventDate = new Date(event.date);
            const isPast = eventDate < new Date(new Date().setHours(0,0,0,0));
            
            return (
              <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden group">
                {isPast && <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-md">Past Event</div>}
                
                <h3 className="font-bold text-gray-900 text-lg pr-20 leading-tight mb-2">{event.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{event.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarDays className="w-4 h-4 text-primary-500" />
                    <span className="font-medium">{eventDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="text-gray-300">•</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    <span>{event.venue}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-accent-50 text-accent-600 p-2 rounded-lg">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">RSVPs</p>
                      <p className="font-bold text-gray-900 leading-none">
                        {event.rsvps.length} <span className="text-gray-400 font-normal text-xs">{event.maxCapacity ? `/ ${event.maxCapacity}` : ''}</span>
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(event.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </AdminLayout>
  );
}
