import React from 'react';

export const TechInnovator = ({ resume }) => {
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
      
      {/* Tech Innovator Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl mb-6 shadow-xs relative overflow-hidden">
        {/* Subtle decorative grid background glow */}
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-violet-600/20 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-mono font-semibold tracking-wide uppercase border border-violet-500/30 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Verified Software Architecture Profile
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {personalInfo.fullName || 'Software Engineer'}
            </h1>
            <p className="text-sm font-semibold text-violet-300 mt-0.5">
              {personalInfo.title || 'Full Stack & Cloud Systems Engineer'}
            </p>
          </div>

          <div className="text-xs text-slate-300 space-y-1 sm:text-right font-mono">
            {personalInfo.email && (
              <div>
                <a href={`mailto:${personalInfo.email}`} className="text-violet-200 hover:text-white transition">
                  {personalInfo.email}
                </a>
              </div>
            )}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            <div className="flex flex-wrap sm:justify-end gap-2 text-violet-300 text-[11px] pt-1">
              {personalInfo.github && <span>git: {personalInfo.github}</span>}
              {personalInfo.linkedin && <span>in: {personalInfo.linkedin}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Summary / Architecture Focus */}
      {summary && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-violet-100 text-violet-800 text-[10px] font-bold uppercase rounded font-mono">
              // OVERVIEW
            </span>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>
          <p className="text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            {summary}
          </p>
        </div>
      )}

      {/* Modern Tech Stack Grid */}
      {(skills.technical?.length > 0 || skills.soft?.length > 0) && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase rounded font-mono">
              // TECH STACK & CAPABILITIES
            </span>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(skills.technical || []).map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-50 text-violet-900 border border-violet-200 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-violet-600"></span>
                {skill}
              </span>
            ))}
            {(skills.soft || []).map((skill, idx) => (
              <span
                key={`soft-${idx}`}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Engineering Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase rounded font-mono">
              // WORK EXPERIENCE
            </span>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-violet-300 transition">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-sm text-[#0F172A]">{exp.role}</span>
                    <span className="text-xs font-semibold text-violet-700">@ {exp.company}</span>
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-500">
                    {exp.startDate} → {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>

                {exp.location && (
                  <p className="text-[11px] text-slate-500 mb-2 font-mono">
                    [{exp.location}]
                  </p>
                )}

                <ul className="space-y-1.5 text-slate-700 text-xs">
                  {(exp.bullets || []).map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-violet-600 font-bold select-none mt-0.5">▸</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engineering Projects & Open Source */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded font-mono">
              // FEATURED PROJECTS & SYSTEMS
            </span>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-xs text-slate-900">{proj.title}</span>
                    {proj.role && <span className="text-[10px] font-mono text-violet-600 font-bold">{proj.role}</span>}
                  </div>
                  {proj.description && <p className="text-xs text-slate-600 mb-2">{proj.description}</p>}
                  {(proj.bullets || []).map((b, bIdx) => (
                    <p key={bIdx} className="text-[11px] text-slate-700 leading-snug flex items-start gap-1 mb-1">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{b}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Certifications Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
        {education && education.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                // EDUCATION
              </span>
            </div>
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="text-xs">
                  <p className="font-bold text-slate-900">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </p>
                  <p className="text-slate-600">
                    {edu.institution} {edu.graduationDate ? `• ${edu.graduationDate}` : ''}
                  </p>
                  {edu.gpa && <p className="text-[11px] font-mono text-slate-500">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {(certifications.length > 0 || achievements.length > 0) && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                // CERTIFICATIONS & HONORS
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-700 font-mono">
              {certifications.map((c, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-violet-500 font-bold">#</span>
                  <span>{typeof c === 'string' ? c : `${c.name || ''}`}</span>
                </div>
              ))}
              {achievements.map((a, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-emerald-500 font-bold">#</span>
                  <span>{typeof a === 'string' ? a : `${a.title || ''}`}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
