import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useUpdateRequests, useClubsData, UpdateRequest } from '../../hooks/useAdminData';
import { DataTable } from '../../components/admin/DataTable';
import { Button } from '../../components/ui/button';
import { Eye, FileEdit } from 'lucide-react';
import { ApprovalModal } from '../../components/admin/ApprovalModal';
import { approveRequest as approveRequestService, rejectRequest as rejectRequestService } from '../../services/approvals/approvalService';

export function ApprovalsPage() {
  const { requests } = useUpdateRequests();
  const { clubs } = useClubsData();
  const [selectedRequest, setSelectedRequest] = useState<UpdateRequest | null>(null);

  const pendingRequests = requests.filter(r => r.status === 'Pending');

  const handleApprove = (request: UpdateRequest) => {
    approveRequestService(request);
    setSelectedRequest(null);
  };

  const handleReject = (request: UpdateRequest) => {
    rejectRequestService(request);
    setSelectedRequest(null);
  };

  const columns = [
    { header: 'Club Name', accessor: 'clubName', render: (val: string) => <span className="font-bold text-primary-950">{val}</span> },
    { header: 'Request Type', accessor: 'type' },
    { header: 'Date', accessor: 'requestDate', render: (val: string) => <span className="text-sm text-gray-500">{new Date(val).toLocaleDateString()}</span> },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (val: string) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          val === 'Pending' ? 'bg-orange-100 text-orange-700' : 
          val === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {val}
        </span>
      )
    },
    { 
      header: 'Action', 
      accessor: 'id', 
      render: (val: string, row: any) => (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1.5 text-xs font-medium border-primary-200 hover:bg-primary-50 text-primary-700"
          onClick={() => setSelectedRequest(row)}
        >
          <Eye size={14} /> Review
        </Button>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-950 mb-1">Approval Requests</h2>
          <p className="text-sm text-gray-500">Review and publish updates submitted by club admins.</p>
        </div>
        
        <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-xl flex items-center gap-2 border border-orange-100 font-medium">
          <FileEdit size={18} />
          {pendingRequests.length} Pending Requests
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable title="Pending Club Updates" columns={columns} data={pendingRequests} />
      </div>

      <ApprovalModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
        currentClubData={clubs.find(c => c.id === selectedRequest?.clubId)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </AdminLayout>
  );
}
