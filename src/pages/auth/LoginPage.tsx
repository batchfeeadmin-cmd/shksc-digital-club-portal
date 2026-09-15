import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { SchoolLogo } from '../../components/ui/SchoolLogo';
import { Lock, Mail, LogIn, ArrowLeft } from 'lucide-react';
import { getUserByEmail } from '../../services/auth/userService';
import { getClubs } from '../../services/clubs/clubService';

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const clubAdminAccount = getUserByEmail('science@shksc.edu');
  const clubAdminClubName = getClubs().find(c => c.id === clubAdminAccount?.clubId)?.name || 'Club';

  if (user) {
    if (user.role === 'root_admin') return <Navigate to="/admin/root/dashboard" replace />;
    if (user.role === 'club_admin') return <Navigate to="/admin/club/dashboard" replace />;
    if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      login(email, password);
    } catch (err) {
      setError('Invalid email or password. Try the demo accounts below.');
    }
  };

  // One-click demo login — fills nothing, signs in directly
  const demoLogin = (demoEmail: string, demoPassword: string) => {
    setError('');
    try {
      login(demoEmail, demoPassword);
    } catch (err) {
      setError('Demo account unavailable.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface">
      {/* Left branding area */}
      <div className="hidden md:flex flex-col justify-center w-1/2 bg-primary-950 text-white p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-800 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-600 rounded-full blur-3xl opacity-20 -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10 max-w-lg mx-auto">
          <Link to="/" className="block group w-fit">
            <SchoolLogo className="w-20 h-20 bg-white rounded-2xl shadow-xl mb-8 group-hover:scale-105 transition-transform duration-300" />
            <h1 className="text-5xl font-heading font-bold mb-6 leading-tight group-hover:text-primary-50 transition-colors">
              SHKSC Digital<br/><span className="text-accent-400">Club Portal</span>
            </h1>
          </Link>
          <p className="text-primary-200 text-lg leading-relaxed max-w-md">
            A premium institutional management system for exploring, registering, and managing student clubs seamlessly.
          </p>
        </div>
      </div>

      {/* Right login area */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-12 lg:p-24 bg-white relative">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="md:hidden flex items-center gap-4 mb-10 group w-fit">
             <SchoolLogo className="w-12 h-12 bg-white rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300" />
             <h2 className="font-heading font-bold text-2xl text-primary-950 leading-tight">SHKSC Digital<br/>Club Portal</h2>
          </Link>

          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-800 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <h2 className="text-3xl font-heading font-bold text-primary-950 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-8">Sign in to access your dashboard.</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 mb-10">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email / Student ID</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full bg-primary-950 text-white hover:bg-primary-900 rounded-xl h-12 text-base font-bold shadow-md tracking-wide">
              Sign In
            </Button>
          </form>

          {/* Demo Accounts Wrapper */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Demo Accounts</span>
            </div>
          </div>
          
          <div className="grid gap-3 mt-8">
            <button type="button" onClick={() => demoLogin('admin@shksc.edu', 'admin123')} className="group flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-left">
              <span className="flex items-center gap-2 font-bold text-primary-950 group-hover:text-primary-800 text-sm">
                <LogIn className="w-4 h-4 text-accent-500" /> Root Admin
              </span>
              <span className="text-gray-500 text-xs font-mono font-medium bg-gray-100 px-2 py-1 rounded-md">admin@shksc.edu</span>
            </button>
            <button type="button" onClick={() => demoLogin('science@shksc.edu', 'club123')} className="group flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-left">
              <span className="flex items-center gap-2 font-bold text-primary-950 group-hover:text-primary-800 text-sm">
                <LogIn className="w-4 h-4 text-accent-500" /> Club Admin
                <span className="text-[10px] font-bold text-accent-600 bg-accent-50 border border-accent-100 px-1.5 py-0.5 rounded">{clubAdminClubName}</span>
              </span>
              <span className="text-gray-500 text-xs font-mono font-medium bg-gray-100 px-2 py-1 rounded-md">science@shksc.edu</span>
            </button>
            <button type="button" onClick={() => demoLogin('student@shksc.edu', 'student123')} className="group flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-left">
              <span className="flex items-center gap-2 font-bold text-primary-950 group-hover:text-primary-800 text-sm">
                <LogIn className="w-4 h-4 text-accent-500" /> Student
              </span>
              <span className="text-gray-500 text-xs font-mono font-medium bg-gray-100 px-2 py-1 rounded-md">student@shksc.edu</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
