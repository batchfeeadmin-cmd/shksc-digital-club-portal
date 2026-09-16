import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { Button } from '../../components/ui/button';
import { ImageCropper } from '../../components/ui/ImageCropper';
import { UserPlus, Pencil, Trash2, X, KeyRound } from 'lucide-react';
import { UserAccount } from '../../types';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../services/auth/userService';
import { getClubs } from '../../services/clubs/clubService';
import { logActivity } from '../../services/activity/activityService';

interface AccountFormState {
  name: string;
  email: string;
  password: string;
  mobile: string;
  designation: string;
  clubId: string;
  status: 'Active' | 'Inactive';
  userType: 'Teacher' | 'Student' | 'Other';
  accessLevel: 'Full Access' | 'Editor' | 'Viewer';
  department: string;
  profilePicture: string;
}

const emptyForm: AccountFormState = {
  name: '',
  email: '',
  password: '',
  mobile: '',
  designation: 'Club Moderator',
  clubId: '',
  status: 'Active',
  userType: 'Teacher',
  accessLevel: 'Full Access',
  department: '',
  profilePicture: ''
};

export function ClubAdminsPage() {
  const [admins, setAdmins] = useState<UserAccount[]>([]);
  const [clubs, setClubs] = useState(() => getClubs());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AccountFormState>(emptyForm);
  const [formError, setFormError] = useState('');

  const refresh = () => {
    setAdmins(getAllUsers().filter(u => u.role === 'club_admin'));
    setClubs(getClubs());
  };

  useEffect(() => {
    refresh();
    window.addEventListener('shksc_state_changed', refresh);
    return () => window.removeEventListener('shksc_state_changed', refresh);
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (admin: UserAccount) => {
    setEditingId(admin.id);
    setForm({
      name: admin.name,
      email: admin.email,
      password: '',
      mobile: admin.mobile || '',
      designation: admin.designation || 'Club Moderator',
      clubId: admin.clubId || '',
      status: admin.status || 'Active',
      userType: admin.userType || 'Teacher',
      accessLevel: admin.accessLevel || 'Full Access',
      department: admin.department || '',
      profilePicture: admin.profilePicture || ''
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.name || !form.email || !form.clubId) {
      setFormError('Name, email and club are required.');
      return;
    }
    if (!editingId && !form.password) {
      setFormError('Password is required for a new account.');
      return;
    }
    const allUsers = getAllUsers();
    const emailTaken = allUsers.some(
      u => u.email.toLowerCase() === form.email.toLowerCase() && u.id !== editingId
    );
    if (emailTaken) {
      setFormError('An account with this email already exists.');
      return;
    }

    if (editingId) {
      updateUser(editingId, {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        designation: form.designation,
        status: form.status,
        userType: form.userType,
        accessLevel: form.accessLevel,
        department: form.department,
        profilePicture: form.profilePicture,
        clubId: form.clubId,
        ...(form.password ? { password: form.password } : {})
      });
      logActivity({
        actor: 'Root Admin',
        role: 'root_admin',
        action: 'Updated Club Admin Account',
        detail: `${form.name} (${form.email}) updated`
      });
    } else {
      createUser({
        id: `u-${Date.now()}`,
        name: form.name,
        email: form.email,
        password: form.password,
        mobile: form.mobile,
        designation: form.designation,
        status: form.status,
        userType: form.userType,
        accessLevel: form.accessLevel,
        department: form.department,
        profilePicture: form.profilePicture,
        clubId: form.clubId,
        role: 'club_admin'
      });
      logActivity({
        actor: 'Root Admin',
        role: 'root_admin',
        action: 'Created Club Admin Account',
        detail: `${form.name} (${form.email}) added as club admin`
      });
    }

    setModalOpen(false);
    refresh();
  };

  const handleDelete = (admin: UserAccount) => {
    if (window.confirm(`Delete club admin "${admin.name}"? This cannot be undone.`)) {
      deleteUser(admin.id);
      logActivity({
        actor: 'Root Admin',
        role: 'root_admin',
        action: 'Deleted Club Admin Account',
        detail: `${admin.name} (${admin.email}) removed`
      });
      refresh();
    }
  };

  const clubNameOf = (clubId?: string) =>
    clubs.find(c => c.id === clubId)?.name || 'Not assigned';

  const columns = [
    { header: 'Name', accessor: 'name', render: (val: string) => <span className="font-bold text-primary-950">{val}</span> },
    { header: 'Email / ID', accessor: 'email', render: (val: string) => <span className="font-mono text-xs text-gray-600">{val}</span> },
    { header: 'Club', accessor: 'clubId', render: (val: string) => <span className="text-gray-700">{clubNameOf(val)}</span> },
    { header: 'Designation', accessor: 'designation', render: (val: string) => <span className="text-gray-700">{val || '—'}</span> },
    { header: 'Mobile', accessor: 'mobile', render: (val: string) => <span className="text-gray-700">{val || '—'}</span> },
    { header: 'Status', accessor: 'status', render: (val: string) => <span className={`px-2 py-0.5 rounded text-xs font-bold ${val === 'Inactive' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{val || 'Active'}</span> },
    {
      header: 'Actions',
      accessor: 'id',
      render: (val: string, row: UserAccount) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs border-gray-200 hover:bg-primary-50"
            onClick={() => openEdit(row)}
          >
            <Pencil size={13} /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => handleDelete(row)}
          >
            <Trash2 size={13} /> Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-950">Club Admins</h2>
          <p className="text-sm text-gray-500">Create and manage club admin accounts. Credentials are used to sign in to the club dashboard.</p>
        </div>
        <Button onClick={openCreate} className="bg-primary-900 hover:bg-primary-800 text-white gap-2">
          <UserPlus size={18} /> Create Club Admin
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable title="Club Admin Accounts" columns={columns} data={admins} />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-slate-50">
              <h3 className="text-lg font-heading font-bold text-primary-950 flex items-center gap-2">
                <KeyRound size={18} className="text-accent-500" />
                {editingId ? 'Edit Club Admin' : 'Create Club Admin'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                  {formError}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">Profile Picture</label>
                <ImageCropper 
                  value={form.profilePicture} 
                  onChange={(val) => setForm({ ...form, profilePicture: val })} 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  placeholder="e.g. Computer Club Admin"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email (Login ID) *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  placeholder="admin@shksc.edu"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Password {!editingId && '*'}
                  </label>
                  <input
                    type="text"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                    placeholder={editingId ? 'Leave blank to keep' : 'Set a password'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile</label>
                  <input
                    type="text"
                    value={form.mobile}
                    onChange={e => setForm({ ...form, mobile: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                    placeholder="017XX-XXXXXX"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">User Type</label>
                  <select
                    value={form.userType}
                    onChange={e => setForm({ ...form, userType: e.target.value as any })}
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white"
                  >
                    <option value="Teacher">Teacher</option>
                    <option value="Student">Student</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {form.userType === 'Teacher' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department / Subject</label>
                    <input
                      type="text"
                      list="school-subjects"
                      value={form.department}
                      onChange={e => setForm({ ...form, department: e.target.value })}
                      className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white"
                      placeholder="e.g. Physics"
                    />
                    <datalist id="school-subjects">
                      <option value="Bangla" />
                      <option value="English" />
                      <option value="Mathematics" />
                      <option value="Science" />
                      <option value="Physics" />
                      <option value="Chemistry" />
                      <option value="Biology" />
                      <option value="Higher Mathematics" />
                      <option value="Bangladesh and Global Studies" />
                      <option value="Religion and Moral Education" />
                      <option value="Information and Communication Technology (ICT)" />
                      <option value="Accounting" />
                      <option value="Finance & Banking" />
                      <option value="Business Entrepreneurship" />
                      <option value="Economics" />
                      <option value="Geography and Environment" />
                      <option value="History of Bangladesh and World Civilization" />
                      <option value="Civics and Citizenship" />
                      <option value="Agriculture Studies" />
                      <option value="Home Science" />
                      <option value="Physical Education and Health" />
                      <option value="Arts and Crafts" />
                    </datalist>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Assigned Club *</label>
                <select
                  value={form.clubId}
                  onChange={e => setForm({ ...form, clubId: e.target.value })}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white"
                >
                  <option value="">-- Select Club --</option>
                  {clubs.map(club => (
                    <option key={club.id} value={club.id}>{club.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Designation</label>
                  <select
                    value={form.designation}
                    onChange={e => setForm({ ...form, designation: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white"
                  >
                    <option value="Club Moderator">Club Moderator</option>
                    <option value="President">President</option>
                    <option value="General Secretary">General Secretary</option>
                    <option value="Faculty Advisor">Faculty Advisor</option>
                    <option value="Executive Member">Executive Member</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Account Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as 'Active' | 'Inactive' })}
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive (Suspended)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Access Level</label>
                <select
                  value={form.accessLevel}
                  onChange={e => setForm({ ...form, accessLevel: e.target.value as any })}
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white"
                >
                  <option value="Full Access">Full Access (Manage Everything)</option>
                  <option value="Editor">Editor (Manage Content & Events)</option>
                  <option value="Viewer">Viewer (Read Only)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary-900 text-white hover:bg-primary-800">
                  {editingId ? 'Save Changes' : 'Create Account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
