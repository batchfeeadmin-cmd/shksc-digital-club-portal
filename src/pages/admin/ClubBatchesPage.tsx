import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  RotateCcw,
  Save,
  Search,
  Users,
  X
} from 'lucide-react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { getClubs } from '../../services/clubs/clubService';
import { getStudents } from '../../services/students/studentService';
import { createBatchRequest, getAttendanceByBatch, getBatchesByClub, saveAttendance } from '../../services/batches/batchService';
import type { AttendanceStatus, BatchStatus, ClubBatch, Student } from '../../types';

const weekdays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const statusClass: Record<BatchStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700'
};

type BatchStatusFilter = 'All' | BatchStatus;

const getLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function ClubBatchesPage() {
  const { user } = useAuth();
  const club = getClubs().find(item => item.id === user?.clubId);
  const todayDate = getLocalDate();
  const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [students, setStudents] = useState<Student[]>(getStudents());
  const [batches, setBatches] = useState<ClubBatch[]>(club ? getBatchesByClub(club.id) : []);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<ClubBatch | null>(null);
  const [statusFilter, setStatusFilter] = useState<BatchStatusFilter>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [batchName, setBatchName] = useState('');
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [days, setDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('15:30');
  const [endTime, setEndTime] = useState('17:00');
  const [instructorName, setInstructorName] = useState('');
  const [instructorContact, setInstructorContact] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [attendanceDate, setAttendanceDate] = useState(todayDate);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const refresh = () => {
    setStudents(getStudents());
    setBatches(club ? getBatchesByClub(club.id) : []);
  };

  useEffect(() => {
    window.addEventListener('shksc_state_changed', refresh);
    return () => window.removeEventListener('shksc_state_changed', refresh);
  }, [club?.id]);

  const clubStudents = students.filter(student => student.clubId === club?.id && student.registrationStatus === 'Confirmed');
  const classOptions = Array.from(new Set(clubStudents.map(student => student.class))).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const eligibleStudents = useMemo(
    () => className ? clubStudents.filter(student => student.class === className) : [],
    [className, clubStudents]
  );
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredBatches = batches.filter(batch => {
    const matchesStatus = statusFilter === 'All' || batch.status === statusFilter;
    const searchable = [batch.name, batch.className, batch.section, batch.instructorName, batch.days.join(' ')].filter(Boolean).join(' ').toLowerCase();
    return matchesStatus && (!normalizedSearch || searchable.includes(normalizedSearch));
  });

  const pendingCount = batches.filter(batch => batch.status === 'Pending').length;
  const approvedCount = batches.filter(batch => batch.status === 'Approved').length;
  const rejectedCount = batches.filter(batch => batch.status === 'Rejected').length;
  const todayDueCount = batches.filter(batch =>
    batch.status === 'Approved' &&
    batch.days.includes(todayDay) &&
    !getAttendanceByBatch(batch.id).some(record => record.date === todayDate)
  ).length;

  const toggleStudent = (id: string) => {
    setSelectedStudentIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  };

  const toggleAllEligible = () => {
    const eligibleIds = eligibleStudents.map(student => student.id);
    const allSelected = eligibleIds.length > 0 && eligibleIds.every(id => selectedStudentIds.includes(id));
    setSelectedStudentIds(allSelected ? [] : eligibleIds);
  };

  const toggleDay = (day: string) => {
    setDays(current => current.includes(day) ? current.filter(item => item !== day) : [...current, day]);
  };

  const resetBatchForm = () => {
    setBatchName('');
    setClassName('');
    setSection('');
    setDays([]);
    setStartTime('15:30');
    setEndTime('17:00');
    setInstructorName('');
    setInstructorContact('');
    setSelectedStudentIds([]);
  };

  const submitBatch = (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback(null);
    if (!club || !batchName.trim() || !className || !days.length || !instructorName.trim() || !selectedStudentIds.length) {
      setFeedback({ type: 'error', text: 'Complete the batch details, schedule, instructor, and select at least one student.' });
      return;
    }
    if (endTime <= startTime) {
      setFeedback({ type: 'error', text: 'End time must be later than the start time.' });
      return;
    }

    createBatchRequest({
      clubId: club.id,
      clubName: club.name,
      name: batchName.trim(),
      className,
      section: section.trim(),
      days,
      startTime,
      endTime,
      instructorName: instructorName.trim(),
      instructorContact: instructorContact.trim(),
      studentIds: selectedStudentIds,
      requestedBy: user?.name || 'Club Admin'
    });
    resetBatchForm();
    setShowCreate(false);
    setFeedback({ type: 'success', text: 'Batch request sent to Root Admin for approval.' });
    refresh();
  };

  const loadAttendance = (batch: ClubBatch, date: string) => {
    const existing = getAttendanceByBatch(batch.id).find(record => record.date === date);
    const initial: Record<string, AttendanceStatus> = {};
    batch.studentIds.forEach(id => { initial[id] = existing?.entries[id] || 'Present'; });
    setAttendance(initial);
  };

  const openAttendance = (batch: ClubBatch) => {
    setSelectedBatch(batch);
    setAttendanceDate(todayDate);
    loadAttendance(batch, todayDate);
  };

  const changeAttendanceDate = (date: string) => {
    setAttendanceDate(date);
    if (selectedBatch) loadAttendance(selectedBatch, date);
  };

  const markEveryone = (status: AttendanceStatus) => {
    if (!selectedBatch) return;
    setAttendance(Object.fromEntries(selectedBatch.studentIds.map(id => [id, status])));
  };

  const saveBatchAttendance = () => {
    if (!selectedBatch) return;
    saveAttendance(selectedBatch, attendanceDate, attendance, user?.name || 'Club Admin');
    setFeedback({ type: 'success', text: `Attendance saved for ${selectedBatch.name} on ${attendanceDate}.` });
    setSelectedBatch(null);
    refresh();
  };

  const attendanceSummary = {
    present: Object.values(attendance).filter(value => value === 'Present').length,
    absent: Object.values(attendance).filter(value => value === 'Absent').length,
    late: Object.values(attendance).filter(value => value === 'Late').length
  };

  return (
    <ClubAdminLayout>
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-950">Batches &amp; Attendance</h1>
          <p className="mt-1 text-sm text-gray-500">Create class-based batches, follow approvals, and record attendance quickly.</p>
        </div>
        <Button onClick={() => { setShowCreate(true); setFeedback(null); }} className="gap-2">
          <Plus size={16} /> Create Batch
        </Button>
      </div>

      {feedback && (
        <div className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
          feedback.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'
        }`} role="status">
          {feedback.type === 'success' ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
          {feedback.text}
        </div>
      )}

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <button type="button" onClick={() => setStatusFilter('All')} className={`rounded-xl border p-4 text-left ${statusFilter === 'All' ? 'border-primary-300 bg-primary-50 ring-2 ring-primary-100' : 'border-gray-100 bg-white'}`}>
          <span className="text-2xl font-bold text-primary-950">{batches.length}</span>
          <span className="mt-1 block text-xs font-semibold text-gray-500">All Batches</span>
        </button>
        <button type="button" onClick={() => setStatusFilter('Approved')} className={`rounded-xl border p-4 text-left ${statusFilter === 'Approved' ? 'border-green-300 bg-green-50 ring-2 ring-green-100' : 'border-gray-100 bg-white'}`}>
          <span className="text-2xl font-bold text-green-700">{approvedCount}</span>
          <span className="mt-1 block text-xs font-semibold text-gray-500">Approved</span>
        </button>
        <button type="button" onClick={() => setStatusFilter('Pending')} className={`rounded-xl border p-4 text-left ${statusFilter === 'Pending' ? 'border-amber-300 bg-amber-50 ring-2 ring-amber-100' : 'border-gray-100 bg-white'}`}>
          <span className="text-2xl font-bold text-amber-700">{pendingCount}</span>
          <span className="mt-1 block text-xs font-semibold text-gray-500">Awaiting Root</span>
        </button>
        <button type="button" onClick={() => setStatusFilter('Rejected')} className={`rounded-xl border p-4 text-left ${statusFilter === 'Rejected' ? 'border-red-300 bg-red-50 ring-2 ring-red-100' : 'border-gray-100 bg-white'}`}>
          <span className="text-2xl font-bold text-red-700">{rejectedCount}</span>
          <span className="mt-1 block text-xs font-semibold text-gray-500">Needs Correction</span>
        </button>
      </div>

      {todayDueCount > 0 && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
          <p className="text-sm font-semibold text-blue-800"><CalendarDays size={17} className="mr-2 inline" />{todayDueCount} batch{todayDueCount > 1 ? 'es' : ''} still need attendance today.</p>
          <button type="button" onClick={() => { setStatusFilter('Approved'); setSearchTerm(''); }} className="shrink-0 text-xs font-bold text-blue-700">View approved</button>
        </div>
      )}

      {showCreate && (
        <form onSubmit={submitBatch} className="mb-7 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div><h2 className="text-lg font-bold text-primary-950">New Batch Request</h2><p className="mt-1 text-xs text-gray-500">It will become active after Root Admin approval.</p></div>
            <button type="button" onClick={() => { setShowCreate(false); resetBatchForm(); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="Close batch form"><X size={19} /></button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm font-semibold text-gray-700 md:col-span-2">Batch name *
              <input required value={batchName} onChange={event => setBatchName(event.target.value)} placeholder="Science Explorers - Class 9" className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
            </label>
            <label className="text-sm font-semibold text-gray-700">Class *
              <select required value={className} onChange={event => { setClassName(event.target.value); setSelectedStudentIds([]); }} className="mt-2 h-11 w-full rounded-lg border border-gray-200 bg-white px-3 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100">
                <option value="">Select class</option>
                {classOptions.map(value => <option key={value} value={value}>Class {value}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold text-gray-700">Section
              <input value={section} onChange={event => setSection(event.target.value)} placeholder="A / B" className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
            </label>
            <label className="text-sm font-semibold text-gray-700">Start time *
              <input required type="time" value={startTime} onChange={event => setStartTime(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3" />
            </label>
            <label className="text-sm font-semibold text-gray-700">End time *
              <input required type="time" value={endTime} onChange={event => setEndTime(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3" />
            </label>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-gray-700">Class days *</p>
            <div className="flex flex-wrap gap-2">
              {weekdays.map(day => (
                <button type="button" key={day} onClick={() => toggleDay(day)} className={`rounded-lg border px-3 py-2 text-sm font-bold ${days.includes(day) ? 'border-primary-950 bg-primary-950 text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-primary-300'}`}>{day}</button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold text-gray-700">Instructor name *
              <input required value={instructorName} onChange={event => setInstructorName(event.target.value)} placeholder="Instructor / trainer" className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
            </label>
            <label className="text-sm font-semibold text-gray-700">Instructor contact
              <input value={instructorContact} onChange={event => setInstructorContact(event.target.value)} placeholder="Mobile / email" className="mt-2 h-11 w-full rounded-lg border border-gray-200 px-3 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
            </label>
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-slate-50 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div><p className="font-bold text-primary-950">Select Students ({selectedStudentIds.length})</p><p className="text-xs text-gray-500">Only confirmed students from the selected class are shown.</p></div>
              {eligibleStudents.length > 0 && <button type="button" onClick={toggleAllEligible} className="text-sm font-bold text-primary-700">{eligibleStudents.every(student => selectedStudentIds.includes(student.id)) ? 'Clear all' : 'Select all'}</button>}
            </div>
            {!className ? (
              <div className="rounded-lg bg-white p-5 text-center text-sm text-gray-500">Select a class to see eligible students.</div>
            ) : eligibleStudents.length === 0 ? (
              <div className="rounded-lg bg-white p-5 text-center text-sm text-gray-500">No confirmed students found in Class {className}.</div>
            ) : (
              <div className="grid max-h-56 gap-2 overflow-y-auto sm:grid-cols-2">
                {eligibleStudents.map(student => (
                  <label key={student.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm ${selectedStudentIds.includes(student.id) ? 'border-primary-200 bg-primary-50' : 'border-gray-100 bg-white'}`}>
                    <input type="checkbox" checked={selectedStudentIds.includes(student.id)} onChange={() => toggleStudent(student.id)} />
                    <span className="min-w-0"><span className="block truncate font-semibold text-gray-900">{student.name}</span><span className="text-xs text-gray-500">Roll {student.roll}{student.section ? ` - Section ${student.section}` : ''}</span></span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col-reverse justify-end gap-3 border-t border-gray-100 pt-5 sm:flex-row">
            <Button type="button" variant="outline" onClick={() => { setShowCreate(false); resetBatchForm(); }}>Cancel</Button>
            <Button type="submit">Send for Root Approval</Button>
          </div>
        </form>
      )}

      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="search" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Search batch, instructor, class or day..." className="h-11 w-full rounded-lg border border-gray-200 pl-10 pr-3 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
        </div>
        {(searchTerm || statusFilter !== 'All') && <Button variant="ghost" onClick={() => { setSearchTerm(''); setStatusFilter('All'); }} className="gap-2"><RotateCcw size={15} /> Reset</Button>}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {filteredBatches.map(batch => {
          const todayRecord = getAttendanceByBatch(batch.id).find(record => record.date === todayDate);
          const todayMarked = todayRecord ? Object.keys(todayRecord.entries).length : 0;
          const scheduledToday = batch.status === 'Approved' && batch.days.includes(todayDay);
          return (
            <article key={batch.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${scheduledToday && !todayRecord ? 'border-blue-200 ring-2 ring-blue-50' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-accent-600">Class {batch.className}{batch.section ? ` - Section ${batch.section}` : ''}</p>
                    {scheduledToday && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">Today</span>}
                  </div>
                  <h2 className="mt-1 font-bold text-primary-950">{batch.name}</h2>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass[batch.status]}`}>{batch.status}</span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                <p className="flex items-center gap-2"><CalendarDays size={15} className="text-primary-600" />{batch.days.join(', ')}</p>
                <p className="flex items-center gap-2"><Clock3 size={15} className="text-primary-600" />{batch.startTime} - {batch.endTime}</p>
                <p className="flex items-center gap-2"><Users size={15} className="text-primary-600" />{batch.studentIds.length} students</p>
                <p>Instructor: <strong className="text-gray-800">{batch.instructorName}</strong></p>
              </div>
              {batch.status === 'Rejected' && batch.rejectionReason && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"><strong>Root feedback:</strong> {batch.rejectionReason}</p>}
              {batch.status === 'Pending' && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs font-semibold text-amber-700">Waiting for Root Admin approval. Attendance will unlock after approval.</p>}
              {batch.status === 'Approved' && (
                <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="text-xs font-bold text-green-700">Live and trackable</p><p className="mt-1 text-xs text-gray-500">Today: {todayMarked}/{batch.studentIds.length} marked</p></div>
                  <Button variant="outline" onClick={() => openAttendance(batch)} className="gap-2"><CheckCircle2 size={15} /> {todayRecord ? 'Update Attendance' : 'Take Attendance'}</Button>
                </div>
              )}
            </article>
          );
        })}
        {filteredBatches.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500 lg:col-span-2">
            {batches.length === 0 ? 'No batch requests yet. Create the first batch to get started.' : 'No batches match the current search or status filter.'}
          </div>
        )}
      </div>

      {selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/50 p-3 sm:p-4 backdrop-blur-sm">
          <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0"><h2 className="truncate text-xl font-bold text-primary-950">Attendance - {selectedBatch.name}</h2><p className="mt-1 text-sm text-gray-500">{selectedBatch.instructorName} - {selectedBatch.days.join(', ')}</p></div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700">Date <input type="date" max={todayDate} value={attendanceDate} onChange={event => changeAttendanceDate(event.target.value)} className="ml-1 rounded-lg border border-gray-200 px-2 py-2" /></label>
                <button type="button" onClick={() => setSelectedBatch(null)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="Close attendance"><X size={20} /></button>
              </div>
            </div>

            <div className="border-b border-gray-100 bg-slate-50 px-5 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-700">{selectedBatch.studentIds.length} students</p>
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <button type="button" onClick={() => markEveryone('Present')} className="rounded-lg border border-green-200 bg-white px-3 py-1.5 text-green-700">All Present</button>
                  <button type="button" onClick={() => markEveryone('Absent')} className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-red-700">All Absent</button>
                  <button type="button" onClick={() => markEveryone('Late')} className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-amber-700">All Late</button>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-4 sm:p-5">
              {selectedBatch.studentIds.map(studentId => {
                const student = students.find(item => item.id === studentId);
                return (
                  <div key={studentId} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3">
                    <span className="min-w-0"><span className="block truncate font-medium text-gray-900">{student?.name || studentId}</span><span className="text-xs text-gray-500">Roll {student?.roll || '-'}</span></span>
                    <select value={attendance[studentId] || 'Present'} onChange={event => setAttendance(current => ({ ...current, [studentId]: event.target.value as AttendanceStatus }))} className={`rounded-lg border px-3 py-2 text-sm font-semibold ${attendance[studentId] === 'Absent' ? 'border-red-200 bg-red-50 text-red-700' : attendance[studentId] === 'Late' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-green-200 bg-green-50 text-green-700'}`}>
                      <option>Present</option><option>Absent</option><option>Late</option>
                    </select>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <p className="text-sm text-gray-600"><strong className="text-green-700">{attendanceSummary.present} present</strong> - <strong className="text-red-700">{attendanceSummary.absent} absent</strong> - <strong className="text-amber-700">{attendanceSummary.late} late</strong></p>
              <div className="flex gap-2"><Button variant="outline" onClick={() => setSelectedBatch(null)}>Cancel</Button><Button onClick={saveBatchAttendance} className="gap-2"><Save size={15} /> Save Attendance</Button></div>
            </div>
          </div>
        </div>
      )}
    </ClubAdminLayout>
  );
}
