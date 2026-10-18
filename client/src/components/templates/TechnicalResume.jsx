import React from 'react';

export const TechnicalResume = ({ resume }) => {
  const { personalInfo = {}, summary = '', experience = [], education = [], skills = {}, projects = [], certifications = [] } = resume?.sections || {};

  return (
    <div className="font-mono text-[12px] leading-relaxed p-8 sm:p-10 max-w-[850px] mx-auto bg-white min-h-[1100px] shadow-sm print:p-0 print:shadow-none text-slate-800">
      {/* Header */}
      <div className="border-b-2 border-slate-800 pb-3 mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
            {personalInfo.fullName || 'Alex Morgan'}
          </h1>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            {personalInfo.title || 'Systems & Full Stack Engineer'}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600 mt-2 font-mono">
          {personalInfo.email && <span>email: <a href={`mailto:${personalInfo.email}`} className="text-blue-600 underline">{personalInfo.email}</a></span>}
          {personalInfo.phone && <span>tel: {personalInfo.phone}</span>}
          {personalInfo.location && <span>loc: {personalInfo.location}</span>}
          {personalInfo.github && <span>git: {personalInfo.github}</span>}
          {personalInfo.linkedin && <span>in: {personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Technical Skills Header First for Tech Resumes */}
      {(skills.technical?.length > 0 || skills.tools?.length > 0) && (
        <div className="mb-4 bg-slate-50 p-3 rounded border border-slate-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5 font-sans">
            <span className="text-violet-600 font-mono">&gt;</span> TECH_STACK & PROFICIENCIES
          </div>
          <div className="space-y-1 text-xs">
            {skills.technical?.length > 0 && (
              <div><span className="font-bold text-slate-700">Languages & Core:</span> {skills.technical.join(', ')}</div>
            )}
            {skills.tools?.length > 0 && (
              <div><span className="font-bold text-slate-700">Cloud & Infrastructure:</span> {skills.tools.join(', ')}</div>
            )}
            {skills.soft?.length > 0 && (
              <div><span className="font-bold text-slate-700">Methodologies:</span> {skills.soft.join(', ')}</div>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 font-sans">
            <span className="text-violet-600 font-mono">&gt;</span> OVERVIEW
          </div>
          <p className="text-slate-700 leading-normal font-sans text-xs">
            {summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 font-sans">
            <span className="text-violet-600 font-mono">&gt;</span> ENGINEERING_EXPERIENCE
          </div>
          <div className="space-y-3 font-sans">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-xs">
                  <span>{exp.role} @ {exp.company}</span>
                  <span className="text-[11px] font-mono text-slate-500">
                    [{exp.startDate} :: {exp.current ? 'PRESENT' : exp.endDate}]
                  </span>
                </div>
                {exp.location && <div className="text-[11px] text-slate-500 font-mono mb-1">{exp.location}</div>}
                <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs">
                  {(exp.bullets || []).map((b, bIdx) => (
                    <li key={bIdx} className="leading-snug">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 font-sans">
            <span className="text-violet-600 font-mono">&gt;</span> KEY_SYSTEMS_AND_PROJECTS
          </div>
          <div className="space-y-2.5 font-sans">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="border-l-2 border-violet-400 pl-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs">{proj.name}</span>
                  {proj.link && <span className="text-[11px] font-mono text-blue-600">{proj.link}</span>}
                </div>
                {proj.technologies?.length > 0 && (
                  <div className="text-[11px] font-mono text-violet-700 mb-1">
                    stack: [{proj.technologies.join(', ')}]
                  </div>
                )}
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

      {/* Education & Certs */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
        {education && education.length > 0 && (
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 font-sans">
              <span className="text-violet-600 font-mono">&gt;</span> EDUCATION
            </div>
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="text-xs font-sans">
                <div className="font-bold text-slate-800">{edu.degree}</div>
                <div className="text-slate-600">{edu.institution} ({edu.graduationDate})</div>
              </div>
            ))}
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 font-sans">
              <span className="text-violet-600 font-mono">&gt;</span> CERTIFICATIONS
            </div>
            {certifications.map((c, idx) => (
              <div key={c.id || idx} className="text-xs font-sans">
                <div className="font-semibold text-slate-800">{c.name}</div>
                <div className="text-slate-500 font-mono text-[11px]">{c.issuer} [{c.issueDate}]</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
