import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ScoreRing } from '../components/common/ScoreRing';
import {
  Briefcase,
  FileCheck2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  RefreshCw,
  Plus,
  Copy,
  Info,
  Scale,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const JobMatcherPage = () => {
  const [searchParams] = useSearchParams();
  const initialResumeId = searchParams.get('resumeId');
  const navigate = useNavigate();

  // Mode: 'single' (Job Description Match) or 'compare' (Compare Two Job Descriptions)
  const [activeTab, setActiveTab] = useState('single');

  // Resume source: 'saved' | 'paste'
  const [resumeSource, setResumeSource] = useState('saved');
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(initialResumeId || '');
  const [pastedResumeText, setPastedResumeText] = useState('');

  // Single Match state
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Engineer');
  const [jobDescription, setJobDescription] = useState(`We are looking for a Senior Full Stack Engineer with deep experience in React, TypeScript, Node.js, and MongoDB.
Responsibilities:
- Build and scale high-throughput REST APIs and microservices.
- Design responsive frontend applications with React and Tailwind CSS.
- Implement CI/CD pipelines using Docker, GitHub Actions, and AWS cloud infrastructure.
- Write unit tests and maintain high engineering code quality standards.`);

  const [matching, setMatching] = useState(false);
  const [tailoring, setTailoring] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [activeExplainingSkill, setActiveExplainingSkill] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Compare Two JDs state
  const [jobATitle, setJobATitle] = useState('Fintech Full Stack Lead');
  const [jobADesc, setJobADesc] = useState(`Looking for a Full Stack Lead. Requirements: React, TypeScript, Node.js, PostgreSQL, Docker, AWS, system design, CI/CD, and financial compliance.`);
  const [jobBTitle, setJobBTitle] = useState('AI Infrastructure Engineer');
  const [jobBDesc, setJobBDesc] = useState(`Looking for an AI Platform Engineer. Requirements: Python, FastAPI, Docker, Kubernetes, AWS, machine learning, MongoDB, and distributed systems.`);
  const [comparing, setComparing] = useState(false);
  const [compareResult, setCompareResult] = useState(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get('/resumes');
        if (res.data.success && res.data.data.length > 0) {
          setResumes(res.data.data);
          if (!selectedResumeId) {
            setSelectedResumeId(res.data.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load user resumes', err);
      }
    };

    fetchResumes();
  }, []);

  const handleRunMatch = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!jobTitle || !jobDescription) {
      setErrorMsg('Please enter both the target job title and job description');
      return;
    }

    if (resumeSource === 'paste' && (!pastedResumeText.trim() || pastedResumeText.length < 40)) {
      setErrorMsg('Please paste at least 40 characters of your resume text');
      return;
    }

    setMatching(true);
    setMatchResult(null);

    try {
      const payload = {
        jobTitle,
        jobDescription
      };

      if (resumeSource === 'saved') {
        payload.resumeId = selectedResumeId || null;
      } else {
        payload.resumeText = pastedResumeText;
      }

      const res = await api.post('/job-matches', payload);
      if (res.data.success) {
        setMatchResult(res.data.data);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to match resume against job description.');
    } finally {
      setMatching(false);
    }
  };

  const handleRunComparison = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!jobADesc || !jobBDesc) {
      setErrorMsg('Please provide job descriptions for both Job A and Job B');
      return;
    }

    setComparing(true);
    setCompareResult(null);

    try {
      const payload = {
        jobA: { title: jobATitle, description: jobADesc },
        jobB: { title: jobBTitle, description: jobBDesc }
      };

      if (resumeSource === 'saved') {
        payload.resumeId = selectedResumeId || null;
      } else {
        payload.resumeText = pastedResumeText;
      }

      const res = await api.post('/job-matches/compare', payload);
      if (res.data.success) {
        setCompareResult(res.data.data.comparison);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to compare job descriptions.');
    } finally {
      setComparing(false);
    }
  };

  const handleGenerateTailoredResume = async () => {
    if (!matchResult || !matchResult._id) return;
    setTailoring(true);

    try {
      const res = await api.post(`/job-matches/${matchResult._id}/tailor`);
      if (res.data.success) {
        navigate(`/dashboard/builder?id=${res.data.data._id}`);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to generate tailored resume.');
    } finally {
      setTailoring(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7865FF]/10 text-[#7865FF] border border-[#7865FF]/20 text-xs font-semibold mb-2">
            <Briefcase className="w-3.5 h-3.5 text-[#35D9E8]" />
            AI Role Alignment Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F6FF]">Job Description Matcher</h1>
          <p className="text-sm sm:text-[15px] text-[#B5C0D6] mt-1">
            Benchmark your resume against job postings to identify keyword alignment, technical gaps, and role relevance.
          </p>
        </div>

        {/* Tab switcher: Single Match vs Compare Two JDs */}
        <div className="inline-flex rounded-xl bg-[#101A2D] border border-[rgba(166,184,225,0.16)] p-1 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('single')}
            className={`interactive-pill px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'single'
                ? 'bg-gradient-to-r from-[#7865FF] to-[#4285FF] text-white shadow-glow-violet font-bold'
                : 'text-[#8D9AB5] hover:text-[#F4F6FF]'
            }`}
          >
            <Briefcase className="w-4 h-4 text-[#35D9E8]" />
            Job Matcher
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`interactive-pill px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'compare'
                ? 'bg-gradient-to-r from-[#7865FF] to-[#4285FF] text-white shadow-glow-violet font-bold'
                : 'text-[#8D9AB5] hover:text-[#F4F6FF]'
            }`}
          >
            <Scale className="w-4 h-4 text-[#35D9E8]" />
            Compare Two Postings
          </button>
        </div>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="p-4 bg-[#101A2D]/80 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-sm text-[#32D6A0] shadow-sm">
        <ShieldCheck className="w-5 h-5 text-[#32D6A0] shrink-0" />
        <span className="text-[#B5C0D6]">
          <strong className="text-[#32D6A0]">Zero Permanent Storage Guarantee:</strong> You can test and compare job descriptions with direct pasted text without storing any records permanently in our database.
        </span>
      </div>

      {/* Resume Source Selector */}
      <div className="interactive-card bg-[#141E33] rounded-2xl border border-[rgba(166,184,225,0.16)] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(166,184,225,0.12)] pb-3">
          <label className="text-sm font-bold text-[#F4F6FF]">
            Candidate Resume Source
          </label>
          <div className="inline-flex rounded-xl bg-[#101A2D] border border-[rgba(166,184,225,0.16)] p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setResumeSource('saved')}
              className={`interactive-pill px-3.5 py-1.5 rounded-lg transition-all ${
                resumeSource === 'saved'
                  ? 'bg-[#192640] text-[#F4F6FF] border border-[#7865FF]/40 font-bold shadow-sm'
                  : 'text-[#8D9AB5] hover:text-[#F4F6FF]'
              }`}
            >
              Saved Resumes ({resumes.length})
            </button>
            <button
              type="button"
              onClick={() => setResumeSource('paste')}
              className={`interactive-pill px-3.5 py-1.5 rounded-lg transition-all ${
                resumeSource === 'paste'
                  ? 'bg-gradient-to-r from-[#7865FF] to-[#4285FF] text-white shadow-glow-violet font-bold'
                  : 'text-[#8D9AB5] hover:text-[#F4F6FF]'
              }`}
            >
              Paste Resume Text (Private)
            </button>
          </div>
        </div>

        {resumeSource === 'saved' ? (
          <div>
            {resumes.length === 0 ? (
              <div className="text-sm text-[#8D9AB5] bg-[#101A2D] p-4 rounded-xl border border-[rgba(166,184,225,0.14)]">
                No saved resumes found. Switch to "Paste Resume Text" or create one in the Resume Builder.
              </div>
            ) : (
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full text-sm px-4 py-2.5 border border-[rgba(166,184,225,0.18)] rounded-xl bg-[#101A2D] font-medium text-[#F4F6FF] focus:outline-none focus:border-[#7865FF] transition"
              >
                {resumes.map((r) => (
                  <option key={r._id} value={r._id} className="bg-[#101A2D] text-[#F4F6FF]">
                    {r.title} ({r.jobTarget}) — Updated {new Date(r.updatedAt).toLocaleDateString()}
                  </option>
                ))}
              </select>
            )}
          </div>
        ) : (
          <div>
            <textarea
              rows={4}
              value={pastedResumeText}
              onChange={(e) => setPastedResumeText(e.target.value)}
              placeholder="Paste your resume skills, experience, and projects text here (never saved to database)..."
              className="w-full p-4 border border-[rgba(166,184,225,0.18)] rounded-xl text-sm bg-[#101A2D] text-[#F4F6FF] placeholder-[#8D9AB5] focus:outline-none focus:border-[#7865FF] transition leading-relaxed"
            />
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-[#FF728A] text-sm rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TAB 1: SINGLE JOB MATCHER */}
      {activeTab === 'single' && (
        <div className="space-y-6">
          <div className="interactive-card bg-[#141E33] rounded-2xl border border-[rgba(166,184,225,0.16)] p-6 space-y-4">
            <form onSubmit={handleRunMatch} className="space-y-4 text-sm">
              <div>
                <label className="block text-sm font-bold text-[#F4F6FF] mb-1.5">
                  Target Job Title
                </label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full text-sm px-4 py-2.5 border border-[rgba(166,184,225,0.18)] rounded-xl bg-[#101A2D] text-[#F4F6FF] placeholder-[#8D9AB5] focus:outline-none focus:border-[#7865FF] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#F4F6FF] mb-1.5">
                  Job Description / Requirements
                </label>
                <textarea
                  rows={5}
                  required
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description text..."
                  className="w-full p-4 border border-[rgba(166,184,225,0.18)] rounded-xl text-sm bg-[#101A2D] text-[#F4F6FF] placeholder-[#8D9AB5] focus:outline-none focus:border-[#7865FF] leading-relaxed transition"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={matching}
                  className="interactive-button inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7865FF] to-[#4285FF] shadow-glow-violet transition-all disabled:opacity-50"
                >
                  {matching ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing Match Coverage...
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-4 h-4 text-[#35D9E8]" />
                      Run Job Match Analysis
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Match Results */}
          {matchResult && (
            <div className="space-y-6 animate-fade-in">
              {/* Top Score Banner */}
              <div className="bg-[#141E33] rounded-3xl p-6 sm:p-8 border border-[rgba(166,184,225,0.18)] shadow-glow-violet/10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 border-b lg:border-b-0 lg:border-r border-[rgba(166,184,225,0.12)]">
                    <ScoreRing
                      score={matchResult.overallMatchScore}
                      size={150}
                      strokeWidth={12}
                      subtext="Job Description Alignment"
                      theme="dark"
                    />
                  </div>

                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold text-lg text-[#F4F6FF]">
                          Match Analysis for "{matchResult.jobTitle}"
                        </h3>
                        <p className="text-sm text-[#B5C0D6] mt-1">
                          {matchResult.experienceSummary}
                        </p>
                      </div>

                      {matchResult._id && !matchResult.isGuest && (
                        <button
                          onClick={handleGenerateTailoredResume}
                          disabled={tailoring}
                          className="interactive-button inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7865FF] to-[#4285FF] hover:brightness-110 shadow-glow-violet transition shrink-0"
                        >
                          <Sparkles className="w-4 h-4 text-[#35D9E8]" />
                          {tailoring ? 'Generating Tailored Copy...' : '1-Click Create Tailored Resume'}
                        </button>
                      )}
                    </div>

                    {/* Sub category bars */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm pt-2">
                      <div className="interactive-card bg-[#101A2D] p-3 rounded-xl border border-[rgba(166,184,225,0.14)] text-center">
                        <span className="text-[13px] text-[#8D9AB5] font-medium block">Skills Match</span>
                        <span className="text-xl font-extrabold text-[#7865FF]">
                          {matchResult.categoryScores?.skillsMatch}%
                        </span>
                      </div>
                      <div className="interactive-card bg-[#101A2D] p-3 rounded-xl border border-[rgba(166,184,225,0.14)] text-center">
                        <span className="text-[13px] text-[#8D9AB5] font-medium block">Experience Relevance</span>
                        <span className="text-xl font-extrabold text-[#32D6A0]">
                          {matchResult.categoryScores?.experienceMatch}%
                        </span>
                      </div>
                      <div className="interactive-card bg-[#101A2D] p-3 rounded-xl border border-[rgba(166,184,225,0.14)] text-center">
                        <span className="text-[13px] text-[#8D9AB5] font-medium block">Keyword Density</span>
                        <span className="text-xl font-extrabold text-[#35D9E8]">
                          {matchResult.categoryScores?.keywordDensity}%
                        </span>
                      </div>
                      <div className="interactive-card bg-[#101A2D] p-3 rounded-xl border border-[rgba(166,184,225,0.14)] text-center">
                        <span className="text-[13px] text-[#8D9AB5] font-medium block">Education Alignment</span>
                        <span className="text-xl font-extrabold text-[#4285FF]">
                          {matchResult.categoryScores?.educationMatch}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Matched vs Missing Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Matched Skills */}
                <div className="interactive-card bg-[#141E33] rounded-2xl p-6 border border-[rgba(166,184,225,0.16)] space-y-3">
                  <h4 className="text-xs font-bold text-[#32D6A0] uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#32D6A0]" />
                      Matched Skills ({matchResult.matchedSkills?.length || 0})
                    </span>
                    <span className="text-[13px] text-[#8D9AB5] lowercase font-normal">Click skill for context</span>
                  </h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {matchResult.matchedSkills?.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveExplainingSkill(activeExplainingSkill === s ? null : s)}
                        className={`interactive-pill px-3 py-1.5 rounded-lg text-xs font-semibold transition border text-left ${
                          activeExplainingSkill === s
                            ? 'bg-[#32D6A0] text-[#080D1B] border-[#32D6A0] font-bold shadow-sm'
                            : 'bg-emerald-500/15 text-[#32D6A0] border-emerald-500/30 hover:border-emerald-500/60'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="interactive-card bg-[#141E33] rounded-2xl p-6 border border-[rgba(166,184,225,0.16)] space-y-3">
                  <h4 className="text-xs font-bold text-[#FF728A] uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-[#FF728A]" />
                      Missing Requirements ({matchResult.missingRequiredSkills?.length || 0})
                    </span>
                    <span className="text-[13px] text-[#8D9AB5] lowercase font-normal">Click skill for context</span>
                  </h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {matchResult.missingRequiredSkills?.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveExplainingSkill(activeExplainingSkill === s ? null : s)}
                        className={`interactive-pill px-3 py-1.5 rounded-lg text-xs font-semibold transition border text-left ${
                          activeExplainingSkill === s
                            ? 'bg-[#FF728A] text-[#080D1B] border-[#FF728A] font-bold shadow-sm'
                            : 'bg-rose-500/15 text-[#FF728A] border-rose-500/30 hover:border-rose-500/60'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Keyword Relevance Explainer Box */}
              {activeExplainingSkill && matchResult.skillExplanations && (
                <div className="interactive-card p-5 bg-[#192640] rounded-2xl border border-[#7865FF]/40 text-sm space-y-1.5 animate-fade-in shadow-glow-violet/10">
                  <div className="flex items-center gap-2 font-bold text-[#F4F6FF] uppercase tracking-wider text-xs">
                    <Info className="w-4 h-4 text-[#7865FF]" />
                    <span>Why "{activeExplainingSkill}" is relevant:</span>
                  </div>
                  <p className="text-[#B5C0D6] leading-relaxed">
                    {matchResult.skillExplanations[activeExplainingSkill] || 'Critical competency highlighted in the job specification for technical screening.'}
                  </p>
                </div>
              )}

              {/* Actionable Recommendations */}
              <div className="interactive-card bg-[#141E33] rounded-2xl p-6 border border-[rgba(166,184,225,0.16)] space-y-4">
                <h4 className="text-xs font-bold text-[#F4F6FF] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#7865FF]" />
                  Targeted Resume Improvements for This Posting
                </h4>
                <div className="space-y-2.5 text-sm">
                  {matchResult.actionableTips?.map((tip, idx) => (
                    <div key={idx} className="p-3.5 bg-[#101A2D] rounded-xl border border-[rgba(166,184,225,0.14)] flex items-start gap-3 text-[#F4F6FF]">
                      <Sparkles className="w-4 h-4 text-[#35D9E8] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMPARE TWO JOB POSTINGS */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          <div className="bg-[#141E33] rounded-2xl border border-[rgba(166,184,225,0.16)] p-6 space-y-5">
            <div>
              <h3 className="font-extrabold text-base text-[#F4F6FF] flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#7865FF]" />
                Side-by-Side Job Posting Comparison
              </h3>
              <p className="text-sm text-[#B5C0D6] mt-1">
                Paste two different job postings to discover which role your resume is better aligned with, and uncover unique skill requirements for each company.
              </p>
            </div>

            <form onSubmit={handleRunComparison} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job A */}
                <div className="interactive-card p-5 bg-[#101A2D] rounded-2xl border border-[rgba(166,184,225,0.16)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#F4F6FF]">Job Opportunity A</span>
                    <span className="text-[11px] bg-[#192640] px-2.5 py-0.5 rounded border border-[rgba(166,184,225,0.2)] font-semibold text-[#B5C0D6]">Option 1</span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#8D9AB5] mb-1">Target Title</label>
                    <input
                      type="text"
                      value={jobATitle}
                      onChange={(e) => setJobATitle(e.target.value)}
                      className="w-full px-3.5 py-2 border border-[rgba(166,184,225,0.18)] rounded-xl bg-[#0B1120] text-[#F4F6FF] focus:outline-none focus:border-[#7865FF] transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#8D9AB5] mb-1">Job Description Text</label>
                    <textarea
                      rows={6}
                      value={jobADesc}
                      onChange={(e) => setJobADesc(e.target.value)}
                      placeholder="Paste Job A requirements..."
                      className="w-full p-3 border border-[rgba(166,184,225,0.18)] rounded-xl bg-[#0B1120] text-[#F4F6FF] focus:outline-none focus:border-[#7865FF] transition text-sm leading-relaxed"
                    />
                  </div>
                </div>

                {/* Job B */}
                <div className="interactive-card p-5 bg-[#101A2D] rounded-2xl border border-[rgba(166,184,225,0.16)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#F4F6FF]">Job Opportunity B</span>
                    <span className="text-[11px] bg-[#192640] px-2.5 py-0.5 rounded border border-[rgba(166,184,225,0.2)] font-semibold text-[#B5C0D6]">Option 2</span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#8D9AB5] mb-1">Target Title</label>
                    <input
                      type="text"
                      value={jobBTitle}
                      onChange={(e) => setJobBTitle(e.target.value)}
                      className="w-full px-3.5 py-2 border border-[rgba(166,184,225,0.18)] rounded-xl bg-[#0B1120] text-[#F4F6FF] focus:outline-none focus:border-[#7865FF] transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#8D9AB5] mb-1">Job Description Text</label>
                    <textarea
                      rows={6}
                      value={jobBDesc}
                      onChange={(e) => setJobBDesc(e.target.value)}
                      placeholder="Paste Job B requirements..."
                      className="w-full p-3 border border-[rgba(166,184,225,0.18)] rounded-xl bg-[#0B1120] text-[#F4F6FF] focus:outline-none focus:border-[#7865FF] transition text-sm leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={comparing}
                  className="interactive-button inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#7865FF] to-[#4285FF] shadow-glow-violet transition-all disabled:opacity-50"
                >
                  {comparing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Benchmarking Postings...
                    </>
                  ) : (
                    <>
                      <Scale className="w-4 h-4 text-[#35D9E8]" />
                      Compare Both Job Postings
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Comparison Results */}
          {compareResult && (
            <div className="bg-[#141E33] rounded-3xl p-6 sm:p-8 border border-[rgba(166,184,225,0.18)] shadow-glow-violet/10 space-y-6 animate-fade-in">
              <div className="interactive-card p-5 bg-[#101A2D] border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#32D6A0] block">
                    Strategic Recommendation
                  </span>
                  <h3 className="font-extrabold text-base text-[#F4F6FF] mt-0.5">
                    Highest Match: "{compareResult.recommendedTarget}" ({compareResult.scoreDifference}% advantage)
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#32D6A0]">
                    Shared Core Skills: {compareResult.sharedSkills?.length || 0}
                  </span>
                </div>
              </div>

              {/* Side by side score cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                {/* Job A Breakdown */}
                <div className="interactive-card p-6 rounded-2xl border border-[rgba(166,184,225,0.16)] bg-[#101A2D] space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-base text-[#F4F6FF]">{compareResult.jobA.title}</h4>
                    <span className="text-2xl font-black text-[#7865FF]">{compareResult.jobA.score}%</span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-[#8D9AB5] block mb-1.5">
                      Matched Skills ({compareResult.jobA.matchedSkills?.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {compareResult.jobA.matchedSkills?.map((s, idx) => (
                        <span key={idx} className="interactive-pill px-2.5 py-1 rounded-lg bg-emerald-500/15 text-[#32D6A0] border border-emerald-500/30 text-xs font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-[#8D9AB5] block mb-1.5">
                      Unique to this role ({compareResult.jobA.uniqueSkills?.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {compareResult.jobA.uniqueSkills?.map((s, idx) => (
                        <span key={idx} className="interactive-pill px-2.5 py-1 rounded-lg bg-[#7865FF]/15 text-[#7865FF] border border-[#7865FF]/30 text-xs font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Job B Breakdown */}
                <div className="interactive-card p-6 rounded-2xl border border-[rgba(166,184,225,0.16)] bg-[#101A2D] space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-base text-[#F4F6FF]">{compareResult.jobB.title}</h4>
                    <span className="text-2xl font-black text-[#35D9E8]">{compareResult.jobB.score}%</span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-[#8D9AB5] block mb-1.5">
                      Matched Skills ({compareResult.jobB.matchedSkills?.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {compareResult.jobB.matchedSkills?.map((s, idx) => (
                        <span key={idx} className="interactive-pill px-2.5 py-1 rounded-lg bg-emerald-500/15 text-[#32D6A0] border border-emerald-500/30 text-xs font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-[#8D9AB5] block mb-1.5">
                      Unique to this role ({compareResult.jobB.uniqueSkills?.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {compareResult.jobB.uniqueSkills?.map((s, idx) => (
                        <span key={idx} className="interactive-pill px-2.5 py-1 rounded-lg bg-[#35D9E8]/15 text-[#35D9E8] border border-[#35D9E8]/30 text-xs font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
