import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, Check, Clock3, Users, X } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { getClubs } from '../../services/clubs/clubService';
import { getStudents } from '../../services/students/studentService';
import { getAttendanceRecords, getAttendanceSummary, getBatches, reviewBatchRequest } from '../../services/batches/batchService';
import type { ClubBatch } from '../../types';

export function RootBatchesPage() {
  const [batches, setBatches] = useState<ClubBatch[]>(getBatches());
  const [message, setMessage] = useState('');
  const refresh = () => setBatches(getBatches());
  useEffect(() => { window.addEventListener('shksc_state_changed', refresh); return () => window.removeEventListener('shksc_state_changed', refresh); }, []);
  const pending = batches.filter(batch => batch.status === 'Pending');
  const approved = batches.filter(batch => batch.status === 'Approved');
  const students = getStudents();
  const clubs = getClubs();
  const attendanceRecords = getAttendanceRecords();
  const totalAssigned = approved.reduce((sum, batch) => sum + batch.studentIds.length, 0);
  const summary = getAttendanceSummary();
  const clubRows = useMemo(() => clubs.map(club => {
    const clubBatches = approved.filter(batch => batch.clubId === club.id);
    const clubRecords = attendanceRecords.filter(record => record.clubId === club.id);
    const clubSummary = getAttendanceSummary(clubBatches.length === 1 ? clubBatches[0].id : undefined);
    const directEntries = clubRecords.reduce((total, record) => total + Object.keys(record.entries).length, 0);
    const present = clubBatches.length === 1 ? clubSummary.Present : clubRecords.reduce((total, record) => total + Object.values(record.entries).filter(value => value === 'Present').length, 0);
    const absent = clubBatches.length === 1 ? clubSummary.Absent : clubRecords.reduce((total, record) => total + Object.values(record.entries).filter(value => value === 'Absent').length, 0);
    return { club, batches: clubBatches.length, students: new Set(clubBatches.flatMap(batch => batch.studentIds)).size, sessions: clubRecords.length, present, absent, total: directEntries };
  }), [approved, attendanceRecords, clubs]);

  const review = (batch: ClubBatch, approve: boolean) => {
    const reason = approve ? undefined : (window.prompt('Reason for rejection (optional):') || 'Returned for correction');
    reviewBatchRequest(batch.id, approve ? 'Approved' : 'Rejected', 'Root Admin', reason);
    setMessage(approve ? `${batch.name} approved and visible to the club.` : `${batch.name} rejected.`);
    refresh();
  };

  return <AdminLayout>
    <div className="mb-8"><h1 className="text-2xl font-heading font-bold text-primary-950">Batches, Classes &amp; Attendance</h1><p className="mt-1 text-sm text-gray-500">Approve club batch structures and monitor attendance across every club.</p></div>
    {message && <p className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700" role="status">{message}</p>}
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Metric icon={<Users size={20} />} label="Approved batches" value={approved.length} /><Metric icon={<Users size={20} />} label="Assigned seats" value={totalAssigned} /><Metric icon={<Check size={20} />} label="Present entries" value={summary.Present} /><Metric icon={<X size={20} />} label="Absent entries" value={summary.Absent} /></div>
    <section className="mb-8"><h2 className="mb-4 text-lg font-bold text-primary-950">Pending Root approval <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">{pending.length}</span></h2>{pending.length === 0 ? <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">No pending batch requests.</div> : <div className="grid gap-4 lg:grid-cols-2">{pending.map(batch => <div key={batch.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-accent-600">{batch.clubName} · Class {batch.className}</p><h3 className="mt-1 font-bold text-primary-950">{batch.name}</h3><p className="mt-1 text-sm text-gray-500">Requested by {batch.requestedBy}</p></div><p className="text-lg font-extrabold text-primary-950">{batch.studentIds.length} students</p></div><div className="mt-4 grid gap-2 rounded-xl bg-slate-50 p-3 text-sm text-gray-600 sm:grid-cols-2"><p><Clock3 size={14} className="mr-1 inline text-primary-600" />{batch.days.join(', ')}</p><p>{batch.startTime} – {batch.endTime}</p><p>Instructor: <strong>{batch.instructorName}</strong></p><p>{batch.instructorContact || 'No contact added'}</p></div><div className="mt-4 flex gap-2"><Button onClick={() => review(batch, true)} className="gap-2 bg-green-600 hover:bg-green-700"><Check size={15} /> Approve batch</Button><Button variant="outline" onClick={() => review(batch, false)} className="gap-2 border-red-200 text-red-600 hover:bg-red-50"><X size={15} /> Reject</Button></div></div>)}</div>}</section>
    <section><div className="mb-4 flex items-center gap-2"><BarChart3 className="text-accent-600" size={20} /><h2 className="text-lg font-bold text-primary-950">Cross-club attendance report</h2></div><div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-gray-100 bg-slate-50 text-xs uppercase tracking-wider text-gray-500"><th className="px-5 py-4">Club</th><th className="px-5 py-4">Batches</th><th className="px-5 py-4">Students</th><th className="px-5 py-4">Sessions</th><th className="px-5 py-4 text-green-700">Present</th><th className="px-5 py-4 text-red-700">Absent</th><th className="px-5 py-4">Coverage</th></tr></thead><tbody>{clubRows.map(row => <tr key={row.club.id} className="border-b border-gray-100 last:border-0"><td className="px-5 py-4 font-bold text-primary-950">{row.club.name}</td><td className="px-5 py-4">{row.batches}</td><td className="px-5 py-4">{row.students}</td><td className="px-5 py-4">{row.sessions}</td><td className="px-5 py-4 font-bold text-green-700">{row.present}</td><td className="px-5 py-4 font-bold text-red-600">{row.absent}</td><td className="px-5 py-4">{row.total ? `${Math.round(((row.present + row.absent) / row.total) * 100)}% marked` : 'Not marked'}</td></tr>)}</tbody></table></div><p className="mt-3 text-xs text-gray-500">Attendance report is calculated from approved batches and saved daily attendance records. Student names remain available inside each club’s attendance screen.</p></section>
  </AdminLayout>;
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) { return <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">{icon}</div><p className="text-sm font-semibold text-gray-500">{label}</p><p className="mt-1 text-3xl font-heading font-extrabold text-primary-950">{value}</p></div>; }
