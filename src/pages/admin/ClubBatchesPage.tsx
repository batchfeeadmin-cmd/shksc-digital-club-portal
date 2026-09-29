import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, Plus, Save, Users } from 'lucide-react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { getClubs } from '../../services/clubs/clubService';
import { getStudents } from '../../services/students/studentService';
import { createBatchRequest, getAttendanceByBatch, getBatchesByClub, saveAttendance } from '../../services/batches/batchService';
import type { AttendanceStatus, ClubBatch, Student } from '../../types';

const weekdays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const statusClass: Record<string, string> = { Pending: 'bg-amber-100 text-amber-700', Approved: 'bg-green-100 text-green-700', Rejected: 'bg-red-100 text-red-700' };

export function ClubBatchesPage() {
  const { user } = useAuth();
  const club = getClubs().find(item => item.id === user?.clubId);
  const [students, setStudents] = useState<Student[]>(getStudents());
  const [batches, setBatches] = useState<ClubBatch[]>(club ? getBatchesByClub(club.id) : []);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<ClubBatch | null>(null);
  const [classFilter, setClassFilter] = useState('All');
  const [batchName, setBatchName] = useState('');
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [days, setDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('15:30');
  const [endTime, setEndTime] = useState('17:00');
  const [instructorName, setInstructorName] = useState('');
  const [instructorContact, setInstructorContact] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [message, setMessage] = useState('');

  const refresh = () => { setStudents(getStudents()); setBatches(club ? getBatchesByClub(club.id) : []); };
  useEffect(() => { window.addEventListener('shksc_state_changed', refresh); return () => window.removeEventListener('shksc_state_changed', refresh); }, [club?.id]);
  const clubStudents = students.filter(student => student.clubId === club?.id && student.registrationStatus === 'Confirmed');
  const classOptions = Array.from(new Set(clubStudents.map(student => student.class))).sort();
  const filteredStudents = useMemo(() => classFilter === 'All' ? clubStudents : clubStudents.filter(student => student.class === classFilter), [classFilter, clubStudents]);
  const approvedBatches = batches.filter(batch => batch.status === 'Approved');

  const toggleStudent = (id: string) => setSelectedStudentIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const toggleDay = (day: string) => setDays(current => current.includes(day) ? current.filter(item => item !== day) : [...current, day]);
  const submitBatch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!club || !batchName.trim() || !className || !days.length || !instructorName.trim() || !selectedStudentIds.length) { setMessage('Complete batch name, class, schedule, instructor, and at least one student.'); return; }
    createBatchRequest({ clubId: club.id, clubName: club.name, name: batchName.trim(), className, section: section.trim(), days, startTime, endTime, instructorName: instructorName.trim(), instructorContact: instructorContact.trim(), studentIds: selectedStudentIds, requestedBy: user?.name || 'Club Admin' });
    setShowCreate(false); setBatchName(''); setClassName(''); setSection(''); setDays([]); setInstructorName(''); setInstructorContact(''); setSelectedStudentIds([]); setMessage('Batch request sent to Root Admin for approval.'); refresh();
  };

  const openAttendance = (batch: ClubBatch) => {
    setSelectedBatch(batch);
    const existing = getAttendanceByBatch(batch.id).find(record => record.date === attendanceDate);
    const initial: Record<string, AttendanceStatus> = {};
    batch.studentIds.forEach(id => { initial[id] = existing?.entries[id] || 'Present'; });
    setAttendance(initial);
  };
  const saveBatchAttendance = () => { if (!selectedBatch) return; saveAttendance(selectedBatch, attendanceDate, attendance, user?.name || 'Club Admin'); setMessage('Attendance saved successfully.'); };

  return <ClubAdminLayout>
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="text-2xl font-heading font-bold text-primary-950">Batches &amp; Attendance</h1><p className="mt-1 text-sm text-gray-500">Group your club students by class, schedule, and instructor. Root approval is required before a batch becomes live.</p></div><Button onClick={() => setShowCreate(true)} className="gap-2"><Plus size={16} /> Create batch request</Button></div>
    {message && <p className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700" role="status">{message}</p>}
    {showCreate && <form onSubmit={submitBatch} className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"><h2 className="mb-5 text-lg font-bold text-primary-950">New batch / class request</h2><div className="grid gap-4 md:grid-cols-3"><label className="text-sm font-semibold text-gray-700 md:col-span-2">Batch name<input required value={batchName} onChange={event => setBatchName(event.target.value)} placeholder="Science Explorers · Class 9" className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3" /></label><label className="text-sm font-semibold text-gray-700">Class<select required value={className} onChange={event => { setClassName(event.target.value); setClassFilter(event.target.value); }} className="mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-3"><option value="">Select class</option>{classOptions.map(value => <option key={value} value={value}>Class {value}</option>)}</select></label><label className="text-sm font-semibold text-gray-700">Section<input value={section} onChange={event => setSection(event.target.value)} placeholder="A / B" className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3" /></label><label className="text-sm font-semibold text-gray-700">Start time<input required type="time" value={startTime} onChange={event => setStartTime(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3" /></label><label className="text-sm font-semibold text-gray-700">End time<input required type="time" value={endTime} onChange={event => setEndTime(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3" /></label></div><div className="mt-5"><p className="mb-2 text-sm font-semibold text-gray-700">Class days</p><div className="flex flex-wrap gap-2">{weekdays.map(day => <button type="button" key={day} onClick={() => toggleDay(day)} className={`rounded-lg border px-3 py-2 text-sm font-bold ${days.includes(day) ? 'border-primary-950 bg-primary-950 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>{day}</button>)}</div></div><div className="mt-5 grid gap-4 md:grid-cols-2"><label className="text-sm font-semibold text-gray-700">Instructor name<input required value={instructorName} onChange={event => setInstructorName(event.target.value)} placeholder="Instructor / trainer" className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3" /></label><label className="text-sm font-semibold text-gray-700">Instructor contact<input value={instructorContact} onChange={event => setInstructorContact(event.target.value)} placeholder="Mobile / email" className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3" /></label></div><div className="mt-6 rounded-xl border border-gray-200 bg-slate-50 p-4"><div className="mb-3 flex items-center justify-between"><p className="font-bold text-primary-950">Select students ({selectedStudentIds.length})</p><select value={classFilter} onChange={event => setClassFilter(event.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"><option value="All">All classes</option>{classOptions.map(value => <option key={value} value={value}>Class {value}</option>)}</select></div><div className="grid max-h-52 gap-2 overflow-y-auto sm:grid-cols-2">{filteredStudents.map(student => <label key={student.id} className="flex items-center gap-2 rounded-lg bg-white p-2 text-sm"><input type="checkbox" checked={selectedStudentIds.includes(student.id)} onChange={() => toggleStudent(student.id)} />{student.name} <span className="text-gray-400">· Class {student.class}</span></label>)}</div></div><div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5"><Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button><Button type="submit">Send for Root approval</Button></div></form>}
    <div className="grid gap-6 lg:grid-cols-2">{batches.map(batch => { const todayRecord = getAttendanceByBatch(batch.id).find(record => record.date === new Date().toISOString().slice(0, 10)); const todayMarked = todayRecord ? Object.keys(todayRecord.entries).length : 0; return <div key={batch.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-accent-600">Class {batch.className}{batch.section ? ` · Section ${batch.section}` : ''}</p><h2 className="mt-1 font-bold text-primary-950">{batch.name}</h2></div><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass[batch.status]}`}>{batch.status}</span></div><div className="mt-4 grid gap-2 text-sm text-gray-600 sm:grid-cols-2"><p className="flex items-center gap-2"><CalendarDays size={15} className="text-primary-600" />{batch.days.join(', ')}</p><p className="flex items-center gap-2"><Clock3 size={15} className="text-primary-600" />{batch.startTime} – {batch.endTime}</p><p className="flex items-center gap-2"><Users size={15} className="text-primary-600" />{batch.studentIds.length} students</p><p>Instructor: <strong className="text-gray-800">{batch.instructorName}</strong></p></div>{batch.status === 'Approved' && <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4"><div><p className="text-xs font-bold text-green-700">Live and trackable</p><p className="mt-1 text-xs text-gray-500">Today: {todayMarked}/{batch.studentIds.length} marked</p></div><Button variant="outline" onClick={() => openAttendance(batch)} className="gap-2"><CheckCircle2 size={15} /> Take attendance</Button></div>}</div>; })}{batches.length === 0 && <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500 lg:col-span-2">No batch requests yet.</div>}</div>
    {selectedBatch && <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/50 p-4 backdrop-blur-sm"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-primary-950">Attendance · {selectedBatch.name}</h2><p className="text-sm text-gray-500">{selectedBatch.instructorName} · {selectedBatch.days.join(', ')}</p></div><label className="text-sm font-semibold text-gray-700">Date<input type="date" value={attendanceDate} onChange={event => setAttendanceDate(event.target.value)} className="ml-2 rounded-lg border border-gray-200 px-2 py-2" /></label></div><div className="mt-6 space-y-2">{selectedBatch.studentIds.map(studentId => { const student = students.find(item => item.id === studentId); return <div key={studentId} className="flex items-center justify-between rounded-xl border border-gray-100 p-3"><span className="font-medium text-gray-900">{student?.name || studentId}</span><select value={attendance[studentId] || 'Present'} onChange={event => setAttendance(current => ({ ...current, [studentId]: event.target.value as AttendanceStatus }))} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"><option>Present</option><option>Absent</option><option>Late</option></select></div>; })}</div><div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5"><p className="text-sm text-gray-500">Summary: {Object.values(attendance).filter(value => value === 'Present').length} present · {Object.values(attendance).filter(value => value === 'Absent').length} absent · {Object.values(attendance).filter(value => value === 'Late').length} late</p><div className="flex gap-2"><Button variant="outline" onClick={() => setSelectedBatch(null)}>Close</Button><Button onClick={saveBatchAttendance} className="gap-2"><Save size={15} /> Save attendance</Button></div></div></div></div>}
  </ClubAdminLayout>;
}
