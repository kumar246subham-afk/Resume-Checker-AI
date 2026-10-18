import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Hammer,
  FileCheck2,
  Briefcase,
  Sparkles,
  Layers,
  Bot,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navigationItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'My Resumes', href: '/dashboard/resumes', icon: FileText },
    { name: 'Resume Builder', href: '/dashboard/builder', icon: Hammer },
    { name: 'Resume Checker', href: '/dashboard/checker', icon: FileCheck2 },
    { name: 'Job Matcher', href: '/dashboard/job-matcher', icon: Briefcase },
    { name: 'AI Resume Improver', href: '/dashboard/improver', icon: Sparkles },
    { name: 'Templates', href: '/dashboard/templates', icon: Layers },
    { name: 'AI Career Assistant', href: '/dashboard/career-assistant', icon: Bot },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const analysesUsed = user?.subscription?.analysesUsed || 0;
  const analysesLimit = user?.subscription?.analysesLimit || 15;
  const usagePercentage = Math.min(100, Math.round((analysesUsed / analysesLimit) * 100));

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#111827] text-white flex flex-col transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6D5EF7] to-[#14B8A6] flex items-center justify-center text-white font-bold">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              Resume Checker <span className="text-[#6D5EF7] text-xs">AI</span>
            </span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors
                ${isActive 
                  ? 'bg-[#6D5EF7] text-white shadow-sm shadow-violet-500/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Usage status card */}
        <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
          <div className="flex justify-between items-center mb-1 text-slate-300 font-semibold">
            <span>Free Tier Usage</span>
            <span className="text-violet-400 font-bold">{analysesUsed}/{analysesLimit}</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
            <div 
              className="bg-gradient-to-r from-violet-500 to-teal-400 h-full rounded-full transition-all"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Comprehensive ATS checks and AI rewrites included.
          </p>
        </div>

        {/* User bar */}
        <div className="p-3 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500 text-violet-300 font-bold text-xs flex items-center justify-center shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
              <Link to="/dashboard" className="hover:text-slate-800">Platform</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-800 font-semibold capitalize">
                {window.location.pathname.split('/').pop() || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/checker"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 text-[#6D5EF7] border border-violet-200 hover:bg-violet-100 transition"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              Quick Check
            </Link>

            <Link
              to="/dashboard/builder"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#6D5EF7] text-white hover:bg-[#5A4BE0] transition shadow-sm"
            >
              <Hammer className="w-3.5 h-3.5" />
              Create Resume
            </Link>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
