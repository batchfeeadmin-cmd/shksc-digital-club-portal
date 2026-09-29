import React, { useState } from 'react';
import { Button } from '../ui/button';
import { ImageCropper } from '../ui/ImageCropper';
import { getUserByEmail } from '../../services/auth/userService';
import { getStudentByEmail } from '../../services/students/studentService';
import { AlertCircle, BadgeCheck, LockKeyhole } from 'lucide-react';

interface PersonalInfoFormProps {
  formData: any;
  updateData: (data: any) => void;
  onNext: () => void;
}

export function PersonalInfoForm({ formData, updateData, onNext }: PersonalInfoFormProps) {
  const [accountError, setAccountError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    updateData({ [e.target.name]: e.target.value });
    if (['email', 'password', 'confirmPassword'].includes(e.target.name)) {
      setAccountError('');
    }
  };

  const handleImageChange = (base64: string) => {
    updateData({ profilePicture: base64 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = formData.email.trim().toLowerCase();
    if (getUserByEmail(normalizedEmail) || getStudentByEmail(normalizedEmail)) {
      setAccountError('This email is already connected to a portal account or registration.');
      return;
    }

    if (formData.password.length < 8) {
      setAccountError('Password must contain at least 8 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setAccountError('Password and confirmation do not match.');
      return;
    }

    updateData({ email: normalizedEmail });
    setAccountError('');
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-heading font-bold text-primary-950 mb-6 pb-4 border-b border-gray-100">Student Information</h3>

      <div className="rounded-xl border border-primary-100 bg-primary-50 p-4">
        <div className="flex items-start gap-3">
          <BadgeCheck className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-primary-950">Student ID is generated automatically</p>
            <p className="text-xs mt-1 text-primary-700">
              Complete your admission information below. After submission, the portal will create your unique Student ID automatically.
            </p>
          </div>
        </div>
      </div>

      {accountError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 flex items-start gap-3" role="alert">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold">Portal account could not be prepared</p>
            <p className="text-sm mt-1">{accountError}</p>
          </div>
        </div>
      )}

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
            <label className="block text-sm font-semibold text-gray-700 mb-2">Student Roll *</label>
            <input required type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} placeholder="e.g. 12" className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number *</label>
          <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
        </div>

        <div className="md:col-span-2 rounded-xl border border-gray-200 bg-slate-50 p-5">
          <div className="flex items-start gap-3 mb-5">
            <LockKeyhole className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-primary-950">Create your Student Portal login</p>
              <p className="text-xs text-gray-500 mt-1">Your account will activate automatically after successful payment.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
              <input required minLength={8} type="password" name="password" value={formData.password} onChange={handleChange} autoComplete="new-password" className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password *</label>
              <input required minLength={8} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} autoComplete="new-password" className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white" />
            </div>
          </div>
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
