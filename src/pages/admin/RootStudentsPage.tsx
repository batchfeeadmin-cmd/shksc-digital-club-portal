import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { Users, Download } from 'lucide-react';
import { useClubsData } from '../../hooks/useAdminData';
import { getStudents } from '../../services/students/studentService';
import type { Student } from '../../types';
import { Button } from '../../components/ui/button';
import { exportToCSV } from '../../utils/exportUtils';

export function RootStudentsPage() {
  const { clubs } = useClubsData();
  const [students, setStudents] = useState<Student[]>(getStudents());

  useEffect(() => {
    const handleUpdate = () => setStudents(getStudents());
    window.addEventListener('shksc_state_changed', handleUpdate);
    return () => window.removeEventListener('shksc_state_changed', handleUpdate);
  }, []);

  const clubNameOf = (clubId: string) => clubs.find(c => c.id === clubId)?.name || '—';

  const rows = students.map(s => ({
    id: s.studentId || s.id,
    name: s.name,
    class: `Class ${s.class}${s.roll ? ` - ${s.roll}` : ''}`,
    mobile: s.mobile || '—',
    email: s.email || '—',
    club: clubNameOf(s.clubId),
    status: s.registrationStatus
  }));

  const columns = [
    { header: 'Student ID', accessor: 'id', render: (val: string) => <span className="font-mono text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-700">{val}</span> },
    { header: 'Name', accessor: 'name', render: (val: string) => <span className="font-bold text-primary-950">{val}</span> },
    { header: 'Class', accessor: 'class' },
    { header: 'Mobile', accessor: 'mobile' },
    { header: 'Club', accessor: 'club' },
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
    }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-950 mb-1">Students</h2>
          <p className="text-sm text-gray-500">All registered students across every club.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => exportToCSV('all_students.csv', rows)}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-xl flex items-center gap-2 border border-primary-100 font-medium">
            <Users size={18} /> {students.length} Students
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable title="Registered Students" columns={columns} data={rows} />
      </div>
    </AdminLayout>
  );
}
