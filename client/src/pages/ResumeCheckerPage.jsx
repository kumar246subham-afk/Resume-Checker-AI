import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ScoreRing } from '../components/common/ScoreRing';
import { Modal } from '../components/common/Modal';
import {
  Upload,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  Briefcase,
  Layers,
  ArrowRight,
  Printer,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Check
} from 'lucide-react';

export const ResumeCheckerPage = () => {
  const [searchParams] = useSearchParams();
  const initialResumeId = searchParams.get('resumeId');
  const initialAnalysisId = searchParams.get('analysisId');

  const [activeMode, setActiveMode] = useState('upload'); // 'upload' | 'select' | 'paste'
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [targetJobTitle, setTargetJobTitle] = useState('Senior Software Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [savedResumes, setSavedResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(initialResumeId || '');

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // AI Fix modal state
  const [fixModalOpen, setFixModalOpen] = useState(false);
  const [activeIssue, setActiveIssue] = useState(null);
  const [fixLoading, setFixLoading] = useState(false);
  const [fixResult, setFixResult] = useState('');

  // Load saved resumes & check if initial analysisId requested
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get('/resumes');
        if (res.data.success && res.data.data.length > 0) {
          setSavedResumes(res.data.data);
          if (!selectedResumeId) {
            setSelectedResumeId(res.data.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load resumes', err);
      }
    };

    fetchResumes();

    if (initialAnalysisId) {
      const fetchAnalysis = async () => {
        try {
          const res = await api.get(`/analysis/${initialAnalysisId}`);
          if (res.data.success) {
            setAnalysisReport(res.data.data);
          }
        } catch (err) {
          console.error('Failed to load analysis report', err);
        }
      };
      fetchAnalysis();
    }
  }, [initialAnalysisId]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleRunAudit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setAnalyzing(true);
    setAnalysisReport(null);

    try {
      if (activeMode === 'upload') {
        if (!file) {
          setErrorMsg('Please select a PDF or DOCX file to upload');
          setAnalyzing(false);
          return;
        }

        const formData = new FormData();
        formData.append('resumeFile', file);
        formData.append('targetJobTitle', targetJobTitle);
        formData.append('jobDescription', jobDescription);

        const res = await api.post('/analysis/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data.success) {
          setAnalysisReport(res.data.data);
        }
      } else if (activeMode === 'select') {
        if (!selectedResumeId) {
          setErrorMsg('Please select a saved resume to analyze');
          setAnalyzing(false);
          return;
        }

        const res = await api.post(`/analysis/resume/${selectedResumeId}`, {
          targetJobTitle,
          jobDescription
        });

        if (res.data.success) {
          setAnalysisReport(res.data.data);
        }
      } else if (activeMode === 'paste') {
        if (!pastedText.trim() || pastedText.trim().length < 50) {
          setErrorMsg('Please paste at least 50 characters of resume text');
          setAnalyzing(false);
          return;
        }

        const res = await api.post('/analysis/upload', {
          resumeText: pastedText,
          resumeTitle: 'Pasted Resume Text',
          targetJobTitle,
          jobDescription
        });

        if (res.data.success) {
          setAnalysisReport(res.data.data);
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Analysis failed. Please check the document format.');
    } finally {
      setAnalyzing(false);
    }
  };

  const triggerAIFix = async (issue) => {
    setActiveIssue(issue);
    setFixResult('');
    setFixModalOpen(true);
    setFixLoading(true);

    try {
      const res = await api.post('/analysis/improve', {
        type: 'bullet',
        text: issue.recommendation || issue.explanation,
        context: { targetRole: targetJobTitle }
      });
      if (res.data.success) {
        setFixResult(res.data.data.improved);
      }
    } catch (err) {
      console.error('Failed to generate fix', err);
    } finally {
      setFixLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#111827]">ATS Resume Checker</h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Comprehensive 10-point audit assessing formatting, keyword relevance, action verbs, and quantifiable impact.
        </p>
      </div>

      {/* Input / Upload Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-5">
        
        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-100 pb-3 gap-3">
          <button
            onClick={() => setActiveMode('upload')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeMode === 'upload' ? 'bg-[#6D5EF7] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload PDF / DOCX
          </button>

          <button
            onClick={() => setActiveMode('select')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeMode === 'select' ? 'bg-[#6D5EF7] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Select Saved Resume ({savedResumes.length})
          </button>

          <button
            onClick={() => setActiveMode('paste')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeMode === 'paste' ? 'bg-[#6D5EF7] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            Paste Plain Text
          </button>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRunAudit} className="space-y-4">
          
          {/* Mode 1: File Dropzone */}
          {activeMode === 'upload' && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-violet-200 hover:border-violet-400 bg-slate-50/50 rounded-2xl p-8 text-center transition cursor-pointer"
              onClick={() => document.getElementById('resume-file-input').click()}
            >
              <input
                id="resume-file-input"
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
              <div className="w-12 h-12 bg-violet-100 text-[#6D5EF7] rounded-xl flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-[#111827]">
                {file ? file.name : 'Click to select or drag & drop your resume file'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Accepts PDF or Word DOCX (maximum 10MB)
              </p>
            </div>
          )}

          {/* Mode 2: Select Saved Resume */}
          {activeMode === 'select' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Choose Saved Resume
              </label>
              {savedResumes.length === 0 ? (
                <div className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl">
                  No saved resumes yet. You can upload a file or build one in the Resume Builder.
                </div>
              ) : (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#6D5EF7]"
                >
                  {savedResumes.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.title} ({r.templateId}) — Updated {new Date(r.updatedAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Mode 3: Paste Text */}
          {activeMode === 'paste' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Paste Resume Text
              </label>
              <textarea
                rows={6}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the raw text of your resume here..."
                className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#6D5EF7]"
              />
            </div>
          )}

          {/* Target Role & Optional Job Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Job Title
              </label>
              <input
                type="text"
                value={targetJobTitle}
                onChange={(e) => setTargetJobTitle(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#6D5EF7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex justify-between">
                <span>Target Job Description (Optional)</span>
                <span className="text-[10px] text-slate-400 font-normal">Enables keyword comparison</span>
              </label>
              <textarea
                rows={2}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job posting requirements for precise keyword matching..."
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#6D5EF7]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={analyzing}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] shadow-md transition disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running Algorithmic Audit...
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  Evaluate ATS Compatibility
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ANALYSIS RESULTS REPORT */}
      {analysisReport && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Executive Score Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-premium">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Circular Score */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 border-b lg:border-b-0 lg:border-r border-slate-100">
                <ScoreRing
                  score={analysisReport.scores?.overall || 0}
                  size={150}
                  strokeWidth={12}
                  subtext="Overall ATS Compatibility"
                />
              </div>

              {/* 5 Category Progress Bars */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-[#111827]">Category Score Breakdown</h3>
                  <span className="text-xs text-slate-500 font-medium">Transparent Category Weights</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>ATS Readability (25%)</span>
                      <span className="font-bold text-emerald-600">{analysisReport.scores?.atsReadability}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-1">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${analysisReport.scores?.atsReadability}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>Keyword Relevance (25%)</span>
                      <span className="font-bold text-violet-600">{analysisReport.scores?.keywordAlignment}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-1">
                      <div className="bg-violet-600 h-2 rounded-full" style={{ width: `${analysisReport.scores?.keywordAlignment}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>Skills & Experience (20%)</span>
                      <span className="font-bold text-teal-600">{analysisReport.scores?.skillsExperience}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-1">
                      <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${analysisReport.scores?.skillsExperience}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>Projects & Metrics (15%)</span>
                      <span className="font-bold text-indigo-600">{analysisReport.scores?.projectsAchievements}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-1">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${analysisReport.scores?.projectsAchievements}%` }} />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>Grammar & Clarity (15%)</span>
                      <span className="font-bold text-amber-600">{analysisReport.scores?.grammarClarity}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-1">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${analysisReport.scores?.grammarClarity}%` }} />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {analysisReport.summary}
                </p>
              </div>

            </div>
          </div>

          {/* Keywords Match Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-[#111827]">
              Keyword Intelligence {analysisReport.hasJobDescription ? '(Matched vs Job Description)' : '(Target Industry Core)'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Matched Keywords ({analysisReport.matchedKeywords?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisReport.matchedKeywords?.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white text-emerald-800 border border-emerald-300">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 space-y-2">
                <span className="font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Missing Recommended Keywords ({analysisReport.missingKeywords?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisReport.missingKeywords?.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white text-rose-800 border border-rose-300">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detected Issues & Actionable Fixes */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-[#111827] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Detected Issues & Actionable Improvements ({analysisReport.issues?.length || 0})
            </h3>

            <div className="space-y-3">
              {analysisReport.issues?.map((issue, idx) => (
                <div
                  key={issue.id || idx}
                  className={`p-4 rounded-xl border text-xs space-y-2 transition ${
                    issue.severity === 'critical'
                      ? 'bg-rose-50/50 border-rose-200'
                      : issue.severity === 'warning'
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        issue.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : issue.severity === 'warning'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-200 text-slate-800'
                      }`}>
                        {issue.severity}
                      </span>
                      <h4 className="font-bold text-[#111827]">{issue.title}</h4>
                      <span className="text-[11px] text-slate-500 font-medium">({issue.category})</span>
                    </div>

                    <button
                      onClick={() => triggerAIFix(issue)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6D5EF7] bg-white border border-violet-200 hover:bg-violet-50 px-2.5 py-1 rounded-lg transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate AI Fix
                    </button>
                  </div>

                  <p className="text-slate-700 leading-relaxed">{issue.explanation}</p>
                  <p className="text-slate-900 font-semibold bg-white/70 p-2 rounded-lg border border-slate-200/60">
                    <strong>Recommended Action:</strong> {issue.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Bullet Points Identified */}
          {analysisReport.weakBullets && analysisReport.weakBullets.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
              <h3 className="font-bold text-sm text-[#111827]">
                Bullet Points Identified for Rewriting ({analysisReport.weakBullets.length})
              </h3>

              <div className="space-y-3 text-xs">
                {analysisReport.weakBullets.map((wb, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="text-rose-700 font-medium line-through">
                      "{wb.original}"
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Reason: {wb.reason}
                    </div>
                    <div className="text-emerald-800 font-semibold bg-emerald-50 p-2 rounded border border-emerald-200">
                      Suggested: "{wb.improvedSuggestion}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* AI Fix Dialog */}
      <Modal
        isOpen={fixModalOpen}
        onClose={() => setFixModalOpen(false)}
        title="AI Issue Resolution"
      >
        <div className="space-y-4">
          {fixLoading ? (
            <div className="py-8 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-[#6D5EF7] animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-800">
                Generating verified ATS-compliant rewrite...
              </p>
            </div>
          ) : (
            <>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Issue Title
                </span>
                <p className="text-xs font-bold text-[#111827] mt-0.5">{activeIssue?.title}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6D5EF7]">
                  Proposed Wording
                </span>
                <textarea
                  rows={4}
                  value={fixResult}
                  onChange={(e) => setFixResult(e.target.value)}
                  className="w-full p-3 border-2 border-violet-200 rounded-xl text-xs bg-violet-50/20 text-slate-900 mt-1 focus:outline-none focus:border-[#6D5EF7]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setFixModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Close
                </button>
                <Link
                  to="/dashboard/builder"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] transition"
                >
                  Open in Resume Builder
                </Link>
              </div>
            </>
          )}
        </div>
      </Modal>

    </div>
  );
};
