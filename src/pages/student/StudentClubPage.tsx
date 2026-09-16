import React from 'react';
import { StudentLayout } from '../../components/student/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { useClubsData } from '../../hooks/useAdminData';
import { getStudentByEmail } from '../../services/students/studentService';
import { ClubInfoCard } from '../../components/student/StudentCards';
import { BookOpen, Users, Trophy } from 'lucide-react';

export function StudentClubPage() {
  const { user } = useAuth();
  const { clubs } = useClubsData();
  const student = user ? getStudentByEmail(user.email) : undefined;
  const club = student ? clubs.find(c => c.id === student.clubId) : undefined;

  return (
    <StudentLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary-950">My Club</h1>
        <p className="text-sm text-gray-500 mt-1">Information and updates about your enrolled club.</p>
      </div>

      {!club ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">No Club Assigned</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            You are not currently assigned to any club. Please complete your registration or contact the administration.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <ClubInfoCard club={club} />
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-primary-950 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-accent-500" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Total Members</p>
                  <p className="text-lg font-bold text-primary-950">{club.memberCount || 120}+</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Established</p>
                  <p className="text-lg font-bold text-primary-950">{club.establishedYear || '2023'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-primary-950 mb-4 text-lg">About {club.name}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {club.shortDescription || `Welcome to ${club.name}. We are dedicated to providing the best extracurricular experience for our members. Engage in activities, events, and build your skills with us.`}
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-primary-950 mb-4 text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent-500" />
                Recent Achievements
              </h3>
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Achievements will be updated soon by the club committee.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
