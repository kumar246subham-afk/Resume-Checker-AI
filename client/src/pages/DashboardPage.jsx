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
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#111827] to-[#1F2937] text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[11px] font-semibold mb-2 border border-violet-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Targeting: {user?.preferences?.targetJobRole || 'Software Engineering'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Professional'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Track your ATS score health, match new job descriptions, and create interview-winning resumes with grounded AI assistance.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleCreateNewResume}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            Build New Resume
          </button>
          <Link
            to="/dashboard/checker"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
          >
            <FileCheck2 className="w-4 h-4 text-teal-400" />
            Check Existing Resume
          </Link>
        </div>
      </div>

      {/* 3 Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/dashboard/builder"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle hover:border-violet-300 hover:shadow-card-hover transition group flex items-start justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-[#6D5EF7] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Hammer className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#111827]">AI Resume Builder</h3>
            <p className="text-xs text-[#64748B] mt-1 leading-normal">
              Edit sections, reorder bullets, and view real-time A4 preview.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#6D5EF7] group-hover:translate-x-1 transition" />
        </Link>

        <Link
          to="/dashboard/checker"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle hover:border-teal-300 hover:shadow-card-hover transition group flex items-start justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#111827]">ATS Resume Checker</h3>
            <p className="text-xs text-[#64748B] mt-1 leading-normal">
              Audit readability, keyword density, and action verbs.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition" />
        </Link>

        <Link
          to="/dashboard/job-matcher"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle hover:border-indigo-300 hover:shadow-card-hover transition group flex items-start justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#111827]">Job Description Matcher</h3>
            <p className="text-xs text-[#64748B] mt-1 leading-normal">
              Compare your resume against any job description to uncover missing skills.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
        </Link>
      </div>

      {/* Main Grid: Recent Resumes & Latest Analysis Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col (8 cols): My Resumes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#6D5EF7]" />
              My Saved Resumes
            </h2>
            <Link to="/dashboard/resumes" className="text-xs font-bold text-[#6D5EF7] hover:underline">
              View All ({resumes.length})
            </Link>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-xs text-slate-500 animate-pulse">
              Loading your saved resumes...
            </div>
          ) : resumes.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 bg-violet-50 text-[#6D5EF7] rounded-xl flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-[#111827]">No resumes created yet</h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                Create a professional resume from scratch or import one using our ATS-optimized builder.
              </p>
              <button
                onClick={handleCreateNewResume}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Create First Resume
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.slice(0, 4).map((resume) => (
                <div
                  key={resume._id}
                  className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-violet-200 hover:shadow-subtle transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <div>
                    <h3 className="font-bold text-xs text-[#111827] flex items-center gap-1.5">
                      {resume.title}
                      <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        {resume.templateId}
                      </span>
                    </h3>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Target: {resume.jobTarget || 'General'} • Updated {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/dashboard/builder?id=${resume._id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#6D5EF7] bg-violet-50 hover:bg-violet-100 transition"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/dashboard/checker?resumeId=${resume._id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
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
            <h2 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Latest ATS Evaluation
            </h2>
            {latestAnalysis && (
              <Link to={`/dashboard/checker?analysisId=${latestAnalysis._id}`} className="text-xs font-bold text-[#6D5EF7] hover:underline">
                View Full Audit
              </Link>
            )}
          </div>

          {latestAnalysis ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-[#111827]">{latestAnalysis.resumeTitle}</h3>
                  <p className="text-[11px] text-[#64748B]">Audited: {new Date(latestAnalysis.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Score: {latestAnalysis.scores?.overall}/100
                </span>
              </div>

              <div className="flex justify-center py-2">
                <ScoreRing score={latestAnalysis.scores?.overall || 0} size={120} strokeWidth={10} subtext="ATS Score" />
              </div>

              {/* Category Breakdown */}
              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between text-slate-700">
                  <span>ATS Readability</span>
                  <span className="font-bold text-slate-900">{latestAnalysis.scores?.atsReadability}%</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Keyword Alignment</span>
                  <span className="font-bold text-slate-900">{latestAnalysis.scores?.keywordAlignment}%</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Skills & Experience</span>
                  <span className="font-bold text-slate-900">{latestAnalysis.scores?.skillsExperience}%</span>
                </div>
              </div>

              {/* Quick issue highlight */}
              {latestAnalysis.issues && latestAnalysis.issues.length > 0 && (
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Top Priority Issue</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    {latestAnalysis.issues[0]?.title}: {latestAnalysis.issues[0]?.recommendation}
                  </p>
                </div>
              )}

              <Link
                to={`/dashboard/improver?analysisId=${latestAnalysis._id}`}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Improve with AI Now
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center mx-auto">
                <ScoreRing score={0} size={40} strokeWidth={5} showLabel={false} />
              </div>
              <h3 className="font-bold text-sm text-[#111827]">No ATS Analysis Yet</h3>
              <p className="text-xs text-[#64748B]">
                Upload your resume or audit a saved draft to calculate your score across 5 categories.
              </p>
              <Link
                to="/dashboard/checker"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] transition"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                Run First Audit
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
