import React from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { BookOpen, Eye } from 'lucide-react';
import { useClubsData, useClubFees } from '../../hooks/useAdminData';
import { getStudents } from '../../services/students/studentService';

export function RootClubsPage() {
  const { clubs } = useClubsData();
  const { fees } = useClubFees();
  const students = getStudents();

  const rows = clubs.map(club => {
    const clubStudents = students.filter(s => s.clubId === club.id);
    const fee = fees[club.id];
    return {
      id: club.id,
      name: club.name,
      logo: club.logo,
      category: club.category,
      established: club.establishedYear ? String(club.establishedYear) : '—',
      members: clubStudents.length,
      registrationFee: fee ? `৳ ${fee.registrationFee}` : '—',
      totalFee: fee ? `৳ ${fee.registrationFee + fee.affiliationCost}` : '—',
      slug: club.slug
    };
  });

  const columns = [
    {
      header: 'Club Name',
      accessor: 'name',
      render: (val: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-900 flex items-center justify-center font-bold text-sm overflow-hidden shrink-0">
            {row.logo?.startsWith('/') ? (
              <img src={row.logo} alt={val} className="w-full h-full object-cover" />
            ) : (
              row.logo
            )}
          </div>
          <span className="font-bold text-primary-950">{val}</span>
        </div>
      )
    },
    { header: 'Category', accessor: 'category' },
    { header: 'Established', accessor: 'established' },
    { header: 'Students', accessor: 'members' },
    { header: 'Registration Fee', accessor: 'registrationFee' },
    { header: 'Total Payable', accessor: 'totalFee' },
    {
      header: 'Action',
      accessor: 'slug',
      render: (val: string) => (
        <Link
          to={`/clubs/${val}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-800"
        >
          <Eye size={14} /> View Page
        </Link>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-950 mb-1">Clubs</h2>
          <p className="text-sm text-gray-500">All clubs on the portal with their fee structure.</p>
        </div>
        <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-xl flex items-center gap-2 border border-primary-100 font-medium">
          <BookOpen size={18} /> {clubs.length} Clubs
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable title="Club Directory" columns={columns} data={rows} />
      </div>
    </AdminLayout>
  );
}
