import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
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
  ChevronLeft,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Mobile drawer state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Desktop sidebar collapsed/expanded state persisted in localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('resume_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('resume_sidebar_collapsed', String(next));
      } catch (err) {
        console.warn('Could not persist sidebar preference', err);
      }
      return next;
    });
  };

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  // 9 navigation items strictly preserved in their original order with individual icon animations
  const navigationItems = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      exact: true,
      iconAnim: 'group-hover:scale-110 group-hover:brightness-125'
    },
    {
      name: 'My Resumes',
      href: '/dashboard/resumes',
      icon: FileText,
      iconAnim: 'group-hover:-translate-y-0.5 group-hover:scale-105'
    },
    {
      name: 'Resume Builder',
      href: '/dashboard/builder',
      icon: Hammer,
      iconAnim: 'group-hover:-rotate-12 group-hover:scale-110 origin-bottom-left'
    },
    {
      name: 'Resume Checker',
      href: '/dashboard/checker',
      icon: FileCheck2,
      iconAnim: 'group-hover:-translate-y-0.5 group-hover:scale-110'
    },
    {
      name: 'Job Matcher',
      href: '/dashboard/job-matcher',
      icon: Briefcase,
      iconAnim: 'group-hover:-translate-y-0.5 group-hover:scale-105'
    },
    {
      name: 'AI Resume Improver',
      href: '/dashboard/improver',
      icon: Sparkles,
      iconAnim: 'group-hover:scale-120 group-hover:rotate-12'
    },
    {
      name: 'Templates',
      href: '/dashboard/templates',
      icon: Layers,
      iconAnim: 'group-hover:-translate-y-1 group-hover:scale-105'
    },
    {
      name: 'AI Career Assistant',
      href: '/dashboard/career-assistant',
      icon: Bot,
      iconAnim: 'group-hover:scale-115 group-hover:-translate-y-0.5'
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      iconAnim: 'group-hover:rotate-45 group-hover:scale-105'
    }
  ];

  // Helper to reliably check active state based on React Router location
  const isItemActive = (item) => {
    if (item.exact) {
      return location.pathname === item.href || location.pathname === `${item.href}/`;
    }
    return location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
  };

  // Find active item for page breadcrumb
  const currentActiveItem = navigationItems.find(isItemActive) || { name: 'Dashboard' };

  const analysesUsed = user?.subscription?.analysesUsed || 0;
  const analysesLimit = user?.subscription?.analysesLimit || 15;
  const usagePercentage = Math.min(100, Math.round((analysesUsed / analysesLimit) * 100));

  return (
    <div className="min-h-screen bg-[#080D1B] text-[#F4F6FF] flex overflow-x-hidden">
      
      {/* Mobile Drawer Backdrop with Blur */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#080D1B]/80 backdrop-blur-md lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Premium Dark SaaS Sidebar (Option A + Option C Studio Theme) */}
      <aside
        className={`no-print fixed top-0 bottom-0 left-0 z-50 bg-[#0B1120] text-[#F4F6FF] border-r border-[rgba(166,184,225,0.16)] flex flex-col transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:static
          ${sidebarOpen ? 'translate-x-0 w-72 max-w-[85vw]' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-[80px]' : 'lg:w-68'}
        `}
      >
        {/* Brand Header with Subtle Dark Gradient */}
        <div className={`h-16 flex items-center border-b border-[rgba(166,184,225,0.16)] px-4 bg-gradient-to-b from-[#141E33]/60 via-[#101A2D]/40 to-transparent relative ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}>
          <Link
            to="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7865FF] rounded-xl"
            title="Resume Checker AI Home"
          >
            {/* Logo Mark with Gradient and Hover Scale */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7865FF] via-[#4285FF] to-[#35D9E8] p-0.5 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(120,101,255,0.45)] transition-all duration-200">
              <div className="w-full h-full bg-[#0B1120] rounded-[10px] flex items-center justify-center">
                <FileCheck2 className="w-5 h-5 text-[#35D9E8] group-hover:text-white transition-colors" />
              </div>
            </div>

            {/* Brand Title (hidden when collapsed on desktop) */}
            <div className={`flex flex-col transition-opacity duration-200 ${isCollapsed ? 'lg:hidden' : 'block'}`}>
              <span className="font-extrabold text-[16px] tracking-tight text-[#F4F6FF] whitespace-nowrap leading-tight">
                Resume Checker <span className="bg-gradient-to-r from-[#7865FF] to-[#35D9E8] bg-clip-text text-transparent text-sm font-black">AI</span>
              </span>
              <span className="text-[11px] text-[#8D9AB5] font-semibold tracking-wider uppercase">
                Career Studio
              </span>
            </div>
          </Link>

          {/* Controls: Close (mobile) & Collapse Toggle (desktop) */}
          <div className="flex items-center gap-1">
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#B5C0D6] hover:text-white p-1.5 rounded-lg hover:bg-[#141E33] transition"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Collapse / Expand Toggle Button */}
            {!isCollapsed && (
              <button
                onClick={toggleCollapsed}
                type="button"
                className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-[#B5C0D6] hover:text-[#F4F6FF] hover:bg-[#141E33] border border-transparent hover:border-[rgba(166,184,225,0.16)] transition"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Collapsed Mode Expand Button Pill (When collapsed on desktop) */}
        {isCollapsed && (
          <div className="hidden lg:flex justify-center py-2.5 border-b border-[rgba(166,184,225,0.12)]">
            <button
              onClick={toggleCollapsed}
              type="button"
              className="w-9 h-8 rounded-lg text-[#B5C0D6] hover:text-[#F4F6FF] hover:bg-[#141E33] border border-transparent hover:border-[rgba(166,184,225,0.16)] flex items-center justify-center transition"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation List with Medium Typography and Interactive Hover */}
        <nav
          className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800"
          aria-label="Main Navigation"
        >
          {navigationItems.map((item) => {
            const isActive = isItemActive(item);

            return (
              <div key={item.name} className="relative group">
                <NavLink
                  to={item.href}
                  end={item.exact}
                  onClick={() => setSidebarOpen(false)}
                  className={`relative flex items-center rounded-xl text-[14px] sm:text-[15px] font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7865FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1120] ${
                    isCollapsed
                      ? 'lg:justify-center lg:px-0 lg:py-3 px-3.5 py-3 gap-3.5'
                      : 'px-3.5 py-3 gap-3.5'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-[#7865FF] to-[#4285FF] text-white font-semibold shadow-[0_4px_20px_rgba(120,101,255,0.4)] border border-[#7865FF]/50'
                      : 'text-[#B5C0D6] hover:text-[#F4F6FF] hover:bg-[#141E33] hover:border-[rgba(166,184,225,0.16)] hover:shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:translate-x-1 hover:scale-[1.015] border border-transparent'
                  }`}
                >
                  {/* Active Left Indicator Bar */}
                  {isActive && (
                    <span
                      className="absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.85)]"
                      aria-hidden="true"
                    />
                  )}

                  {/* Icon with Custom Micro-Animation on Hover */}
                  <item.icon
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 ease-out ${
                      isActive ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]' : ''
                    } ${item.iconAnim}`}
                    aria-hidden="true"
                  />

                  {/* Label (hidden in collapsed mode on desktop) */}
                  <span
                    className={`truncate whitespace-nowrap transition-colors duration-200 ${
                      isCollapsed ? 'lg:hidden' : 'block'
                    }`}
                  >
                    {item.name}
                  </span>
                </NavLink>

                {/* Accessible Floating Tooltip in Collapsed Desktop Mode */}
                {isCollapsed && (
                  <div
                    role="tooltip"
                    className="hidden lg:block absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3.5 py-2 bg-[#192640] text-[#F4F6FF] text-[13px] font-semibold rounded-lg shadow-2xl border border-[rgba(166,184,225,0.2)] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 shadow-[0_8px_25px_rgba(0,0,0,0.6)]"
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.name}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#35D9E8] shadow-[0_0_6px_#35D9E8]" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Free Tier Usage Status Card */}
        <div className="p-3 mx-2 mb-2">
          {isCollapsed ? (
            // Compact Miniature Gauge in Collapsed Mode
            <div
              className="hidden lg:flex flex-col items-center justify-center p-2 rounded-xl bg-[#141E33] border border-[rgba(166,184,225,0.16)] hover:border-[#7865FF]/40 transition group relative cursor-pointer"
              title={`Free Tier Usage: ${analysesUsed}/${analysesLimit} analyses`}
            >
              <Zap className="w-4 h-4 text-[#35D9E8] group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[11px] font-bold text-[#F4F6FF]">
                {analysesUsed}/{analysesLimit}
              </span>
              <div className="w-9 h-1.5 bg-[#101A2D] rounded-full overflow-hidden mt-1">
                <div
                  className="bg-gradient-to-r from-[#7865FF] to-[#35D9E8] h-full rounded-full"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>

              {/* Tooltip on hover in collapsed mode */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3.5 py-2.5 bg-[#192640] text-[#F4F6FF] text-xs rounded-xl shadow-2xl border border-[rgba(166,184,225,0.2)] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                <p className="font-bold text-[#F4F6FF]">Free Tier Usage</p>
                <p className="text-[12px] text-[#B5C0D6] mt-0.5">{analysesUsed} of {analysesLimit} ATS checks used ({usagePercentage}%)</p>
              </div>
            </div>
          ) : (
            // Full Usage Card in Expanded Mode
            <div className="rounded-xl bg-[#141E33] border border-[rgba(166,184,225,0.16)] p-3.5 text-xs shadow-inner">
              <div className="flex justify-between items-center mb-2 text-[#F4F6FF] font-semibold text-[13px]">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#35D9E8]" />
                  <span>Free Tier Usage</span>
                </span>
                <span className="text-[#35D9E8] font-bold text-[12px] bg-[#35D9E8]/10 px-2 py-0.5 rounded border border-[#35D9E8]/20">
                  {analysesUsed}/{analysesLimit}
                </span>
              </div>
              <div className="w-full bg-[#101A2D] h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-gradient-to-r from-[#7865FF] via-[#4285FF] to-[#35D9E8] h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(120,101,255,0.4)]"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
              <p className="text-[12px] text-[#8D9AB5] leading-relaxed">
                Includes full ATS keyword audits, AI rewrites, and PDF downloads.
              </p>
            </div>
          )}
        </div>

        {/* User Profile Bar */}
        <div className={`p-3.5 border-t border-[rgba(166,184,225,0.16)] bg-[#0B1120] flex items-center ${
          isCollapsed ? 'lg:justify-center' : 'justify-between'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0 group relative">
            {/* User Avatar Initial */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7865FF] via-[#4285FF] to-[#35D9E8] p-0.5 shrink-0 shadow-sm">
              <div className="w-full h-full bg-[#141E33] rounded-full flex items-center justify-center text-white font-bold text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>

            {/* Name and Email (Hidden when collapsed on desktop) */}
            <div className={`min-w-0 transition-opacity duration-200 ${isCollapsed ? 'lg:hidden' : 'block'}`}>
              <p className="text-[14px] font-semibold text-[#F4F6FF] truncate leading-tight">
                {user?.name || 'Account'}
              </p>
              <p className="text-[12px] text-[#8D9AB5] truncate leading-tight mt-0.5">
                {user?.email || 'user@example.com'}
              </p>
            </div>

            {/* Tooltip on user in collapsed mode */}
            {isCollapsed && (
              <div className="hidden lg:block absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#192640] text-[#F4F6FF] text-xs font-semibold rounded-lg shadow-xl border border-[rgba(166,184,225,0.18)] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50">
                <span>{user?.name || 'User'} ({user?.email})</span>
              </div>
            )}
          </div>

          {/* Logout Button (Hidden in collapsed mode; shown in expanded or on mobile) */}
          <div className={isCollapsed ? 'lg:hidden' : 'block'}>
            <button
              onClick={logout}
              title="Sign out of account"
              aria-label="Sign out of account"
              className="p-2 text-[#8D9AB5] hover:text-rose-400 hover:bg-[#141E33] rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#080D1B]">
        
        {/* Top Navbar in Dark Theme */}
        <header className="no-print h-16 bg-[#0B1120] border-b border-[rgba(166,184,225,0.16)] flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Drawer Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#B5C0D6] hover:text-[#F4F6FF] rounded-lg hover:bg-[#141E33] transition"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-[14px] font-medium text-[#8D9AB5]" aria-label="Breadcrumb">
              <Link to="/dashboard" className="hover:text-[#F4F6FF] transition">
                Platform
              </Link>
              <ChevronRight className="w-4 h-4 text-[#8D9AB5]" />
              <span className="text-[#F4F6FF] font-semibold">
                {currentActiveItem.name}
              </span>
            </nav>
          </div>

          {/* Quick Header Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/checker"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[14px] font-medium bg-[#141E33] text-[#35D9E8] border border-[rgba(53,217,232,0.25)] hover:bg-[#192640] hover:border-[#35D9E8]/50 hover:shadow-[0_0_12px_rgba(53,217,232,0.25)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <FileCheck2 className="w-4 h-4 text-[#35D9E8]" />
              Quick Check
            </Link>

            <Link
              to="/dashboard/builder"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-semibold bg-gradient-to-r from-[#7865FF] to-[#4285FF] text-white hover:opacity-95 shadow-[0_4px_16px_rgba(120,101,255,0.35)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(120,101,255,0.5)] transition-all duration-200"
            >
              <Hammer className="w-4 h-4" />
              Create Resume
            </Link>
          </div>
        </header>

        {/* Page Body Viewport with Dark Main Content Background #0E1527 */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0E1527] text-[#F4F6FF]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
