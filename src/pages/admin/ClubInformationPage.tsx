import React, { useEffect, useState } from 'react';
import { ClubAdminLayout } from '../../components/admin/ClubAdminLayout';
import { useClubsData, useUpdateRequests } from '../../hooks/useAdminData';
import { Button } from '../../components/ui/button';
import { Send, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function ClubInformationPage() {
  const { user } = useAuth();
  const { clubs } = useClubsData();
  const { requests, saveRequests } = useUpdateRequests();

  const club = clubs.find(c => c.id === user?.clubId);

  const [formData, setFormData] = useState({
    name: club?.name || '',
    shortDescription: club?.shortDescription || '',
    fullDescription: club?.fullDescription || '',
    mission: club?.mission || '',
    vision: club?.vision || '',
    coordinatorName: club?.coordinator?.name || '',
    coordinatorRole: club?.coordinator?.role || ''
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (club) {
      setFormData({
        name: club.name,
        shortDescription: club.shortDescription,
        fullDescription: club.fullDescription || '',
        mission: club.mission || '',
        vision: club.vision || '',
        coordinatorName: club.coordinator?.name || '',
        coordinatorRole: club.coordinator?.role || ''
      });
    }
  }, [club]);

  const pendingRequest = user
    ? requests.find(r => r.clubId === user.clubId && r.type === 'Information Update' && r.status === 'Pending')
    : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!club) return;

    const newRequest = {
      id: `req-${Date.now()}`,
      clubId: club.id,
      clubName: club.name,
      type: 'Information Update' as const,
      status: 'Pending' as const,
      requestDate: new Date().toISOString(),
      data: formData
    };

    saveRequests([...requests, newRequest]);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <ClubAdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-primary-950">Club Information</h2>
        <p className="text-sm text-gray-500">
          {club?.name || 'Your club'} — edit details and submit an update request to Root Admin.
        </p>
      </div>

      {pendingRequest && (
        <div className="max-w-4xl mb-6 bg-orange-50 border border-orange-200 rounded-2xl p-6">
          <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
            <Clock size={18} /> Information update request pending
          </h4>
          <p className="text-sm text-orange-700">
            Your changes are awaiting Root Admin approval. Once approved, they go live on the public club page.
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Club Name</label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description</label>
              <input 
                name="shortDescription" 
                value={formData.shortDescription} 
                onChange={handleChange} 
                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Description</label>
            <textarea 
              name="fullDescription" 
              value={formData.fullDescription} 
              onChange={handleChange} 
              rows={4}
              className="w-full p-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 outline-none" 
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mission</label>
              <textarea 
                name="mission" 
                value={formData.mission} 
                onChange={handleChange} 
                rows={3}
                className="w-full p-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vision</label>
              <textarea 
                name="vision" 
                value={formData.vision} 
                onChange={handleChange} 
                rows={3}
                className="w-full p-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 outline-none" 
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Coordinator Name</label>
              <input 
                name="coordinatorName" 
                value={formData.coordinatorName} 
                onChange={handleChange} 
                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Coordinator Role</label>
              <input 
                name="coordinatorRole" 
                value={formData.coordinatorRole} 
                onChange={handleChange} 
                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 outline-none" 
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
            {submitted && (
              <span className="text-green-600 flex items-center gap-1 text-sm font-medium animate-in fade-in">
                <CheckCircle2 size={16} /> Request sent to Root Admin
              </span>
            )}
            <Button type="submit" size="lg" disabled={!!pendingRequest} className="bg-primary-900 text-white hover:bg-primary-800 gap-2">
              <Send size={18} /> Submit Update Request
            </Button>
          </div>
        </form>
      </div>
    </ClubAdminLayout>
  );
}
