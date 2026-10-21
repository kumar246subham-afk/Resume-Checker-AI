import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ScoreRing } from '../components/common/ScoreRing';
import {
  Hammer,
  FileCheck2,
  Briefcase,
  FileText,
  Sparkles,
  ArrowRight,
  Plus,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Trash2,
  Download
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumesRes, analysesRes] = await Promise.all([
          api.get('/resumes'),
          api.get('/analysis')
        ]);

        if (resumesRes.data.success) {
          setResumes(resumesRes.data.data);
        }
        if (analysesRes.data.success) {
          setRecentAnalyses(analysesRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateNewResume = async () => {
    try {
      const res = await api.post('/resumes', {
        title: `${user?.name || 'My'} Professional Resume`,
        jobTarget: user?.preferences?.targetJobRole || 'Software Engineer',
        templateId: user?.preferences?.preferredTemplate || 'ats-classic'
      });

      if (res.data.success) {
        navigate(`/dashboard/builder?id=${res.data.data._id}`);
      }
    } catch (err) {
      console.error('Failed to create resume', err);
    }
  };

  const latestAnalysis = recentAnalyses[0] || null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* A. Welcome Hero Section - Option A + Option C Futuristic Studio */}
      <div className="bg-gradient-to-r from-[#141E33] via-[#192640] to-[#101A2D] text-[#F4F6FF] rounded-2xl p-6 sm:p-8 border border-[rgba(166,184,225,0.18)] shadow-[0_12px_40px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute -right-24 -top-24 w-72 h-72 bg-[#7865FF]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-48 -bottom-24 w-64 h-64 bg-[#35D9E8]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#101A2D]/80 text-[#35D9E8] text-[13px] font-semibold mb-3 border border-[#35D9E8]/25 backdrop-blur-sm shadow-[0_0_12px_rgba(53,217,232,0.15)]">
            <Sparkles className="w-4 h-4 text-[#35D9E8]" />
            <span>Target Role: {user?.preferences?.targetJobRole || 'Software Engineering'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold tracking-tight text-[#F4F6FF]">
            Welcome back, {user?.name || 'Professional'}!
          </h1>
          <p className="text-[15px] sm:text-[16px] text-[#B5C0D6] mt-2 leading-relaxed">
            Monitor your ATS resume health, identify missing industry keywords, and generate interview-winning resumes with grounded, non-hallucinatory AI guidance.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <button
            onClick={handleCreateNewResume}
            className="studio-btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-[15px] group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
            <span>Build New Resume</span>
          </button>

          <Link
            to="/dashboard/checker"
            className="studio-btn-secondary inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-[15px] group"
          >
            <FileCheck2 className="w-4 h-4 text-[#35D9E8] transition-transform group-hover:scale-110 duration-200" />
            <span>Check Existing Resume</span>
          </Link>
        </div>
      </div>

      {/* B. Statistics Cards (4 Metric Cards with Real Data & Medium Typography) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="studio-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] font-medium text-[#8D9AB5]">Total Resumes</span>
            <div className="w-9 h-9 rounded-xl bg-[#7865FF]/15 text-[#7865FF] flex items-center justify-center border border-[#7865FF]/25">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#F4F6FF] tracking-tight mb-1">
            {resumes.length}
          </div>
          <p className="text-[13px] text-[#B5C0D6]">Active documents created in builder</p>
        </div>

        <div className="studio-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] font-medium text-[#8D9AB5]">Completed Audits</span>
            <div className="w-9 h-9 rounded-xl bg-[#35D9E8]/15 text-[#35D9E8] flex items-center justify-center border border-[#35D9E8]/25">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#F4F6FF] tracking-tight mb-1">
            {recentAnalyses.length}
          </div>
          <p className="text-[13px] text-[#B5C0D6]">Total ATS compatibility scans</p>
        </div>

        <div className="studio-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] font-medium text-[#8D9AB5]">Latest ATS Score</span>
            <div className="w-9 h-9 rounded-xl bg-[#32D6A0]/15 text-[#32D6A0] flex items-center justify-center border border-[#32D6A0]/25">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#F4F6FF] tracking-tight mb-1 flex items-baseline gap-1.5">
            <span>{latestAnalysis ? latestAnalysis.scores?.overall : '—'}</span>
            {latestAnalysis && <span className="text-[13px] text-[#8D9AB5] font-semibold">/100</span>}
          </div>
          <p className="text-[13px] text-[#B5C0D6]">
            {latestAnalysis ? (latestAnalysis.scores?.overall >= 80 ? 'Competitive candidate tier' : 'Optimization suggested') : 'No resume audited yet'}
          </p>
        </div>

        <div className="studio-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] font-medium text-[#8D9AB5]">Target Readiness</span>
            <div className="w-9 h-9 rounded-xl bg-[#4285FF]/15 text-[#4285FF] flex items-center justify-center border border-[#4285FF]/25">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#F4F6FF] tracking-tight mb-1">
            {latestAnalysis ? `${Math.round((latestAnalysis.scores?.overall || 0) * 0.95)}%` : 'Ready'}
          </div>
          <p className="text-[13px] text-[#B5C0D6]">
            Based on current career profile
          </p>
        </div>
      </div>

      {/* C. Quick-Action Studio (6 Premium Studio Cards) */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#F4F6FF] tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#35D9E8]" />
            AI Career Studio Workspaces
          </h2>
          <p className="text-[14px] text-[#8D9AB5] mt-0.5">
            Select a specialized AI workflow to craft, evaluate, or optimize your resume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: AI Resume Builder */}
          <Link
            to="/dashboard/builder"
            className="studio-card p-6 rounded-2xl group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#7865FF]/15 text-[#7865FF] flex items-center justify-center border border-[#7865FF]/30 group-hover:scale-110 group-hover:bg-[#7865FF]/25 transition-all duration-200">
                  <Hammer className="w-6 h-6 transition-transform group-hover:-rotate-12 duration-200" />
                </div>
                <ArrowRight className="w-5 h-5 text-[#8D9AB5] group-hover:text-[#7865FF] group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-bold text-[17px] text-[#F4F6FF] group-hover:text-[#9182FF] transition-colors">
                AI Resume Builder
              </h3>
              <p className="text-[14px] text-[#B5C0D6] mt-1.5 leading-relaxed">
                Create structured, ATS-compliant resumes from scratch with live A4 preview and verified metric bullets.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(166,184,225,0.1)] flex items-center gap-2 text-[13px] font-semibold text-[#7865FF]">
              <span>Open Builder</span>
              <span className="text-[#35D9E8] font-normal">• 10 Templates</span>
            </div>
          </Link>

          {/* Card 2: ATS Resume Checker */}
          <Link
            to="/dashboard/checker"
            className="studio-card p-6 rounded-2xl group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#35D9E8]/15 text-[#35D9E8] flex items-center justify-center border border-[#35D9E8]/30 group-hover:scale-110 group-hover:bg-[#35D9E8]/25 transition-all duration-200">
                  <FileCheck2 className="w-6 h-6 transition-transform group-hover:scale-110 duration-200" />
                </div>
                <ArrowRight className="w-5 h-5 text-[#8D9AB5] group-hover:text-[#35D9E8] group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-bold text-[17px] text-[#F4F6FF] group-hover:text-[#35D9E8] transition-colors">
                ATS Resume Checker
              </h3>
              <p className="text-[14px] text-[#B5C0D6] mt-1.5 leading-relaxed">
                Audit readability, keyword density, parsing formatting, and impact verbs with detailed actionable scores.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(166,184,225,0.1)] flex items-center gap-2 text-[13px] font-semibold text-[#35D9E8]">
              <span>Audit Document</span>
              <span className="text-[#8D9AB5] font-normal">• Fast & Deep Scan</span>
            </div>
          </Link>

          {/* Card 3: Job Description Matcher */}
          <Link
            to="/dashboard/job-matcher"
            className="studio-card p-6 rounded-2xl group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#4285FF]/15 text-[#4285FF] flex items-center justify-center border border-[#4285FF]/30 group-hover:scale-110 group-hover:bg-[#4285FF]/25 transition-all duration-200">
                  <Briefcase className="w-6 h-6 transition-transform group-hover:scale-110 duration-200" />
                </div>
                <ArrowRight className="w-5 h-5 text-[#8D9AB5] group-hover:text-[#4285FF] group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-bold text-[17px] text-[#F4F6FF] group-hover:text-[#4285FF] transition-colors">
                Job Description Matcher
              </h3>
              <p className="text-[14px] text-[#B5C0D6] mt-1.5 leading-relaxed">
                Compare your resume against single or competing job descriptions to highlight missing critical skills.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(166,184,225,0.1)] flex items-center gap-2 text-[13px] font-semibold text-[#4285FF]">
              <span>Compare Job Spec</span>
              <span className="text-[#8D9AB5] font-normal">• Skill Gap Matrix</span>
            </div>
          </Link>

          {/* Card 4: AI Resume Improver */}
          <Link
            to="/dashboard/improver"
            className="studio-card p-6 rounded-2xl group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#7865FF]/15 text-[#7865FF] flex items-center justify-center border border-[#7865FF]/30 group-hover:scale-110 group-hover:bg-[#7865FF]/25 transition-all duration-200">
                  <Sparkles className="w-6 h-6 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-200" />
                </div>
                <ArrowRight className="w-5 h-5 text-[#8D9AB5] group-hover:text-[#7865FF] group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-bold text-[17px] text-[#F4F6FF] group-hover:text-[#9182FF] transition-colors">
                AI Resume Improver
              </h3>
              <p className="text-[14px] text-[#B5C0D6] mt-1.5 leading-relaxed">
                Review side-by-side bullet point diffs and enhance impact with zero-hallucination user metrics.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(166,184,225,0.1)] flex items-center gap-2 text-[13px] font-semibold text-[#7865FF]">
              <span>Smart Rewriter</span>
              <span className="text-[#32D6A0] font-normal">• Zero Hallucination</span>
            </div>
          </Link>

          {/* Card 5: Professional Templates */}
          <Link
            to="/dashboard/templates"
            className="studio-card p-6 rounded-2xl group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#32D6A0]/15 text-[#32D6A0] flex items-center justify-center border border-[#32D6A0]/30 group-hover:scale-110 group-hover:bg-[#32D6A0]/25 transition-all duration-200">
                  <Plus className="w-6 h-6 transition-transform group-hover:scale-110 duration-200" />
                </div>
                <ArrowRight className="w-5 h-5 text-[#8D9AB5] group-hover:text-[#32D6A0] group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-bold text-[17px] text-[#F4F6FF] group-hover:text-[#32D6A0] transition-colors">
                Professional Templates
              </h3>
              <p className="text-[14px] text-[#B5C0D6] mt-1.5 leading-relaxed">
                Explore 10 curated, ATS-friendly templates tailored for executives, engineers, creatives, and graduates.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(166,184,225,0.1)] flex items-center gap-2 text-[13px] font-semibold text-[#32D6A0]">
              <span>Browse Gallery</span>
              <span className="text-[#8D9AB5] font-normal">• 10 Formats</span>
            </div>
          </Link>

          {/* Card 6: AI Career Assistant */}
          <Link
            to="/dashboard/career-assistant"
            className="studio-card p-6 rounded-2xl group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFC56E]/15 text-[#FFC56E] flex items-center justify-center border border-[#FFC56E]/30 group-hover:scale-110 group-hover:bg-[#FFC56E]/25 transition-all duration-200">
                  <Sparkles className="w-6 h-6 transition-transform group-hover:scale-110 duration-200" />
                </div>
                <ArrowRight className="w-5 h-5 text-[#8D9AB5] group-hover:text-[#FFC56E] group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-bold text-[17px] text-[#F4F6FF] group-hover:text-[#FFC56E] transition-colors">
                AI Career Assistant
              </h3>
              <p className="text-[14px] text-[#B5C0D6] mt-1.5 leading-relaxed">
                Consult a specialized career mentor for cover letter drafting, interview questions, and salary negotiation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(166,184,225,0.1)] flex items-center gap-2 text-[13px] font-semibold text-[#FFC56E]">
              <span>Ask Advisor</span>
              <span className="text-[#8D9AB5] font-normal">• Chat Assistant</span>
            </div>
          </Link>
        </div>
      </div>

      {/* D & E. Main Grid: Recent Resumes & Latest ATS Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col (7 cols): My Resumes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#F4F6FF] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#7865FF]" />
              My Saved Resumes
            </h2>
            <Link to="/dashboard/resumes" className="text-[14px] font-semibold text-[#7865FF] hover:text-[#9182FF] hover:underline">
              View All ({resumes.length})
            </Link>
          </div>

          {loading ? (
            <div className="studio-card rounded-2xl p-8 text-center text-[14px] text-[#8D9AB5] animate-pulse">
              Loading your saved resumes...
            </div>
          ) : resumes.length === 0 ? (
            <div className="studio-card rounded-2xl p-8 border-dashed border-[rgba(166,184,225,0.2)] text-center space-y-4">
              <div className="w-14 h-14 bg-[#7865FF]/15 text-[#7865FF] rounded-2xl flex items-center justify-center mx-auto border border-[#7865FF]/25">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-[17px] text-[#F4F6FF]">No resumes created yet</h3>
              <p className="text-[14px] text-[#B5C0D6] max-w-sm mx-auto">
                Create a professional resume from scratch or import one using our ATS-optimized builder.
              </p>
              <button
                onClick={handleCreateNewResume}
                className="studio-btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold transition"
              >
                <Plus className="w-4 h-4" />
                Create First Resume
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.slice(0, 4).map((resume) => (
                <div
                  key={resume._id}
                  className="studio-card rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-[#7865FF]/40"
                >
                  <div>
                    <h3 className="font-bold text-[15px] text-[#F4F6FF] flex items-center gap-2">
                      {resume.title}
                      <span className="text-[11px] uppercase font-semibold px-2 py-0.5 rounded bg-[#101A2D] text-[#35D9E8] border border-[#35D9E8]/20">
                        {resume.templateId}
                      </span>
                    </h3>
                    <p className="text-[13px] text-[#8D9AB5] mt-0.5">
                      Target: {resume.jobTarget || 'General'} • Updated {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/dashboard/builder?id=${resume._id}`}
                      className="px-3.5 py-1.5 rounded-lg text-[13px] font-semibold text-[#F4F6FF] bg-[#192640] hover:bg-[#7865FF] hover:text-white border border-[rgba(166,184,225,0.18)] transition-all duration-180"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/dashboard/checker?resumeId=${resume._id}`}
                      className="px-3.5 py-1.5 rounded-lg text-[13px] font-semibold text-[#35D9E8] bg-[#101A2D] hover:bg-[#35D9E8]/20 border border-[#35D9E8]/30 transition-all duration-180"
                    >
                      Audit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col (5 cols): Latest ATS Score Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#F4F6FF] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#32D6A0]" />
              Latest ATS Evaluation
            </h2>
            {latestAnalysis && (
              <Link to={`/dashboard/checker?analysisId=${latestAnalysis._id}`} className="text-[14px] font-semibold text-[#7865FF] hover:text-[#9182FF] hover:underline">
                View Full Audit
              </Link>
            )}
          </div>

          {latestAnalysis ? (
            <div className="studio-card rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[15px] text-[#F4F6FF]">{latestAnalysis.resumeTitle}</h3>
                  <p className="text-[13px] text-[#8D9AB5]">Audited: {new Date(latestAnalysis.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-[13px] font-bold text-[#32D6A0] bg-[#32D6A0]/15 border border-[#32D6A0]/30 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(50,214,160,0.15)]">
                  Score: {latestAnalysis.scores?.overall}/100
                </span>
              </div>

              <div className="flex justify-center py-2">
                <ScoreRing score={latestAnalysis.scores?.overall || 0} size={130} strokeWidth={11} subtext="ATS Score" theme="dark" />
              </div>

              {/* Category Breakdown */}
              <div className="space-y-2.5 text-[14px] border-t border-[rgba(166,184,225,0.14)] pt-3.5">
                <div className="flex justify-between text-[#B5C0D6]">
                  <span>ATS Readability</span>
                  <span className="font-bold text-[#F4F6FF]">{latestAnalysis.scores?.atsReadability}%</span>
                </div>
                <div className="flex justify-between text-[#B5C0D6]">
                  <span>Keyword Alignment</span>
                  <span className="font-bold text-[#F4F6FF]">{latestAnalysis.scores?.keywordAlignment}%</span>
                </div>
                <div className="flex justify-between text-[#B5C0D6]">
                  <span>Skills & Experience</span>
                  <span className="font-bold text-[#F4F6FF]">{latestAnalysis.scores?.skillsExperience}%</span>
                </div>
              </div>

              {/* Quick issue highlight */}
              {latestAnalysis.issues && latestAnalysis.issues.length > 0 && (
                <div className="bg-[#FFC56E]/10 rounded-xl p-3.5 border border-[#FFC56E]/25 text-[13px]">
                  <div className="flex items-center gap-1.5 font-bold text-[#FFC56E] mb-1">
                    <AlertTriangle className="w-4 h-4 text-[#FFC56E]" />
                    <span>Top Priority Issue</span>
                  </div>
                  <p className="text-[13px] text-[#B5C0D6]">
                    {latestAnalysis.issues[0]?.title}: {latestAnalysis.issues[0]?.recommendation}
                  </p>
                </div>
              )}

              <Link
                to={`/dashboard/improver?analysisId=${latestAnalysis._id}`}
                className="studio-btn-primary w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[14px] font-semibold"
              >
                <Sparkles className="w-4 h-4 text-[#35D9E8]" />
                Improve with AI Now
              </Link>
            </div>
          ) : (
            <div className="studio-card rounded-2xl p-8 border-dashed border-[rgba(166,184,225,0.2)] text-center space-y-4">
              <div className="w-14 h-14 bg-[#101A2D] text-[#8D9AB5] rounded-2xl flex items-center justify-center mx-auto border border-[rgba(166,184,225,0.16)]">
                <ScoreRing score={0} size={44} strokeWidth={5} showLabel={false} theme="dark" />
              </div>
              <h3 className="font-bold text-[17px] text-[#F4F6FF]">No ATS Analysis Yet</h3>
              <p className="text-[14px] text-[#B5C0D6]">
                Upload your resume or audit a saved draft to calculate your score across 5 categories.
              </p>
              <Link
                to="/dashboard/checker"
                className="studio-btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold"
              >
                <FileCheck2 className="w-4 h-4 text-[#35D9E8]" />
                Run First Audit
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
