import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
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
import { RootStudentsPage } from './pages/admin/RootStudentsPage';
import { RootClubsPage } from './pages/admin/RootClubsPage';
import { RootPaymentsPage } from './pages/admin/RootPaymentsPage';
import { RootReportsPage } from './pages/admin/RootReportsPage';
import { RootActivityPage } from './pages/admin/RootActivityPage';
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { LoginPage } from './pages/auth/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const PublicLayout = () => (
  <div className="min-h-screen bg-surface flex flex-col">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

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
          </Route>
          
          {/* Root Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['root_admin']} />}>
            <Route path="/admin/root/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/root/registration-control" element={<RegistrationControlPage />} />
            <Route path="/admin/root/fee-management" element={<FeeManagementPage />} />
            <Route path="/admin/root/approvals" element={<ApprovalsPage />} />
            <Route path="/admin/root/club-admins" element={<ClubAdminsPage />} />
            <Route path="/admin/root/students" element={<RootStudentsPage />} />
            <Route path="/admin/root/clubs" element={<RootClubsPage />} />
            <Route path="/admin/root/payments" element={<RootPaymentsPage />} />
            <Route path="/admin/root/reports" element={<RootReportsPage />} />
            <Route path="/admin/root/activity" element={<RootActivityPage />} />
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
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

