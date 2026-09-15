import React from 'react';
import { Club } from '../../types';
import { Calendar, UserCircle, Star, Users, Flag, Target } from 'lucide-react';

export function ClubInfo({ club }: { club: Club }) {
  return (
    <div className="grid lg:grid-cols-3 gap-12">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-12">
        <section>
          <h2 className="text-2xl font-heading font-bold text-primary-950 mb-4">About the Club</h2>
          <div className="prose prose-lg text-gray-600">
            <p>{club.fullDescription || club.history || 'Information about this club is coming soon. Stay tuned for exciting updates.'}</p>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          {club.mission && (
            <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100">
              <div className="flex items-center gap-3 mb-3">
                <Flag className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-bold text-primary-950">Mission</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{club.mission}</p>
            </div>
          )}
          {club.objectives && club.objectives.length > 0 && (
            <div className="bg-accent-50 p-6 rounded-2xl border border-accent-100">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-5 h-5 text-accent-600" />
                <h3 className="text-lg font-bold text-primary-950">Objectives</h3>
              </div>
              <ul className="text-gray-700 text-sm leading-relaxed list-disc list-inside space-y-1">
                {club.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
              </ul>
            </div>
          )}
          {!club.objectives?.length && club.vision && (
            <div className="bg-accent-50 p-6 rounded-2xl border border-accent-100">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-5 h-5 text-accent-600" />
                <h3 className="text-lg font-bold text-primary-950">Vision</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{club.vision}</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div>
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sticky top-24">
          <h3 className="text-lg font-heading font-bold text-primary-950 mb-6 pb-4 border-b border-gray-100">Club Information</h3>
          
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                <UserCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">President</p>
                <p className="font-semibold text-gray-900">{club.president || 'Information will be updated'}</p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                <UserCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">General Secretary</p>
                <p className="font-semibold text-gray-900">{club.generalSecretary || 'Information will be updated'}</p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                <UserCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Coordinator / Moderator</p>
                <p className="font-semibold text-gray-900">{club.coordinator || 'Information will be updated'}</p>
              </div>
            </li>
            
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Established</p>
                <p className="font-semibold text-gray-900">{club.establishedDate || club.establishedYear || 'Information will be updated'}</p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Members</p>
                <p className="font-semibold text-gray-900">{club.memberCount} Students</p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Achievements</p>
                <p className="font-semibold text-gray-900">{club.achievementCount} Awards</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
