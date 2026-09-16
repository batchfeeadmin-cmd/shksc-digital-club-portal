import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SchoolLogo } from './components/ui/SchoolLogo';
import { HomePage } from './pages/HomePage';
import { ClubsPage } from './pages/ClubsPage';
import { RichClubPage } from './pages/RichClubPage';
import { ScienceClubPage } from './pages/ScienceClubPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { RegistrationControlPage } from './pages/admin/RegistrationControlPage';
import { FeeManagementPage } from './pages/admin/FeeManagementPage';
import { ApprovalsPage } from './pages/admin/ApprovalsPage';
import { ClubDashboardPage } from './pages/admin/ClubDashboardPage';
import { ClubInformationPage } from './pages/admin/ClubInformationPage';
import { ClubAchievementsPage } from './pages/admin/ClubAchievementsPage';
import { ClubGalleryPage } from './pages/admin/ClubGalleryPage';
import { ClubAdminsPage } from './pages/admin/ClubAdminsPage';
import { ClubFeePage } from './pages/admin/ClubFeePage';
import { ClubProfilePage } from './pages/admin/ClubProfilePage';
import { ClubStudentsPage } from './pages/admin/ClubStudentsPage';
import { ClubNoticesPage } from './pages/admin/ClubNoticesPage';
import { ClubRequestsPage } from './pages/admin/ClubRequestsPage';
import { ClubPaymentsPage } from './pages/admin/ClubPaymentsPage';
import { ClubEventsPage } from './pages/admin/ClubEventsPage';
import { ClubCommitteePage } from './pages/admin/ClubCommitteePage';
import { ClubCertificatesPage } from './pages/admin/ClubCertificatesPage';
import { ClubCommunicationsPage } from './pages/admin/ClubCommunicationsPage';
import { RootSubAdminsPage } from './pages/admin/RootSubAdminsPage';
import { RootStudentsPage } from './pages/admin/RootStudentsPage';
import { RootClubsPage } from './pages/admin/RootClubsPage';
import { RootPaymentsPage } from './pages/admin/RootPaymentsPage';
import { RootReportsPage } from './pages/admin/RootReportsPage';
import { RootActivityPage } from './pages/admin/RootActivityPage';
import { RootCMSPage } from './pages/admin/RootCMSPage';
import { RootDataPage } from './pages/admin/RootDataPage';
import { RootAcademicYearPage } from './pages/admin/RootAcademicYearPage';
import { RootCommunicationsPage } from './pages/admin/RootCommunicationsPage';
import { RootSettingsPage } from './pages/admin/RootSettingsPage';
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { StudentClubPage } from './pages/student/StudentClubPage';
import { StudentRegistrationPage } from './pages/student/StudentRegistrationPage';
import { StudentPaymentPage } from './pages/student/StudentPaymentPage';
import { StudentReceiptPage } from './pages/student/StudentReceiptPage';
import { StudentNoticesPage } from './pages/student/StudentNoticesPage';
import { LoginPage } from './pages/auth/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { SiteAnnouncement } from './components/SiteAnnouncement';

import { getSystemSettings } from './services/settings/settingsService';

const PublicLayout = () => {
  const settings = getSystemSettings();
  
  if (settings.maintenanceMode) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <SchoolLogo className="w-24 h-24 mb-6" />
        <h1 className="text-4xl font-heading font-bold text-primary-950 mb-4">Under Maintenance</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-8">{settings.maintenanceMessage}</p>
        <Link to="/login" className="text-sm font-bold text-primary-600 hover:text-primary-800">Admin Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <SiteAnnouncement />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/clubs" element={<ClubsPage />} />
            <Route path="/clubs/science" element={<ScienceClubPage />} />
            <Route path="/clubs/:clubSlug" element={<RichClubPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
          </Route>
          
          <Route path="/login" element={<LoginPage />} />

          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student/dashboard" element={<StudentDashboardPage />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
            <Route path="/student/club" element={<StudentClubPage />} />
            <Route path="/student/registration" element={<StudentRegistrationPage />} />
            <Route path="/student/payment" element={<StudentPaymentPage />} />
            <Route path="/student/receipt" element={<StudentReceiptPage />} />
            <Route path="/student/notices" element={<StudentNoticesPage />} />
          </Route>
          
          {/* Root Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['root_admin']} />}>
            <Route path="/admin/root/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/root/registration-control" element={<RegistrationControlPage />} />
            <Route path="/admin/root/fee-management" element={<FeeManagementPage />} />
            <Route path="/admin/root/sub-admins" element={<RootSubAdminsPage />} />
            <Route path="/admin/root/approvals" element={<ApprovalsPage />} />
            <Route path="/admin/root/club-admins" element={<ClubAdminsPage />} />
            <Route path="/admin/root/students" element={<RootStudentsPage />} />
            <Route path="/admin/root/clubs" element={<RootClubsPage />} />
            <Route path="/admin/root/payments" element={<RootPaymentsPage />} />
            <Route path="/admin/root/reports" element={<RootReportsPage />} />
            <Route path="/admin/root/data" element={<RootDataPage />} />
            <Route path="/admin/root/session" element={<RootAcademicYearPage />} />
            <Route path="/admin/root/communications" element={<RootCommunicationsPage />} />
            <Route path="/admin/root/settings" element={<RootSettingsPage />} />
            <Route path="/admin/root/activity" element={<RootActivityPage />} />
            <Route path="/admin/root/cms" element={<RootCMSPage />} />
          </Route>
          
          {/* Club Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['club_admin', 'root_admin']} />}>
            <Route path="/admin/club/dashboard" element={<ClubDashboardPage />} />
            <Route path="/admin/club/information" element={<ClubInformationPage />} />
            <Route path="/admin/club/achievements" element={<ClubAchievementsPage />} />
            <Route path="/admin/club/gallery" element={<ClubGalleryPage />} />
            <Route path="/admin/club/fees" element={<ClubFeePage />} />
            <Route path="/admin/club/profile" element={<ClubProfilePage />} />
            <Route path="/admin/club/students" element={<ClubStudentsPage />} />
            <Route path="/admin/club/notices" element={<ClubNoticesPage />} />
            <Route path="/admin/club/requests" element={<ClubRequestsPage />} />
            <Route path="/admin/club/payments" element={<ClubPaymentsPage />} />
            <Route path="/admin/club/events" element={<ClubEventsPage />} />
            <Route path="/admin/club/committee" element={<ClubCommitteePage />} />
            <Route path="/admin/club/certificates" element={<ClubCertificatesPage />} />
            <Route path="/admin/club/communications" element={<ClubCommunicationsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

