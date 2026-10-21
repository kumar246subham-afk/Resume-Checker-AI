import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { ResumePreview } from '../components/templates/ResumePreview';
import { Modal } from '../components/common/Modal';
import {
  Save,
  Download,
  Printer,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  FileCheck2,
  Briefcase,
  GraduationCap,
  Code,
  Settings2
} from 'lucide-react';
import { exportResumeToPdf, triggerPrintFallback, sanitizePdfFilename } from '../services/pdfExportService';

export const ResumeBuilderPage = () => {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('id');
  const templateParam = searchParams.get('template');

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [zoom, setZoom] = useState(90);
  const [activeTab, setActiveTab] = useState('editor'); // for mobile tab switching

  // PDF Export States & Ref
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgressText, setExportProgressText] = useState('');
  const [exportError, setExportError] = useState(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  const resumeExportRef = useRef(null);

  // Section order mode: 'standard' or 'fresher_first' (Education & Projects prioritized)
  const [sectionOrderMode, setSectionOrderMode] = useState('standard');

  // Accordion open states - initialize from query param if available
  const [openSection, setOpenSection] = useState(searchParams.get('section') || 'personal');

  // Sync openSection when searchParams changes
  useEffect(() => {
    const s = searchParams.get('section');
    if (s) {
      setOpenSection(s);
    }
  }, [searchParams]);

  // AI Modal States
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalType, setAiModalType] = useState('bullet'); // 'bullet' or 'summary'
  const [aiLoading, setAiLoading] = useState(false);
  const [currentBulletContext, setCurrentBulletContext] = useState(null);
  const [originalText, setOriginalText] = useState('');
  const [proposedText, setProposedText] = useState('');
  const [aiRationale, setAiRationale] = useState('');

  // Initial fetch or create
  useEffect(() => {
    const initResume = async () => {
      try {
        if (resumeId) {
          const res = await api.get(`/resumes/${resumeId}`);
          if (res.data.success) {
            const data = res.data.data;
            if (templateParam) {
              data.templateId = templateParam;
            }
            setResume(data);
          }
        } else {
          // Fetch user's latest resume or create default draft
          const listRes = await api.get('/resumes');
          if (listRes.data.success && listRes.data.data.length > 0) {
            const data = listRes.data.data[0];
            if (templateParam) {
              data.templateId = templateParam;
            }
            setResume(data);
          } else {
            const createRes = await api.post('/resumes', {
              title: 'Professional Resume Draft',
              templateId: templateParam || 'ats-classic'
            });
            if (createRes.data.success) {
              setResume(createRes.data.data);
            }
          }
        }
      } catch (err) {
        console.error('Failed to initialize resume builder', err);
      } finally {
        setLoading(false);
      }
    };

    initResume();
  }, [resumeId, templateParam]);

  // Debounced auto-save effect
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (!resume || !resume._id) return;

    setSaveStatus('Saving...');
    const timer = setTimeout(async () => {
      try {
        await api.put(`/resumes/${resume._id}`, {
          title: resume.title,
          templateId: resume.templateId,
          jobTarget: resume.jobTarget,
          sections: resume.sections,
          styling: resume.styling
        });
        setSaveStatus('All changes saved');
      } catch (err) {
        console.error('Autosave error', err);
        setSaveStatus('Save error');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [resume?.sections, resume?.templateId, resume?.title, resume?.jobTarget, resume?.styling]);

  const handleManualSave = async () => {
    if (!resume || !resume._id) return;
    setSaving(true);
    try {
      await api.put(`/resumes/${resume._id}`, resume);
      setSaveStatus('All changes saved');
    } catch (err) {
      console.error('Manual save failed', err);
    } finally {
      setSaving(false);
    }
  };

  // Section mutators
  const updatePersonalInfo = (field, value) => {
    setResume(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        personalInfo: {
          ...prev.sections.personalInfo,
          [field]: value
        }
      }
    }));
  };

  const updateSummary = (value) => {
    setResume(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        summary: value
      }
    }));
  };

  // Experience mutators
  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      role: 'Software Engineer',
      company: 'Tech Company',
      location: 'Remote',
      startDate: '2023-01',
      endDate: 'Present',
      current: true,
      bullets: ['Spearheaded microservices development, boosting performance by 25%.']
    };
    setResume(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        experience: [newExp, ...(prev.sections.experience || [])]
      }
    }));
  };

  const updateExperience = (index, field, value) => {
    setResume(prev => {
      const expList = [...(prev.sections.experience || [])];
      expList[index] = { ...expList[index], [field]: value };
      return {
        ...prev,
        sections: { ...prev.sections, experience: expList }
      };
    });
  };

  const removeExperience = (index) => {
    setResume(prev => {
      const expList = [...(prev.sections.experience || [])];
      expList.splice(index, 1);
      return {
        ...prev,
        sections: { ...prev.sections, experience: expList }
      };
    });
  };

  const updateExpBullet = (expIndex, bulletIndex, value) => {
    setResume(prev => {
      const expList = [...(prev.sections.experience || [])];
      const bullets = [...(expList[expIndex].bullets || [])];
      bullets[bulletIndex] = value;
      expList[expIndex].bullets = bullets;
      return {
        ...prev,
        sections: { ...prev.sections, experience: expList }
      };
    });
  };

  const addExpBullet = (expIndex) => {
    setResume(prev => {
      const expList = [...(prev.sections.experience || [])];
      const bullets = [...(expList[expIndex].bullets || []), 'Engineered key application components with quantifiable business impact.'];
      expList[expIndex].bullets = bullets;
      return {
        ...prev,
        sections: { ...prev.sections, experience: expList }
      };
    });
  };

  const removeExpBullet = (expIndex, bulletIndex) => {
    setResume(prev => {
      const expList = [...(prev.sections.experience || [])];
      const bullets = [...(expList[expIndex].bullets || [])];
      bullets.splice(bulletIndex, 1);
      expList[expIndex].bullets = bullets;
      return {
        ...prev,
        sections: { ...prev.sections, experience: expList }
      };
    });
  };

  // Education mutators
  const addEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      institution: 'State University',
      location: 'City, State',
      graduationDate: '2022',
      gpa: '3.8',
      highlights: []
    };
    setResume(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        education: [newEdu, ...(prev.sections.education || [])]
      }
    }));
  };

  const updateEducation = (index, field, value) => {
    setResume(prev => {
      const eduList = [...(prev.sections.education || [])];
      eduList[index] = { ...eduList[index], [field]: value };
      return {
        ...prev,
        sections: { ...prev.sections, education: eduList }
      };
    });
  };

  const removeEducation = (index) => {
    setResume(prev => {
      const eduList = [...(prev.sections.education || [])];
      eduList.splice(index, 1);
      return {
        ...prev,
        sections: { ...prev.sections, education: eduList }
      };
    });
  };

  // Skills mutators
  const handleSkillsStringChange = (category, commaSeparated) => {
    const array = commaSeparated.split(',').map(s => s.trim()).filter(Boolean);
    setResume(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        skills: {
          ...prev.sections.skills,
          [category]: array
        }
      }
    }));
  };

  // AI Triggers
  const triggerAIBulletRewrite = async (expIndex, bulletIndex, currentBullet) => {
    setCurrentBulletContext({ type: 'exp', expIndex, bulletIndex });
    setOriginalText(currentBullet);
    setProposedText('');
    setAiRationale('');
    setAiModalType('bullet');
    setAiModalOpen(true);
    setAiLoading(true);

    try {
      const res = await api.post('/analysis/improve', {
        type: 'bullet',
        text: currentBullet,
        context: { targetRole: resume?.jobTarget || 'Software Engineer' }
      });
      if (res.data.success) {
        setProposedText(res.data.data.improved);
        setAiRationale(res.data.data.rationale);
      }
    } catch (err) {
      console.error('AI bullet rewrite failed', err);
    } finally {
      setAiLoading(false);
    }
  };

  const triggerAISummaryGenerate = async () => {
    setAiModalType('summary');
    setOriginalText(resume?.sections?.summary || '');
    setProposedText('');
    setAiRationale('');
    setAiModalOpen(true);
    setAiLoading(true);

    try {
      const res = await api.post('/analysis/improve', {
        type: 'summary',
        text: 'summary',
        context: {
          role: resume?.jobTarget || 'Software Engineer',
          skills: resume?.sections?.skills?.technical || []
        }
      });
      if (res.data.success) {
        setProposedText(res.data.data.summary);
        setAiRationale('Crafted high-impact executive summary emphasizing technical ownership and proven delivery.');
      }
    } catch (err) {
      console.error('AI summary generation failed', err);
    } finally {
      setAiLoading(false);
    }
  };

  // Project mutators
  const addProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      name: 'Full Stack Web Platform',
      role: 'Lead Architect',
      link: 'github.com/developer/platform',
      technologies: ['React', 'Node.js', 'MongoDB'],
      description: 'Production web application handling asynchronous background data pipelines.',
      bullets: [
        'Designed decoupled microservice architecture, decreasing end-to-end latency.',
        'Implemented end-to-end responsive design with Tailwind CSS for cross-device compatibility.'
      ]
    };
    setResume(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        projects: [newProj, ...(prev.sections.projects || [])]
      }
    }));
  };

  const updateProject = (index, field, value) => {
    setResume(prev => {
      const list = [...(prev.sections.projects || [])];
      list[index] = { ...list[index], [field]: value };
      return {
        ...prev,
        sections: { ...prev.sections, projects: list }
      };
    });
  };

  const removeProject = (index) => {
    setResume(prev => {
      const list = [...(prev.sections.projects || [])];
      list.splice(index, 1);
      return {
        ...prev,
        sections: { ...prev.sections, projects: list }
      };
    });
  };

  const addProjectBullet = (projIndex) => {
    setResume(prev => {
      const list = [...(prev.sections.projects || [])];
      const bullets = [...(list[projIndex].bullets || []), ''];
      list[projIndex] = { ...list[projIndex], bullets };
      return { ...prev, sections: { ...prev.sections, projects: list } };
    });
  };

  const updateProjectBullet = (projIndex, bulletIndex, value) => {
    setResume(prev => {
      const list = [...(prev.sections.projects || [])];
      const bullets = [...(list[projIndex].bullets || [])];
      bullets[bulletIndex] = value;
      list[projIndex] = { ...list[projIndex], bullets };
      return { ...prev, sections: { ...prev.sections, projects: list } };
    });
  };

  const removeProjectBullet = (projIndex, bulletIndex) => {
    setResume(prev => {
      const list = [...(prev.sections.projects || [])];
      const bullets = [...(list[projIndex].bullets || [])];
      bullets.splice(bulletIndex, 1);
      list[projIndex] = { ...list[projIndex], bullets };
      return { ...prev, sections: { ...prev.sections, projects: list } };
    });
  };

  const triggerAIProjectBulletRewrite = async (projIndex, bulletIndex, currentBullet) => {
    setCurrentBulletContext({ type: 'proj', projIndex, bulletIndex });
    setOriginalText(currentBullet);
    setProposedText('');
    setAiRationale('');
    setAiModalType('bullet');
    setAiModalOpen(true);
    setAiLoading(true);

    try {
      const res = await api.post('/analysis/improve', {
        type: 'bullet',
        text: currentBullet,
        context: { targetRole: resume?.jobTarget || 'Software Engineer' }
      });
      if (res.data.success) {
        setProposedText(res.data.data.improved);
        setAiRationale(res.data.data.rationale);
      }
    } catch (err) {
      console.error('AI project bullet rewrite failed', err);
    } finally {
      setAiLoading(false);
    }
  };

  // Student / Fresher preset
  const applyStudentPreset = () => {
    setResume(prev => {
      const current = prev?.sections || {};
      return {
        ...prev,
        jobTarget: current.personalInfo?.title || 'Entry Level Software Engineer',
        sections: {
          ...current,
          education: (current.education && current.education.length > 0) ? current.education : [
            {
              id: 'edu-1',
              institution: 'State University of Technology',
              degree: 'Bachelor of Science',
              fieldOfStudy: 'Computer Science',
              graduationDate: '2025',
              gpa: '3.8/4.0',
              highlights: ['Coursework: Data Structures, Algorithms, Distributed Databases, Web Systems']
            }
          ],
          projects: (current.projects && current.projects.length > 0) ? current.projects : [
            {
              id: 'proj-1',
              name: 'Cloud Resume & Job Analytics App',
              role: 'Full Stack Creator',
              link: 'github.com/student/cloud-resume',
              technologies: ['React', 'Node.js', 'MongoDB', 'Docker'],
              description: 'End-to-end web platform providing real-time document analysis and PDF generation.',
              bullets: [
                'Engineered frontend in React with responsive Tailwind CSS components.',
                'Implemented secure authentication pipelines and document processing services.'
              ]
            }
          ]
        }
      };
    });
    setSectionOrderMode('fresher_first');
    setOpenSection('education');
  };

  // Estimate A4 page length & overflow check
  const calculatePageEstimate = () => {
    if (!resume?.sections) {
      return { pages: 1, label: '1 Page (Optimal)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
    const { experience = [], education = [], projects = [], summary = '', skills = {} } = resume.sections;
    let units = 12; // personal header
    if (summary) units += Math.ceil(summary.length / 90) * 3;
    experience.forEach(e => {
      units += 4 + (e.bullets?.length || 0) * 3;
    });
    education.forEach(() => { units += 4; });
    projects.forEach(p => {
      units += 4 + (p.bullets?.length || 0) * 3;
    });
    units += (skills.technical?.length || 0);

    if (units <= 58) {
      return { pages: 1, label: 'A4: 1 Page (Optimal)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    } else if (units <= 116) {
      return { pages: 2, label: 'A4: 2 Pages (Standard)', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
    } else {
      return { pages: 3, label: 'A4: 3+ Pages (Overflow Warning)', color: 'text-amber-800 bg-amber-50 border-amber-300' };
    }
  };

  const acceptAISuggestion = () => {
    if (aiModalType === 'summary') {
      updateSummary(proposedText);
    } else if (currentBulletContext?.type === 'exp') {
      updateExpBullet(currentBulletContext.expIndex, currentBulletContext.bulletIndex, proposedText);
    } else if (currentBulletContext?.type === 'proj') {
      updateProjectBullet(currentBulletContext.projIndex, currentBulletContext.bulletIndex, proposedText);
    }
    setAiModalOpen(false);
  };

  const handleDownloadPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(false);
    setExportProgressText('Preparing PDF export...');

    try {
      // 1. First trigger auto-save if resume exists
      if (resume?._id) {
        try {
          await api.put(`/resumes/${resume._id}`, {
            title: resume.title,
            templateId: resume.templateId,
            jobTarget: resume.jobTarget,
            sections: resume.sections,
            styling: resume.styling
          });
          setSaveStatus('All changes saved');
        } catch (saveErr) {
          console.warn('[PDF Download] Pre-export save warning:', saveErr);
        }
      }

      // 2. Generate sanitized file name
      const candidateName = resume?.sections?.personalInfo?.fullName || resume?.title || 'Resume';
      const cleanFilename = sanitizePdfFilename(`${candidateName}_Resume.pdf`);

      // 3. Locate target element: prioritize dedicated export ref, then fallback to DOM id
      const target = resumeExportRef.current || document.getElementById('resume-export-container') || document.getElementById('resume-printable-node');

      if (!target) {
        throw new Error('Resume preview element could not be found. Please ensure the preview panel is loaded.');
      }

      // 4. Run export pipeline
      const result = await exportResumeToPdf(target, {
        filename: cleanFilename,
        onProgress: (status) => setExportProgressText(status)
      });

      if (result.success) {
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3500);
      }
    } catch (err) {
      console.error('[PDF Download] Export failed:', err);
      setExportError(err.message || 'Unable to generate PDF document. You can also use the browser print dialog as an immediate fallback.');
    } finally {
      setIsExporting(false);
      setExportProgressText('');
    }
  };

  const handlePrintPDF = () => {
    triggerPrintFallback();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-xs font-semibold text-slate-500 animate-pulse">
        Initializing Resume Studio...
      </div>
    );
  }

  const { personalInfo = {}, summary = '', experience = [], education = [], skills = {}, projects = [] } = resume?.sections || {};
  const pageEstimate = calculatePageEstimate();

  return (
    <div className="max-w-[1700px] mx-auto space-y-4">
      
      {/* Top Toolbar in Dark Studio Theme */}
      <div className="no-print bg-[#141E33] rounded-2xl p-4 border border-[rgba(166,184,225,0.18)] shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        {/* Title & target */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={resume?.title || ''}
            onChange={(e) => setResume(prev => ({ ...prev, title: e.target.value }))}
            className="text-base sm:text-lg font-extrabold text-[#F4F6FF] bg-transparent border-b border-transparent hover:border-[#7865FF]/40 focus:border-[#7865FF] focus:outline-none px-1.5 py-0.5 rounded transition"
          />
          <span className="text-[12px] font-semibold text-[#8D9AB5]">
            • {saveStatus}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* A4 Page Length & Overflow Check Badge */}
          <div className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${pageEstimate.color}`}>
            <span>{pageEstimate.label}</span>
          </div>

          {/* Student / Fresher Setup Preset Button */}
          <button
            onClick={applyStudentPreset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#FFC56E] bg-[#FFC56E]/10 hover:bg-[#FFC56E]/20 border border-[#FFC56E]/30 transition shadow-xs"
            title="Reorders education and projects above experience for freshers"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFC56E]" />
            <span>Fresher Setup</span>
          </button>

          {/* Template Switcher */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F4F6FF] bg-[#101A2D] px-3 py-1.5 rounded-xl border border-[rgba(166,184,225,0.18)]">
            <Layers className="w-4 h-4 text-[#7865FF]" />
            <select
              value={resume?.templateId || 'ats-classic'}
              onChange={(e) => setResume(prev => ({ ...prev, templateId: e.target.value }))}
              className="bg-transparent focus:outline-none font-bold text-[#F4F6FF] cursor-pointer"
            >
              <optgroup label="ATS & General" className="bg-[#101A2D] text-[#F4F6FF]">
                <option value="ats-classic">ATS Classic (High Compatibility)</option>
                <option value="modern-pro">Modern Professional</option>
                <option value="minimal-elegant">Minimal Elegant</option>
              </optgroup>
              <optgroup label="Leadership & Executive" className="bg-[#101A2D] text-[#F4F6FF]">
                <option value="executive-profile">Executive Profile</option>
                <option value="executive-elite">Executive Elite (Midnight & Gold)</option>
              </optgroup>
              <optgroup label="Engineering & Data" className="bg-[#101A2D] text-[#F4F6FF]">
                <option value="tech-resume">Technical Resume (DevOps & Systems)</option>
                <option value="tech-innovator">Tech Innovator (AI & Full Stack)</option>
                <option value="data-science-pro">Data Science Pro (Analytics & ML)</option>
              </optgroup>
              <optgroup label="Creative & Early Career" className="bg-[#101A2D] text-[#F4F6FF]">
                <option value="creative-portfolio">Creative Portfolio (Design & UX)</option>
                <option value="fresh-graduate-pro">Fresh Graduate Pro (Students & B.Tech)</option>
              </optgroup>
            </select>
          </div>

          {/* Zoom controls */}
          <div className="hidden lg:flex items-center gap-1 bg-[#101A2D] px-2.5 py-1 rounded-xl border border-[rgba(166,184,225,0.18)] text-xs">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-1 text-[#8D9AB5] hover:text-[#F4F6FF] hover:scale-110 active:scale-95 transition-transform"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-[#F4F6FF] text-[12px] w-10 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(130, zoom + 10))}
              className="p-1 text-[#8D9AB5] hover:text-[#F4F6FF] hover:scale-110 active:scale-95 transition-transform"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile view toggle */}
          <div className="flex lg:hidden rounded-xl bg-[#101A2D] p-1 text-xs border border-[rgba(166,184,225,0.16)]">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${activeTab === 'editor' ? 'bg-[#7865FF] text-white shadow' : 'text-[#8D9AB5]'}`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${activeTab === 'preview' ? 'bg-[#7865FF] text-white shadow' : 'text-[#8D9AB5]'}`}
            >
              Preview
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleManualSave}
            disabled={saving}
            className="studio-btn-secondary inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#F4F6FF] shadow-sm transition"
          >
            <Save className="w-3.5 h-3.5 text-[#35D9E8]" />
            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          {/* Print fallback button */}
          <button
            onClick={handlePrintPDF}
            type="button"
            title="Open browser print / PDF dialog"
            className="studio-btn-secondary inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#B5C0D6] shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5 text-[#8D9AB5]" />
            <span className="hidden sm:inline">Print Dialog</span>
          </button>

          {/* Download PDF button */}
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            type="button"
            className={`studio-btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              isExporting
                ? 'opacity-80 cursor-wait'
                : exportSuccess
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : ''
            }`}
          >
            {isExporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                <span>{exportProgressText || 'Exporting PDF...'}</span>
              </>
            ) : exportSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* PDF Export Error Banner */}
      {exportError && (
        <div className="no-print bg-[#FFC56E]/15 border border-[#FFC56E]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#FFC56E] shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#FFC56E] shrink-0" />
            <span className="font-medium text-[#F4F6FF]">{exportError}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-1 bg-[#FFC56E] hover:bg-[#FFC56E]/90 text-[#080D1B] rounded-lg font-bold text-[11px] transition"
            >
              Retry Download
            </button>
            <button
              onClick={handlePrintPDF}
              className="px-3 py-1 bg-[#141E33] hover:bg-[#192640] text-[#FFC56E] border border-[#FFC56E]/30 rounded-lg font-bold text-[11px] transition inline-flex items-center gap-1"
            >
              <Printer className="w-3 h-3" />
              Browser Print Fallback
            </button>
            <button
              onClick={() => setExportError(null)}
              className="text-[#B5C0D6] hover:text-white p-1 text-xs font-bold"
              title="Dismiss error"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Dual Panel Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Panel: Sections Editor (5 cols on large screens) */}
        <div className={`no-print lg:col-span-5 space-y-4 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          
          {/* Section Hierarchy Reordering Toggle */}
          <div className="bg-[#141E33] rounded-2xl border border-[rgba(166,184,225,0.16)] p-3.5 shadow-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#7865FF]" />
              <div>
                <span className="font-bold text-[#F4F6FF] block">Section Layout</span>
                <span className="text-[11px] text-[#8D9AB5]">
                  {sectionOrderMode === 'fresher_first' ? 'Student Mode (Education & Projects prioritized)' : 'Standard Chronological'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSectionOrderMode(sectionOrderMode === 'standard' ? 'fresher_first' : 'standard')}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#35D9E8] hover:bg-[#35D9E8]/10 border border-[#35D9E8]/25 transition"
            >
              {sectionOrderMode === 'standard' ? 'Switch to Student Layout' : 'Switch to Standard Layout'}
            </button>
          </div>

          {/* Section 1: Personal Info */}
          <div className="studio-card rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === 'personal' ? null : 'personal')}
              className="w-full px-5 py-3.5 flex justify-between items-center bg-[#141E33] hover:bg-[#192640] transition text-left border-b border-[rgba(166,184,225,0.1)]"
            >
              <div className="flex items-center gap-2.5 font-bold text-[15px] text-[#F4F6FF]">
                <Settings2 className="w-4 h-4 text-[#7865FF]" />
                <span>Contact & Personal Details</span>
              </div>
              {openSection === 'personal' ? <ChevronUp className="w-4 h-4 text-[#8D9AB5]" /> : <ChevronDown className="w-4 h-4 text-[#8D9AB5]" />}
            </button>

            {openSection === 'personal' && (
              <div className="p-5 space-y-3.5 bg-[#101A2D]/40 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={personalInfo.fullName || ''}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      className="studio-input w-full px-3 py-2 rounded-xl text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={personalInfo.title || ''}
                      onChange={(e) => updatePersonalInfo('title', e.target.value)}
                      className="studio-input w-full px-3 py-2 rounded-xl text-[14px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">Email</label>
                    <input
                      type="email"
                      value={personalInfo.email || ''}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className="studio-input w-full px-3 py-2 rounded-xl text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">Phone</label>
                    <input
                      type="text"
                      value={personalInfo.phone || ''}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      className="studio-input w-full px-3 py-2 rounded-xl text-[14px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">Location</label>
                    <input
                      type="text"
                      value={personalInfo.location || ''}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      className="studio-input w-full px-2.5 py-2 rounded-xl text-[13px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">LinkedIn</label>
                    <input
                      type="text"
                      value={personalInfo.linkedin || ''}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      className="studio-input w-full px-2.5 py-2 rounded-xl text-[13px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">GitHub / Site</label>
                    <input
                      type="text"
                      value={personalInfo.github || ''}
                      onChange={(e) => updatePersonalInfo('github', e.target.value)}
                      className="studio-input w-full px-2.5 py-2 rounded-xl text-[13px]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Professional Summary */}
          <div className="studio-card rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === 'summary' ? null : 'summary')}
              className="w-full px-5 py-3.5 flex justify-between items-center bg-[#141E33] hover:bg-[#192640] transition text-left border-b border-[rgba(166,184,225,0.1)]"
            >
              <div className="flex items-center gap-2.5 font-bold text-[15px] text-[#F4F6FF]">
                <FileCheck2 className="w-4 h-4 text-[#35D9E8]" />
                <span>Professional Summary</span>
              </div>
              {openSection === 'summary' ? <ChevronUp className="w-4 h-4 text-[#8D9AB5]" /> : <ChevronDown className="w-4 h-4 text-[#8D9AB5]" />}
            </button>

            {openSection === 'summary' && (
              <div className="p-5 space-y-3.5 bg-[#101A2D]/40 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-[#8D9AB5]">3-4 sentence elevator pitch</span>
                  <button
                    onClick={triggerAISummaryGenerate}
                    className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#35D9E8] bg-[#35D9E8]/10 hover:bg-[#35D9E8]/20 px-3 py-1.5 rounded-lg border border-[#35D9E8]/30 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#35D9E8]" />
                    AI Generate / Rewrite
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={(e) => updateSummary(e.target.value)}
                  placeholder="Results-driven professional with 5+ years of experience in..."
                  className="studio-input w-full p-3 rounded-xl text-[14px] leading-relaxed"
                />
              </div>
            )}
          </div>

          {/* Section 3: Work Experience */}
          <div className="studio-card rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === 'experience' ? null : 'experience')}
              className="w-full px-5 py-3.5 flex justify-between items-center bg-[#141E33] hover:bg-[#192640] transition text-left border-b border-[rgba(166,184,225,0.1)]"
            >
              <div className="flex items-center gap-2.5 font-bold text-[15px] text-[#F4F6FF]">
                <Briefcase className="w-4 h-4 text-[#4285FF]" />
                <span>Work Experience ({experience.length})</span>
              </div>
              {openSection === 'experience' ? <ChevronUp className="w-4 h-4 text-[#8D9AB5]" /> : <ChevronDown className="w-4 h-4 text-[#8D9AB5]" />}
            </button>

            {openSection === 'experience' && (
              <div className="p-5 space-y-6 bg-[#101A2D]/40 text-xs">
                {experience.map((exp, expIdx) => (
                  <div key={exp.id || expIdx} className="bg-[#101A2D] p-4 rounded-xl border border-[rgba(166,184,225,0.14)] space-y-3.5 relative">
                    <button
                      onClick={() => removeExperience(expIdx)}
                      className="absolute top-3 right-3 text-[#8D9AB5] hover:text-[#FF728A] p-1 transition"
                      title="Remove Role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-3 pr-6">
                      <div>
                        <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">Job Title / Role</label>
                        <input
                          type="text"
                          value={exp.role || ''}
                          onChange={(e) => updateExperience(expIdx, 'role', e.target.value)}
                          className="studio-input w-full px-3 py-2 rounded-xl text-[14px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company || ''}
                          onChange={(e) => updateExperience(expIdx, 'company', e.target.value)}
                          className="studio-input w-full px-3 py-2 rounded-xl text-[14px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate || ''}
                          onChange={(e) => updateExperience(expIdx, 'startDate', e.target.value)}
                          placeholder="2021-01"
                          className="studio-input w-full px-2.5 py-1.5 rounded-xl text-[13px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate || ''}
                          onChange={(e) => updateExperience(expIdx, 'endDate', e.target.value)}
                          placeholder="Present"
                          className="studio-input w-full px-2.5 py-1.5 rounded-xl text-[13px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">Location</label>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => updateExperience(expIdx, 'location', e.target.value)}
                          className="studio-input w-full px-2.5 py-1.5 rounded-xl text-[13px]"
                        />
                      </div>
                    </div>

                    {/* Bullets List */}
                    <div className="space-y-2 pt-2 border-t border-[rgba(166,184,225,0.1)]">
                      <label className="block text-[13px] font-semibold text-[#B5C0D6]">Achievement Bullets</label>
                      {(exp.bullets || []).map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => updateExpBullet(expIdx, bIdx, e.target.value)}
                            className="studio-input flex-1 p-2.5 text-[14px] rounded-xl focus:border-[#7865FF]"
                          />
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => triggerAIBulletRewrite(expIdx, bIdx, bullet)}
                              className="p-2 rounded-lg bg-[#7865FF]/15 text-[#35D9E8] hover:bg-[#7865FF]/30 border border-[#7865FF]/30 transition"
                              title="Improve with AI"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#35D9E8]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeExpBullet(expIdx, bIdx)}
                              className="p-2 rounded-lg text-[#8D9AB5] hover:text-[#FF728A] hover:bg-[#FF728A]/10 transition"
                              title="Delete Bullet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addExpBullet(expIdx)}
                        className="text-[13px] font-semibold text-[#35D9E8] hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Achievement Bullet
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addExperience}
                  className="w-full py-2.5 border-2 border-dashed border-[rgba(166,184,225,0.2)] rounded-xl text-[14px] font-bold text-[#F4F6FF] hover:border-[#7865FF] hover:text-[#9182FF] transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Role / Experience
                </button>
              </div>
            )}
          </div>

          {/* Section 4: Technical Skills */}
          <div className="studio-card rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === 'skills' ? null : 'skills')}
              className="w-full px-5 py-3.5 flex justify-between items-center bg-[#141E33] hover:bg-[#192640] transition text-left border-b border-[rgba(166,184,225,0.1)]"
            >
              <div className="flex items-center gap-2.5 font-bold text-[15px] text-[#F4F6FF]">
                <Code className="w-4 h-4 text-[#32D6A0]" />
                <span>Skills & Competencies</span>
              </div>
              {openSection === 'skills' ? <ChevronUp className="w-4 h-4 text-[#8D9AB5]" /> : <ChevronDown className="w-4 h-4 text-[#8D9AB5]" />}
            </button>

            {openSection === 'skills' && (
              <div className="p-5 space-y-3.5 bg-[#101A2D]/40 text-xs">
                <div>
                  <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">
                    Technical Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={(skills.technical || []).join(', ')}
                    onChange={(e) => handleSkillsStringChange('technical', e.target.value)}
                    placeholder="React, Node.js, Python, TypeScript, Docker"
                    className="studio-input w-full px-3 py-2 rounded-xl text-[14px]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">
                    Tools & Platforms (comma separated)
                  </label>
                  <input
                    type="text"
                    value={(skills.tools || []).join(', ')}
                    onChange={(e) => handleSkillsStringChange('tools', e.target.value)}
                    placeholder="AWS, Git, Docker, Kubernetes, Postman"
                    className="studio-input w-full px-3 py-2 rounded-xl text-[14px]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">
                    Soft Skills & Leadership (comma separated)
                  </label>
                  <input
                    type="text"
                    value={(skills.soft || []).join(', ')}
                    onChange={(e) => handleSkillsStringChange('soft', e.target.value)}
                    placeholder="Cross-functional collaboration, Agile/Scrum, Mentorship"
                    className="studio-input w-full px-3 py-2 rounded-xl text-[14px]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Education */}
          <div className="studio-card rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === 'education' ? null : 'education')}
              className="w-full px-5 py-3.5 flex justify-between items-center bg-[#141E33] hover:bg-[#192640] transition text-left border-b border-[rgba(166,184,225,0.1)]"
            >
              <div className="flex items-center gap-2.5 font-bold text-[15px] text-[#F4F6FF]">
                <GraduationCap className="w-4 h-4 text-[#7865FF]" />
                <span>Education ({education.length})</span>
              </div>
              {openSection === 'education' ? <ChevronUp className="w-4 h-4 text-[#8D9AB5]" /> : <ChevronDown className="w-4 h-4 text-[#8D9AB5]" />}
            </button>

            {openSection === 'education' && (
              <div className="p-5 space-y-4 bg-[#101A2D]/40 text-xs">
                {education.map((edu, eduIdx) => (
                  <div key={edu.id || eduIdx} className="bg-[#101A2D] p-3.5 rounded-xl border border-[rgba(166,184,225,0.14)] space-y-2.5 relative">
                    <button
                      onClick={() => removeEducation(eduIdx)}
                      className="absolute top-3 right-3 text-[#8D9AB5] hover:text-[#FF728A] transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-2.5 pr-6">
                      <div>
                        <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-0.5">Degree</label>
                        <input
                          type="text"
                          value={edu.degree || ''}
                          onChange={(e) => updateEducation(eduIdx, 'degree', e.target.value)}
                          className="studio-input w-full px-3 py-1.5 rounded-xl text-[13px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-0.5">Field of Study</label>
                        <input
                          type="text"
                          value={edu.fieldOfStudy || ''}
                          onChange={(e) => updateEducation(eduIdx, 'fieldOfStudy', e.target.value)}
                          className="studio-input w-full px-3 py-1.5 rounded-xl text-[13px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-0.5">Institution</label>
                        <input
                          type="text"
                          value={edu.institution || ''}
                          onChange={(e) => updateEducation(eduIdx, 'institution', e.target.value)}
                          className="studio-input w-full px-2.5 py-1.5 rounded-xl text-[13px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-0.5">Grad Year</label>
                        <input
                          type="text"
                          value={edu.graduationDate || ''}
                          onChange={(e) => updateEducation(eduIdx, 'graduationDate', e.target.value)}
                          className="studio-input w-full px-2.5 py-1.5 rounded-xl text-[13px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-0.5">GPA (Optional)</label>
                        <input
                          type="text"
                          value={edu.gpa || ''}
                          onChange={(e) => updateEducation(eduIdx, 'gpa', e.target.value)}
                          className="studio-input w-full px-2.5 py-1.5 rounded-xl text-[13px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addEducation}
                  className="w-full py-2 border border-dashed border-[rgba(166,184,225,0.2)] rounded-xl text-[13px] font-bold text-[#F4F6FF] hover:text-[#9182FF] hover:border-[#7865FF] transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Degree
                </button>
              </div>
            )}
          </div>

          {/* Section 6: Key Projects */}
          <div className="studio-card rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === 'projects' ? null : 'projects')}
              className="w-full px-5 py-3.5 flex justify-between items-center bg-[#141E33] hover:bg-[#192640] transition text-left border-b border-[rgba(166,184,225,0.1)]"
            >
              <div className="flex items-center gap-2.5 font-bold text-[15px] text-[#F4F6FF]">
                <Code className="w-4 h-4 text-[#35D9E8]" />
                <span>Key Projects & Portfolio ({projects.length})</span>
              </div>
              {openSection === 'projects' ? <ChevronUp className="w-4 h-4 text-[#8D9AB5]" /> : <ChevronDown className="w-4 h-4 text-[#8D9AB5]" />}
            </button>

            {openSection === 'projects' && (
              <div className="p-5 space-y-4 bg-[#101A2D]/40 text-xs">
                {projects.map((proj, projIdx) => (
                  <div key={proj.id || projIdx} className="bg-[#101A2D] p-4 rounded-xl border border-[rgba(166,184,225,0.14)] space-y-3 relative">
                    <button
                      onClick={() => removeProject(projIdx)}
                      className="absolute top-3 right-3 text-[#8D9AB5] hover:text-[#FF728A] transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-3 pr-6">
                      <div>
                        <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">Project Name</label>
                        <input
                          type="text"
                          value={proj.name || ''}
                          onChange={(e) => updateProject(projIdx, 'name', e.target.value)}
                          className="studio-input w-full px-3 py-1.5 rounded-xl text-[13px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">Your Role</label>
                        <input
                          type="text"
                          value={proj.role || ''}
                          onChange={(e) => updateProject(projIdx, 'role', e.target.value)}
                          className="studio-input w-full px-3 py-1.5 rounded-xl text-[13px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">Demo or Repo Link</label>
                        <input
                          type="text"
                          value={proj.link || ''}
                          onChange={(e) => updateProject(projIdx, 'link', e.target.value)}
                          placeholder="github.com/user/project"
                          className="studio-input w-full px-3 py-1.5 rounded-xl text-[13px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">Technologies (comma separated)</label>
                        <input
                          type="text"
                          value={(proj.technologies || []).join(', ')}
                          onChange={(e) => updateProject(projIdx, 'technologies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                          placeholder="React, Node.js, MongoDB"
                          className="studio-input w-full px-3 py-1.5 rounded-xl text-[13px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-semibold text-[#B5C0D6] mb-1">Summary / Problem Solved</label>
                      <input
                        type="text"
                        value={proj.description || ''}
                        onChange={(e) => updateProject(projIdx, 'description', e.target.value)}
                        placeholder="Brief overview of the project's purpose..."
                        className="studio-input w-full px-3 py-1.5 rounded-xl text-[13px]"
                      />
                    </div>

                    {/* Bullets */}
                    <div className="space-y-2 pt-2 border-t border-[rgba(166,184,225,0.1)]">
                      <label className="block text-[13px] font-semibold text-[#B5C0D6]">Project Highlights & Impact</label>
                      {(proj.bullets || []).map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => updateProjectBullet(projIdx, bIdx, e.target.value)}
                            className="studio-input flex-1 p-2 text-[14px] rounded-xl focus:border-[#7865FF]"
                          />
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => triggerAIProjectBulletRewrite(projIdx, bIdx, bullet)}
                              className="p-2 rounded-lg bg-[#7865FF]/15 text-[#35D9E8] hover:bg-[#7865FF]/30 border border-[#7865FF]/30 transition"
                              title="Improve with AI"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#35D9E8]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeProjectBullet(projIdx, bIdx)}
                              className="p-2 rounded-lg text-[#8D9AB5] hover:text-[#FF728A] hover:bg-[#FF728A]/10 transition"
                              title="Delete Bullet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addProjectBullet(projIdx)}
                        className="text-[13px] font-semibold text-[#35D9E8] hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Project Bullet
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addProject}
                  className="w-full py-2.5 border-2 border-dashed border-[rgba(166,184,225,0.2)] rounded-xl text-[14px] font-bold text-[#F4F6FF] hover:border-[#7865FF] hover:text-[#9182FF] transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Live A4 Resume Preview (7 cols on large screens) */}
        <div className={`lg:col-span-7 ${activeTab === 'editor' ? 'hidden lg:block' : 'block'}`}>
          <div className="sticky top-20">
            <ResumePreview resume={resume} zoom={zoom} />
          </div>
        </div>

      </div>

      {/* Offscreen Node for high-fidelity PDF capture: standard unscaled A4 dimensions, immune to viewport/tab hiding */}
      <div
        style={{
          position: 'fixed',
          left: '-15000px',
          top: 0,
          width: '210mm',
          minHeight: '297mm',
          background: '#ffffff',
          zIndex: -9999,
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      >
        <ResumePreview ref={resumeExportRef} resume={resume} zoom={100} forExport={true} />
      </div>

      {/* AI Suggestion / Rewrite Modal in Dark Studio Theme */}
      <Modal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title={aiModalType === 'summary' ? 'AI Executive Summary Generator' : 'AI Action Verb & Metric Enhancer'}
      >
        <div className="space-y-4">
          {aiLoading ? (
            <div className="py-8 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-[#7865FF] animate-spin mx-auto" />
              <p className="text-[14px] font-bold text-[#F4F6FF]">
                Analyzing role context and generating high-impact phrasing...
              </p>
            </div>
          ) : (
            <>
              {originalText && (
                <div>
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#8D9AB5]">
                    Original Text
                  </span>
                  <div className="p-3.5 bg-[#101A2D] rounded-xl border border-[rgba(166,184,225,0.16)] text-[14px] text-[#F4F6FF] mt-1">
                    {originalText}
                  </div>
                </div>
              )}

              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#35D9E8]">
                  Proposed AI Revision (Editable)
                </span>
                <textarea
                  rows={4}
                  value={proposedText}
                  onChange={(e) => setProposedText(e.target.value)}
                  className="studio-input w-full p-3.5 border-2 border-[#7865FF]/50 rounded-xl bg-[#101A2D] text-[14px] text-[#F4F6FF] mt-1 focus:outline-none focus:border-[#7865FF] leading-relaxed"
                />
              </div>

              {aiRationale && (
                <div className="bg-[#32D6A0]/10 border border-[#32D6A0]/30 p-3.5 rounded-xl text-[13px] text-[#32D6A0]">
                  <strong>Why this improves ATS ranking:</strong> {aiRationale}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setAiModalOpen(false)}
                  className="studio-btn-secondary px-4 py-2 rounded-xl text-[14px] font-semibold text-[#8D9AB5]"
                >
                  Discard
                </button>
                <button
                  onClick={acceptAISuggestion}
                  className="studio-btn-primary px-5 py-2 rounded-xl text-[14px] font-bold text-white flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Accept & Apply to Resume
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
