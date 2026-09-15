import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { DataTable } from '../../components/admin/DataTable';
import { FeeEditModal } from '../../components/admin/FeeEditModal';
import { useClubFees, useClubsData, ClubFee } from '../../hooks/useAdminData';
import { Button } from '../../components/ui/button';
import { Edit2 } from 'lucide-react';

export function FeeManagementPage() {
  const { fees, saveFees } = useClubFees();
  const { clubs } = useClubsData();
  const [editingClub, setEditingClub] = useState<{ id: string, name: string, fee: ClubFee } | null>(null);

  const handleSaveFee = (clubId: string, updatedFee: ClubFee) => {
    saveFees({ ...fees, [clubId]: updatedFee });
  };

  const tableData = clubs.map(club => {
    const feeInfo = fees[club.id] || { registrationFee: 0, affiliationCost: 0, lastUpdated: 'N/A' };
    return {
      id: club.id,
      name: club.name,
      registrationFee: feeInfo.registrationFee,
      affiliationCost: feeInfo.affiliationCost,
      total: feeInfo.registrationFee + feeInfo.affiliationCost,
      lastUpdated: feeInfo.lastUpdated,
      rawFee: feeInfo
    };
  });

  const columns = [
    { header: 'Club Name', accessor: 'name', render: (val: string) => <span className="font-bold text-primary-950">{val}</span> },
    { header: 'Registration Fee', accessor: 'registrationFee', render: (val: number) => <span>{val} TK</span> },
    { header: 'Affiliation Cost', accessor: 'affiliationCost', render: (val: number) => <span>{val} TK</span> },
    { header: 'Total Payable', accessor: 'total', render: (val: number) => <span className="font-bold text-accent-600">{val} TK</span> },
    { header: 'Last Updated', accessor: 'lastUpdated', render: (val: string) => <span className="text-xs text-gray-500 font-mono">{val}</span> },
    { header: 'Action', accessor: 'id', render: (val: string, row: any) => (
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 gap-1.5 text-xs font-medium border-gray-200 hover:bg-primary-50 hover:text-primary-900"
        onClick={() => setEditingClub({ id: val, name: row.name, fee: row.rawFee })}
      >
        <Edit2 size={14} /> Edit
      </Button>
    )}
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-primary-950">Club Fee Management</h2>
        <p className="text-sm text-gray-500">Manage registration fees and affiliation costs per club.</p>
      </div>

      <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
        <DataTable 
          title="Fee Structure Overview" 
          columns={columns} 
          data={tableData} 
        />
      </div>

      {editingClub && (
        <FeeEditModal
          isOpen={!!editingClub}
          onClose={() => setEditingClub(null)}
          clubId={editingClub.id}
          clubName={editingClub.name}
          initialFee={editingClub.fee}
          onSave={handleSaveFee}
        />
      )}
    </AdminLayout>
  );
}
