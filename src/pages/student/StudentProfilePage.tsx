import React, { useState } from 'react';
import { StudentLayout } from '../../components/student/StudentLayout';
import { User, Mail, Phone, BookOpen, Hash, GraduationCap, Camera, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getStudentByEmail, updateStudent } from '../../services/students/studentService';
import { getClubs } from '../../services/clubs/clubService';
import { ImageCropper } from '../../components/ui/ImageCropper';
import { Button } from '../../components/ui/button';

export function StudentProfilePage() {
  const { user } = useAuth();
  const [pictureEditorOpen, setPictureEditorOpen] = useState(false);
  const [draftPicture, setDraftPicture] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);
  
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
    profilePicture: profilePicture ?? realStudent?.profilePicture ?? user?.profilePicture
  };

  const openPictureEditor = () => {
    if (!realStudent) return;
    setDraftPicture(student.profilePicture || '');
    setPictureEditorOpen(true);
  };

  const savePicture = () => {
    if (!realStudent || !draftPicture) return;
    updateStudent(realStudent.id, { profilePicture: draftPicture });
    setProfilePicture(draftPicture);
    setPictureEditorOpen(false);
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
               onClick={openPictureEditor}
               className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
               aria-label="Change profile picture"
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

      {pictureEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="picture-editor-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 id="picture-editor-title" className="text-xl font-bold text-primary-950">Update profile picture</h2>
                <p className="mt-1 text-sm text-gray-500">Choose and crop a clear square portrait.</p>
              </div>
              <button onClick={() => setPictureEditorOpen(false)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100" aria-label="Close profile picture editor">
                <X size={20} />
              </button>
            </div>
            <ImageCropper value={draftPicture} onChange={setDraftPicture} />
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setPictureEditorOpen(false)}>Cancel</Button>
              <Button onClick={savePicture} disabled={!draftPicture}>Save picture</Button>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
