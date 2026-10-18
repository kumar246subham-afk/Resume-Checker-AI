import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

// Protected Pages
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { MyResumesPage } from './pages/MyResumesPage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { ResumeCheckerPage } from './pages/ResumeCheckerPage';
import { JobMatcherPage } from './pages/JobMatcherPage';
import { ResumeImproverPage } from './pages/ResumeImproverPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { CareerAssistantPage } from './pages/CareerAssistantPage';
import { SettingsPage } from './pages/SettingsPage';

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
  );
};

export default App;
