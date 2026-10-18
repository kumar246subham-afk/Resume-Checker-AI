import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FileCheck2, 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  Sparkles, 
  Settings 
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();

  const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/signup');
  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6D5EF7] to-[#14B8A6] flex items-center justify-center text-white shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-[#111827] flex items-center gap-1.5">
                Resume Checker <span className="text-[#6D5EF7] text-xs font-bold px-1.5 py-0.5 rounded bg-violet-50 border border-violet-100">AI</span>
              </span>
              <span className="text-[10px] font-medium text-[#64748B] -mt-1 hidden sm:block">
                Build Smarter. Apply Better.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#64748B]">
            <a href="/#features" className="hover:text-[#6D5EF7] transition">Features</a>
            <a href="/#how-it-works" className="hover:text-[#6D5EF7] transition">How It Works</a>
            <a href="/#templates" className="hover:text-[#6D5EF7] transition">Templates</a>
            <a href="/#pricing" className="hover:text-[#6D5EF7] transition">Pricing</a>
            <a href="/#faq" className="hover:text-[#6D5EF7] transition">FAQ</a>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200 hover:border-violet-300 hover:bg-slate-50 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-violet-100 text-[#6D5EF7] flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-[#111827] max-w-[120px] truncate">
                    {user?.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-scale-up"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-[#111827]">{user?.name}</p>
                      <p className="text-[11px] text-[#64748B] truncate">{user?.email}</p>
                    </div>

                    <Link 
                      to="/dashboard" 
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-violet-50 hover:text-[#6D5EF7]"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>

                    <Link 
                      to="/dashboard/resumes" 
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-violet-50 hover:text-[#6D5EF7]"
                    >
                      <FileText className="w-4 h-4" />
                      My Resumes
                    </Link>

                    <Link 
                      to="/dashboard/settings" 
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-violet-50 hover:text-[#6D5EF7]"
                    >
                      <Settings className="w-4 h-4" />
                      Account Settings
                    </Link>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-[#111827] hover:text-[#6D5EF7] transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#6D5EF7] to-[#5A4BE0] hover:from-[#5A4BE0] hover:to-[#4839C7] rounded-lg shadow-sm shadow-violet-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-black hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <a href="/#features" onClick={() => setMobileMenuOpen(false)} className="py-1">Features</a>
            <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-1">How It Works</a>
            <a href="/#templates" onClick={() => setMobileMenuOpen(false)} className="py-1">Templates</a>
            <a href="/#pricing" onClick={() => setMobileMenuOpen(false)} className="py-1">Pricing</a>
            <a href="/#faq" onClick={() => setMobileMenuOpen(false)} className="py-1">FAQ</a>
          </nav>
          
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs font-bold text-white bg-[#6D5EF7] rounded-lg"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-center py-2 text-xs font-semibold text-rose-600 border border-rose-200 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs font-bold text-white bg-[#6D5EF7] rounded-lg"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
