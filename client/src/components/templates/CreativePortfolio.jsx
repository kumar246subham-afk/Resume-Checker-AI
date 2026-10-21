import React from 'react';

export const CreativePortfolio = ({ resume }) => {
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
    <div className="font-sans text-[#1E1B4B] text-[13px] leading-relaxed p-8 sm:p-12 max-w-[850px] mx-auto bg-white min-h-[1100px] shadow-sm print:p-0 print:shadow-none">
      
      {/* Creative Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-indigo-100 mb-6">
        <div>
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 text-[10px] font-bold tracking-wider uppercase mb-2">
            Creative & Product Design Portfolio
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1E1B4B]">
            {personalInfo.fullName || 'Creative Designer'}
          </h1>
          <p className="text-sm font-semibold text-[#8B5CF6] tracking-wide mt-0.5">
            {personalInfo.title || 'Product Designer & UX Strategist'}
          </p>
        </div>

        <div className="flex flex-col sm:items-end text-xs text-slate-600 space-y-1">
          {personalInfo.email && (
            <div>
              <a href={`mailto:${personalInfo.email}`} className="text-[#8B5CF6] font-semibold hover:underline">
                {personalInfo.email}
              </a>
            </div>
          )}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}

          {/* Portfolio & Social Link Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1.5 sm:justify-end">
            {personalInfo.website && (
              <span className="px-2 py-0.5 bg-violet-50 text-violet-700 rounded text-[11px] font-medium border border-violet-200">
                🌐 {personalInfo.website}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="px-2 py-0.5 bg-slate-50 text-slate-700 rounded text-[11px] font-medium border border-slate-200">
                in/{personalInfo.linkedin.replace(/.*linkedin\.com\/in\//, '')}
              </span>
            )}
            {personalInfo.github && (
              <span className="px-2 py-0.5 bg-slate-50 text-slate-700 rounded text-[11px] font-medium border border-slate-200">
                git/{personalInfo.github.replace(/.*github\.com\//, '')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Design Narrative Summary */}
      {summary && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-violet-50/70 via-indigo-50/40 to-transparent border border-violet-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6] mb-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
            Design Philosophy & Impact
          </h2>
          <p className="text-slate-700 leading-relaxed text-justify">
            {summary}
          </p>
        </div>
      )}

      {/* Creative Skills & Design Tooling */}
      {(skills.technical?.length > 0 || skills.soft?.length > 0) && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E1B4B] border-b border-indigo-100 pb-1 mb-2.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
            Core Competencies & Toolset
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {(skills.technical || []).map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-900 border border-violet-200 shadow-2xs"
              >
                {skill}
              </span>
            ))}
            {(skills.soft || []).map((s, idx) => (
              <span
                key={`soft-${idx}`}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Featured Portfolio Case Studies */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E1B4B] border-b border-indigo-100 pb-1 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
            Featured Case Studies & Portfolio Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {projects.map((proj, idx) => (
              <div
                key={proj.id || idx}
                className="p-3.5 rounded-xl border border-violet-200/80 bg-white hover:border-violet-400 transition shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-xs text-[#1E1B4B]">{proj.title}</span>
                    {proj.role && (
                      <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
                        {proj.role}
                      </span>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                  {(proj.bullets || []).map((bullet, bIdx) => (
                    <p key={bIdx} className="text-[11px] text-slate-700 flex items-start gap-1.5 mb-1">
                      <span className="text-violet-500 font-bold">✦</span>
                      <span>{bullet}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience & Roles */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E1B4B] border-b border-indigo-100 pb-1 mb-3.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
            Experience & Design Leadership
          </h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="pl-3.5 border-l-2 border-violet-300">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                  <div>
                    <span className="font-bold text-sm text-[#1E1B4B]">{exp.role}</span>
                    <span className="text-xs font-semibold text-[#8B5CF6] ml-2">@ {exp.company}</span>
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
                  {(exp.bullets || []).map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-violet-500 font-bold select-none">▸</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Achievements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-indigo-100">
        {education && education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E1B4B] mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></span>
              Education & Design Studies
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
                  {edu.gpa && <p className="text-[11px] text-violet-700">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {(certifications.length > 0 || achievements.length > 0) && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E1B4B] mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></span>
              Recognition & Accreditations
            </h2>
            <div className="space-y-1 text-xs text-slate-700">
              {certifications.map((c, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-violet-500 font-bold">★</span>
                  <span>{typeof c === 'string' ? c : `${c.name || ''}`}</span>
                </div>
              ))}
              {achievements.map((a, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-violet-500 font-bold">★</span>
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
