import React from 'react';

export const ModernProfessional = ({ resume }) => {
  const { personalInfo = {}, summary = '', experience = [], education = [], skills = {}, projects = [], certifications = [], achievements = [] } = resume?.sections || {};
  const primaryColor = resume?.styling?.primaryColor || '#6D5EF7';

  return (
    <div className="font-sans text-[#111827] text-[13px] leading-relaxed p-8 sm:p-12 max-w-[850px] mx-auto bg-white min-h-[1100px] shadow-sm print:p-0 print:shadow-none border-t-8" style={{ borderTopColor: primaryColor }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-4 border-b border-slate-200 mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
            {personalInfo.fullName || 'Your Full Name'}
          </h1>
          <p className="text-sm font-semibold tracking-wide mt-0.5" style={{ color: primaryColor }}>
            {personalInfo.title || 'Professional Title'}
          </p>
        </div>

        <div className="text-xs text-slate-600 space-y-1 sm:text-right">
          {personalInfo.email && <div><a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a></div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
          <div className="flex sm:justify-end gap-2 text-slate-500">
            {personalInfo.linkedin && <span className="hover:text-black">{personalInfo.linkedin}</span>}
            {personalInfo.github && <span>• {personalInfo.github}</span>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: primaryColor }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: primaryColor }}></span>
            About Me
          </h2>
          <p className="text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100">
            {summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: primaryColor }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: primaryColor }}></span>
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="relative pl-3 border-l-2 border-slate-200">
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-baseline">
                  <span className="font-bold text-[#111827] text-sm">{exp.role}</span>
                  <span className="text-xs font-medium text-slate-500">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-600 mb-1.5 flex gap-2">
                  <span>{exp.company}</span>
                  {exp.location && <span>• {exp.location}</span>}
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700">
                  {(exp.bullets || []).map((b, bIdx) => (
                    <li key={bIdx} className="leading-snug">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Grid */}
      {(skills.technical?.length > 0 || skills.soft?.length > 0) && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2" style={{ color: primaryColor }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: primaryColor }}></span>
            Skills & Proficiencies
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.technical?.map((skill, sIdx) => (
              <span key={sIdx} className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                {skill}
              </span>
            ))}
            {skills.tools?.map((tool, tIdx) => (
              <span key={tIdx} className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100">
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: primaryColor }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: primaryColor }}></span>
            Featured Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold text-[#111827]">{proj.name}</span>
                  {proj.link && <span className="text-xs text-slate-500">{proj.link}</span>}
                </div>
                {proj.technologies?.length > 0 && (
                  <p className="text-xs font-medium text-slate-500 mb-1">
                    {proj.technologies.join(' • ')}
                  </p>
                )}
                {proj.description && <p className="text-xs text-slate-700 mb-1">{proj.description}</p>}
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700 text-xs">
                  {(proj.bullets || []).map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Certifications Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {education && education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: primaryColor }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: primaryColor }}></span>
              Education
            </h2>
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="text-xs text-slate-800">
                <div className="font-bold text-black">{edu.degree}</div>
                <div className="text-slate-600">{edu.institution} ({edu.graduationDate})</div>
                {edu.gpa && <div className="text-slate-500">GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: primaryColor }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: primaryColor }}></span>
              Certifications
            </h2>
            <div className="space-y-1 text-xs text-slate-800">
              {certifications.map((c, idx) => (
                <div key={c.id || idx}>
                  <div className="font-semibold text-black">{c.name}</div>
                  <div className="text-slate-500">{c.issuer} — {c.issueDate}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
