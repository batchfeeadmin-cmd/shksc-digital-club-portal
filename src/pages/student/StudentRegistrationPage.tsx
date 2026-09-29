import React from 'react';
import { StudentLayout } from '../../components/student/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { useClubsData } from '../../hooks/useAdminData';
import { getStudentByEmail } from '../../services/students/studentService';
import { RegistrationCard } from '../../components/student/StudentCards';
import { ClipboardList, CheckCircle2, AlertCircle } from 'lucide-react';

export function StudentRegistrationPage() {
  const { user } = useAuth();
  const { clubs } = useClubsData();
  const student = user ? getStudentByEmail(user.email) : undefined;
  const club = student ? clubs.find(c => c.id === student.clubId) : undefined;
  
  const isPaid = student?.registrationStatus === 'Confirmed';

  return (
    <StudentLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary-950">Registration Details</h1>
        <p className="text-sm text-gray-500 mt-1">View your application and registration status.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 p-6 flex items-center justify-between">
              <h3 className="font-bold text-primary-950 text-lg flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-accent-500" />
                Submitted Information
              </h3>
              {isPaid ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                  <AlertCircle className="w-3.5 h-3.5" /> Pending Payment
                </span>
              )}
            </div>
            
            {student ? (
              <div className="p-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-medium">{student.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Registration Reference</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-medium">{student.studentId}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">School Student ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-medium">{student.schoolStudentId || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{student.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Mobile Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">{student.mobile}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Class</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {student.class}{student.section ? `, Section ${student.section}` : ''}{student.roll ? `, Roll ${student.roll}` : ''}
                    </dd>
                  </div>

                  {student.fatherName && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Father's Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{student.fatherName}</dd>
                    </div>
                  )}
                  {student.motherName && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Mother's Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{student.motherName}</dd>
                    </div>
                  )}
                  {student.dateOfBirth && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                      <dd className="mt-1 text-sm text-gray-900">{student.dateOfBirth}</dd>
                    </div>
                  )}
                  {student.gender && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Gender</dt>
                      <dd className="mt-1 text-sm text-gray-900">{student.gender}</dd>
                    </div>
                  )}
                  {student.address && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">{student.address}</dd>
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Selected Club</dt>
                    <dd className="mt-1 text-sm text-primary-600 font-bold">{club?.name || 'Unknown Club'}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                No registration data found.
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <RegistrationCard clubName={club?.name || 'No club selected'} status={isPaid ? 'Confirmed' : 'Pending Payment'} />
          
          <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
            <h4 className="font-bold text-primary-900 mb-2">Need to update info?</h4>
            <p className="text-sm text-primary-700 mb-4">
              Once registration is submitted, you cannot change the details directly. Please contact your club admin to request updates.
            </p>
            <a href="mailto:info.shksc@gmail.com?subject=Club%20registration%20update%20request" className="block text-center text-sm font-bold text-primary-700 bg-white px-4 py-2 rounded-lg border border-primary-200 hover:bg-primary-50 w-full transition-colors">
              Contact Admin
            </a>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
