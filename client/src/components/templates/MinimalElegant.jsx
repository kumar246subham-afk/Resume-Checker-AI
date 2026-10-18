import React from 'react';

export const MinimalElegant = ({ resume }) => {
  const { personalInfo = {}, summary = '', experience = [], education = [], skills = {}, projects = [] } = resume?.sections || {};

  return (
    <div className="font-sans text-[#1E293B] text-[13px] leading-relaxed p-8 sm:p-14 max-w-[850px] mx-auto bg-white min-h-[1100px] shadow-sm print:p-0 print:shadow-none">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-wide text-[#0F172A]">
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#64748B] mt-1 font-medium">
          {personalInfo.title || 'Senior Software Engineer'}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#64748B] mt-3 pt-3 border-t border-slate-100">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-8">
          <p className="text-slate-600 leading-relaxed text-sm font-light">
            {summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8] mb-4">
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-medium text-[#0F172A] text-sm">{exp.role}</span>
                  <span className="text-xs text-[#94A3B8]">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-xs text-[#64748B] mb-2 font-light">
                  {exp.company} {exp.location && `• ${exp.location}`}
                </div>
                <ul className="space-y-1.5 text-slate-600 text-xs pl-0">
                  {(exp.bullets || []).map((b, bIdx) => (
                    <li key={bIdx} className="relative pl-3 before:content-['–'] before:absolute before:left-0 before:text-slate-400">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8] mb-4">
            Projects
          </h2>
          <div className="space-y-4">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-[#0F172A]">{proj.name}</span>
                  {proj.link && <span className="text-xs text-slate-400">{proj.link}</span>}
                </div>
                {proj.technologies?.length > 0 && (
                  <p className="text-xs text-slate-400 mb-1">{proj.technologies.join(', ')}</p>
                )}
                <ul className="space-y-1 text-slate-600 text-xs pl-0">
                  {(proj.bullets || []).map((b, bIdx) => (
                    <li key={bIdx} className="relative pl-3 before:content-['–'] before:absolute before:left-0 before:text-slate-400">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {(skills.technical?.length > 0 || skills.tools?.length > 0) && (
        <div className="mb-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8] mb-3">
            Core Competencies
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-light">
            {[...(skills.technical || []), ...(skills.tools || [])].join('  /  ')}
          </p>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8] mb-3">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-medium text-slate-800">{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="text-slate-500"> • {edu.institution}</span>
                </div>
                <span className="text-slate-400">{edu.graduationDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
