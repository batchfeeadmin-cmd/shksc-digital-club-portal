import React, { useEffect, useState } from 'react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { Button } from '../../components/ui/button';
import { Users, Pencil, UserPlus, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClubsData, useClubFees } from '../../hooks/useAdminData';
import { getStudents, addStudent, updateStudent } from '../../services/students/studentService';
import { confirmPayment } from '../../services/payments/paymentService';
import { generateTranId } from '../../services/payments/sslCommerzService';
import { logActivity } from '../../services/activity/activityService';
import type { Student } from '../../types';

interface EditForm {
  name: string;
  class: string;
  roll: string;
  mobile: string;
  email: string;
}

const emptyEditForm: EditForm = { name: '', class: '', roll: '', mobile: '', email: '' };

interface AdmissionForm {
  name: string;
  class: string;
  section: string;
  roll: string;
  mobile: string;
  email: string;
  paymentMethod: 'Cash' | 'Online';
}

const emptyAdmissionForm: AdmissionForm = {
  name: '',
  class: '',
  section: '',
  roll: '',
  mobile: '',
  email: '',
  paymentMethod: 'Cash'
};

export function ClubStudentsPage() {
  const { user } = useAuth();
  const { clubs } = useClubsData();
  const { fees } = useClubFees();
  const [students, setStudents] = useState<Student[]>(getStudents());

  const club = clubs.find(c => c.id === user?.clubId);

  const [editTarget, setEditTarget] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyEditForm);
  const [admissionOpen, setAdmissionOpen] = useState(false);
  const [admissionForm, setAdmissionForm] = useState<AdmissionForm>(emptyAdmissionForm);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const handleUpdate = () => setStudents(getStudents());
    window.addEventListener('shksc_state_changed', handleUpdate);
    return () => window.removeEventListener('shksc_state_changed', handleUpdate);
  }, []);

  const clubStudents = students.filter(s => s.clubId === user?.clubId);
  const fee = user?.clubId ? fees[user.clubId] : undefined;
  const feeTotal = (fee?.registrationFee ?? 0) + (fee?.affiliationCost ?? 0);

  const flashSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const openEdit = (student: Student) => {
    setEditTarget(student);
    setEditForm({
      name: student.name,
      class: student.class,
      roll: student.roll,
      mobile: student.mobile,
      email: student.email
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    updateStudent(editTarget.id, {
      name: editForm.name,
      class: editForm.class,
      roll: editForm.roll,
      mobile: editForm.mobile,
      email: editForm.email
    });
    logActivity({
      actor: user?.name || 'Club Admin',
      role: 'club_admin',
      clubName: club?.name,
      action: 'Edited Student Details',
      detail: `${editForm.name} (${editTarget.studentId}) details updated`
    });
    setEditTarget(null);
    flashSuccess('Student details updated ✓');
  };

  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.clubId || !club) return;

    const newStudent = addStudent({
      id: `stu-${Date.now()}`,
      studentId: '',
      name: admissionForm.name,
      class: admissionForm.class,
      roll: admissionForm.roll,
      mobile: admissionForm.mobile,
      email: admissionForm.email,
      clubId: user.clubId,
      registrationStatus: admissionForm.paymentMethod === 'Cash' ? 'Confirmed' : 'Pending Payment'
    });

    if (admissionForm.paymentMethod === 'Cash') {
      const cashTxnId = `CASH-${Date.now().toString(36).toUpperCase()}`;
      confirmPayment(
        newStudent,
        user.clubId,
        feeTotal,
        cashTxnId,
        'Cash',
        admissionForm.name,
        club.name
      );
      logActivity({
        actor: user?.name || 'Club Admin',
        role: 'club_admin',
        clubName: club.name,
        action: 'Offline Admission (Cash)',
        detail: `${admissionForm.name} admitted to ${club.name} — paid ${feeTotal} ৳ in cash`
      });
    } else {
      logActivity({
        actor: user?.name || 'Club Admin',
        role: 'club_admin',
        clubName: club.name,
        action: 'Offline Admission (Online)',
        detail: `${admissionForm.name} admitted to ${club.name} — payment pending online`
      });
    }

    setAdmissionForm(emptyAdmissionForm);
    setAdmissionOpen(false);
    flashSuccess('Student admitted ✓');
  };

  const rows = clubStudents.map(s => ({
    id: s.studentId || s.id,
    name: s.name,
    class: `Class ${s.class}${s.roll ? ` - ${s.roll}` : ''}`,
    mobile: s.mobile || '—',
    email: s.email || '—',
    status: s.registrationStatus,
    _student: s
  }));

  const columns = [
    { header: 'Student ID', accessor: 'id', render: (val: string) => <span className="font-mono text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-700">{val}</span> },
    { header: 'Name', accessor: 'name', render: (val: string) => <span className="font-bold text-primary-950">{val}</span> },
    { header: 'Class', accessor: 'class' },
    { header: 'Mobile', accessor: 'mobile' },
    {
      header: 'Status',
      accessor: 'status',
      render: (val: string) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          val === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {val}
        </span>
      )
    },
    {
      header: 'Action',
      accessor: 'id',
      render: (_val: string, row: any) => (
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs border-gray-200 hover:bg-primary-50"
          onClick={() => openEdit(row._student)}
        >
          <Pencil size={13} /> Edit
        </Button>
      )
    }
  ];

  return (
    <ClubAdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-950 mb-1">Students</h2>
          <p className="text-sm text-gray-500">{club?.name || 'Your club'} — view, edit or admit students.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-xl flex items-center gap-2 border border-primary-100 font-medium">
            <Users size={18} /> {clubStudents.length} Students
          </div>
          <Button onClick={() => setAdmissionOpen(true)} className="bg-accent-500 hover:bg-accent-600 text-white gap-2">
            <UserPlus size={16} /> Register Student
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-100 font-medium flex items-center gap-2">
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable title="Club Members" columns={columns} data={rows} />
      </div>

      {/* Edit modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-slate-50">
              <h3 className="text-lg font-heading font-bold text-primary-950">Edit Student Details</h3>
              <button onClick={() => setEditTarget(null)} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Class *</label>
                  <input type="text" value={editForm.class} onChange={e => setEditForm({ ...editForm, class: e.target.value })} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Roll</label>
                  <input type="text" value={editForm.roll} onChange={e => setEditForm({ ...editForm, roll: e.target.value })} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile</label>
                  <input type="text" value={editForm.mobile} onChange={e => setEditForm({ ...editForm, mobile: e.target.value })} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
                <Button type="submit" className="bg-primary-900 text-white hover:bg-primary-800">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offline admission modal */}
      {admissionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden my-8">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-slate-50">
              <h3 className="text-lg font-heading font-bold text-primary-950 flex items-center gap-2">
                <UserPlus size={18} className="text-accent-500" /> Offline Admission — {club?.name}
              </h3>
              <button onClick={() => setAdmissionOpen(false)} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
            </div>
            <form onSubmit={handleAdmissionSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input type="text" value={admissionForm.name} onChange={e => setAdmissionForm({ ...admissionForm, name: e.target.value })} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" required />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Class *</label>
                  <input type="text" value={admissionForm.class} onChange={e => setAdmissionForm({ ...admissionForm, class: e.target.value })} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section</label>
                  <input type="text" value={admissionForm.section} onChange={e => setAdmissionForm({ ...admissionForm, section: e.target.value })} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Roll</label>
                  <input type="text" value={admissionForm.roll} onChange={e => setAdmissionForm({ ...admissionForm, roll: e.target.value })} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile *</label>
                  <input type="text" value={admissionForm.mobile} onChange={e => setAdmissionForm({ ...admissionForm, mobile: e.target.value })} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <input type="email" value={admissionForm.email} onChange={e => setAdmissionForm({ ...admissionForm, email: e.target.value })} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Payment Method *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAdmissionForm({ ...admissionForm, paymentMethod: 'Cash' })}
                    className={`p-3 rounded-xl border-2 text-sm font-bold transition-colors ${
                      admissionForm.paymentMethod === 'Cash'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    💵 Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdmissionForm({ ...admissionForm, paymentMethod: 'Online' })}
                    className={`p-3 rounded-xl border-2 text-sm font-bold transition-colors ${
                      admissionForm.paymentMethod === 'Online'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    💳 Online (SSLCommerz)
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Total payable: <span className="font-bold text-accent-600">{feeTotal.toLocaleString()} ৳</span>
                  {admissionForm.paymentMethod === 'Cash' ? ' — will be marked as Paid (Cash).' : ' — student pays later online.'}
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setAdmissionOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-accent-500 hover:bg-accent-600 text-white">Admit Student</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ClubAdminLayout>
  );
}
