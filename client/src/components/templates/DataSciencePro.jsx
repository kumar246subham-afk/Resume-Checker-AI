import React from 'react';

export const DataSciencePro = ({ resume }) => {
  const {
    personalInfo = {},
    summary = '',
    experience = [],
    education = [],
    skills = {},
    projects = [],
    certifications = [],
    achievements = []
  } = resume?.sections || {};

  return (
    <div className="font-sans text-[#0F172A] text-[13px] leading-relaxed p-8 sm:p-12 max-w-[850px] mx-auto bg-white min-h-[1100px] shadow-sm print:p-0 print:shadow-none">
      
      {/* Top Teal & Navy Header */}
      <div className="border-b-4 border-[#0D9488] pb-5 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold tracking-wider uppercase mb-1.5">
              <span>●</span> Quantitative Analytics & ML Profile
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
              {personalInfo.fullName || 'Data Science Professional'}
            </h1>
            <p className="text-sm font-bold text-[#0D9488] tracking-wide mt-0.5">
              {personalInfo.title || 'Data Scientist | Machine Learning Specialist'}
            </p>
          </div>

          <div className="text-right text-xs text-slate-600 space-y-0.5">
            {personalInfo.email && (
              <div>
                <a href={`mailto:${personalInfo.email}`} className="text-[#0D9488] font-semibold hover:underline">
                  {personalInfo.email}
                </a>
              </div>
            )}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            <div className="flex sm:justify-end gap-2 text-slate-500 text-[11px] pt-0.5">
              {personalInfo.github && <span>github: {personalInfo.github}</span>}
              {personalInfo.linkedin && <span>linkedin: {personalInfo.linkedin}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Analytical Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2 flex items-center gap-2">
            <span className="w-2.5 h-1 bg-[#0D9488] rounded-full"></span>
            Professional Summary & Research Focus
          </h2>
          <p className="text-slate-700 leading-relaxed bg-teal-50/30 p-3.5 rounded-xl border border-teal-100/80 text-justify">
            {summary}
          </p>
        </div>
      )}

      {/* Structured Technical Skills Matrix */}
      {(skills.technical?.length > 0 || skills.soft?.length > 0) && (
        <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-1 bg-[#0D9488] rounded-full"></span>
              Technical Competencies & Analytics Stack
            </span>
            <span className="text-[10px] text-teal-700 font-semibold uppercase">Tooling & Models</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {(skills.technical || []).map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white text-slate-800 border border-slate-300/80 shadow-2xs flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]"></span>
                {skill}
              </span>
            ))}
            {(skills.soft || []).map((s, idx) => (
              <span
                key={`soft-${idx}`}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-teal-50/60 text-teal-900 border border-teal-200/70"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience & Practical Analytics */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] border-b border-slate-200 pb-1 mb-3.5 flex items-center gap-2">
            <span className="w-2.5 h-1 bg-[#0D9488] rounded-full"></span>
            Professional Experience & Applied Analytics
          </h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="pl-3.5 border-l-2 border-teal-600/40">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                  <div>
                    <span className="font-bold text-sm text-[#0F172A]">{exp.role}</span>
                    <span className="text-xs font-semibold text-teal-800 ml-1.5">• {exp.company}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>

                {exp.location && (
                  <p className="text-[11px] text-slate-500 mb-1.5">
                    {exp.location}
                  </p>
                )}

                <ul className="space-y-1.5 text-slate-700 text-xs">
                  {(exp.bullets || []).map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-[#0D9488] font-bold select-none">■</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Projects & Research Highlights */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] border-b border-slate-200 pb-1 mb-3 flex items-center gap-2">
            <span className="w-2.5 h-1 bg-[#0D9488] rounded-full"></span>
            Machine Learning Projects & Data Products
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/90">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-xs text-[#0F172A]">{proj.title}</span>
                  {proj.role && <span className="text-[11px] text-[#0D9488] font-bold">{proj.role}</span>}
                </div>
                {proj.description && <p className="text-xs text-slate-600 mb-1.5">{proj.description}</p>}
                {(proj.bullets || []).map((bullet, bIdx) => (
                  <p key={bIdx} className="text-xs text-slate-700 flex items-start gap-1.5 leading-snug">
                    <span className="text-teal-600">›</span>
                    <span>{bullet}</span>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Certifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
        {education && education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2 flex items-center gap-1.5">
              <span className="w-2 h-1 bg-[#0D9488] rounded-full"></span>
              Academic Background
            </h2>
            <div className="space-y-2 text-xs">
              {education.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <p className="font-bold text-slate-900">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </p>
                  <p className="text-slate-600">
                    {edu.institution} {edu.graduationDate ? `• ${edu.graduationDate}` : ''}
                  </p>
                  {edu.gpa && <p className="text-[11px] text-teal-700 font-semibold">Cumulative GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {(certifications.length > 0 || achievements.length > 0) && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2 flex items-center gap-1.5">
              <span className="w-2 h-1 bg-[#0D9488] rounded-full"></span>
              Certifications & Publications
            </h2>
            <div className="space-y-1.5 text-xs text-slate-700">
              {certifications.map((c, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span>{typeof c === 'string' ? c : `${c.name || ''} ${c.issuer ? `(${c.issuer})` : ''}`}</span>
                </div>
              ))}
              {achievements.map((a, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span>{typeof a === 'string' ? a : `${a.title || ''}: ${a.description || ''}`}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
