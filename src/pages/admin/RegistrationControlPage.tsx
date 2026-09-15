import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { RegistrationControlCard } from '../../components/admin/RegistrationControlCard';

export function RegistrationControlPage() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-primary-950">Registration Control</h2>
        <p className="text-sm text-gray-500">Configure global registration settings and status for the SHKSC Portal.</p>
      </div>
      
      <div className="max-w-4xl">
        <RegistrationControlCard />
      </div>
    </AdminLayout>
  );
}
