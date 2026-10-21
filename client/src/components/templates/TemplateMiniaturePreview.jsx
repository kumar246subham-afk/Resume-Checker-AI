import React from 'react';
import { DEMO_RESUME_DATA } from '../../data/templatesData';

export const TemplateMiniaturePreview = ({ templateId = 'ats-classic', resume = null, isHovered = false }) => {
  const activeResume = resume?.sections?.personalInfo?.fullName ? resume : DEMO_RESUME_DATA;
  const { personalInfo = {}, summary = '', experience = [], education = [], skills = {} } = activeResume.sections || {};

  const name = personalInfo.fullName || 'Alex Morgan';
  const title = personalInfo.title || 'Senior Software Engineer';
  const email = personalInfo.email || 'alex@domain.com';
  const location = personalInfo.location || 'San Francisco, CA';
  const firstExp = experience[0] || {
    role: 'Senior Software Engineer',
    company: 'Apex Systems',
    startDate: '2022',
    endDate: 'Present',
    bullets: ['Architected scalable microservices processing 15k req/s.', 'Reduced system latency by 35% across cloud infrastructure.']
  };
  const skillList = (skills.technical || ['React', 'Node.js', 'Python', 'AWS', 'Docker']).slice(0, 5);

  // Template-specific visual miniature representations
  const renderMiniatureContent = () => {
    switch (templateId) {
      case 'ats-classic':
        return (
          <div className="font-serif p-4 text-[10px] text-slate-900 h-full flex flex-col justify-between">
            <div className="text-center border-b border-slate-300 pb-2 mb-2.5">
              <div className="font-bold text-xs uppercase tracking-wide text-black">{name}</div>
              <div className="text-[9px] text-slate-600">{title}</div>
              <div className="text-[8px] text-slate-500 mt-0.5">{email} • {location} • LinkedIn</div>
            </div>
            <div className="space-y-2 flex-1">
              <div>
                <div className="font-bold text-[9px] uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1 text-black">
                  Experience
                </div>
                <div className="flex justify-between font-bold text-[8.5px]">
                  <span>{firstExp.role} — <span className="font-normal italic text-slate-600">{firstExp.company}</span></span>
                  <span className="text-[8px] font-normal text-slate-500">2022 – Pres</span>
                </div>
                <div className="text-[8px] text-slate-700 pl-2 mt-0.5 line-clamp-2">
                  • {firstExp.bullets?.[0] || 'Architected high-throughput services.'}
                </div>
              </div>
              <div>
                <div className="font-bold text-[9px] uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1 text-black">
                  Skills & Education
                </div>
                <div className="text-[8px] text-slate-700">
                  <span className="font-semibold">Core: </span>{skillList.join(', ')}
                </div>
                <div className="text-[8px] text-slate-600 mt-0.5">
                  B.S. Computer Science • UC Berkeley
                </div>
              </div>
            </div>
            <div className="text-[7.5px] text-center text-slate-400 pt-1 border-t border-slate-100">
              100% Single-Column ATS Layout
            </div>
          </div>
        );

      case 'modern-pro':
        return (
          <div className="font-sans text-[10px] text-slate-900 h-full flex flex-col justify-between border-t-4 border-[#6D5EF7] bg-white">
            <div className="p-3 pb-2 border-b border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-extrabold text-xs text-slate-900">{name}</div>
                  <div className="text-[9px] font-bold text-[#6D5EF7]">{title}</div>
                </div>
                <div className="text-right text-[8px] text-slate-500">
                  <div>{email}</div>
                  <div>{location}</div>
                </div>
              </div>
            </div>
            <div className="p-3 pt-2 space-y-2 flex-1">
              <div>
                <div className="text-[8.5px] font-bold uppercase tracking-wider text-[#6D5EF7] flex items-center gap-1 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6D5EF7]"></span> Experience
                </div>
                <div className="pl-2 border-l-2 border-violet-100">
                  <div className="font-bold text-[8.5px] text-slate-900">{firstExp.role}</div>
                  <div className="text-[7.5px] text-slate-500">{firstExp.company} • 2022–Pres</div>
                  <div className="text-[7.5px] text-slate-600 line-clamp-1 mt-0.5">
                    {firstExp.bullets?.[0]}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[8.5px] font-bold uppercase tracking-wider text-[#6D5EF7] flex items-center gap-1 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6D5EF7]"></span> Skills
                </div>
                <div className="flex flex-wrap gap-1">
                  {skillList.slice(0, 4).map((s, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-violet-50 text-violet-800 rounded text-[7.5px] font-medium border border-violet-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-3 pb-2 text-[7.5px] text-slate-400 flex justify-between">
              <span>B.S. Computer Science</span>
              <span className="text-[#6D5EF7] font-semibold">Modern Style</span>
            </div>
          </div>
        );

      case 'minimal-elegant':
        return (
          <div className="font-sans p-4 text-[10px] text-slate-900 h-full flex flex-col justify-between bg-white">
            <div className="pb-3 border-b border-slate-100">
              <div className="text-[11px] font-light tracking-widest uppercase text-slate-800">{name}</div>
              <div className="text-[8px] tracking-wider uppercase text-slate-400 mt-0.5">{title}</div>
              <div className="text-[7.5px] text-slate-400 mt-1">{email} / {location}</div>
            </div>
            <div className="space-y-2 flex-1 pt-2">
              <div>
                <div className="text-[7.5px] font-bold tracking-widest uppercase text-slate-400 mb-1">
                  Experience
                </div>
                <div className="text-[8.5px] font-semibold text-slate-800">{firstExp.role}</div>
                <div className="text-[7.5px] text-slate-400">{firstExp.company}</div>
                <div className="text-[7.5px] text-slate-600 italic line-clamp-1 mt-0.5">
                  "{firstExp.bullets?.[0]}"
                </div>
              </div>
              <div>
                <div className="text-[7.5px] font-bold tracking-widest uppercase text-slate-400 mb-1">
                  Proficiencies
                </div>
                <div className="text-[8px] text-slate-700 font-light tracking-wide">
                  {skillList.join('  •  ')}
                </div>
              </div>
            </div>
            <div className="text-[7.5px] text-slate-400 border-t border-slate-100 pt-1">
              Spacious & Refined Typography
            </div>
          </div>
        );

      case 'tech-resume':
        return (
          <div className="font-mono p-3 text-[10px] text-slate-900 h-full flex flex-col justify-between bg-white border-t-2 border-sky-500">
            <div className="bg-slate-900 text-white p-2.5 rounded-lg mb-2">
              <div className="text-white font-bold text-[11px] flex justify-between items-center">
                <span>{name}</span>
                <span className="text-sky-400 text-[8px]">// v2.4</span>
              </div>
              <div className="text-sky-300 text-[8px] font-sans font-medium">{title}</div>
              <div className="text-[7px] text-slate-400 mt-0.5 font-mono">{email} | {location}</div>
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                <div className="text-[7.5px] text-sky-700 font-bold mb-0.5">&gt; TECH_STACK</div>
                <div className="flex flex-wrap gap-1">
                  {skillList.slice(0, 4).map((s, i) => (
                    <span key={i} className="px-1 py-0.2 bg-white text-slate-700 border border-slate-300 rounded text-[7px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[7.5px] text-slate-500 font-bold">&gt; EXPERIENCE</div>
                <div className="text-[8px] font-bold text-slate-900">{firstExp.role} @ {firstExp.company}</div>
                <div className="text-[7.5px] text-slate-600 line-clamp-1 font-sans">
                  • {firstExp.bullets?.[0]}
                </div>
              </div>
            </div>
            <div className="text-[7px] text-sky-700 font-semibold pt-1 border-t border-slate-100 flex justify-between">
              <span>ARCHITECTURE FOCUS</span>
              <span>98% ATS</span>
            </div>
          </div>
        );

      case 'executive-profile':
        return (
          <div className="font-sans p-3.5 text-[10px] text-slate-900 h-full flex flex-col justify-between bg-white border-t-4 border-slate-800">
            <div className="border-b border-slate-200 pb-2 mb-2 flex justify-between items-baseline">
              <div>
                <div className="font-extrabold text-xs tracking-tight text-slate-900 uppercase font-serif">{name}</div>
                <div className="text-[8.5px] font-bold text-slate-600 tracking-wider uppercase">{title}</div>
              </div>
              <div className="text-right text-[7.5px] text-slate-500">
                <div>{location}</div>
                <div>{email}</div>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <div className="bg-slate-50 p-1.5 rounded border-l-2 border-slate-800">
                <div className="text-[7.5px] font-bold uppercase text-slate-800">Executive Summary</div>
                <div className="text-[7.5px] text-slate-600 line-clamp-1 italic">
                  Visionary leadership driving multi-million revenue growth & system transformation.
                </div>
              </div>
              <div>
                <div className="text-[8px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-0.5 mb-1">
                  Core Competencies
                </div>
                <div className="grid grid-cols-2 gap-1 text-[7.5px] text-slate-700 font-medium">
                  <div>• Strategic Planning</div>
                  <div>• Cloud Transformation</div>
                  <div>• Team Mentorship</div>
                  <div>• P&L Management</div>
                </div>
              </div>
            </div>
            <div className="text-[7.5px] text-slate-500 border-t border-slate-100 pt-1 flex justify-between">
              <span>Senior & VP Roles</span>
              <span className="font-bold text-slate-800">Executive</span>
            </div>
          </div>
        );

      case 'executive-elite':
        return (
          <div className="font-serif p-3.5 text-[10px] text-slate-900 h-full flex flex-col justify-between bg-white border-t-4 border-[#B45309]">
            <div className="border-b-2 border-slate-900 pb-2 mb-2 flex justify-between items-start">
              <div>
                <div className="font-extrabold text-xs text-slate-950 uppercase tracking-tight">{name}</div>
                <div className="text-[8px] font-sans font-bold tracking-widest text-[#B45309] uppercase">
                  {title}
                </div>
              </div>
              <div className="text-right text-[7.5px] text-slate-600 font-sans">
                <div>{location}</div>
                <div>{email}</div>
              </div>
            </div>
            <div className="space-y-1.5 flex-1 font-sans">
              <div className="p-1.5 bg-amber-50/50 rounded border-l-2 border-[#B45309] text-[7.5px] text-slate-700">
                <span className="font-bold text-slate-900">Leadership Scope: </span>
                Guiding strategic vision, high-scale engineering governance, and board alignment.
              </div>
              <div>
                <div className="text-[7.5px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 mb-1 flex justify-between">
                  <span>Executive Track</span>
                  <span className="text-[#B45309] text-[7px]">CONFIDENTIAL</span>
                </div>
                <div className="text-[8px] font-bold text-slate-900">{firstExp.role}</div>
                <div className="text-[7.5px] text-[#B45309] font-medium">{firstExp.company}</div>
                <div className="text-[7.5px] text-slate-600 line-clamp-1 mt-0.5">
                  › {firstExp.bullets?.[0]}
                </div>
              </div>
            </div>
            <div className="text-[7.5px] text-[#B45309] font-bold font-sans pt-1 border-t border-slate-100 flex justify-between">
              <span>Gold Accent Styling</span>
              <span>C-Suite Grade</span>
            </div>
          </div>
        );

      case 'tech-innovator':
        return (
          <div className="font-sans text-[10px] text-slate-900 h-full flex flex-col justify-between bg-white">
            <div className="bg-slate-900 text-white p-2.5 rounded-t-lg">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-xs text-white">{name}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-violet-500/30 text-violet-300 text-[6.5px] font-mono">
                  LIVE PROFILE
                </span>
              </div>
              <div className="text-[8px] font-semibold text-violet-300">{title}</div>
              <div className="text-[7px] text-slate-400 font-mono mt-0.5">{email} • {location}</div>
            </div>
            <div className="p-2.5 space-y-1.5 flex-1">
              <div>
                <div className="text-[7px] font-mono font-bold text-violet-700 uppercase tracking-wider mb-1">
                  // TECH_STACK
                </div>
                <div className="flex flex-wrap gap-1">
                  {skillList.slice(0, 4).map((s, i) => (
                    <span key={i} className="px-1 py-0.2 bg-violet-50 text-violet-900 border border-violet-200 rounded text-[7px] font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[7px] font-mono font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                  // EXPERIENCE
                </div>
                <div className="p-1 rounded bg-slate-50 border border-slate-200 text-[7.5px]">
                  <div className="font-bold text-slate-900">{firstExp.role}</div>
                  <div className="text-violet-700 font-medium">@ {firstExp.company}</div>
                  <div className="text-slate-600 line-clamp-1 mt-0.5">
                    ▸ {firstExp.bullets?.[0]}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-2.5 pb-2 text-[7px] text-violet-600 font-mono flex justify-between">
              <span>&gt; AI & SOFTWARE</span>
              <span>100% SELECTABLE</span>
            </div>
          </div>
        );

      case 'data-science-pro':
        return (
          <div className="font-sans p-3 text-[10px] text-slate-900 h-full flex flex-col justify-between bg-white border-t-4 border-[#0D9488]">
            <div className="border-b-2 border-teal-600/30 pb-2 mb-2 flex justify-between items-baseline">
              <div>
                <div className="font-extrabold text-xs text-slate-900">{name}</div>
                <div className="text-[8px] font-bold text-[#0D9488] tracking-wide">{title}</div>
              </div>
              <div className="text-right text-[7.5px] text-slate-500">
                <div>{location}</div>
                <div>{email}</div>
              </div>
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="bg-teal-50/50 p-1.5 rounded border border-teal-200/80">
                <div className="text-[7.5px] font-bold uppercase text-teal-900 mb-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span> Analytics & ML Focus
                </div>
                <div className="flex flex-wrap gap-1">
                  {['Python', 'SQL', 'PyTorch', 'Tableau'].map((s, i) => (
                    <span key={i} className="px-1 py-0.2 bg-white text-slate-800 rounded text-[7px] font-semibold border border-teal-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[7.5px] font-bold uppercase tracking-wider text-slate-800 mb-0.5">
                  Applied Analytics
                </div>
                <div className="text-[8px] font-bold text-slate-900">{firstExp.role}</div>
                <div className="text-[7.5px] text-teal-800 font-medium">• {firstExp.company}</div>
                <div className="text-[7.5px] text-slate-600 line-clamp-1 mt-0.5">
                  ■ {firstExp.bullets?.[0]}
                </div>
              </div>
            </div>
            <div className="text-[7.5px] text-teal-700 font-bold pt-1 border-t border-slate-100 flex justify-between">
              <span>Data & ML Pipeline</span>
              <span>Teal Accent</span>
            </div>
          </div>
        );

      case 'creative-portfolio':
        return (
          <div className="font-sans p-3.5 text-[10px] text-slate-900 h-full flex flex-col justify-between bg-white border-l-4 border-[#8B5CF6]">
            <div className="border-b border-indigo-100 pb-2 mb-2 flex justify-between items-start">
              <div>
                <div className="text-[7px] font-bold text-violet-600 uppercase tracking-widest">Portfolio</div>
                <div className="font-extrabold text-xs text-indigo-950">{name}</div>
                <div className="text-[8px] font-medium text-[#8B5CF6]">{title}</div>
              </div>
              <div className="text-right text-[7.5px] text-slate-500">
                <div className="font-semibold text-violet-700">🌐 alexmorgan.dev</div>
                <div>{location}</div>
              </div>
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="bg-violet-50/50 p-1.5 rounded-lg border border-violet-100">
                <div className="text-[7.5px] font-bold uppercase text-violet-900 mb-0.5">Design Tooling</div>
                <div className="flex flex-wrap gap-1">
                  {['Figma', 'UI/UX', 'Prototypes', 'Design Systems'].map((s, i) => (
                    <span key={i} className="px-1.5 py-0.2 bg-white text-violet-900 rounded-full text-[6.5px] font-medium border border-violet-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[7.5px] font-bold uppercase tracking-wider text-indigo-950 mb-0.5">
                  Case Studies & Leadership
                </div>
                <div className="text-[8px] font-bold text-indigo-900">{firstExp.role}</div>
                <div className="text-[7.5px] text-[#8B5CF6]">@ {firstExp.company}</div>
                <div className="text-[7.5px] text-slate-600 line-clamp-1 mt-0.5">
                  ✦ {firstExp.bullets?.[0]}
                </div>
              </div>
            </div>
            <div className="text-[7.5px] text-violet-600 font-semibold pt-1 border-t border-slate-100 flex justify-between">
              <span>Asymmetric Layout</span>
              <span>Design Grade</span>
            </div>
          </div>
        );

      case 'fresh-graduate-pro':
        return (
          <div className="font-sans p-3 text-[10px] text-slate-900 h-full flex flex-col justify-between bg-white border-t-3 border-teal-500">
            <div className="border-b border-slate-200 pb-2 mb-2 flex justify-between items-baseline">
              <div>
                <div className="text-[7px] font-bold text-teal-700 uppercase tracking-widest">Early Career</div>
                <div className="font-extrabold text-xs text-slate-900">{name}</div>
                <div className="text-[8px] font-semibold text-[#6D5EF7]">{title}</div>
              </div>
              <div className="text-right text-[7.5px] text-slate-500">
                <div>{email}</div>
                <div>{location}</div>
              </div>
            </div>
            <div className="space-y-1.5 flex-1">
              {/* Highlighted Education on Top */}
              <div className="bg-teal-50/60 p-1.5 rounded border border-teal-200">
                <div className="text-[7px] font-bold uppercase text-teal-900 flex justify-between">
                  <span>Education (Priority)</span>
                  <span className="text-teal-700 font-bold">GPA: 3.85</span>
                </div>
                <div className="text-[7.5px] font-bold text-slate-800">B.S. Computer Science</div>
                <div className="text-[7px] text-slate-600">UC Berkeley • Class of 2024</div>
              </div>
              <div>
                <div className="text-[7.5px] font-bold uppercase tracking-wider text-slate-800 mb-0.5">
                  Capstone Projects
                </div>
                <div className="text-[8px] font-bold text-slate-900">NeuralSearch Cloud Engine</div>
                <div className="text-[7.5px] text-teal-700 font-medium">Lead Developer</div>
                <div className="text-[7.5px] text-slate-600 line-clamp-1 mt-0.5">
                  ✓ Built full-stack semantic search indexing 500k records.
                </div>
              </div>
            </div>
            <div className="text-[7.5px] text-teal-800 font-semibold pt-1 border-t border-slate-100 flex justify-between">
              <span>B.Tech / Fresher Optimized</span>
              <span>Teal & Violet</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 flex items-center justify-center p-3 sm:p-4 select-none overflow-hidden">
      <div
        className={`w-full max-w-[240px] aspect-[1/1.38] bg-white rounded-md shadow-md border border-slate-200/90 transition-transform duration-300 ease-out origin-center ${
          isHovered ? 'scale-[1.03] shadow-lg' : 'scale-100'
        }`}
      >
        {renderMiniatureContent()}
      </div>
    </div>
  );
};
