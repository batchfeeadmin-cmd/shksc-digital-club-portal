import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { UserCog, Plus, Shield, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { getAllUsers, createUser, deleteUser } from '../../services/auth/userService';
import { UserAccount } from '../../types';

export function RootSubAdminsPage() {
  const [subAdmins, setSubAdmins] = useState<UserAccount[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);

  const availablePermissions = [
    { id: 'students_clubs', label: 'Students & Clubs' },
    { id: 'payments', label: 'Payments' },
    { id: 'reports', label: 'Reports' },
    { id: 'communications', label: 'Communications' },
    { id: 'data', label: 'Data Import/Export' },
    { id: 'cms', label: 'Content (CMS)' }
  ];

  const loadSubAdmins = () => {
    const users = getAllUsers();
    setSubAdmins(users.filter(u => u.role === 'sub_admin'));
  };

  useEffect(() => {
    loadSubAdmins();
  }, []);

  const handleTogglePermission = (id: string) => {
    setPermissions(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleAddSubAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !designation) return;

    const newSubAdmin: UserAccount = {
      id: `u-${Date.now()}`,
      name,
      email,
      password,
      role: 'sub_admin',
      designation,
      permissions,
      createdAt: new Date().toISOString()
    };

    createUser(newSubAdmin);
    setSuccessMsg('Sub-Admin created successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
    
    // Reset
    setName('');
    setEmail('');
    setPassword('');
    setDesignation('');
    setPermissions([]);
    setShowAddForm(false);
    loadSubAdmins();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this Sub-Admin?')) {
      deleteUser(id);
      loadSubAdmins();
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-950 mb-1">Sub-Admins</h2>
          <p className="text-sm text-gray-500">Manage sub-admin roles and permissions.</p>
        </div>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="bg-primary-950 hover:bg-primary-900 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Sub-Admin
          </Button>
        )}
      </div>

      {successMsg && (
        <div className="mb-6 bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-100 font-medium flex items-center gap-2">
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Create New Sub-Admin</h3>
          
          <form onSubmit={handleAddSubAdmin} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email (Login ID)</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Designation (e.g. Accountant)</label>
                <input type="text" value={designation} onChange={e => setDesignation(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Permissions</label>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {availablePermissions.map(perm => (
                  <label key={perm.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${permissions.includes(perm.id) ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={permissions.includes(perm.id)} 
                      onChange={() => handleTogglePermission(perm.id)} 
                    />
                    <Shield size={16} />
                    <span className="text-sm font-medium">{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary-950 hover:bg-primary-900 text-white">Create Account</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subAdmins.map(admin => (
          <div key={admin.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center font-bold text-xl">
                  {admin.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{admin.name}</h3>
                  <p className="text-xs font-medium text-gray-500">{admin.designation}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(admin.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="text-sm text-gray-600 mb-4 font-mono bg-gray-50 px-3 py-1.5 rounded-lg inline-block w-fit">
              {admin.email}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Permissions</p>
              <div className="flex flex-wrap gap-1.5">
                {admin.permissions && admin.permissions.length > 0 ? (
                  admin.permissions.map(p => {
                    const label = availablePermissions.find(ap => ap.id === p)?.label || p;
                    return <span key={p} className="bg-primary-50 text-primary-700 text-[10px] px-2 py-1 rounded-md font-bold">{label}</span>;
                  })
                ) : (
                  <span className="text-xs text-gray-400 italic">No permissions assigned</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {subAdmins.length === 0 && !showAddForm && (
          <div className="col-span-full py-12 text-center text-gray-500">
            <UserCog className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No sub-admins found.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
