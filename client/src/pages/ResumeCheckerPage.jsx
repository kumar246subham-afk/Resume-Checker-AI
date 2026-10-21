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
  const [careerMode, setCareerMode] = useState('experienced'); // 'experienced' | 'fresher'
  const [fresherTrack, setFresherTrack] = useState('software_developer');
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
          setErrorMsg('Please select a PDF, Word DOCX, or image file (PNG/JPG) to upload');
          setAnalyzing(false);
          return;
        }

        const formData = new FormData();
        formData.append('resumeFile', file);
        formData.append('targetJobTitle', targetJobTitle);
        formData.append('jobDescription', jobDescription);
        formData.append('careerMode', careerMode);
        formData.append('fresherTrack', fresherTrack);

        // Do not force manual Content-Type header so the browser sets the boundary automatically
        const res = await api.post('/analysis/upload', formData);

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
          jobDescription,
          careerMode,
          fresherTrack
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
          jobDescription,
          careerMode,
          fresherTrack
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
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F6FF]">
          ATS Resume Checker
        </h1>
        <p className="text-[15px] text-[#B5C0D6] mt-1.5 leading-relaxed">
          Comprehensive 10-point audit assessing formatting, keyword relevance, action verbs, and quantifiable impact.
        </p>
      </div>

      {/* Input / Upload Card */}
      <div className="studio-card rounded-2xl p-6 sm:p-8 space-y-6">
        
        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap border-b border-[rgba(166,184,225,0.12)] pb-4 gap-2.5">
          <button
            onClick={() => setActiveMode('upload')}
            className={`px-4 py-2.5 rounded-xl text-[14px] font-semibold transition flex items-center gap-2 ${
              activeMode === 'upload'
                ? 'studio-btn-primary shadow-[0_0_15px_rgba(120,101,255,0.35)]'
                : 'studio-pill text-[#B5C0D6]'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload Resume (PDF, DOCX, PNG, JPG)
          </button>

          <button
            onClick={() => setActiveMode('select')}
            className={`px-4 py-2.5 rounded-xl text-[14px] font-semibold transition flex items-center gap-2 ${
              activeMode === 'select'
                ? 'studio-btn-primary shadow-[0_0_15px_rgba(120,101,255,0.35)]'
                : 'studio-pill text-[#B5C0D6]'
            }`}
          >
            <FileText className="w-4 h-4" />
            Select Saved Resume ({savedResumes.length})
          </button>

          <button
            onClick={() => setActiveMode('paste')}
            className={`px-4 py-2.5 rounded-xl text-[14px] font-semibold transition flex items-center gap-2 ${
              activeMode === 'paste'
                ? 'studio-btn-primary shadow-[0_0_15px_rgba(120,101,255,0.35)]'
                : 'studio-pill text-[#B5C0D6]'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            Paste Plain Text
          </button>
        </div>

        {errorMsg && (
          <div className="bg-[#FF728A]/10 border border-[#FF728A]/30 text-[#FF728A] text-[14px] rounded-xl p-4 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRunAudit} className="space-y-5">
          
          {/* Mode 1: File Dropzone */}
          {activeMode === 'upload' && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                handleFileDrop(e);
                setErrorMsg('');
              }}
              className="interactive-upload-zone rounded-2xl p-8 sm:p-10 text-center transition cursor-pointer"
              onClick={() => document.getElementById('resume-file-input').click()}
            >
              <input
                id="resume-file-input"
                type="file"
                accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.txt"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                    setErrorMsg('');
                  }
                }}
                className="hidden"
              />
              <div className="w-14 h-14 bg-[#7865FF]/15 text-[#7865FF] rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[#7865FF]/25 shadow-sm">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="text-[16px] font-bold text-[#F4F6FF]">
                {file ? file.name : 'Click to select or drag & drop your resume file'}
              </h3>
              <p className="text-[13px] text-[#8D9AB5] mt-1.5">
                Accepts PDF (selectable & scanned OCR), Word DOCX, PNG, or JPG (maximum 10MB)
              </p>
            </div>
          )}

          {/* Mode 2: Select Saved Resume */}
          {activeMode === 'select' && (
            <div>
              <label className="block text-[14px] font-semibold text-[#B5C0D6] mb-1.5">
                Choose Saved Resume
              </label>
              {savedResumes.length === 0 ? (
                <div className="text-[14px] text-[#8D9AB5] bg-[#101A2D] p-4 rounded-xl border border-[rgba(166,184,225,0.14)]">
                  No saved resumes yet. You can upload a file or build one in the Resume Builder.
                </div>
              ) : (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="studio-input w-full text-[14px] px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  {savedResumes.map((r) => (
                    <option key={r._id} value={r._id} className="bg-[#101A2D] text-[#F4F6FF]">
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
              <label className="block text-[14px] font-semibold text-[#B5C0D6] mb-1.5">
                Paste Resume Text
              </label>
              <textarea
                rows={6}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the raw text of your resume here..."
                className="studio-input w-full p-4 rounded-xl text-[14px] leading-relaxed"
              />
            </div>
          )}

          {/* Career Stage Mode & Track */}
          <div className="p-5 bg-[#101A2D]/80 rounded-2xl border border-[rgba(166,184,225,0.14)] space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-[14px] font-bold text-[#F4F6FF] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#35D9E8]" />
                  Career Stage Mode
                </label>
                <p className="text-[13px] text-[#8D9AB5] mt-0.5">
                  Fresher mode prioritizes coursework, projects, internships, and foundational skills over tenure.
                </p>
              </div>

              <div className="inline-flex rounded-xl bg-[#0B1120] p-1 text-[13px] font-semibold border border-[rgba(166,184,225,0.14)]">
                <button
                  type="button"
                  onClick={() => setCareerMode('experienced')}
                  className={`px-3.5 py-1.5 rounded-lg transition ${
                    careerMode === 'experienced'
                      ? 'bg-[#192640] text-[#F4F6FF] shadow-sm border border-[rgba(166,184,225,0.2)]'
                      : 'text-[#8D9AB5] hover:text-[#F4F6FF]'
                  }`}
                >
                  Experienced
                </button>
                <button
                  type="button"
                  onClick={() => setCareerMode('fresher')}
                  className={`px-3.5 py-1.5 rounded-lg transition ${
                    careerMode === 'fresher'
                      ? 'bg-gradient-to-r from-[#7865FF] to-[#4285FF] text-white shadow-sm'
                      : 'text-[#8D9AB5] hover:text-[#F4F6FF]'
                  }`}
                >
                  Fresher / Student
                </button>
              </div>
            </div>

            {careerMode === 'fresher' && (
              <div className="pt-3 border-t border-[rgba(166,184,225,0.1)] flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="text-[13px] font-bold text-[#F4F6FF] shrink-0">
                  Target Career Track:
                </label>
                <select
                  value={fresherTrack}
                  onChange={(e) => setFresherTrack(e.target.value)}
                  className="studio-input text-[13px] px-3.5 py-1.5 rounded-xl"
                >
                  <option value="software_developer" className="bg-[#101A2D]">Software Developer / Engineer</option>
                  <option value="data_analyst" className="bg-[#101A2D]">Data Analyst / BI Specialist</option>
                  <option value="data_scientist" className="bg-[#101A2D]">Data Scientist / ML Engineer</option>
                  <option value="product_associate" className="bg-[#101A2D]">Associate Product Manager</option>
                  <option value="devops" className="bg-[#101A2D]">DevOps / Cloud Engineer</option>
                </select>
                <span className="text-[12px] text-[#32D6A0] bg-[#32D6A0]/10 px-2.5 py-1 rounded-md border border-[#32D6A0]/30 font-medium">
                  Track-specific keyword benchmarking active
                </span>
              </div>
            )}
          </div>

          {/* Target Role & Optional Job Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[rgba(166,184,225,0.1)]">
            <div>
              <label className="block text-[14px] font-semibold text-[#B5C0D6] mb-1.5">
                Target Job Title
              </label>
              <input
                type="text"
                value={targetJobTitle}
                onChange={(e) => setTargetJobTitle(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer"
                className="studio-input w-full px-4 py-2.5 rounded-xl text-[14px]"
              />
            </div>

            <div>
              <label className="block text-[14px] font-semibold text-[#B5C0D6] mb-1.5 flex justify-between">
                <span>Target Job Description (Optional)</span>
                <span className="text-[12px] text-[#8D9AB5] font-normal">Enables keyword comparison</span>
              </label>
              <textarea
                rows={2}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job posting requirements for precise keyword matching..."
                className="studio-input w-full px-4 py-2 rounded-xl text-[14px]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={analyzing}
              className="studio-btn-primary inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-[15px] transition disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Running Algorithmic Audit...
                </>
              ) : (
                <>
                  <FileCheck2 className="w-5 h-5 text-[#35D9E8]" />
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
          <div className="studio-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Circular Score */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 border-b lg:border-b-0 lg:border-r border-[rgba(166,184,225,0.14)]">
                <ScoreRing
                  score={analysisReport.scores?.overall || 0}
                  size={160}
                  strokeWidth={13}
                  subtext="Estimated ATS Compatibility"
                  theme="dark"
                />
                <span className="text-[12px] text-[#8D9AB5] font-medium mt-2">
                  Algorithmic Estimate (0-100)
                </span>
              </div>

              {/* 5 Category Progress Bars */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <h3 className="font-extrabold text-[17px] text-[#F4F6FF]">5-Pillar Score Breakdown</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {analysisReport.careerMode === 'fresher' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-bold bg-[#FFC56E]/10 text-[#FFC56E] border border-[#FFC56E]/30">
                        <Sparkles className="w-3.5 h-3.5 text-[#FFC56E]" />
                        Fresher Mode ({analysisReport.fresherTrack?.replace(/_/g, ' ') || 'General'})
                      </span>
                    )}
                    {analysisReport.extractionMetadata && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-medium bg-[#7865FF]/15 text-[#9182FF] border border-[#7865FF]/30">
                        <FileText className="w-3.5 h-3.5" />
                        {analysisReport.extractionMetadata.method === 'pdf-ocr' ? 'Scanned PDF (OCR)' :
                         analysisReport.extractionMetadata.method === 'image-ocr' ? 'Image Resume (OCR)' :
                         analysisReport.extractionMetadata.method === 'docx' ? 'Word Document' :
                         analysisReport.extractionMetadata.method === 'pdf-text' ? 'Selectable PDF' : 'Text Extracted'}
                      </span>
                    )}
                    {analysisReport.detectedCareerLevel && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-medium bg-[#32D6A0]/15 text-[#32D6A0] border border-[#32D6A0]/30">
                        <Sparkles className="w-3.5 h-3.5" />
                        {analysisReport.detectedCareerLevel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold text-[#B5C0D6] text-[13px]">
                      <span>ATS Readability (25%)</span>
                      <span className="font-bold text-[#32D6A0]">{analysisReport.scores?.atsReadability}%</span>
                    </div>
                    <div className="w-full bg-[#101A2D] h-2 rounded-full mt-1.5 border border-[rgba(166,184,225,0.1)]">
                      <div className="bg-[#32D6A0] h-full rounded-full shadow-[0_0_8px_rgba(50,214,160,0.5)]" style={{ width: `${analysisReport.scores?.atsReadability}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-[#B5C0D6] text-[13px]">
                      <span>Keyword Relevance (25%)</span>
                      <span className="font-bold text-[#7865FF]">{analysisReport.scores?.keywordAlignment}%</span>
                    </div>
                    <div className="w-full bg-[#101A2D] h-2 rounded-full mt-1.5 border border-[rgba(166,184,225,0.1)]">
                      <div className="bg-gradient-to-r from-[#7865FF] to-[#4285FF] h-full rounded-full shadow-[0_0_8px_rgba(120,101,255,0.5)]" style={{ width: `${analysisReport.scores?.keywordAlignment}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-[#B5C0D6] text-[13px]">
                      <span>Skills & Experience (20%)</span>
                      <span className="font-bold text-[#35D9E8]">{analysisReport.scores?.skillsExperience}%</span>
                    </div>
                    <div className="w-full bg-[#101A2D] h-2 rounded-full mt-1.5 border border-[rgba(166,184,225,0.1)]">
                      <div className="bg-[#35D9E8] h-full rounded-full shadow-[0_0_8px_rgba(53,217,232,0.5)]" style={{ width: `${analysisReport.scores?.skillsExperience}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-[#B5C0D6] text-[13px]">
                      <span>Projects & Metrics (15%)</span>
                      <span className="font-bold text-[#4285FF]">{analysisReport.scores?.projectsAchievements}%</span>
                    </div>
                    <div className="w-full bg-[#101A2D] h-2 rounded-full mt-1.5 border border-[rgba(166,184,225,0.1)]">
                      <div className="bg-[#4285FF] h-full rounded-full shadow-[0_0_8px_rgba(66,133,255,0.5)]" style={{ width: `${analysisReport.scores?.projectsAchievements}%` }} />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex justify-between font-semibold text-[#B5C0D6] text-[13px]">
                      <span>Grammar & Clarity (15%)</span>
                      <span className="font-bold text-[#FFC56E]">{analysisReport.scores?.grammarClarity}%</span>
                    </div>
                    <div className="w-full bg-[#101A2D] h-2 rounded-full mt-1.5 border border-[rgba(166,184,225,0.1)]">
                      <div className="bg-[#FFC56E] h-full rounded-full shadow-[0_0_8px_rgba(255,197,110,0.5)]" style={{ width: `${analysisReport.scores?.grammarClarity}%` }} />
                    </div>
                  </div>
                </div>

                <p className="text-[14px] text-[#B5C0D6] bg-[#101A2D] p-4 rounded-xl border border-[rgba(166,184,225,0.12)] leading-relaxed">
                  {analysisReport.summary}
                </p>
              </div>

            </div>

            {/* Transparent Scoring Formula Details & Disclaimer */}
            <div className="p-5 bg-[#101A2D]/70 rounded-2xl border border-[rgba(166,184,225,0.12)] text-xs text-[#B5C0D6] space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[14px] text-[#F4F6FF]">
                <Briefcase className="w-4 h-4 text-[#7865FF]" />
                <span>How This ATS Score Is Calculated</span>
              </div>
              <p className="leading-relaxed text-[13px] text-[#8D9AB5]">
                {analysisReport.scoringExplanation || 'Our multi-dimensional scoring engine evaluates 5 core pillars: Header and structural readability (25%), targeted keyword coverage (25%), dynamic skill & active verb phrasing (20%), measurable project impact (15%), and grammatical consistency (15%).'}
              </p>
              <div className="pt-2 border-t border-[rgba(166,184,225,0.1)] flex items-start gap-2 text-[12px] text-[#8D9AB5]">
                <AlertCircle className="w-4 h-4 text-[#8D9AB5] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#F4F6FF]">Important Notice:</strong> {analysisReport.disclaimer || 'ATS scores are algorithmic estimates based on industry patterns and recruiter heuristics, not guarantees of employment or official employer ATS results.'}
                </span>
              </div>
            </div>
          </div>

          {/* Keywords Match Breakdown */}
          <div className="studio-card rounded-2xl p-6 sm:p-8 space-y-5">
            <h3 className="font-bold text-[17px] text-[#F4F6FF]">
              Keyword Intelligence {analysisReport.hasJobDescription ? '(Matched vs Job Description)' : '(Target Industry Core)'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="bg-[#32D6A0]/10 border border-[#32D6A0]/25 rounded-xl p-5 space-y-3">
                <span className="font-bold text-[#32D6A0] text-[14px] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#32D6A0]" />
                  Matched Keywords ({analysisReport.matchedKeywords?.length || 0})
                </span>
                <div className="flex flex-wrap gap-2">
                  {analysisReport.matchedKeywords?.map((kw, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg text-[12px] font-semibold bg-[#101A2D] text-[#32D6A0] border border-[#32D6A0]/30 shadow-xs">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#FF728A]/10 border border-[#FF728A]/25 rounded-xl p-5 space-y-3">
                <span className="font-bold text-[#FF728A] text-[14px] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#FF728A]" />
                  Missing Recommended Keywords ({analysisReport.missingKeywords?.length || 0})
                </span>
                <div className="flex flex-wrap gap-2">
                  {analysisReport.missingKeywords?.map((kw, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg text-[12px] font-semibold bg-[#101A2D] text-[#FF728A] border border-[#FF728A]/30 shadow-xs">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detected Issues & Actionable Fixes */}
          <div className="studio-card rounded-2xl p-6 sm:p-8 space-y-5">
            <h3 className="font-bold text-[17px] text-[#F4F6FF] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#FFC56E]" />
              Detected Issues & Evidence-Based Improvements ({analysisReport.issues?.length || 0})
            </h3>

            <div className="space-y-4">
              {analysisReport.issues?.map((issue, idx) => (
                <div
                  key={issue.id || idx}
                  className={`p-5 rounded-xl border text-xs space-y-3 transition ${
                    issue.severity === 'critical'
                      ? 'bg-[#FF728A]/10 border-[#FF728A]/30'
                      : issue.severity === 'warning'
                      ? 'bg-[#FFC56E]/10 border-[#FFC56E]/30'
                      : 'bg-[#101A2D] border-[rgba(166,184,225,0.16)]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        issue.severity === 'critical'
                          ? 'bg-[#FF728A]/20 text-[#FF728A] border border-[#FF728A]/40'
                          : issue.severity === 'warning'
                          ? 'bg-[#FFC56E]/20 text-[#FFC56E] border border-[#FFC56E]/40'
                          : 'bg-[#192640] text-[#B5C0D6] border border-[rgba(166,184,225,0.18)]'
                      }`}>
                        {issue.severity}
                      </span>
                      <h4 className="font-bold text-[15px] text-[#F4F6FF]">{issue.title}</h4>
                      <span className="text-[12px] text-[#8D9AB5] font-medium">({issue.category})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/dashboard/builder?section=${issue.sectionKey || 'experience'}`}
                        className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#35D9E8] hover:text-[#7865FF] bg-[#101A2D] hover:bg-[#192640] border border-[rgba(166,184,225,0.18)] px-3 py-1.5 rounded-lg transition"
                      >
                        <span>Fix {issue.sectionKey ? `${issue.sectionKey.charAt(0).toUpperCase() + issue.sectionKey.slice(1)}` : 'Section'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => triggerAIFix(issue)}
                        className="inline-flex items-center gap-1.5 text-[12px] font-bold text-white bg-gradient-to-r from-[#7865FF] to-[#4285FF] hover:opacity-95 px-3 py-1.5 rounded-lg shadow-sm transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#35D9E8]" />
                        AI Fix
                      </button>
                    </div>
                  </div>

                  <p className="text-[14px] text-[#F4F6FF] leading-relaxed">{issue.explanation}</p>

                  {/* Tangible Evidence Block */}
                  {issue.evidence && (
                    <div className="text-[12px] bg-[#0B1120] border-l-2 border-[#7865FF] px-3.5 py-2 rounded-r font-mono text-[#F4F6FF]">
                      <span className="font-sans font-bold text-[#8D9AB5] uppercase text-[10px] block">
                        Extracted Document Evidence:
                      </span>
                      {issue.evidence}
                    </div>
                  )}

                  <p className="text-[13px] text-[#F4F6FF] font-semibold bg-[#101A2D] p-3 rounded-xl border border-[rgba(166,184,225,0.12)]">
                    <strong className="text-[#35D9E8]">Recommended Action:</strong> {issue.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Bullet Points Identified */}
          {analysisReport.weakBullets && analysisReport.weakBullets.length > 0 && (
            <div className="studio-card rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="font-bold text-[17px] text-[#F4F6FF]">
                Bullet Points Identified for Rewriting ({analysisReport.weakBullets.length})
              </h3>

              <div className="space-y-3.5 text-xs">
                {analysisReport.weakBullets.map((wb, idx) => (
                  <div key={idx} className="p-4 bg-[#101A2D] rounded-xl border border-[rgba(166,184,225,0.14)] space-y-2">
                    <div className="text-[#FF728A] font-medium line-through text-[13px]">
                      "{wb.original}"
                    </div>
                    <div className="text-[#8D9AB5] text-[12px]">
                      Reason: {wb.reason}
                    </div>
                    <div className="text-[#32D6A0] font-semibold bg-[#32D6A0]/10 p-2.5 rounded-lg border border-[#32D6A0]/25 text-[13px]">
                      Suggested: "{wb.improvedSuggestion}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* AI Fix Dialog in Dark Theme */}
      <Modal
        isOpen={fixModalOpen}
        onClose={() => setFixModalOpen(false)}
        title="AI Issue Resolution"
      >
        <div className="space-y-4">
          {fixLoading ? (
            <div className="py-8 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-[#7865FF] animate-spin mx-auto" />
              <p className="text-[14px] font-bold text-[#F4F6FF]">
                Generating verified ATS-compliant rewrite...
              </p>
            </div>
          ) : (
            <>
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#8D9AB5]">
                  Issue Title
                </span>
                <p className="text-[15px] font-bold text-[#F4F6FF] mt-1">{activeIssue?.title}</p>
              </div>

              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#35D9E8]">
                  Proposed Wording
                </span>
                <textarea
                  rows={4}
                  value={fixResult}
                  onChange={(e) => setFixResult(e.target.value)}
                  className="studio-input w-full p-3.5 border-2 border-[#7865FF]/40 rounded-xl text-[14px] leading-relaxed mt-1"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setFixModalOpen(false)}
                  className="studio-btn-secondary px-4 py-2 rounded-xl text-[14px] font-semibold text-[#8D9AB5]"
                >
                  Close
                </button>
                <Link
                  to="/dashboard/builder"
                  className="studio-btn-primary px-5 py-2 rounded-xl text-[14px] font-bold text-white transition"
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
