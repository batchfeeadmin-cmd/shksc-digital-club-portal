import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StepIndicator } from '../components/registration/StepIndicator';
import { PersonalInfoForm } from '../components/registration/PersonalInfoForm';
import { ClubSelectionForm } from '../components/registration/ClubSelectionForm';
import { ReviewCard } from '../components/registration/ReviewCard';
import { SuccessScreen } from '../components/registration/SuccessScreen';
import { Student } from '../types';
import { addStudent } from '../services/students/studentService';

export function RegistrationPage() {
  const [searchParams] = useSearchParams();
  const preselectedClub = searchParams.get('club') || '';

  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedStudent, setSubmittedStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: '',
    class: '',
    section: '',
    rollNumber: '',
    studentId: '',
    mobile: '',
    email: '',
    address: '',
    selectedClubId: preselectedClub,
    profilePicture: ''
  });

  const updateFormData = (newData: any) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmitFinal = () => {
    // Save the application as a student record with Pending Payment status
    const student = addStudent({
      id: `stu-${Date.now()}`,
      studentId: '',
      name: formData.fullName,
      class: formData.class,
      roll: formData.rollNumber,
      mobile: formData.mobile,
      email: formData.email,
      clubId: formData.selectedClubId,
      registrationStatus: 'Pending Payment',
      profilePicture: formData.profilePicture
    });
    setSubmittedStudent(student);
    setIsSuccess(true);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-surface-sec pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {!isSuccess && (
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary-950 mb-4">
              Club Registration
            </h1>
            <p className="text-gray-600">
              Complete the steps below to apply for club membership.
            </p>
          </div>
        )}

        {!isSuccess && <StepIndicator currentStep={currentStep} />}

        <div className="mt-8">
          {isSuccess && submittedStudent ? (
            <SuccessScreen formData={formData} submittedStudent={submittedStudent} />
          ) : (
            <>
              {currentStep === 1 && (
                <PersonalInfoForm 
                  formData={formData} 
                  updateData={updateFormData} 
                  onNext={handleNext} 
                />
              )}
              {currentStep === 2 && (
                <ClubSelectionForm 
                  formData={formData} 
                  updateData={updateFormData} 
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {currentStep === 3 && (
                <ReviewCard 
                  formData={formData} 
                  onNext={handleSubmitFinal}
                  onEdit={() => setCurrentStep(1)}
                />
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
