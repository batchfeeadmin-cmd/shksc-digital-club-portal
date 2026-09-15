import React from 'react';
import { Button } from '../ui/button';
import { ImageCropper } from '../ui/ImageCropper';

interface PersonalInfoFormProps {
  formData: any;
  updateData: (data: any) => void;
  onNext: () => void;
}

export function PersonalInfoForm({ formData, updateData, onNext }: PersonalInfoFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    updateData({ [e.target.name]: e.target.value });
  };

  const handleImageChange = (base64: string) => {
    updateData({ profilePicture: base64 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-heading font-bold text-primary-950 mb-6 pb-4 border-b border-gray-100">Student Information</h3>
      
      <div className="mb-8 border-b border-gray-100 pb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">Profile Picture (Passport Size)</label>
        <ImageCropper 
          value={formData.profilePicture} 
          onChange={handleImageChange} 
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
          <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID *</label>
          <input required type="text" name="studentId" value={formData.studentId} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Father's Name</label>
          <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mother's Name</label>
          <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth *</label>
          <input required type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
          <select required name="gender" value={formData.gender} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Class *</label>
          <select required name="class" value={formData.class} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white">
            <option value="">Select Class</option>
            {['8', '9', '10', '11', '12'].map(c => <option key={c} value={c}>Class {c}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Section</label>
            <input type="text" name="section" value={formData.section} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Roll No</label>
            <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number *</label>
          <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
          <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full p-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"></textarea>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <Button type="submit" size="lg">Continue to Club Selection</Button>
      </div>
    </form>
  );
}
