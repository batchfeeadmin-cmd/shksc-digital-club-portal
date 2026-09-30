import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SchoolLogo } from './components/ui/SchoolLogo';
const lazyNamed = (loader: () => Promise<any>, name: string) =>
  lazy(() => loader().then(module => ({ default: module[name] })));

const HomePage = lazyNamed(() => import('./pages/HomePage'), 'HomePage');
const ClubsPage = lazyNamed(() => import('./pages/ClubsPage'), 'ClubsPage');
const RichClubPage = lazyNamed(() => import('./pages/RichClubPage'), 'RichClubPage');
const ScienceClubPage = lazyNamed(() => import('./pages/ScienceClubPage'), 'ScienceClubPage');
const RegistrationPage = lazyNamed(() => import('./pages/RegistrationPage'), 'RegistrationPage');
const AdminDashboardPage = lazyNamed(() => import('./pages/admin/AdminDashboardPage'), 'AdminDashboardPage');
const RegistrationControlPage = lazyNamed(() => import('./pages/admin/RegistrationControlPage'), 'RegistrationControlPage');
const FeeManagementPage = lazyNamed(() => import('./pages/admin/FeeManagementPage'), 'FeeManagementPage');
const ApprovalsPage = lazyNamed(() => import('./pages/admin/ApprovalsPage'), 'ApprovalsPage');
const ClubDashboardPage = lazyNamed(() => import('./pages/admin/ClubDashboardPage'), 'ClubDashboardPage');
const ClubInformationPage = lazyNamed(() => import('./pages/admin/ClubInformationPage'), 'ClubInformationPage');
const ClubAchievementsPage = lazyNamed(() => import('./pages/admin/ClubAchievementsPage'), 'ClubAchievementsPage');
const ClubGalleryPage = lazyNamed(() => import('./pages/admin/ClubGalleryPage'), 'ClubGalleryPage');
const ClubAdminsPage = lazyNamed(() => import('./pages/admin/ClubAdminsPage'), 'ClubAdminsPage');
const ClubFeePage = lazyNamed(() => import('./pages/admin/ClubFeePage'), 'ClubFeePage');
const ClubProfilePage = lazyNamed(() => import('./pages/admin/ClubProfilePage'), 'ClubProfilePage');
const ClubStudentsPage = lazyNamed(() => import('./pages/admin/ClubStudentsPage'), 'ClubStudentsPage');
const ClubNoticesPage = lazyNamed(() => import('./pages/admin/ClubNoticesPage'), 'ClubNoticesPage');
const ClubRequestsPage = lazyNamed(() => import('./pages/admin/ClubRequestsPage'), 'ClubRequestsPage');
const ClubPaymentsPage = lazyNamed(() => import('./pages/admin/ClubPaymentsPage'), 'ClubPaymentsPage');
const ClubEventsPage = lazyNamed(() => import('./pages/admin/ClubEventsPage'), 'ClubEventsPage');
const ClubCommitteePage = lazyNamed(() => import('./pages/admin/ClubCommitteePage'), 'ClubCommitteePage');
const ClubCertificatesPage = lazyNamed(() => import('./pages/admin/ClubCertificatesPage'), 'ClubCertificatesPage');
const ClubCommunicationsPage = lazyNamed(() => import('./pages/admin/ClubCommunicationsPage'), 'ClubCommunicationsPage');
const RootSubAdminsPage = lazyNamed(() => import('./pages/admin/RootSubAdminsPage'), 'RootSubAdminsPage');
const RootStudentsPage = lazyNamed(() => import('./pages/admin/RootStudentsPage'), 'RootStudentsPage');
const RootClubsPage = lazyNamed(() => import('./pages/admin/RootClubsPage'), 'RootClubsPage');
const RootPaymentsPage = lazyNamed(() => import('./pages/admin/RootPaymentsPage'), 'RootPaymentsPage');
const RootFinancePage = lazyNamed(() => import('./pages/admin/RootFinancePage'), 'RootFinancePage');
const ClubFinancePage = lazyNamed(() => import('./pages/admin/ClubFinancePage'), 'ClubFinancePage');
const RootDiscountsPage = lazyNamed(() => import('./pages/admin/RootDiscountsPage'), 'RootDiscountsPage');
const ClubDiscountsPage = lazyNamed(() => import('./pages/admin/ClubDiscountsPage'), 'ClubDiscountsPage');
const ClubBatchesPage = lazyNamed(() => import('./pages/admin/ClubBatchesPage'), 'ClubBatchesPage');
const RootBatchesPage = lazyNamed(() => import('./pages/admin/RootBatchesPage'), 'RootBatchesPage');
const RootReportsPage = lazyNamed(() => import('./pages/admin/RootReportsPage'), 'RootReportsPage');
const RootActivityPage = lazyNamed(() => import('./pages/admin/RootActivityPage'), 'RootActivityPage');
const RootCMSPage = lazyNamed(() => import('./pages/admin/RootCMSPage'), 'RootCMSPage');
const RootDataPage = lazyNamed(() => import('./pages/admin/RootDataPage'), 'RootDataPage');
const RootAcademicYearPage = lazyNamed(() => import('./pages/admin/RootAcademicYearPage'), 'RootAcademicYearPage');
const RootCommunicationsPage = lazyNamed(() => import('./pages/admin/RootCommunicationsPage'), 'RootCommunicationsPage');
const RootSettingsPage = lazyNamed(() => import('./pages/admin/RootSettingsPage'), 'RootSettingsPage');
const StudentDashboardPage = lazyNamed(() => import('./pages/student/StudentDashboardPage'), 'StudentDashboardPage');
const StudentProfilePage = lazyNamed(() => import('./pages/student/StudentProfilePage'), 'StudentProfilePage');
const StudentClubPage = lazyNamed(() => import('./pages/student/StudentClubPage'), 'StudentClubPage');
const StudentRegistrationPage = lazyNamed(() => import('./pages/student/StudentRegistrationPage'), 'StudentRegistrationPage');
const StudentPaymentPage = lazyNamed(() => import('./pages/student/StudentPaymentPage'), 'StudentPaymentPage');
const StudentReceiptPage = lazyNamed(() => import('./pages/student/StudentReceiptPage'), 'StudentReceiptPage');
const StudentNoticesPage = lazyNamed(() => import('./pages/student/StudentNoticesPage'), 'StudentNoticesPage');
const LoginPage = lazyNamed(() => import('./pages/auth/LoginPage'), 'LoginPage');
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { NotFoundPage } from './pages/NotFoundPage';

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
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm font-semibold text-primary-700">Loading portal…</div>}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/clubs" element={<ClubsPage />} />
            <Route path="/clubs/science" element={<ScienceClubPage />} />
            <Route path="/clubs/:clubSlug" element={<RichClubPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="*" element={<NotFoundPage />} />
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
          <Route element={<ProtectedRoute allowedRoles={['root_admin', 'sub_admin']} />}>
            <Route path="/admin/root/dashboard" element={<AdminDashboardPage />} />

            <Route element={<ProtectedRoute requireRoot />}>
              <Route path="/admin/root/registration-control" element={<RegistrationControlPage />} />
              <Route path="/admin/root/sub-admins" element={<RootSubAdminsPage />} />
              <Route path="/admin/root/settings" element={<RootSettingsPage />} />
              <Route path="/admin/root/discounts" element={<RootDiscountsPage />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="students_clubs" />}>
              <Route path="/admin/root/approvals" element={<ApprovalsPage />} />
              <Route path="/admin/root/club-admins" element={<ClubAdminsPage />} />
              <Route path="/admin/root/students" element={<RootStudentsPage />} />
              <Route path="/admin/root/clubs" element={<RootClubsPage />} />
              <Route path="/admin/root/session" element={<RootAcademicYearPage />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="payments" />}>
              <Route path="/admin/root/fee-management" element={<FeeManagementPage />} />
              <Route path="/admin/root/payments" element={<RootPaymentsPage />} />
              <Route path="/admin/root/finance" element={<RootFinancePage />} />
              <Route path="/admin/root/batches" element={<RootBatchesPage />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="reports" />}>
              <Route path="/admin/root/reports" element={<RootReportsPage />} />
              <Route path="/admin/root/activity" element={<RootActivityPage />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="communications" />}>
              <Route path="/admin/root/communications" element={<RootCommunicationsPage />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="data" />}>
              <Route path="/admin/root/data" element={<RootDataPage />} />
            </Route>

            <Route element={<ProtectedRoute requiredPermission="cms" />}>
              <Route path="/admin/root/cms" element={<RootCMSPage />} />
            </Route>
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
            <Route path="/admin/club/finance" element={<ClubFinancePage />} />
            <Route path="/admin/club/discounts" element={<ClubDiscountsPage />} />
            <Route path="/admin/club/batches" element={<ClubBatchesPage />} />
            <Route path="/admin/club/events" element={<ClubEventsPage />} />
            <Route path="/admin/club/committee" element={<ClubCommitteePage />} />
            <Route path="/admin/club/certificates" element={<ClubCertificatesPage />} />
            <Route path="/admin/club/communications" element={<ClubCommunicationsPage />} />
          </Route>
        </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
