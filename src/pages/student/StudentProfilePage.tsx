import React, { useState } from 'react';
import { StudentLayout } from '../../components/student/StudentLayout';
import { User, Mail, Phone, BookOpen, Hash, GraduationCap, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getStudentByEmail, updateStudent } from '../../services/students/studentService';
import { getClubs } from '../../services/clubs/clubService';

export function StudentProfilePage() {
  const { user } = useAuth();
  
  // Real student data
  const realStudent = user?.email ? getStudentByEmail(user.email) : null;
  const clubName = realStudent 
    ? getClubs().find(c => c.id === realStudent.clubId)?.name 
    : 'Not Assigned';

  const student = {
    name: realStudent?.name || user?.name || 'Unknown',
    id: realStudent?.studentId || 'N/A',
    class: realStudent?.class || user?.className || 'N/A',
    roll: realStudent?.roll || 'N/A',
    mobile: realStudent?.mobile || 'N/A',
    email: realStudent?.email || user?.email || 'N/A',
    clubName: clubName || 'N/A',
    profilePicture: realStudent?.profilePicture || user?.profilePicture
  };

  const handleUpdatePicture = () => {
    if (!realStudent) return;
    const url = window.prompt('Enter Profile Picture URL:', realStudent.profilePicture || '');
    if (url !== null) {
      updateStudent(realStudent.id, { profilePicture: url });
      // In a real app we'd also update the AuthContext user if needed, 
      // but for this mock, state update event will re-render the layout.
    }
  };

  return (
    <StudentLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary-950">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your personal and contact information.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 max-w-3xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 pb-10 border-b border-gray-100 text-center sm:text-left">
           <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-900 flex items-center justify-center shrink-0 relative overflow-hidden border-2 border-primary-100 shadow-sm group">
             {student.profilePicture ? (
                <img src={student.profilePicture} alt={student.name} className="w-full h-full object-cover" />
             ) : (
                <User size={40} />
             )}
             <button 
               onClick={handleUpdatePicture}
               className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
             >
               <Camera size={24} />
             </button>
           </div>
           <div className="pt-2">
             <h2 className="text-3xl font-heading font-bold text-primary-950">{student.name}</h2>
             <p className="text-gray-500 font-mono mt-2 text-lg font-medium">{student.id}</p>
           </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 md:gap-10">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Class</p>
            <p className="font-medium text-gray-900 flex items-center gap-3 text-lg">
              <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary-400">
                <GraduationCap size={18} />
              </span>
              Class {student.class}
            </p>
          </div>
          
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Roll Number</p>
            <p className="font-medium text-gray-900 flex items-center gap-3 text-lg">
              <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary-400">
                <Hash size={18} />
              </span>
              {student.roll}
            </p>
          </div>
          
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mobile</p>
            <p className="font-medium text-gray-900 flex items-center gap-3 text-lg">
              <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary-400">
                <Phone size={18} />
              </span>
              {student.mobile}
            </p>
          </div>
          
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</p>
            <p className="font-medium text-gray-900 flex items-center gap-3 text-lg">
              <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-primary-400">
                <Mail size={18} />
              </span>
              {student.email}
            </p>
          </div>
          
          <div className="sm:col-span-2 bg-primary-50 p-6 rounded-xl border border-primary-100 mt-2">
            <p className="text-xs font-bold text-primary-500 uppercase tracking-wider mb-2">Selected Club</p>
            <p className="font-bold text-primary-950 text-xl flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-accent-500" /> {student.clubName}
            </p>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
