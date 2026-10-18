import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ResumePreview } from '../components/templates/ResumePreview';
import { Modal } from '../components/common/Modal';
import {
  Save,
  Download,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Check,
  Edit2,
  AlertCircle,
  FileCheck2,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Globe,
  Settings2
} from 'lucide-react';

export const ResumeBuilderPage = () => {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('id');
  const templateParam = searchParams.get('template');
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [zoom, setZoom] = useState(90);
  const [activeTab, setActiveTab] = useState('editor'); // for mobile tab switching

  // Accordion open states
  const [openSection, setOpenSection] = useState('personal');

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
            setResume(res.data.data);
          }
        } else {
          // Fetch user's latest resume or create default draft
          const listRes = await api.get('/resumes');
          if (listRes.data.success && listRes.data.data.length > 0) {
            setResume(listRes.data.data[0]);
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

  const acceptAISuggestion = () => {
    if (aiModalType === 'summary') {
      updateSummary(proposedText);
    } else if (currentBulletContext?.type === 'exp') {
      updateExpBullet(currentBulletContext.expIndex, currentBulletContext.bulletIndex, proposedText);
    }
    setAiModalOpen(false);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-xs font-semibold text-slate-500 animate-pulse">
        Initializing Resume Studio...
      </div>
    );
  }

  const { personalInfo = {}, summary = '', experience = [], education = [], skills = {} } = resume?.sections || {};

  return (
    <div className="max-w-[1700px] mx-auto space-y-4">
      
      {/* Top Toolbar */}
      <div className="no-print bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        {/* Title & target */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={resume?.title || ''}
            onChange={(e) => setResume(prev => ({ ...prev, title: e.target.value }))}
            className="text-base font-extrabold text-[#111827] bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#6D5EF7] focus:outline-none px-1 py-0.5 rounded"
          />
          <span className="text-[11px] font-semibold text-slate-400">
            • {saveStatus}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Template Switcher */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Layers className="w-4 h-4 text-[#6D5EF7]" />
            <select
              value={resume?.templateId || 'ats-classic'}
              onChange={(e) => setResume(prev => ({ ...prev, templateId: e.target.value }))}
              className="bg-transparent focus:outline-none font-bold text-[#111827] cursor-pointer"
            >
              <option value="ats-classic">ATS Classic</option>
              <option value="modern-pro">Modern Professional</option>
              <option value="minimal-elegant">Minimal Elegant</option>
              <option value="tech-resume">Technical Resume</option>
              <option value="executive-profile">Executive Profile</option>
            </select>
          </div>

          {/* Zoom controls */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-1 text-slate-600 hover:text-black"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-slate-700 text-[11px] w-10 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(130, zoom + 10))}
              className="p-1 text-slate-600 hover:text-black"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile view toggle */}
          <div className="flex lg:hidden rounded-lg bg-slate-100 p-0.5 text-xs">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded-md font-bold ${activeTab === 'editor' ? 'bg-white shadow text-[#6D5EF7]' : 'text-slate-600'}`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-md font-bold ${activeTab === 'preview' ? 'bg-white shadow text-[#6D5EF7]' : 'text-slate-600'}`}
            >
              Preview
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleManualSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>

          {/* Download PDF button */}
          <button
            onClick={handlePrintPDF}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Main Dual Panel Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Panel: Sections Editor (5 cols on large screens) */}
        <div className={`no-print lg:col-span-5 space-y-4 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          
          {/* Section 1: Personal Info */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === 'personal' ? null : 'personal')}
              className="w-full px-5 py-3.5 flex justify-between items-center bg-white hover:bg-slate-50 transition text-left"
            >
              <div className="flex items-center gap-2.5 font-bold text-xs text-[#111827]">
                <Settings2 className="w-4 h-4 text-[#6D5EF7]" />
                <span>Contact & Personal Details</span>
              </div>
              {openSection === 'personal' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSection === 'personal' && (
              <div className="p-5 border-t border-slate-100 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={personalInfo.fullName || ''}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#6D5EF7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={personalInfo.title || ''}
                      onChange={(e) => updatePersonalInfo('title', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#6D5EF7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={personalInfo.email || ''}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#6D5EF7]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={personalInfo.phone || ''}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#6D5EF7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={personalInfo.location || ''}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">LinkedIn</label>
                    <input
                      type="text"
                      value={personalInfo.linkedin || ''}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">GitHub / Site</label>
                    <input
                      type="text"
                      value={personalInfo.github || ''}
                      onChange={(e) => updatePersonalInfo('github', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Professional Summary */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === 'summary' ? null : 'summary')}
              className="w-full px-5 py-3.5 flex justify-between items-center bg-white hover:bg-slate-50 transition text-left"
            >
              <div className="flex items-center gap-2.5 font-bold text-xs text-[#111827]">
                <FileCheck2 className="w-4 h-4 text-teal-600" />
                <span>Professional Summary</span>
              </div>
              {openSection === 'summary' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSection === 'summary' && (
              <div className="p-5 border-t border-slate-100 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-500 font-medium">3-4 sentence elevator pitch</span>
                  <button
                    onClick={triggerAISummaryGenerate}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 px-2.5 py-1 rounded-lg border border-violet-200 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#6D5EF7]" />
                    AI Generate / Rewrite
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={(e) => updateSummary(e.target.value)}
                  placeholder="Results-driven professional with 5+ years of experience in..."
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#6D5EF7] text-xs leading-relaxed"
                />
              </div>
            )}
          </div>

          {/* Section 3: Work Experience */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === 'experience' ? null : 'experience')}
              className="w-full px-5 py-3.5 flex justify-between items-center bg-white hover:bg-slate-50 transition text-left"
            >
              <div className="flex items-center gap-2.5 font-bold text-xs text-[#111827]">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>Work Experience ({experience.length})</span>
              </div>
              {openSection === 'experience' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSection === 'experience' && (
              <div className="p-5 border-t border-slate-100 space-y-6 text-xs">
                {experience.map((exp, expIdx) => (
                  <div key={exp.id || expIdx} className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3 relative">
                    <button
                      onClick={() => removeExperience(expIdx)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1"
                      title="Remove Role"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="grid grid-cols-2 gap-3 pr-6">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Job Title / Role</label>
                        <input
                          type="text"
                          value={exp.role || ''}
                          onChange={(e) => updateExperience(expIdx, 'role', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company || ''}
                          onChange={(e) => updateExperience(expIdx, 'company', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate || ''}
                          onChange={(e) => updateExperience(expIdx, 'startDate', e.target.value)}
                          placeholder="2021-01"
                          className="w-full px-2 py-1 border border-slate-200 rounded-lg bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate || ''}
                          onChange={(e) => updateExperience(expIdx, 'endDate', e.target.value)}
                          placeholder="Present"
                          className="w-full px-2 py-1 border border-slate-200 rounded-lg bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Location</label>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => updateExperience(expIdx, 'location', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded-lg bg-white text-xs"
                        />
                      </div>
                    </div>

                    {/* Bullets List */}
                    <div className="space-y-2 pt-2 border-t border-slate-200/60">
                      <label className="block text-[11px] font-bold text-slate-700">Achievement Bullets</label>
                      {(exp.bullets || []).map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => updateExpBullet(expIdx, bIdx, e.target.value)}
                            className="flex-1 p-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#6D5EF7]"
                          />
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => triggerAIBulletRewrite(expIdx, bIdx, bullet)}
                              className="p-1.5 rounded bg-violet-50 text-[#6D5EF7] hover:bg-violet-100 border border-violet-200"
                              title="Improve with AI"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeExpBullet(expIdx, bIdx)}
                              className="p-1.5 rounded text-slate-400 hover:text-rose-600"
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
                        className="text-[11px] font-bold text-[#6D5EF7] hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Achievement Bullet
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addExperience}
                  className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-violet-400 hover:text-[#6D5EF7] transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Role / Experience
                </button>
              </div>
            )}
          </div>

          {/* Section 4: Technical Skills */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === 'skills' ? null : 'skills')}
              className="w-full px-5 py-3.5 flex justify-between items-center bg-white hover:bg-slate-50 transition text-left"
            >
              <div className="flex items-center gap-2.5 font-bold text-xs text-[#111827]">
                <Code className="w-4 h-4 text-emerald-600" />
                <span>Skills & Competencies</span>
              </div>
              {openSection === 'skills' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSection === 'skills' && (
              <div className="p-5 border-t border-slate-100 space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Technical Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={(skills.technical || []).join(', ')}
                    onChange={(e) => handleSkillsStringChange('technical', e.target.value)}
                    placeholder="React, Node.js, Python, TypeScript, Docker"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Tools & Platforms (comma separated)
                  </label>
                  <input
                    type="text"
                    value={(skills.tools || []).join(', ')}
                    onChange={(e) => handleSkillsStringChange('tools', e.target.value)}
                    placeholder="AWS, Git, Docker, Kubernetes, Postman"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Soft Skills & Leadership (comma separated)
                  </label>
                  <input
                    type="text"
                    value={(skills.soft || []).join(', ')}
                    onChange={(e) => handleSkillsStringChange('soft', e.target.value)}
                    placeholder="Cross-functional collaboration, Agile/Scrum, Mentorship"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Education */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === 'education' ? null : 'education')}
              className="w-full px-5 py-3.5 flex justify-between items-center bg-white hover:bg-slate-50 transition text-left"
            >
              <div className="flex items-center gap-2.5 font-bold text-xs text-[#111827]">
                <GraduationCap className="w-4 h-4 text-violet-600" />
                <span>Education ({education.length})</span>
              </div>
              {openSection === 'education' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSection === 'education' && (
              <div className="p-5 border-t border-slate-100 space-y-4 text-xs">
                {education.map((edu, eduIdx) => (
                  <div key={edu.id || eduIdx} className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 space-y-2 relative">
                    <button
                      onClick={() => removeEducation(eduIdx)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="grid grid-cols-2 gap-2 pr-6">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Degree</label>
                        <input
                          type="text"
                          value={edu.degree || ''}
                          onChange={(e) => updateEducation(eduIdx, 'degree', e.target.value)}
                          className="w-full px-2.5 py-1 border border-slate-200 rounded bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Field of Study</label>
                        <input
                          type="text"
                          value={edu.fieldOfStudy || ''}
                          onChange={(e) => updateEducation(eduIdx, 'fieldOfStudy', e.target.value)}
                          className="w-full px-2.5 py-1 border border-slate-200 rounded bg-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Institution</label>
                        <input
                          type="text"
                          value={edu.institution || ''}
                          onChange={(e) => updateEducation(eduIdx, 'institution', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Grad Year</label>
                        <input
                          type="text"
                          value={edu.graduationDate || ''}
                          onChange={(e) => updateEducation(eduIdx, 'graduationDate', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">GPA (Optional)</label>
                        <input
                          type="text"
                          value={edu.gpa || ''}
                          onChange={(e) => updateEducation(eduIdx, 'gpa', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addEducation}
                  className="w-full py-1.5 border border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-[#6D5EF7] transition flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Degree
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

      {/* AI Suggestion / Rewrite Modal */}
      <Modal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title={aiModalType === 'summary' ? 'AI Executive Summary Generator' : 'AI Action Verb & Metric Enhancer'}
      >
        <div className="space-y-4">
          {aiLoading ? (
            <div className="py-8 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-[#6D5EF7] animate-spin mx-auto" />
              <p className="text-xs font-bold text-[#111827]">
                Analyzing role context and generating high-impact phrasing...
              </p>
            </div>
          ) : (
            <>
              {originalText && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Original Text
                  </span>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 mt-1">
                    {originalText}
                  </div>
                </div>
              )}

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6D5EF7]">
                  Proposed AI Revision (Editable)
                </span>
                <textarea
                  rows={4}
                  value={proposedText}
                  onChange={(e) => setProposedText(e.target.value)}
                  className="w-full p-3 border-2 border-violet-300 rounded-xl bg-violet-50/20 text-xs text-slate-900 mt-1 focus:outline-none focus:border-[#6D5EF7]"
                />
              </div>

              {aiRationale && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800">
                  <strong>Why this improves ATS ranking:</strong> {aiRationale}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setAiModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Discard
                </button>
                <button
                  onClick={acceptAISuggestion}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
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
