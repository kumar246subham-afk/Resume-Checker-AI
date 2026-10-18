import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FileText } from 'lucide-react';

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold border border-violet-200">
            <FileText className="w-3.5 h-3.5" />
            <span>User Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827]">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: October 2026
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-subtle space-y-6 text-xs text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#111827]">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Resume Checker AI, you agree to comply with and be bound by these Terms of Service. If you disagree with any part of these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#111827]">2. Nature of ATS Scoring & Disclaimers</h2>
            <p>
              ATS scores and recommendations provided by Resume Checker AI are algorithmic estimates based on industry research and standard applicant tracking practices. <strong>We do not guarantee job interviews, placement rates, or employer hiring decisions.</strong> Users are advised to review all AI-generated suggestions and ensure all claims accurately represent their true qualifications.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#111827]">3. Acceptable Use</h2>
            <p>
              You agree not to upload malicious files, copyrighted materials belonging to others without permission, or documents containing unlawful content. You agree not to attempt to bypass rate limits or reverse-engineer our proprietary scoring models.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#111827]">4. Accounts and Security</h2>
            <p>
              You are responsible for safeguarding your login credentials. If you suspect unauthorized access to your account, please notify us and update your password immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#111827]">5. Modifications to Service</h2>
            <p>
              We reserve the right to improve, modify, or discontinue features of the application as technology evolves.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
