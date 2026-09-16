import React from 'react';
import { StudentLayout } from '../../components/student/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { getStudentByEmail } from '../../services/students/studentService';
import { getNoticesByClub } from '../../services/notices/noticeService';
import { NoticeCard } from '../../components/student/StudentCards';
import { Bell } from 'lucide-react';

export function StudentNoticesPage() {
  const { user } = useAuth();
  const student = user ? getStudentByEmail(user.email) : undefined;
  
  const notices = (student ? getNoticesByClub(student.clubId) : []).map(notice => ({
    title: notice.title,
    date: new Date(notice.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    description: notice.message
  }));

  return (
    <StudentLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary-950">Notices & Announcements</h1>
        <p className="text-sm text-gray-500 mt-1">Stay updated with the latest news from your club.</p>
      </div>

      <div className="max-w-3xl space-y-4">
        {notices.length > 0 ? (
          notices.map((notice, idx) => (
            <NoticeCard key={idx} notice={notice} />
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">No Notices</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              There are no new notices or announcements at this time.
            </p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
