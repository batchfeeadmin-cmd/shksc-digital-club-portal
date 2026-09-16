import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ArrowUpRight, Trash2, CheckCircle2, AlertTriangle, Users, CreditCard } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { promoteAllStudents, purgePendingRegistrations, getStudents } from '../../services/students/studentService';
import { clearAllPayments, getPayments } from '../../services/payments/paymentService';
import { logActivity } from '../../services/activity/activityService';
import { useAuth } from '../../context/AuthContext';

export function RootAcademicYearPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState(getStudents());
  const [payments, setPayments] = useState(getPayments());
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const refreshStats = () => {
    setStudents(getStudents());
    setPayments(getPayments());
  };

  const handlePromote = () => {
    if (confirm('WARNING: This will promote all students to the next class and clear their club memberships. This action cannot be undone. Are you sure?')) {
      promoteAllStudents();
      logActivity({
        actor: user?.name || 'Root Admin',
        role: 'root_admin',
        action: 'Promoted Students',
        detail: 'Advanced academic year: promoted all students and reset club memberships.'
      });
      setMessage({ type: 'success', text: 'Successfully promoted all students and reset their club memberships.' });
      refreshStats();
    }
  };

  const handlePurgePending = () => {
    if (confirm('This will delete all students who have a "Pending Payment" status. Are you sure?')) {
      purgePendingRegistrations();
      logActivity({
        actor: user?.name || 'Root Admin',
        role: 'root_admin',
        action: 'Purged Pending Registrations',
        detail: 'Deleted all inactive/pending student registrations.'
      });
      setMessage({ type: 'success', text: 'Successfully purged all pending registrations.' });
      refreshStats();
    }
  };

  const handleClearPayments = () => {
    if (confirm('DANGER: This will delete the entire payment history log. Are you sure?')) {
      clearAllPayments();
      logActivity({
        actor: user?.name || 'Root Admin',
        role: 'root_admin',
        action: 'Cleared Payment Logs',
        detail: 'Deleted all payment transactions.'
      });
      setMessage({ type: 'success', text: 'Successfully cleared all payment logs.' });
      refreshStats();
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-primary-950 mb-1">Session & Year Management</h2>
        <p className="text-sm text-gray-500">Manage end-of-year operations like promoting students and purging old data.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
          {message.text}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Promotion Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center">
              <ArrowUpRight size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Promote Students</h3>
              <p className="text-sm text-gray-500">Start new academic year</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-800">
            <strong>What this does:</strong>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Increments every student's Class (e.g. Class 10 becomes 11).</li>
              <li>Marks Class 12 students as "Alumni".</li>
              <li><strong>Removes their current club membership</strong> so they must re-register and pay for the new year.</li>
            </ul>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
            <div className="flex items-center gap-3 text-gray-700 font-medium">
              <Users size={18} className="text-gray-400" />
              Total Registered Students
            </div>
            <div className="text-xl font-bold">{students.length}</div>
          </div>

          <div className="mt-auto flex justify-end">
            <Button onClick={handlePromote} className="bg-accent-500 hover:bg-accent-600 text-white w-full sm:w-auto">
              Promote All Students
            </Button>
          </div>
        </div>

        {/* Data Purge Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Trash2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Data Purge</h3>
              <p className="text-sm text-gray-500">Clean up old records</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-4 border border-gray-100 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900 mb-1">Purge Pending Registrations</p>
                <p className="text-xs text-gray-500">Deletes students who never completed payment.</p>
                <p className="text-sm font-medium text-amber-600 mt-2">
                  {students.filter(s => s.registrationStatus === 'Pending Payment').length} pending records
                </p>
              </div>
              <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={handlePurgePending}>
                Purge Pending
              </Button>
            </div>

            <div className="p-4 border border-gray-100 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900 mb-1">Clear Payment Logs</p>
                <p className="text-xs text-gray-500">Deletes all SSLCommerz & Cash transaction history.</p>
                <p className="text-sm font-medium text-gray-600 mt-2 flex items-center gap-1.5">
                  <CreditCard size={14}/> {payments.length} total logs
                </p>
              </div>
              <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={handleClearPayments}>
                Clear Payments
              </Button>
            </div>
          </div>
          
          <div className="mt-auto text-xs text-gray-400 bg-gray-50 p-3 rounded-lg text-center">
            Warning: These actions are permanent and cannot be undone.
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
