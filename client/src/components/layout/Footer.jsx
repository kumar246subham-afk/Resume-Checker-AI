import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck2, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#111827] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6D5EF7] to-[#14B8A6] flex items-center justify-center text-white shadow-md">
                <FileCheck2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Resume Checker <span className="text-[#6D5EF7]">AI</span>
              </span>
            </Link>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Empowering job seekers worldwide to create high-impact, ATS-optimized resumes, match requirements, and advance their careers with verified AI intelligence.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Encrypted at rest • Zero unverified claims • You own your data</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Product</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/dashboard/builder" className="hover:text-white transition">AI Resume Builder</Link></li>
              <li><Link to="/dashboard/checker" className="hover:text-white transition">ATS Resume Checker</Link></li>
              <li><Link to="/dashboard/job-matcher" className="hover:text-white transition">Job Description Matcher</Link></li>
              <li><Link to="/dashboard/improver" className="hover:text-white transition">AI Resume Improver</Link></li>
              <li><Link to="/dashboard/career-assistant" className="hover:text-white transition">AI Career Assistant</Link></li>
            </ul>
          </div>

          {/* Templates & Persona */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Templates</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="/#templates" className="hover:text-white transition">ATS Classic (Single Column)</a></li>
              <li><a href="/#templates" className="hover:text-white transition">Modern Professional</a></li>
              <li><a href="/#templates" className="hover:text-white transition">Minimal Elegant</a></li>
              <li><a href="/#templates" className="hover:text-white transition">Technical & DevOps</a></li>
              <li><a href="/#templates" className="hover:text-white transition">Executive Leadership</a></li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Legal & Privacy</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/dashboard/settings" className="hover:text-white transition">Data Retention & Purge</Link></li>
              <li><a href="/#faq" className="hover:text-white transition">Security & FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Resume Checker AI. All rights reserved.</p>
          <p className="text-[11px] text-slate-400 text-center sm:text-right max-w-xl">
            *Disclaimer: ATS scores are calculated estimates based on algorithmic best practices. Resume Checker AI does not guarantee interviews or employment outcomes.
          </p>
        </div>
      </div>
    </footer>
  );
};
