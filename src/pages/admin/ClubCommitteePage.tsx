import React, { useState, useEffect } from 'react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { Users, Plus, Shield, Trash2, Search, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { getCommitteeByClub, assignCommitteeRole, removeCommitteeRole, CommitteeMember } from '../../services/clubs/committeeService';
import { getStudentsByClub } from '../../services/students/studentService';
import { Student } from '../../types';

export function ClubCommitteePage() {
  const { user } = useAuth();
  const [committee, setCommittee] = useState<CommitteeMember[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [roleName, setRoleName] = useState('');

  const availableRoles = [
    'President',
    'Vice President',
    'General Secretary',
    'Joint Secretary',
    'Organizing Secretary',
    'Event Coordinator',
    'Treasurer',
    'Executive Member'
  ];

  const loadData = () => {
    if (user?.clubId) {
      setCommittee(getCommitteeByClub(user.clubId));
      setStudents(getStudentsByClub(user.clubId).filter(s => s.registrationStatus === 'Confirmed'));
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('shksc_state_changed', loadData);
    return () => window.removeEventListener('shksc_state_changed', loadData);
  }, [user]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId.includes(searchTerm)
  );

  const handleAssignRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.clubId || !selectedStudentId || !roleName) return;

    assignCommitteeRole(user.clubId, selectedStudentId, roleName);
    
    setSelectedStudentId('');
    setRoleName('');
    setSearchTerm('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this committee member?')) {
      removeCommitteeRole(id);
    }
  };

  return (
    <ClubAdminLayout>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center mb-8">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-950 mb-1">Committee Members</h2>
          <p className="text-sm text-gray-500">Assign leadership roles to your club members.</p>
        </div>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="bg-primary-950 hover:bg-primary-900 text-white">
            <Plus className="w-4 h-4 mr-2" /> Assign Role
          </Button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Assign Committee Role</h3>
          
          <form onSubmit={handleAssignRole} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Student</label>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search by name or ID..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 text-sm rounded-lg border border-gray-200 focus:border-primary-500 outline-none"
                  />
                </div>
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto custom-scrollbar">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                      <label key={student.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">
                        <input 
                          type="radio" 
                          name="student"
                          value={student.id}
                          checked={selectedStudentId === student.id}
                          onChange={() => setSelectedStudentId(student.id)}
                          className="text-primary-600"
                        />
                        <div>
                          <p className="font-medium text-sm text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.studentId} • Class {student.class}</p>
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">No confirmed students found</div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Role</label>
                <div className="grid sm:grid-cols-2 gap-2 max-h-[240px] overflow-y-auto custom-scrollbar pr-2">
                  {availableRoles.map(role => (
                    <label key={role} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${roleName === role ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                      <input 
                        type="radio" 
                        name="role"
                        className="hidden" 
                        checked={roleName === role}
                        onChange={() => setRoleName(role)}
                      />
                      <Shield size={16} />
                      <span className="text-sm font-medium">{role}</span>
                    </label>
                  ))}
                  <div className="sm:col-span-2 mt-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Or custom role:</label>
                    <input 
                      type="text" 
                      value={!availableRoles.includes(roleName) && roleName ? roleName : ''} 
                      onChange={e => setRoleName(e.target.value)} 
                      placeholder="Type custom role..." 
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 focus:border-primary-500 outline-none text-sm" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button type="submit" disabled={!selectedStudentId || !roleName} className="bg-primary-950 hover:bg-primary-900 text-white">Assign Role</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {committee.length === 0 && !showAddForm ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
            <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No committee members assigned yet.</p>
          </div>
        ) : (
          committee.map(member => {
            const student = students.find(s => s.id === member.studentId);
            return (
              <div key={member.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col relative">
                <div className="absolute top-4 right-4">
                  <button onClick={() => handleDelete(member.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  {student?.profilePicture ? (
                    <img src={student.profilePicture} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xl">
                      {student?.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900">{student?.name || 'Unknown Student'}</h3>
                    <p className="text-xs text-gray-500">{student?.studentId || '—'} • Class {student?.class || '—'}</p>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent-500" />
                  <span className="font-bold text-sm text-primary-950">{member.roleName}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </ClubAdminLayout>
  );
}
