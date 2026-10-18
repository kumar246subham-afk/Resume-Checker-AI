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
  Copy
} from 'lucide-react';

export const JobMatcherPage = () => {
  const [searchParams] = useSearchParams();
  const initialResumeId = searchParams.get('resumeId');
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(initialResumeId || '');
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
  const [errorMsg, setErrorMsg] = useState('');

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

    setMatching(true);
    setMatchResult(null);

    try {
      const res = await api.post('/job-matches', {
        resumeId: selectedResumeId || null,
        jobTitle,
        jobDescription
      });

      if (res.data.success) {
        setMatchResult(res.data.data);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to match resume against job description.');
    } finally {
      setMatching(false);
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
      <div>
        <h1 className="text-2xl font-extrabold text-[#111827]">Job Description Matcher</h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Benchmark your resume directly against any job posting to uncover missing skills and optimize for applicant tracking algorithms.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRunMatch} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Resume to Match
              </label>
              {resumes.length === 0 ? (
                <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  No saved resumes found. Using default template profile.
                </div>
              ) : (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#6D5EF7]"
                >
                  {resumes.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.title} ({r.jobTarget})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Job Title
              </label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Lead Software Engineer"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#6D5EF7]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Job Description / Requirements
            </label>
            <textarea
              rows={5}
              required
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description text..."
              className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#6D5EF7] leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={matching}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] shadow-md transition disabled:opacity-50"
            >
              {matching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Match Coverage...
                </>
              ) : (
                <>
                  <Briefcase className="w-4 h-4" />
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-premium">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 border-b lg:border-b-0 lg:border-r border-slate-100">
                <ScoreRing
                  score={matchResult.overallMatchScore}
                  size={150}
                  strokeWidth={12}
                  subtext="Job Description Alignment"
                />
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-base text-[#111827]">
                      Match Analysis for "{matchResult.jobTitle}"
                    </h3>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {matchResult.experienceSummary}
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateTailoredResume}
                    disabled={tailoring}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6D5EF7] to-teal-500 hover:opacity-95 shadow-md transition shrink-0"
                  >
                    <Sparkles className="w-4 h-4" />
                    {tailoring ? 'Generating Tailored Copy...' : '1-Click Create Tailored Resume'}
                  </button>
                </div>

                {/* Sub category bars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[11px] text-slate-500 font-medium block">Skills Match</span>
                    <span className="text-base font-extrabold text-violet-600">
                      {matchResult.categoryScores?.skillsMatch}%
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[11px] text-slate-500 font-medium block">Experience Relevance</span>
                    <span className="text-base font-extrabold text-emerald-600">
                      {matchResult.categoryScores?.experienceMatch}%
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[11px] text-slate-500 font-medium block">Keyword Density</span>
                    <span className="text-base font-extrabold text-teal-600">
                      {matchResult.categoryScores?.keywordDensity}%
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[11px] text-slate-500 font-medium block">Education Alignment</span>
                    <span className="text-base font-extrabold text-indigo-600">
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
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-3">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Matched Required Skills ({matchResult.matchedSkills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchResult.matchedSkills?.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-3">
              <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Missing Target Requirements ({matchResult.missingRequiredSkills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchResult.missingRequiredSkills?.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Actionable Recommendations */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-3">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Tailoring Recommendations for This Application
            </h4>
            <div className="space-y-2 text-xs">
              {matchResult.actionableTips?.map((tip, idx) => (
                <div key={idx} className="p-3 bg-violet-50/50 rounded-xl border border-violet-100 flex items-start gap-2.5 text-slate-800">
                  <Sparkles className="w-4 h-4 text-[#6D5EF7] shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
