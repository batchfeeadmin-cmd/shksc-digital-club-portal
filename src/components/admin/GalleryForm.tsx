import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Send, CheckCircle2 } from 'lucide-react';
import { useUpdateRequests } from '../../hooks/useAdminData';

interface GalleryFormProps {
  clubId: string;
  clubName: string;
}

export function GalleryForm({ clubId, clubName }: GalleryFormProps) {
  const { requests, saveRequests } = useUpdateRequests();
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    image: '',
    caption: '',
    eventName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRequest = {
      id: `req-${Date.now()}`,
      clubId,
      clubName,
      type: 'Gallery Update' as const,
      status: 'Pending' as const,
      requestDate: new Date().toISOString(),
      data: formData
    };

    saveRequests([...requests, newRequest]);
    setSubmitted(true);
    setFormData({ image: '', caption: '', eventName: '' });
    
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="font-heading font-bold text-lg text-primary-950 mb-2">Submit New Gallery Image</h3>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL *</label>
        <input required name="image" value={formData.image} onChange={handleChange} placeholder="https://" className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 outline-none" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Caption</label>
        <input required name="caption" value={formData.caption} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 outline-none" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Event Name</label>
        <input required name="eventName" value={formData.eventName} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 outline-none" />
      </div>

      <div className="pt-4 flex items-center justify-end gap-4">
        {submitted && <span className="text-green-600 flex items-center gap-1 text-sm font-medium"><CheckCircle2 size={16} /> Submitted for approval</span>}
        <Button type="submit" className="bg-primary-900 text-white hover:bg-primary-800"><Send size={16} className="mr-2" /> Submit Photo</Button>
      </div>
    </form>
  );
}
