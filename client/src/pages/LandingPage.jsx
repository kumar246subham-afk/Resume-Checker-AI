import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ScoreRing } from '../components/common/ScoreRing';
import { Modal } from '../components/common/Modal';
import { RESUME_TEMPLATES } from '../data/templatesData';
import { TemplateMiniaturePreview } from '../components/templates/TemplateMiniaturePreview';
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
  ShieldCheck,
  Zap,
  Users,
  Code,
  GraduationCap,
  TrendingUp,
  FileText,
  AlertCircle,
  RefreshCw,
  X,
  Eye,
  Check
} from 'lucide-react';

const SAMPLE_HERO_PROFILES = {
  software_engineer: {
    name: 'Alex Morgan',
    role: 'Senior Software Engineer',
    target: 'Full Stack & Distributed Systems',
    score: 88,
    metrics: { readability: 94, keywords: 85, impact: 88, skills: 90 },
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'Distributed Systems', 'PostgreSQL', 'Docker'],
    missingSkills: ['Kubernetes', 'GraphQL'],
    sampleOriginal: 'Responsible for backend API optimization and fixing bugs.',
    sampleImproved: 'Architected high-throughput microservices in Node.js & Redis, reducing p99 API latency by 42% across 1.2M daily active users.',
    reason: 'Replaces passive duty with quantifiable scale, exact tech stack, and a 42% latency reduction.'
  },
  product_manager: {
    name: 'Elena Vance',
    role: 'Staff Product Manager',
    target: 'SaaS Platform & Growth',
    score: 92,
    metrics: { readability: 96, keywords: 90, impact: 92, skills: 88 },
    matchedSkills: ['Product Strategy', 'Roadmapping', 'A/B Testing', 'Agile/Scrum', 'User Retention', 'SQL'],
    missingSkills: ['PLG Funnels', 'Tableau'],
    sampleOriginal: 'Helped launch the new onboarding flow for mobile users.',
    sampleImproved: 'Spearheaded 0-to-1 redesign of user onboarding flow, driving a 28% lift in 30-day activation and generating $420K incremental ARR.',
    reason: 'Adds measurable business metrics ($ ARR & % activation) and executive ownership.'
  },
  data_scientist: {
    name: 'Marcus Chen',
    role: 'Lead Data Scientist',
    target: 'Machine Learning & Analytics',
    score: 86,
    metrics: { readability: 91, keywords: 84, impact: 85, skills: 89 },
    matchedSkills: ['Python', 'PyTorch', 'Scikit-Learn', 'Feature Engineering', 'NLP', 'BigQuery'],
    missingSkills: ['MLOps', 'Kubeflow'],
    sampleOriginal: 'Built machine learning models to predict customer churn.',
    sampleImproved: 'Trained and deployed XGBoost customer retention models processing 50M+ events, decreasing quarterly churn by 14.5% ($1.2M saved).',
    reason: 'Highlights specific ML architecture, data scale (50M+ events), and bottom-line dollar savings.'
  }
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedHeroRole, setSelectedHeroRole] = useState('software_engineer');
  const [targetJobTitle, setTargetJobTitle] = useState('Senior Software Engineer');
  const [targetCompany, setTargetCompany] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [activeTemplateCategory, setActiveTemplateCategory] = useState('all');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedPreviewTemplate, setSelectedPreviewTemplate] = useState(null);

  // Quick Action Upload State
  const [quickFile, setQuickFile] = useState(null);
  const [quickAnalyzing, setQuickAnalyzing] = useState(false);
  const [quickError, setQuickError] = useState('');
  const [guestReport, setGuestReport] = useState(null);
  const [guestModalOpen, setGuestModalOpen] = useState(false);

  const heroProfile = SAMPLE_HERO_PROFILES[selectedHeroRole];

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleQuickUpload = async (e) => {
    e?.preventDefault();
    setQuickError('');

    if (!quickFile) {
      setQuickError('Please select or drop a PDF, Word DOCX, PNG, or JPG resume file');
      return;
    }

    setQuickAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('resumeFile', quickFile);
      formData.append('targetJobTitle', targetJobTitle);
      if (targetCompany) {
        formData.append('jobDescription', `Company/Field: ${targetCompany}`);
      }

      const res = await api.post('/analysis/upload', formData);

      if (res.data.success) {
        if (isAuthenticated) {
          navigate(`/dashboard/checker?analysisId=${res.data.data._id}`);
        } else {
          setGuestReport(res.data.data);
          setGuestModalOpen(true);
        }
      }
    } catch (err) {
      setQuickError(err.response?.data?.message || 'Document analysis failed. Please verify the document format.');
    } finally {
      setQuickAnalyzing(false);
    }
  };

  const templateCategories = [
    { id: 'all', label: 'All 10 Templates' },
    { id: 'tech', label: 'Engineering & Tech' },
    { id: 'executive', label: 'Executive & Leadership' },
    { id: 'ats', label: 'ATS Minimal' },
    { id: 'creative', label: 'Creative & Graduate' }
  ];

  const filteredTemplates = RESUME_TEMPLATES.filter((tpl) => {
    if (activeTemplateCategory === 'all') return true;
    if (activeTemplateCategory === 'tech') return ['tech-resume', 'tech-innovator', 'data-science-pro'].includes(tpl.id);
    if (activeTemplateCategory === 'executive') return ['executive-profile', 'executive-elite'].includes(tpl.id);
    if (activeTemplateCategory === 'ats') return ['ats-classic', 'modern-pro', 'minimal-elegant'].includes(tpl.id);
    if (activeTemplateCategory === 'creative') return ['creative-portfolio', 'fresh-graduate-pro'].includes(tpl.id);
    return true;
  });

  const faqItems = [
    {
      q: 'What is Resume Checker AI?',
      a: 'Resume Checker AI is a full-stack, enterprise-grade career studio that combines AI analysis, ATS compatibility audits, job description matching, and a live A4 resume builder with 10 recruiter-tested templates.'
    },
    {
      q: 'How does the ATS score work?',
      a: 'Our transparent scoring engine evaluates your resume across 5 weighted categories: ATS Readability (25%), Job-Specific Keyword Alignment (25%), Skills & Experience Relevance (20%), Measurable Projects & Achievements (15%), and Grammar, Clarity & Structure (15%).'
    },
    {
      q: 'Can I create a resume for free?',
      a: 'Yes! The Free tier provides access to all 10 professional templates, unlimited manual editing, real-time preview, and full ATS analysis runs with PDF exports.'
    },
    {
      q: 'Which file formats are supported?',
      a: 'We accept text-based PDF, scanned or image PDFs (with automatic OCR fallback), Microsoft Word documents (DOCX/DOC), and PNG/JPG resume images up to 10MB.'
    },
    {
      q: 'Can I tailor my resume to a specific job description?',
      a: 'Yes. Our Job Description Matcher compares your resume against any target job posting, calculates skill density, identifies missing required and preferred skills, and lets you generate a tailored version in one click.'
    },
    {
      q: 'Can AI invent experience or skills on my behalf?',
      a: 'No. In strict compliance with our anti-hallucination policy, we do not invent fake employers, arbitrary metrics, or credentials. When quantifiable impact is missing, we give you structured placeholders to insert your authentic data.'
    },
    {
      q: 'Can I download my resume as a PDF?',
      a: 'Yes. The Resume Builder includes a high-fidelity A4 PDF export engine with selectable text, standard margins, and zero clipping across desktop and mobile browsers.'
    },
    {
      q: 'Is my resume private and secure?',
      a: 'Your documents and data are stored in a private database accessible only by your authenticated account. Files are processed in memory and never sold or used to train public models.'
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
    <div className="min-h-screen bg-[#F5F7FC] text-[#161B2E]">
      <Navbar />

      {/* 1. HERO SECTION (OPTION A: AI Studio + OPTION B: Editorial + OPTION C: Futuristic Interaction) */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 gradient-hero-glow">
        {/* Subtle ambient lighting orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#6C5CE7]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#32D6D3]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#25234F]/15 text-[#101426] text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#32D6D3] animate-pulse" />
                <span className="editorial-tag text-[#101426]">Next-Gen Career Intelligence</span>
                <span className="text-[#6C5CE7] font-semibold">• Option A + B + C</span>
              </div>

              {/* Exact required headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-[#101426] leading-[1.12]">
                Your Next Opportunity Starts With a{' '}
                <span className="gradient-brand-text">Better Resume.</span>
              </h1>

              {/* Exact required supporting text */}
              <p className="text-base sm:text-lg text-[#68738A] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Build a professional resume, discover ATS gaps, and turn your experience into a stronger job application.
              </p>

              {/* Action Buttons in exact order */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/dashboard/checker"
                  className="interactive-button w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#6C5CE7] via-[#438BFF] to-[#32D6D3] shadow-lg shadow-violet-500/25 group"
                >
                  <FileCheck2 className="w-4 h-4 transition-transform group-hover:scale-110 duration-200" />
                  <span>Check My Resume</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
                </Link>

                <Link
                  to="/dashboard/builder"
                  className="interactive-button w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-[#101426] bg-white border border-slate-200 hover:border-violet-300 shadow-sm group"
                >
                  <Hammer className="w-4 h-4 text-[#6C5CE7] transition-transform group-hover:-rotate-12 duration-200" />
                  <span>Build My Resume</span>
                </Link>

                <a
                  href="#templates"
                  className="interactive-button w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-xs text-[#68738A] hover:text-[#6C5CE7] transition-colors"
                >
                  <Layers className="w-4 h-4" />
                  <span>Explore Templates</span>
                </a>
              </div>

              {/* Trust micro-badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-[#68738A]">
                <div className="flex items-center gap-1.5 hover:text-[#101426] transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold">10 ATS Templates</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-[#101426] transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold">Job Match Breakdown</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-[#101426] transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold">Zero Hallucinations</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Hero Visual Studio (Option A + B + C) */}
            <div className="lg:col-span-6 relative">
              {/* Role Switcher Tabs */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-3 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs max-w-fit mx-auto lg:mx-0">
                <span className="text-[10px] font-bold text-[#68738A] uppercase tracking-wider px-2">Role:</span>
                {[
                  { id: 'software_engineer', label: 'Engineer' },
                  { id: 'product_manager', label: 'Product Lead' },
                  { id: 'data_scientist', label: 'Data Scientist' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedHeroRole(tab.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      selectedHeroRole === tab.id
                        ? 'bg-[#101426] text-white shadow-xs'
                        : 'text-[#68738A] hover:text-[#101426] hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Main Interactive Studio Card */}
              <div className="glass-panel bg-white/95 rounded-3xl p-6 sm:p-7 shadow-premium relative z-10 space-y-5 border border-slate-200/90 text-[#111827] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                {/* Sample Label Pill */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                    <span className="text-xs font-bold text-[#101426]">{heroProfile.name} • Resume.pdf</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    ATS Compatible
                  </span>
                </div>

                {/* Score & Category overview */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                  <div className="sm:col-span-5 flex flex-col items-center justify-center p-2">
                    <ScoreRing score={heroProfile.score} size={136} strokeWidth={11} subtext="ATS Match Score" theme="light" />
                  </div>

                  <div className="sm:col-span-7 space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-[#161B2E]">
                        <span>Readability & Structure</span>
                        <span className="font-bold text-emerald-600">{heroProfile.metrics.readability}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${heroProfile.metrics.readability}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-[#161B2E]">
                        <span>Keyword Alignment</span>
                        <span className="font-bold text-[#6C5CE7]">{heroProfile.metrics.keywords}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-[#6C5CE7] h-1.5 rounded-full transition-all duration-500" style={{ width: `${heroProfile.metrics.keywords}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-[#161B2E]">
                        <span>Quantifiable Impact</span>
                        <span className="font-bold text-[#32D6D3]">{heroProfile.metrics.impact}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-[#32D6D3] h-1.5 rounded-full transition-all duration-500" style={{ width: `${heroProfile.metrics.impact}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Matched & Missing Skill Chips */}
                <div className="space-y-2 pt-1 border-t border-slate-100 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block w-full sm:w-auto mr-1">
                      Matched Skills:
                    </span>
                    {heroProfile.matchedSkills.map((skill, idx) => (
                      <span key={idx} className="interactive-pill text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block w-full sm:w-auto mr-1">
                      Missing Gaps:
                    </span>
                    {heroProfile.missingSkills.map((skill, idx) => (
                      <span key={idx} className="interactive-pill text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                        + {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sample AI Wording Improvement Card */}
                <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-slate-400 line-through">Original Task</span>
                    <span className="text-[#6C5CE7] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Grounded AI Rewrite
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] leading-relaxed">
                    <p className="text-slate-500 line-through italic">"{heroProfile.sampleOriginal}"</p>
                    <p className="text-emerald-950 font-medium bg-emerald-50/60 p-2 rounded-xl border border-emerald-200">
                      "{heroProfile.sampleImproved}"
                    </p>
                  </div>
                </div>

                {/* Clearly labeled sample preview disclaimer */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>*Live interactive demonstration with sample data</span>
                  <Link to="/dashboard/checker" className="text-[#6C5CE7] font-bold hover:underline flex items-center gap-1">
                    Try with your resume <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. QUICK-ACTION UPLOAD SECTION */}
      <section className="py-14 bg-white border-y border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-8">
            <span className="editorial-tag text-[#6C5CE7]">Instant Document Audit</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101426]">
              Check Your Resume in Seconds
            </h2>
            <p className="text-xs sm:text-sm text-[#68738A]">
              Upload your PDF, Word DOCX, PNG, or JPG resume to evaluate ATS compatibility and keyword relevance.
            </p>
          </div>

          {quickError && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3.5 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{quickError}</span>
            </div>
          )}

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setQuickFile(e.dataTransfer.files[0]);
                setQuickError('');
              }
            }}
            className="interactive-upload-zone bg-slate-50/70 border-2 border-dashed border-violet-200 rounded-3xl p-8 text-center cursor-pointer transition-all"
          >
            <input
              id="quick-action-file-input"
              type="file"
              accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.txt"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setQuickFile(e.target.files[0]);
                  setQuickError('');
                }
              }}
              className="hidden"
            />

            {!quickFile ? (
              <div
                onClick={() => document.getElementById('quick-action-file-input').click()}
                className="group"
              >
                <div className="w-14 h-14 bg-violet-100/70 text-[#6C5CE7] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-violet-200 transition-all duration-200">
                  <Upload className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-[#101426] group-hover:text-[#6C5CE7] transition-colors">
                  Drag & drop your resume file here, or click to browse
                </h3>
                <p className="text-xs text-[#68738A] mt-1 mb-5">
                  Supports PDF (standard & scanned OCR), Word DOCX, PNG, and JPG (up to 10MB)
                </p>
              </div>
            ) : (
              <div className="mb-5 flex items-center justify-center gap-3">
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-violet-200 shadow-sm">
                  <FileText className="w-4 h-4 text-[#6C5CE7]" />
                  <span className="text-xs font-bold text-[#101426]">{quickFile.name}</span>
                  <span className="text-[11px] text-slate-400">({(quickFile.size / 1024).toFixed(0)} KB)</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickFile(null);
                    }}
                    className="ml-2 text-slate-400 hover:text-rose-600 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div className="max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-left">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Job Title</label>
                <input
                  type="text"
                  value={targetJobTitle}
                  onChange={(e) => setTargetJobTitle(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  className="interactive-input w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Company / Field</label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g. SaaS / FinTech"
                  className="interactive-input w-full text-xs px-3.5 py-2.5 bg-white rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleQuickUpload}
              disabled={quickAnalyzing}
              className="interactive-button inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#6C5CE7] to-[#438BFF] shadow-md shadow-violet-500/25 transition disabled:opacity-50"
            >
              {quickAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running ATS Analysis Engine...
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  Upload & Analyze Compatibility
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION (Step Workflow) */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="editorial-tag text-[#6C5CE7]">Streamlined Process</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101426]">
            How Resume Checker AI Works
          </h2>
          <p className="text-sm text-[#68738A]">
            A transparent three-step workflow from raw draft to interview-ready PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            {
              step: '01',
              title: 'Upload or Build in Studio',
              desc: 'Upload your current PDF/DOCX resume or build from scratch using our guided editor and 10 ATS-ready templates.',
              icon: Upload,
              color: 'text-[#6C5CE7] bg-violet-50 border-violet-100'
            },
            {
              step: '02',
              title: 'Review ATS Scoring & Gaps',
              desc: 'Audit readability, keyword density, and missing requirements against your target industry or job description.',
              icon: FileCheck2,
              color: 'text-[#32D6D3] bg-teal-50 border-teal-100'
            },
            {
              step: '03',
              title: 'Refine Wording & Export PDF',
              desc: 'Accept grounded AI bullet improvements with real metrics, then export pixel-perfect single-column A4 PDFs.',
              icon: Download,
              color: 'text-[#438BFF] bg-blue-50 border-blue-100'
            }
          ].map((item, idx) => (
            <div key={idx} className="interactive-card bg-white rounded-3xl p-8 border border-slate-200/80 shadow-subtle group relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${item.color} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <span className="text-3xl font-black text-slate-200 group-hover:text-violet-200 transition-colors">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-[#101426] mb-2 group-hover:text-[#6C5CE7] transition-colors">{item.title}</h3>
                <p className="text-xs text-[#68738A] leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-[#6C5CE7]">
                <span>Step {item.step} details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURES GRID (Option A: AI Studio + Option B: Varied Editorial Grid) */}
      <section id="features" className="py-20 bg-[#101426] text-white relative overflow-hidden">
        {/* Ambient lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#6C5CE7]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#32D6D3]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="editorial-tag text-[#32D6D3]">Complete Product Suite</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Built for Modern Job Seekers
            </h2>
            <p className="text-sm text-slate-400">
              Eight cohesive tools engineered to make your resume discoverable, compelling, and interview-ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'AI Resume Builder', desc: 'Add, reorder, and edit structured sections with live A4 preview and zoom controls.', icon: Hammer, link: '/dashboard/builder', tag: 'Studio' },
              { title: 'ATS Resume Checker', desc: 'Weighted 5-dimension audit checking readability, keyword density, and grammar.', icon: FileCheck2, link: '/dashboard/checker', tag: 'Core Engine' },
              { title: 'Job Description Matcher', desc: 'Match your resume against any job description to uncover missing requirements.', icon: Briefcase, link: '/dashboard/job-matcher', tag: 'Targeting' },
              { title: 'AI Resume Improver', desc: 'Side-by-side Accept/Edit/Reject workflow for bullet points with authentic metrics.', icon: Sparkles, link: '/dashboard/improver', tag: 'Rewriter' },
              { title: '10 Recruiter Templates', desc: 'ATS-standard designs engineered for technical, executive, and creative roles.', icon: Layers, link: '/dashboard/templates', tag: 'Gallery' },
              { title: 'High-Fidelity PDF Export', desc: 'Export standardized A4 documents with selectable text and pixel-perfect margins.', icon: Download, link: '/dashboard/builder', tag: 'Export' },
              { title: 'Version Management', desc: 'Store role-tailored versions and compare score improvements over time.', icon: History, link: '/dashboard/resumes', tag: 'Tracking' },
              { title: 'AI Career Assistant', desc: 'Structured guidance on describing projects, interview prep, and technical skills.', icon: Bot, link: '/dashboard/career-assistant', tag: 'Assistant' },
            ].map((feat, idx) => (
              <Link
                key={idx}
                to={feat.link}
                className="interactive-card bg-[#1A2138]/90 hover:bg-[#1A2138] border border-white/[0.08] hover:border-[#6C5CE7]/60 rounded-3xl p-6 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#6C5CE7]/20 to-[#32D6D3]/20 border border-white/10 text-[#32D6D3] flex items-center justify-center group-hover:scale-110 group-hover:text-white transition-all duration-200">
                      <feat.icon className="w-5 h-5" />
                    </div>
                    <span className="editorial-tag text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#32D6D3] transition-colors">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
                <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-[#6C5CE7] group-hover:text-[#32D6D3] group-hover:translate-x-1 transition-all">
                  <span>Open tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TRANSPARENT ATS EVALUATION BREAKDOWN */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="interactive-card bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-premium">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 text-center lg:text-left space-y-4">
              <span className="editorial-tag text-[#6C5CE7]">Evaluation Transparency</span>
              <h2 className="text-3xl font-extrabold text-[#101426]">
                How We Calculate Your ATS Compatibility
              </h2>
              <p className="text-xs sm:text-sm text-[#68738A] leading-relaxed">
                Unlike opaque scoring tools, Resume Checker AI breaks down your resume across 5 transparent dimensions with clear weights.
              </p>
              <div className="pt-2">
                <Link
                  to="/dashboard/checker"
                  className="interactive-button inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#6C5CE7] to-[#438BFF] shadow-md shadow-violet-500/25 transition"
                >
                  <span>Analyze My Resume Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#F5F7FC] rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-4 shadow-sm">
              <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
                <span className="font-bold text-[#101426]">Scoring Engine Dimensions</span>
                <span className="text-[11px] text-[#68738A] font-semibold">Configurable Weights</span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-[#161B2E]">
                    <span>ATS Readability (Text length, fonts, contact completeness)</span>
                    <span className="font-bold text-emerald-600">25%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-[#161B2E]">
                    <span>Job-Specific Keyword Alignment (Matches vs Posting)</span>
                    <span className="font-bold text-[#6C5CE7]">25%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-[#6C5CE7] h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-[#161B2E]">
                    <span>Skills & Experience Relevance (Action verbs, timelines)</span>
                    <span className="font-bold text-[#32D6D3]">20%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-[#32D6D3] h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-[#161B2E]">
                    <span>Projects & Measurable Outcomes (Metrics, %, $)</span>
                    <span className="font-bold text-[#438BFF]">15%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-[#438BFF] h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-[#161B2E]">
                    <span>Grammar, Clarity & Structure (Third-person tone, dates)</span>
                    <span className="font-bold text-amber-600">15%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. 10 RESUME TEMPLATES SHOWCASE WITH MODAL PREVIEW */}
      <section id="templates" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="editorial-tag text-[#6C5CE7]">Recruiter-Tested Designs</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101426]">
              Professional Resume Templates
            </h2>
            <p className="text-sm text-[#68738A]">
              Choose from 10 distinct layouts engineered for technical, executive, minimal, and early career resumes.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {templateCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTemplateCategory(cat.id)}
                className={`interactive-pill px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTemplateCategory === cat.id
                    ? 'bg-[#101426] text-white shadow-sm'
                    : 'bg-slate-100 text-[#68738A] hover:bg-slate-200 hover:text-[#101426]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredTemplates.map((tpl) => (
              <div key={tpl.id} className="interactive-card bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-subtle flex flex-col justify-between group">
                <div className="h-56 bg-slate-50 border-b border-slate-100 p-2 overflow-hidden flex items-center justify-center relative">
                  <TemplateMiniaturePreview templateId={tpl.id} />
                  
                  {/* Quick Preview Overlay Button */}
                  <div className="absolute inset-0 bg-[#101426]/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedPreviewTemplate(tpl);
                        setPreviewModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white text-[#101426] text-xs font-bold hover:scale-105 transition-transform flex items-center gap-1 shadow-md"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#6C5CE7]" />
                      Preview
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="editorial-tag text-[10px] text-[#6C5CE7]">{tpl.badge}</span>
                    <h3 className="font-bold text-sm text-[#101426] mt-0.5 group-hover:text-[#6C5CE7] transition-colors">{tpl.name}</h3>
                    <p className="text-[11px] text-[#68738A] mt-1 leading-normal line-clamp-2">{tpl.desc}</p>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/dashboard/builder?template=${tpl.id}`}
                      className="interactive-button w-full text-center py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6C5CE7] to-[#438BFF] shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span>Use Template</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/dashboard/templates"
              className="interactive-button inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:border-[#6C5CE7] text-[#101426] hover:text-[#6C5CE7] font-bold text-xs shadow-sm transition"
            >
              <Layers className="w-4 h-4 text-[#6C5CE7]" />
              <span>Explore All 10 Templates in Full Gallery</span>
              <ArrowRight className="w-4 h-4 text-[#6C5CE7]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. BENEFITS BY PERSONA */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="editorial-tag text-[#6C5CE7]">Tailored Value</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101426]">
            Built for Every Career Stage
          </h2>
          <p className="text-sm text-[#68738A]">
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
            <div key={idx} className="interactive-card bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle group">
              <div className="w-11 h-11 rounded-2xl bg-violet-50 text-[#6C5CE7] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-violet-100 transition-all duration-200">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#101426] mb-1.5 group-hover:text-[#6C5CE7] transition-colors">{item.persona}</h3>
              <p className="text-xs text-[#68738A] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. BEFORE AND AFTER COMPARISON SECTION */}
      <section className="py-20 bg-[#101426] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="editorial-tag text-[#32D6D3]">Grounded Wording Enhancements</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              From Ordinary Tasks to Measurable Impact
            </h2>
            <p className="text-xs text-slate-400">
              *Sample illustrative before-and-after comparison. You maintain total editorial control over every bullet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Card */}
            <div className="interactive-card bg-[#1A2138] rounded-3xl p-7 border border-rose-500/30 space-y-4 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Before (Passive & Vague)</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold">ATS Score: 45</span>
              </div>
              <p className="text-sm text-slate-300 italic font-serif leading-relaxed">
                "Made a Python data analysis project and fixed bugs in our database."
              </p>
              <div className="text-xs text-slate-400 pt-3 border-t border-slate-700/60 space-y-1.5">
                <p>❌ Lacks strong action verbs</p>
                <p>❌ Zero quantifiable metrics or business context</p>
                <p>❌ Missing key data science libraries and tools</p>
              </div>
            </div>

            {/* Improved Card */}
            <div className="interactive-card bg-[#1A2138] rounded-3xl p-7 border border-emerald-500/40 space-y-4 shadow-lg shadow-emerald-500/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">After (AI Enhanced Outcome)</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">ATS Score: 94</span>
              </div>
              <p className="text-sm text-emerald-100 font-serif leading-relaxed">
                "Analyzed a 100,000+ record dataset using Python, Pandas, and PostgreSQL, handling anomalies and creating visualizations that identified churn factors, improving quarterly retention by 18%."
              </p>
              <div className="text-xs text-slate-400 pt-3 border-t border-slate-700/60 space-y-1.5">
                <p>✓ Starts with powerful action verb ("Analyzed")</p>
                <p>✓ Specific scale (100k+ records) and outcome (+18% retention)</p>
                <p>✓ Keyword rich (Python, Pandas, PostgreSQL, Anomalies)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PRICING SECTION */}
      <section id="pricing" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="editorial-tag text-[#6C5CE7]">Honest Plans</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101426]">
            Simple, Transparent Options
          </h2>
          <p className="text-sm text-[#68738A]">
            Start free, build unlimited resumes, and upgrade only when you require enterprise application volumes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className="interactive-card bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-[#101426]">Free Tier</h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">Active</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#101426]">$0</span>
                <span className="text-xs text-slate-500">/ forever</span>
              </div>
              <p className="text-xs text-[#68738A]">
                Perfect for active job seekers crafting their primary resume.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Up to 15 Full ATS Analyses</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> All 10 Professional Templates</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited PDF Exports</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Job Description Matcher</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI Career Assistant Chat</li>
              </ul>
            </div>
            <Link
              to="/signup"
              className="interactive-button mt-8 block text-center py-3 rounded-xl text-xs font-bold text-[#101426] bg-slate-100 hover:bg-slate-200 shadow-sm transition"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="interactive-card bg-white rounded-3xl p-8 border-2 border-[#6C5CE7] shadow-premium relative flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6C5CE7] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-md">
              Most Popular
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-[#101426]">Pro</h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700">Featured</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#101426]">$12</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <p className="text-xs text-[#68738A]">
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
              className="interactive-button mt-8 block w-full text-center py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6C5CE7] to-[#438BFF] shadow-md shadow-violet-500/25 transition"
            >
              Upgrade to Pro (Coming Soon)
            </button>
          </div>

          {/* Career Plus */}
          <div className="interactive-card bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-[#101426]">Career Plus</h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">Enterprise</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#101426]">$29</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <p className="text-xs text-[#68738A]">
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
              className="interactive-button mt-8 block w-full text-center py-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 shadow-sm transition"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </section>

      {/* 10. FAQ ACCORDION SECTION */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-14">
          <span className="editorial-tag text-[#6C5CE7]">Knowledge Base</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101426]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#68738A]">
            Everything you need to know about ATS scoring, AI rewrites, and privacy.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-violet-300 transition-colors">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 text-left flex justify-between items-center text-xs sm:text-sm font-bold text-[#101426] hover:bg-slate-50/80 transition group"
                aria-expanded={openFaq === idx}
              >
                <span className="group-hover:text-[#6C5CE7] transition-colors">{item.q}</span>
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-[#6C5CE7] bg-violet-50' : 'text-slate-400'}`}>
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 text-xs text-[#68738A] leading-relaxed border-t border-slate-100 pt-3 animate-fade-in">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* TEMPLATE PREVIEW MODAL */}
      <Modal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title={selectedPreviewTemplate ? `${selectedPreviewTemplate.name} — Preview` : 'Template Preview'}
        maxWidth="max-w-2xl"
      >
        {selectedPreviewTemplate && (
          <div className="p-6 space-y-5">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden h-72">
              <TemplateMiniaturePreview templateId={selectedPreviewTemplate.id} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="editorial-tag text-[#6C5CE7]">{selectedPreviewTemplate.badge}</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  ATS Verified
                </span>
              </div>
              <h4 className="text-base font-extrabold text-[#101426]">{selectedPreviewTemplate.name}</h4>
              <p className="text-xs text-[#68738A] leading-relaxed">{selectedPreviewTemplate.desc}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Close Preview
              </button>
              <Link
                to={`/dashboard/builder?template=${selectedPreviewTemplate.id}`}
                className="interactive-button px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6C5CE7] to-[#438BFF] shadow-sm transition flex items-center gap-1.5"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </Modal>

      {/* GUEST ANALYSIS RESULT MODAL */}
      <Modal
        isOpen={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        title="Resume ATS Analysis Result"
        maxWidth="max-w-3xl"
      >
        {guestReport && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex flex-col items-center justify-center">
                <ScoreRing
                  score={guestReport.scores?.overall || 0}
                  size={120}
                  strokeWidth={10}
                  subtext="Overall Score"
                  theme="light"
                />
              </div>
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-base font-extrabold text-[#111827]">
                    {guestReport.resumeTitle || 'Uploaded Resume'}
                  </h4>
                  {guestReport.detectedCareerLevel && (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {guestReport.detectedCareerLevel}
                    </span>
                  )}
                  {guestReport.extractionMetadata && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                      {guestReport.extractionMetadata.method === 'pdf-ocr' ? 'Scanned PDF (OCR)' :
                       guestReport.extractionMetadata.method === 'image-ocr' ? 'Image OCR' :
                       guestReport.extractionMetadata.method === 'docx' ? 'DOCX' : 'Selectable Text'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {guestReport.summary}
                </p>
              </div>
            </div>

            {/* Category Scores */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                Category Score Breakdown
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>ATS Readability (25%)</span>
                    <span className="font-bold text-emerald-600">{guestReport.scores?.atsReadability}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${guestReport.scores?.atsReadability}%` }} />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>Keyword Relevance (25%)</span>
                    <span className="font-bold text-violet-600">{guestReport.scores?.keywordAlignment}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5">
                    <div className="bg-violet-600 h-1.5 rounded-full" style={{ width: `${guestReport.scores?.keywordAlignment}%` }} />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>Skills & Experience (20%)</span>
                    <span className="font-bold text-teal-600">{guestReport.scores?.skillsExperience}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5">
                    <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${guestReport.scores?.skillsExperience}%` }} />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>Projects & Impact (15%)</span>
                    <span className="font-bold text-indigo-600">{guestReport.scores?.projectsAchievements}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${guestReport.scores?.projectsAchievements}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Matched Keywords */}
            {guestReport.matchedKeywords?.length > 0 && (
              <div>
                <h5 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">
                  Top Detected Skills ({guestReport.matchedKeywords.length})
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {guestReport.matchedKeywords.slice(0, 10).map((kw, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
                      {kw}
                    </span>
                  ))}
                  {guestReport.matchedKeywords.length > 10 && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]">
                      +{guestReport.matchedKeywords.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Modal CTA Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#438BFF] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="text-center sm:text-left">
                <h5 className="text-sm font-bold">Want to save this analysis and unlock AI rewrites?</h5>
                <p className="text-xs text-violet-100 mt-0.5">
                  Create a free account to apply AI fixes to weak bullets and download ATS-tailored PDFs.
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-white text-violet-700 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-violet-700 hover:bg-violet-800 text-white font-medium text-xs rounded-xl transition"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
};
