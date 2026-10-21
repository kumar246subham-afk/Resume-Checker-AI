import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { PageSkeleton } from './components/common/PageSkeleton';

// Public Pages (Code-split for fast initial page load)
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./pages/SignupPage').then(m => ({ default: m.SignupPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));

// Protected Pages (Loaded on demand when authenticated)
const OnboardingPage = lazy(() => import('./pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout').then(m => ({ default: m.DashboardLayout })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const MyResumesPage = lazy(() => import('./pages/MyResumesPage').then(m => ({ default: m.MyResumesPage })));
const ResumeBuilderPage = lazy(() => import('./pages/ResumeBuilderPage').then(m => ({ default: m.ResumeBuilderPage })));
const ResumeCheckerPage = lazy(() => import('./pages/ResumeCheckerPage').then(m => ({ default: m.ResumeCheckerPage })));
const JobMatcherPage = lazy(() => import('./pages/JobMatcherPage').then(m => ({ default: m.JobMatcherPage })));
const ResumeImproverPage = lazy(() => import('./pages/ResumeImproverPage').then(m => ({ default: m.ResumeImproverPage })));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage').then(m => ({ default: m.TemplatesPage })));
const CareerAssistantPage = lazy(() => import('./pages/CareerAssistantPage').then(m => ({ default: m.CareerAssistantPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xs font-semibold text-slate-500 animate-pulse">
        Verifying Authentication Session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        {/* Public Landing & Marketing */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Onboarding Flow */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* Authenticated Dashboard Nested Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="resumes" element={<MyResumesPage />} />
          <Route path="builder" element={<ResumeBuilderPage />} />
          <Route path="checker" element={<ResumeCheckerPage />} />
          <Route path="job-matcher" element={<JobMatcherPage />} />
          <Route path="improver" element={<ResumeImproverPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="career-assistant" element={<CareerAssistantPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
