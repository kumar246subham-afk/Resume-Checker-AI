import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ScoreRing } from '../components/common/ScoreRing';
import {
  FileCheck2,
  Hammer,
  Sparkles,
  Briefcase,
  Layers,
  Download,
  History,
  Bot,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  Users,
  Code,
  GraduationCap,
  TrendingUp,
  FileText
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [targetJobTitle, setTargetJobTitle] = useState('Senior Software Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleHeroUploadRedirect = () => {
    navigate('/dashboard/checker');
  };

  const templatesList = [
    {
      id: 'ats-classic',
      name: 'ATS Classic',
      badge: 'Highest ATS Compatibility',
      desc: 'Single-column, clean typography designed to pass through any legacy or modern ATS parser without formatting errors.',
      color: '#111827'
    },
    {
      id: 'modern-pro',
      name: 'Modern Professional',
      badge: 'Best for Tech & SaaS',
      desc: 'Contemporary layout featuring subtle violet accents, structured timelines, and clear competency badges.',
      color: '#6D5EF7'
    },
    {
      id: 'minimal-elegant',
      name: 'Minimal Elegant',
      badge: 'Spacious & Refined',
      desc: 'Sophisticated typography and delicate rules designed for design, marketing, and modern business roles.',
      color: '#64748B'
    },
    {
      id: 'tech-resume',
      name: 'Technical Resume',
      badge: 'Engineers & DevOps',
      desc: 'Monospace touches, dedicated tech-stack grids, and project architecture bullet highlights.',
      color: '#14B8A6'
    },
    {
      id: 'executive-profile',
      name: 'Executive Profile',
      badge: 'Leadership & Senior Roles',
      desc: 'Emphasizes strategic executive summaries, leadership competencies, and quantifiable business milestones.',
      color: '#1E293B'
    }
  ];

  const faqItems = [
    {
      q: 'What is Resume Checker AI?',
      a: 'Resume Checker AI is a full-stack, enterprise-grade platform that helps you build professional resumes, analyze ATS compatibility, identify passive language, optimize for specific job postings, and export clean PDF resumes.'
    },
    {
      q: 'How does the ATS score work?',
      a: 'Our transparent scoring engine evaluates your resume across 5 weighted categories: ATS Readability (25%), Job-Specific Keyword Alignment (25%), Skills & Experience Relevance (20%), Measurable Projects & Achievements (15%), and Grammar, Clarity & Structure (15%).'
    },
    {
      q: 'Can I create a resume for free?',
      a: 'Yes! The Free plan provides access to all 5 professional templates, unlimited manual editing, real-time preview, and up to 15 full ATS analysis runs with PDF exports.'
    },
    {
      q: 'Which file formats are supported?',
      a: 'We accept text-based PDF and Microsoft Word (DOCX) files up to 10MB, as well as direct text input. Scanned image PDFs are flagged so you can use selectable text.'
    },
    {
      q: 'Can I tailor my resume to a job description?',
      a: 'Yes. Our Job Description Matcher compares your resume against any target job posting, calculates skill density, identifies missing required and preferred skills, and lets you generate a tailored version in one click.'
    },
    {
      q: 'Can AI invent experience or skills on my behalf?',
      a: 'No. Our AI models are instructed never to fabricate false credentials, fictitious employment, or arbitrary metrics. All suggestions are based on your actual input, with prompts reminding you to verify any quantifiable estimates.'
    },
    {
      q: 'Can I download my resume as a PDF?',
      a: 'Yes. The Resume Builder includes a high-fidelity A4 PDF export engine with selectable text, standard margins, and zero clipping across desktop and mobile browsers.'
    },
    {
      q: 'Is my resume private and secure?',
      a: 'Your documents and data are stored in a private database accessible only by your authenticated account. We do not sell your data or use your resumes to train public models.'
    },
    {
      q: 'Does a high score guarantee an interview?',
      a: 'No. An ATS score is an algorithmic estimate designed to maximize discoverability and recruiter appeal. Hiring decisions involve many human factors beyond automated screening.'
    },
    {
      q: 'How do I delete my uploaded documents?',
      a: 'You have full data ownership. You can permanently delete individual resumes or purge your entire account and associated analyses instantly from your Settings page.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 gradient-hero-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200/80 text-violet-700 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#6D5EF7]" />
                <span>Your career, upgraded with AI</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111827] leading-[1.15]">
                Build a Resume That <br className="hidden sm:inline" />
                <span className="gradient-brand-text">Gets Noticed.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#64748B] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Create a professional resume, discover what needs improvement, and optimize your application with the power of transparent AI analysis.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/dashboard/builder"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#6D5EF7] to-[#5A4BE0] hover:from-[#5A4BE0] hover:to-[#4839C7] shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Hammer className="w-4 h-4" />
                  Build My Resume
                </Link>

                <Link
                  to="/dashboard/checker"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-[#111827] bg-white border border-slate-200 hover:bg-slate-50 hover:border-violet-300 shadow-sm transition-all"
                >
                  <FileCheck2 className="w-4 h-4 text-[#6D5EF7]" />
                  Check My Resume
                </Link>
              </div>

              {/* Trust micro-badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#64748B]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>5 ATS Templates</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Job Match Breakdown</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Verified Action Verbs</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Dashboard Mockup (Clearly Labeled Preview) */}
            <div className="lg:col-span-5 relative">
              {/* Illustrative Notice Pill */}
              <div className="absolute -top-3 right-4 z-20 bg-slate-900/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-md backdrop-blur-md">
                Sample Interactive Preview
              </div>

              {/* Main Mockup Card */}
              <div className="glass-panel rounded-2xl p-6 shadow-premium relative z-10 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-sm text-[#111827]">Alex_Morgan_Resume.pdf</h3>
                    <p className="text-[11px] text-[#64748B]">Software Engineer • 420 words</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    ATS Ready
                  </span>
                </div>

                {/* Score & Category overview */}
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="flex justify-center">
                    <ScoreRing score={88} size={110} strokeWidth={9} showLabel={false} />
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-slate-700">
                        <span>Readability</span>
                        <span className="font-bold text-emerald-600">92%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-0.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-slate-700">
                        <span>Keyword Match</span>
                        <span className="font-bold text-violet-600">85%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-0.5">
                        <div className="bg-[#6D5EF7] h-1.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-slate-700">
                        <span>Impact Metrics</span>
                        <span className="font-bold text-teal-600">86%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-0.5">
                        <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: '86%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detected Issue Pill */}
                <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900">1 Passive Phrase Detected</span>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      "Responsible for API development" → Replace with "Spearheaded microservices architecture".
                    </p>
                  </div>
                </div>

                {/* Floating AI Assistant pill */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-3 rounded-xl shadow-md flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-300" />
                    <span className="font-semibold">AI Assistant: 3 high-impact fixes ready</span>
                  </div>
                  <Link to="/dashboard/checker" className="text-[11px] font-bold bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition">
                    Fix Now
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. QUICK-ACTION UPLOAD SECTION */}
      <section className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
              Check Your Resume Instantly
            </h2>
            <p className="text-sm text-[#64748B]">
              Drop your PDF or DOCX resume below to test ATS compatibility and keyword relevance.
            </p>
          </div>

          <div className="bg-slate-50 border-2 border-dashed border-violet-200 rounded-2xl p-8 text-center hover:border-violet-400 transition-colors">
            <div className="w-14 h-14 bg-violet-100 text-[#6D5EF7] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-7 h-7" />
            </div>

            <h3 className="text-base font-bold text-[#111827]">
              Drag and drop your resume file here
            </h3>
            <p className="text-xs text-[#64748B] mt-1 mb-5">
              Supports text-based PDF and DOCX files up to 10MB.
            </p>

            <div className="max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-left">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Job Title</label>
                <input
                  type="text"
                  value={targetJobTitle}
                  onChange={(e) => setTargetJobTitle(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Company / Field</label>
                <input
                  type="text"
                  placeholder="e.g. SaaS / FinTech"
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <button
              onClick={handleHeroUploadRedirect}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] shadow-md transition"
            >
              <FileCheck2 className="w-4 h-4" />
              Upload & Run Full Analysis
            </button>
          </div>
        </div>
      </section>

      {/* 3. TRUSTED WORKFLOW SECTION */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6D5EF7]">Step-by-Step</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827]">
            How Resume Checker AI Works
          </h2>
          <p className="text-sm text-[#64748B]">
            From upload to interview-ready application in four streamlined steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {[
            {
              step: '01',
              title: 'Upload or Create',
              desc: 'Upload your current PDF/DOCX or use our guided builder with professional templates.',
              icon: Upload,
              color: 'text-violet-600 bg-violet-50 border-violet-100'
            },
            {
              step: '02',
              title: 'Analyze Your Resume',
              desc: 'Our scoring engine audits formatting, section headers, keywords, and action verbs.',
              icon: FileCheck2,
              color: 'text-teal-600 bg-teal-50 border-teal-100'
            },
            {
              step: '03',
              title: 'Fix Problems Using AI',
              desc: 'Review grounded suggestions for passive phrasing, missing skills, and quantifiable impact.',
              icon: Sparkles,
              color: 'text-indigo-600 bg-indigo-50 border-indigo-100'
            },
            {
              step: '04',
              title: 'Download Improved PDF',
              desc: 'Export crisp, single-column, A4 PDF documents ready for automated ATS portals.',
              icon: Download,
              color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle hover:shadow-premium transition-all relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-slate-200">{item.step}</span>
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-2">{item.title}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURES GRID */}
      <section id="features" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Everything You Need</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Built for Modern Job Seekers
            </h2>
            <p className="text-sm text-slate-400">
              Advanced career intelligence tools designed to help you stand out to hiring managers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'AI Resume Builder', desc: 'Add, reorder, and edit structured sections with live A4 preview.', icon: Hammer, link: '/dashboard/builder' },
              { title: 'ATS Resume Checker', desc: '10-point audit identifying parsing snags, passive phrasing, and keyword density.', icon: FileCheck2, link: '/dashboard/checker' },
              { title: 'Job Description Matcher', desc: 'Match your resume against any job description to find missing required skills.', icon: Briefcase, link: '/dashboard/job-matcher' },
              { title: 'AI Resume Improver', desc: 'Side-by-side Accept/Edit/Reject workflow for bullet points and summaries.', icon: Sparkles, link: '/dashboard/improver' },
              { title: '5 Verified Templates', desc: 'Single-column and modern layouts engineered for automated ATS systems.', icon: Layers, link: '/dashboard/templates' },
              { title: 'High-Fidelity PDF Export', desc: 'Export standardized A4 documents with selectable text and clean hierarchy.', icon: Download, link: '/dashboard/resumes' },
              { title: 'Version History', desc: 'Save role-tailored versions and compare score improvements over time.', icon: History, link: '/dashboard/resumes' },
              { title: 'AI Career Assistant', desc: 'Structured guidance on describing projects, interview prep, and tech skills.', icon: Bot, link: '/dashboard/career-assistant' },
            ].map((feat, idx) => (
              <Link
                key={idx}
                to={feat.link}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-violet-500/50 rounded-2xl p-6 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <feat.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-violet-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore feature</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE ATS SCORE PREVIEW */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-premium">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 text-center lg:text-left space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6D5EF7]">Transparent Evaluation</span>
              <h2 className="text-3xl font-extrabold text-[#111827]">
                How We Calculate Your ATS Compatibility
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Unlike vague scoring tools, Resume Checker AI breaks down your resume across 5 transparent dimensions with clear weights.
              </p>
              <div className="pt-2">
                <Link
                  to="/dashboard/checker"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] shadow-sm transition"
                >
                  Analyze My Resume Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-800">Scoring Engine Dimensions</span>
                <span className="text-[11px] text-slate-500 font-medium">Configurable Weights</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>ATS Readability (Text length, fonts, contact completeness)</span>
                    <span className="font-bold text-emerald-600">25%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-1">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Job-Specific Keyword Alignment (Matches vs Posting)</span>
                    <span className="font-bold text-violet-600">25%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-1">
                    <div className="bg-violet-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Skills & Experience Relevance (Action verbs, timelines)</span>
                    <span className="font-bold text-teal-600">20%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-1">
                    <div className="bg-teal-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Projects & Measurable Outcomes (Metrics, %, $)</span>
                    <span className="font-bold text-indigo-600">15%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-1">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Grammar, Clarity & Structure (Third-person tone, dates)</span>
                    <span className="font-bold text-amber-600">15%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-1">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. RESUME TEMPLATES SHOWCASE */}
      <section id="templates" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6D5EF7]">5 Tailored Styles</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827]">
              Engineered for Real Recruiters
            </h2>
            <p className="text-sm text-[#64748B]">
              Every template adheres to ATS standards while maintaining sophisticated visual hierarchy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {templatesList.map((tpl) => (
              <div key={tpl.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <div className="h-44 bg-white rounded-lg border border-slate-200 p-3 shadow-inner flex flex-col gap-1.5 overflow-hidden">
                    <div className="h-3 w-1/2 bg-slate-800 rounded"></div>
                    <div className="h-1.5 w-3/4 bg-slate-300 rounded"></div>
                    <div className="h-px bg-slate-200 my-1"></div>
                    <div className="h-2 w-1/3 bg-slate-400 rounded"></div>
                    <div className="space-y-1">
                      <div className="h-1.5 w-full bg-slate-200 rounded"></div>
                      <div className="h-1.5 w-5/6 bg-slate-200 rounded"></div>
                      <div className="h-1.5 w-4/5 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D5EF7]">{tpl.badge}</span>
                    <h3 className="font-bold text-sm text-[#111827] mt-0.5">{tpl.name}</h3>
                    <p className="text-[11px] text-[#64748B] mt-1 leading-normal">{tpl.desc}</p>
                  </div>

                  <Link
                    to={`/dashboard/builder?template=${tpl.id}`}
                    className="w-full text-center mt-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] transition shadow-xs"
                  >
                    Use Template
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BENEFITS BY PERSONA */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6D5EF7]">Tailored Value</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827]">
            Built for Every Career Stage
          </h2>
          <p className="text-sm text-[#64748B]">
            Whether entering the workforce or stepping into an executive suite, Resume Checker AI adapts to your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { persona: 'Students & Interns', icon: GraduationCap, desc: 'Structure coursework, academic projects, and student leadership into an attractive resume without requiring prior full-time employment.' },
            { persona: 'Freshers & Graduates', icon: Sparkles, desc: 'Overcome the "no experience" dilemma by highlighting core technical skills, verified personal projects, and active internships.' },
            { persona: 'Experienced Engineers', icon: Code, desc: 'Showcase system design, scaling accomplishments, distributed architecture, and quantifiable business optimizations.' },
            { persona: 'Career Switchers', icon: TrendingUp, desc: 'Spotlight transferable competencies, bridge skill gaps for your new industry, and tailor bullet points to target job requirements.' },
            { persona: 'Data Analysts & Scientists', icon: Zap, desc: 'Structure your data pipelines, machine learning models, statistical analyses, and business visualization achievements.' },
            { persona: 'Executive Leaders', icon: Users, desc: 'Highlight organizational stewardship, revenue growth, team mentorship, and strategic engineering roadmaps.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle hover:shadow-premium transition-all">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-[#6D5EF7] flex items-center justify-center mb-3.5">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#111827] mb-1.5">{item.persona}</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. BEFORE AND AFTER SECTION */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400">See the Difference</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              From Ordinary Tasks to Measurable Impact
            </h2>
            <p className="text-xs text-slate-400">
              *Sample illustrative before-and-after comparison. Users must verify all generated claims.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Card */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Before (Weak / Passive)</span>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">ATS Score: 45</span>
              </div>
              <p className="text-sm text-slate-300 italic font-serif">
                "Made a Python data analysis project."
              </p>
              <div className="text-xs text-slate-400 pt-2 border-t border-slate-700/60 space-y-1">
                <p>❌ Lacks strong action verbs</p>
                <p>❌ Zero quantifiable metrics or business context</p>
                <p>❌ Missing key data science libraries and tools</p>
              </div>
            </div>

            {/* Improved Card */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-emerald-500/40 space-y-3 shadow-lg shadow-emerald-500/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">After (AI Enhanced)</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">ATS Score: 94</span>
              </div>
              <p className="text-sm text-emerald-100 font-serif">
                "Analyzed a 100,000+ record dataset using Python and Pandas, handled missing values, and created Seaborn visualizations to identify key trends, improving conversion by 18%."
              </p>
              <div className="text-xs text-slate-400 pt-2 border-t border-slate-700/60 space-y-1">
                <p>✓ Starts with powerful action verb ("Analyzed")</p>
                <p>✓ Specific scale (100k+ records) and outcome (+18% conversion)</p>
                <p>✓ Keyword rich (Python, Pandas, Seaborn, Conversion)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PRICING SECTION */}
      <section id="pricing" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6D5EF7]">Clear Plans</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827]">
            Simple, Transparent Options
          </h2>
          <p className="text-sm text-[#64748B]">
            Start free, build unlimited resumes, and upgrade whenever you require higher volume.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-[#111827]">Free Tier</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Active</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#111827]">$0</span>
                <span className="text-xs text-slate-500">/ forever</span>
              </div>
              <p className="text-xs text-slate-600">
                Perfect for active job seekers crafting their primary resume.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Up to 15 Full ATS Analyses</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> All 5 Professional Templates</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited PDF Exports</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Job Description Matcher</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI Career Assistant Chat</li>
              </ul>
            </div>
            <Link
              to="/signup"
              className="mt-8 block text-center py-2.5 rounded-xl text-xs font-bold text-[#111827] bg-slate-100 hover:bg-slate-200 transition"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-white rounded-2xl p-8 border-2 border-[#6D5EF7] shadow-premium relative flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6D5EF7] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
              Most Popular
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-[#111827]">Pro</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-violet-100 text-violet-700">Featured</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#111827]">$12</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <p className="text-xs text-slate-600">
                For candidates actively targeting multiple companies and job families.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited ATS Analyses</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited Job Matches</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Priority AI Rewrites</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 1-Click Tailored Resumes</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Priority Support</li>
              </ul>
            </div>
            <button
              onClick={() => alert('Online billing will be available soon in your region. Enjoy full features on the Free tier today!')}
              className="mt-8 block w-full text-center py-2.5 rounded-xl text-xs font-bold text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] transition shadow-md"
            >
              Upgrade to Pro (Coming Soon)
            </button>
          </div>

          {/* Career Plus */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-[#111827]">Career Plus</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Enterprise</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#111827]">$29</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <p className="text-xs text-slate-600">
                Executive portfolio management and custom job application tracking.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Everything in Pro</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Executive Cover Letter Generator</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Mock Technical Interview Prep</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dedicated Account Review</li>
              </ul>
            </div>
            <button
              onClick={() => alert('Career Plus tier is currently in private beta.')}
              className="mt-8 block w-full text-center py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </section>

      {/* 10. TESTIMONIALS & CREDIBILITY (Clearly marked demo content) */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6D5EF7]">Testimonials</span>
            <h2 className="text-3xl font-extrabold text-[#111827]">
              Loved by Candidates
            </h2>
            <p className="text-xs text-slate-500">
              *Illustrative sample user stories showcasing platform capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "The Job Matcher flagged 4 crucial Kubernetes and CI/CD keywords that my old resume missed completely. Fixed them in 10 minutes and landed 3 recruiter callbacks within a week.",
                author: "Sarah K.",
                role: "DevOps Engineer",
                badge: "Sample Case Study"
              },
              {
                quote: "The before-and-after suggestions transformed my weak bullet points into concrete achievements with real numbers. The single-column ATS classic template passed through Workday effortlessly.",
                author: "Marcus T.",
                role: "Full Stack Developer",
                badge: "Sample Case Study"
              },
              {
                quote: "As a career switcher moving into Data Science, the AI assistant gave me the exact phrasing to highlight my Python projects without exaggerating my experience.",
                author: "Priya M.",
                role: "Data Analyst",
                badge: "Sample Case Study"
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6D5EF7] bg-violet-50 px-2 py-0.5 rounded-full inline-block">
                  {t.badge}
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-bold text-[#111827]">{t.author}</p>
                  <p className="text-[11px] text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ ACCORDION SECTION */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6D5EF7]">Common Inquiries</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#64748B]">
            Everything you need to know about ATS scoring, AI rewrites, and privacy.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-5 py-4 text-left flex justify-between items-center text-xs sm:text-sm font-bold text-[#111827] hover:bg-slate-50 transition"
              >
                <span>{item.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#6D5EF7] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};
