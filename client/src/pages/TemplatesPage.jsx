import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export const TemplatesPage = () => {
  const templates = [
    {
      id: 'ats-classic',
      name: 'ATS Classic',
      badge: 'Maximum Compatibility',
      desc: 'The gold standard for passing through automated applicant tracking systems (Workday, Greenhouse, Lever). Single-column, standard serif typography, clean section breaks.',
      features: ['100% Single-Column Layout', 'Zero Parsing Failures', 'Optimal for High-Volume Applications']
    },
    {
      id: 'modern-pro',
      name: 'Modern Professional',
      badge: 'Tech & High-Growth SaaS',
      desc: 'Contemporary presentation with subtle violet header bar, clear skill badges, and clean spacing between roles.',
      features: ['Sleek Competency Badges', 'Modern Inter Font', 'Subtle Brand Accents']
    },
    {
      id: 'minimal-elegant',
      name: 'Minimal Elegant',
      badge: 'Product & Design',
      desc: 'Refined, spacious typography with generous breathing room and delicate hairline rules.',
      features: ['Generous Whitespace', 'High-End Typography', 'Distinctive Aesthetic']
    },
    {
      id: 'tech-resume',
      name: 'Technical Resume',
      badge: 'Software & DevOps',
      desc: 'Monospace touches, dedicated tech-stack grids, and project architecture bullet highlights.',
      features: ['Tech Stack Header Box', 'Monospace Code Tags', 'Emphasizes System Impact']
    },
    {
      id: 'executive-profile',
      name: 'Executive Profile',
      badge: 'Leadership & Senior Roles',
      desc: 'Emphasizes strategic executive summaries, leadership competencies, and quantifiable business milestones.',
      features: ['Executive Summary Callout', 'Core Competencies Grid', 'Strategic Achievements Section']
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-[#111827]">Professional Resume Templates</h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Select any of our 5 engineered templates. All templates use your single source of resume data and can be swapped instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle hover:shadow-card-hover transition-all flex flex-col justify-between overflow-hidden"
          >
            {/* Visual Header Representation */}
            <div className="p-5 bg-slate-50 border-b border-slate-100">
              <div className="h-48 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col gap-2">
                <div className="h-4 w-1/2 bg-slate-800 rounded"></div>
                <div className="h-2 w-1/3 bg-slate-400 rounded"></div>
                <div className="h-px bg-slate-200 my-1"></div>
                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-slate-100 rounded"></div>
                  <div className="h-2 w-5/6 bg-slate-100 rounded"></div>
                  <div className="h-2 w-4/5 bg-slate-100 rounded"></div>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D5EF7] bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">
                  {tpl.badge}
                </span>
                <h3 className="font-bold text-base text-[#111827]">{tpl.name}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{tpl.desc}</p>

                <div className="space-y-1.5 pt-2">
                  {tpl.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to={`/dashboard/builder?template=${tpl.id}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] transition shadow-xs mt-4"
              >
                Use This Template
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
