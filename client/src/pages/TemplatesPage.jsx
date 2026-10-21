import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { RESUME_TEMPLATES, TEMPLATE_CATEGORIES, DEMO_RESUME_DATA } from '../data/templatesData';
import { TemplateMiniaturePreview } from '../components/templates/TemplateMiniaturePreview';
import { ResumePreview } from '../components/templates/ResumePreview';
import { Modal } from '../components/common/Modal';
import {
  Layers,
  CheckCircle2,
  ArrowRight,
  Eye,
  Check,
  Search,
  Sparkles,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

export const TemplatesPage = () => {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userResume, setUserResume] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState('ats-classic');
  const [previewModalTemplate, setPreviewModalTemplate] = useState(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // Fetch active user resume if available to highlight active template and preserve user data
  useEffect(() => {
    const fetchUserResume = async () => {
      try {
        const res = await api.get('/resumes');
        if (res.data.success && res.data.data.length > 0) {
          const firstResume = res.data.data[0];
          setUserResume(firstResume);
          if (firstResume.templateId) {
            setSelectedTemplateId(firstResume.templateId);
          }
        }
      } catch (err) {
        console.warn('Could not fetch active resume for templates page, using demo context', err);
      }
    };

    fetchUserResume();
  }, []);

  // Filter templates based on category and search
  const filteredTemplates = useMemo(() => {
    return RESUME_TEMPLATES.filter((tpl) => {
      const matchesCategory = activeCategory === 'all' || tpl.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tpl.name.toLowerCase().includes(q) ||
        tpl.desc.toLowerCase().includes(q) ||
        tpl.badge.toLowerCase().includes(q) ||
        tpl.categoryLabel.toLowerCase().includes(q) ||
        tpl.features.some((f) => f.toLowerCase().includes(q)) ||
        tpl.recommendedRoles.some((r) => r.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleUseTemplate = async (templateId) => {
    if (userResume?._id) {
      try {
        // Persist choice to user's active resume
        await api.put(`/resumes/${userResume._id}`, {
          templateId
        });
      } catch (err) {
        console.warn('Auto-save template choice failed, navigating with query param:', err);
      }
      navigate(`/dashboard/builder?id=${userResume._id}&template=${templateId}`);
    } else {
      navigate(`/dashboard/builder?template=${templateId}`);
    }
  };

  // Resume data to feed preview modal
  const previewResumeData = useMemo(() => {
    const base = userResume?.sections?.personalInfo?.fullName ? userResume : DEMO_RESUME_DATA;
    return {
      ...base,
      templateId: previewModalTemplate?.id || 'ats-classic'
    };
  }, [userResume, previewModalTemplate]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(166,184,225,0.12)] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7865FF]/10 text-[#7865FF] text-xs font-bold border border-[#7865FF]/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#35D9E8]" />
            10 Premium Engineered Formats
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F6FF] tracking-tight">
            Professional Resume Templates
          </h1>
          <p className="text-sm sm:text-[15px] text-[#B5C0D6] mt-1 max-w-2xl leading-relaxed">
            Choose from 10 distinct, ATS-optimized layouts tailored for executives, engineers, data scientists, creatives, and fresh graduates. All templates preserve your resume data seamlessly.
          </p>
        </div>

        {userResume && (
          <div className="bg-[#141E33] rounded-xl p-3.5 border border-[rgba(166,184,225,0.16)] shadow-sm flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#192640] text-[#7865FF] flex items-center justify-center font-bold text-sm border border-[#7865FF]/30">
              <Layers className="w-5 h-5 text-[#35D9E8]" />
            </div>
            <div className="text-xs">
              <span className="text-[#8D9AB5] block font-medium uppercase tracking-wider text-[11px]">Active Resume</span>
              <span className="font-bold text-[#F4F6FF] truncate max-w-[200px] block text-sm">
                {userResume.title || 'My Resume'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`interactive-pill px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-[#7865FF] to-[#4285FF] text-white shadow-glow-violet'
                  : 'bg-[#141E33] text-[#B5C0D6] hover:text-[#F4F6FF] border border-[rgba(166,184,225,0.16)] hover:border-[#7865FF]/40'
              }`}
            >
              {cat.label}
              <span
                className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-[#101A2D] text-[#8D9AB5]'
                }`}
              >
                {cat.id === 'all'
                  ? RESUME_TEMPLATES.length
                  : RESUME_TEMPLATES.filter((t) => t.category === cat.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8D9AB5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates or roles..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-[#101A2D] border border-[rgba(166,184,225,0.18)] rounded-xl focus:outline-none focus:border-[#7865FF] text-[#F4F6FF] placeholder-[#8D9AB5] transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8D9AB5] hover:text-[#F4F6FF] text-sm font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Templates Grid with Premium Hover Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {filteredTemplates.map((tpl) => {
          const isSelected = selectedTemplateId === tpl.id;
          const isHovered = hoveredCardId === tpl.id;

          return (
            <div
              key={tpl.id}
              onMouseEnter={() => setHoveredCardId(tpl.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              className={`group bg-[#141E33] rounded-2xl border transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden relative cursor-default ${
                isSelected
                  ? 'border-[#7865FF] ring-2 ring-[#7865FF]/30 shadow-glow-violet/20'
                  : 'border-[rgba(166,184,225,0.16)] hover:border-[#7865FF]/50 shadow-sm hover:shadow-glow-violet/10 hover:-translate-y-1.5 hover:scale-[1.015]'
              }`}
            >
              {/* Selected Badge Ribbon */}
              {isSelected && (
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#7865FF] to-[#4285FF] text-white text-xs font-bold shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Currently Active</span>
                </div>
              )}

              {/* Miniature Preview Container (Dark studio canvas wrapping realistic white paper preview) */}
              <div className="relative h-64 bg-[#0B1120] border-b border-[rgba(166,184,225,0.12)] overflow-hidden flex items-center justify-center p-3">
                <TemplateMiniaturePreview
                  templateId={tpl.id}
                  resume={userResume}
                  isHovered={isHovered}
                />

                {/* Hover Quick-Preview Overlay Action Button */}
                <div
                  className={`absolute inset-0 bg-[#080D1B]/70 backdrop-blur-[2px] transition-opacity duration-200 flex items-center justify-center gap-3 ${
                    isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <button
                    onClick={() => setPreviewModalTemplate(tpl)}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#F4F6FF] bg-[#192640] hover:bg-[#223354] border border-[rgba(166,184,225,0.2)] shadow-md transition transform active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#35D9E8]" />
                    Quick Preview
                  </button>
                  <button
                    onClick={() => handleUseTemplate(tpl.id)}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7865FF] to-[#4285FF] hover:brightness-110 shadow-glow-violet transition transform active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Select
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#7865FF] bg-[#7865FF]/10 px-2.5 py-0.5 rounded-full border border-[#7865FF]/20">
                      {tpl.badge}
                    </span>
                    <span className="text-xs font-bold text-[#32D6A0] bg-emerald-500/15 px-2.5 py-0.5 rounded border border-emerald-500/30">
                      ATS: {tpl.atsScoreEstimate}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-lg text-[#F4F6FF] group-hover:text-[#7865FF] transition-colors duration-200">
                    {tpl.name}
                  </h3>
                  
                  <p className="text-sm text-[#B5C0D6] leading-relaxed line-clamp-2">
                    {tpl.desc}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2 pt-1">
                    {tpl.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs sm:text-[13px] text-[#B5C0D6]">
                        <CheckCircle2 className="w-4 h-4 text-[#32D6A0] shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Recommended Roles Pills */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {tpl.recommendedRoles.slice(0, 2).map((role, rIdx) => (
                      <span
                        key={rIdx}
                        className="text-xs font-medium text-[#8D9AB5] bg-[#101A2D] px-2.5 py-1 rounded border border-[rgba(166,184,225,0.12)]"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="pt-4 border-t border-[rgba(166,184,225,0.12)] flex items-center gap-2.5">
                  <button
                    onClick={() => setPreviewModalTemplate(tpl)}
                    type="button"
                    className="interactive-button p-2.5 rounded-xl text-[#B5C0D6] hover:text-[#F4F6FF] bg-[#101A2D] hover:bg-[#192640] border border-[rgba(166,184,225,0.16)] transition"
                    title="View Full Screen Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleUseTemplate(tpl.id)}
                    type="button"
                    className={`interactive-button flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition shadow-sm ${
                      isSelected
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-gradient-to-r from-[#7865FF] to-[#4285FF] text-white shadow-glow-violet'
                    }`}
                  >
                    <span>{isSelected ? 'Continue in Builder' : 'Use This Template'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty Filter State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-16 bg-[#141E33] rounded-2xl border border-[rgba(166,184,225,0.16)] p-8 space-y-3">
          <Layers className="w-10 h-10 text-[#8D9AB5] mx-auto" />
          <h3 className="font-bold text-lg text-[#F4F6FF]">No matching templates found</h3>
          <p className="text-sm text-[#B5C0D6] max-w-sm mx-auto">
            Try adjusting your search query or reset category filter to see all 10 available templates.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 bg-[#7865FF]/15 text-[#7865FF] font-bold text-sm rounded-xl border border-[#7865FF]/30 hover:bg-[#7865FF]/25 transition"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Full-Screen Interactive Preview Modal */}
      {previewModalTemplate && (
        <Modal
          isOpen={Boolean(previewModalTemplate)}
          onClose={() => setPreviewModalTemplate(null)}
          title={`Template Preview: ${previewModalTemplate.name}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6">
            {/* Modal Subheader Details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#101A2D] p-4 rounded-xl border border-[rgba(166,184,225,0.16)]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#7865FF] bg-[#7865FF]/10 px-2.5 py-0.5 rounded border border-[#7865FF]/20 uppercase tracking-wide">
                    {previewModalTemplate.categoryLabel}
                  </span>
                  <span className="text-xs font-bold text-[#32D6A0] bg-emerald-500/15 px-2.5 py-0.5 rounded border border-emerald-500/30">
                    Est. ATS Score: {previewModalTemplate.atsScoreEstimate}
                  </span>
                </div>
                <p className="text-sm text-[#B5C0D6] pt-1">
                  {previewModalTemplate.desc}
                </p>
              </div>

              <button
                onClick={() => handleUseTemplate(previewModalTemplate.id)}
                className="interactive-button inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#7865FF] to-[#4285FF] text-white rounded-xl text-sm font-bold shadow-glow-violet transition shrink-0"
              >
                <span>Select & Edit in Builder</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* High-Resolution A4 Sheet Preview Container (Option A+C studio framing) */}
            <div className="bg-[#0B1120] p-4 sm:p-6 rounded-2xl border border-[rgba(166,184,225,0.18)] max-h-[60vh] overflow-y-auto">
              <ResumePreview resume={previewResumeData} zoom={90} />
            </div>

            {/* Template Capabilities List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#F4F6FF] bg-[#101A2D] p-4 rounded-xl border border-[rgba(166,184,225,0.16)]">
              <div>
                <h4 className="font-bold text-[#F4F6FF] mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#32D6A0]" />
                  Key Layout Highlights
                </h4>
                <ul className="space-y-1.5 text-[#B5C0D6] pl-5 list-disc text-xs sm:text-[13px]">
                  {previewModalTemplate.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#F4F6FF] mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#7865FF]" />
                  Best Suited For
                </h4>
                <div className="flex flex-wrap gap-2">
                  {previewModalTemplate.recommendedRoles.map((role, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#192640] text-[#F4F6FF] rounded-lg text-xs font-medium border border-[rgba(166,184,225,0.16)]"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Controls */}
            <div className="flex justify-end gap-3 pt-2 border-t border-[rgba(166,184,225,0.12)]">
              <button
                onClick={() => setPreviewModalTemplate(null)}
                className="interactive-button px-4 py-2 rounded-xl text-sm font-semibold text-[#B5C0D6] bg-[#192640] hover:bg-[#233558] border border-[rgba(166,184,225,0.16)] transition"
              >
                Close Preview
              </button>
              <button
                onClick={() => handleUseTemplate(previewModalTemplate.id)}
                className="interactive-button inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7865FF] to-[#4285FF] shadow-glow-violet transition"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
