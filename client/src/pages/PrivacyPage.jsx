import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Transparency & Data Security</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827]">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: October 2026
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-subtle space-y-6 text-xs text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#111827]">1. Introduction & Overview</h2>
            <p>
              Resume Checker AI ("we", "our", or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy details how we handle the documents, career details, and resumes you upload or construct on our platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#111827]">2. Information We Collect</h2>
            <p>
              We collect information necessary to provide ATS analysis, career tailoring, and PDF generation:
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li><strong>Account Credentials:</strong> Name, email address, and encrypted password hash.</li>
              <li><strong>Resume Content:</strong> Employment history, education, skills, contact numbers, and project descriptions provided by you.</li>
              <li><strong>Uploaded Files:</strong> PDF and DOCX files temporarily parsed in-memory to extract selectable text.</li>
              <li><strong>Job Postings:</strong> Job titles and descriptions you provide to evaluate keyword match coverage.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#111827]">3. How We Use and Process Your Documents</h2>
            <p>
              Your data is processed strictly to calculate ATS scores, generate grounded suggestions, and render downloadable PDF documents. We do <strong>not</strong> sell your resumes or personal information to third-party recruiters, data brokers, or advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#111827]">4. AI Model Interactions</h2>
            <p>
              When utilizing AI-assisted features (such as bullet rewriting or executive summary generation), prompt payloads containing only the relevant text chunk are submitted securely. User resume data is not used to train public LLM foundation models.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#111827]">5. Data Retention & Right to Deletion</h2>
            <p>
              You maintain complete ownership of your career data. At any time, you may delete individual resumes, clear previous audit reports, or permanently purge your account and all associated records from your Settings page.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#111827]">6. Contact Us</h2>
            <p>
              If you have inquiries regarding this policy or data processing practices, please reach out via the support link or account portal.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
