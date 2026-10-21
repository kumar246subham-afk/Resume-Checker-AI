import React from 'react';

export const ExecutiveElite = ({ resume }) => {
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
    <div className="font-sans text-[#1E293B] text-[13px] leading-relaxed p-8 sm:p-12 max-w-[850px] mx-auto bg-white min-h-[1100px] shadow-sm print:p-0 print:shadow-none">
      
      {/* Executive Header Banner */}
      <div className="border-b-2 border-[#0F172A] pb-5 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] uppercase font-serif">
              {personalInfo.fullName || 'Executive Candidate'}
            </h1>
            <p className="text-sm font-bold tracking-widest text-[#B45309] uppercase mt-1">
              {personalInfo.title || 'Senior Executive & Strategic Leader'}
            </p>
          </div>

          <div className="text-right text-xs text-slate-600 space-y-0.5">
            {personalInfo.location && <div className="font-medium text-slate-700">{personalInfo.location}</div>}
            {personalInfo.email && (
              <div>
                <a href={`mailto:${personalInfo.email}`} className="text-[#0F172A] hover:underline font-semibold">
                  {personalInfo.email}
                </a>
              </div>
            )}
            {personalInfo.phone && <div className="text-slate-600">{personalInfo.phone}</div>}
            {personalInfo.linkedin && <div className="text-slate-500 font-mono text-[11px]">{personalInfo.linkedin}</div>}
          </div>
        </div>

        {/* Thin Gold & Slate Accent Bar */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200">
          <div className="h-1 w-16 bg-[#B45309] rounded-full"></div>
          <div className="h-0.5 flex-1 bg-slate-200"></div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
            Confidential Executive Dossier
          </span>
        </div>
      </div>

      {/* Executive Profile Summary */}
      {summary && (
        <div className="mb-6 bg-slate-50/80 rounded-xl p-4 border-l-4 border-[#B45309] border-y border-r border-slate-200/80">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#B45309] rounded-full"></span>
            Executive Profile & Leadership Scope
          </h2>
          <p className="text-slate-700 leading-relaxed text-justify">
            {summary}
          </p>
        </div>
      )}

      {/* Core Competencies Matrix */}
      {(skills.technical?.length > 0 || skills.soft?.length > 0) && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] border-b border-slate-200 pb-1 mb-2.5 flex items-center justify-between">
            <span>Core Executive Competencies</span>
            <span className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Strategic Matrix</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[...(skills.technical || []), ...(skills.soft || [])].slice(0, 12).map((skill, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold flex items-center gap-2 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 bg-[#B45309] rounded-full shrink-0"></span>
                <span className="truncate">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Executive Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] border-b border-slate-200 pb-1 mb-4 flex items-center justify-between">
            <span>Executive Leadership & Career Trajectory</span>
            <span className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Chronological</span>
          </h2>
          <div className="space-y-5">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="border-l-2 border-[#0F172A]/20 pl-4 relative">
                {/* Gold Marker Node */}
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#B45309] border border-white"></div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                  <div>
                    <span className="text-sm font-bold text-[#0F172A]">{exp.role}</span>
                    <span className="text-slate-600 font-semibold text-xs ml-2">
                      | {exp.company}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>

                {exp.location && (
                  <p className="text-[11px] font-medium text-slate-500 mb-2 italic">
                    Location: {exp.location}
                  </p>
                )}

                <ul className="space-y-1.5 text-slate-700">
                  {(exp.bullets || []).map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-[#B45309] font-bold text-xs select-none">›</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategic Initiatives & Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] border-b border-slate-200 pb-1 mb-3">
            Key Strategic Programs & Transformations
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="bg-slate-50/60 p-3 rounded-lg border border-slate-200/80">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-xs text-[#0F172A]">{proj.title}</span>
                  {proj.role && <span className="text-[11px] text-[#B45309] font-semibold">{proj.role}</span>}
                </div>
                {proj.description && <p className="text-xs text-slate-600 mb-1.5">{proj.description}</p>}
                {(proj.bullets || []).map((bullet, bIdx) => (
                  <div key={bIdx} className="text-xs text-slate-700 flex items-start gap-1.5 mt-0.5">
                    <span className="text-slate-400">•</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Credentials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
        {education && education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2.5">
              Education & Academic Credentials
            </h2>
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={edu.id || idx}>
                  <p className="font-bold text-xs text-slate-900">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </p>
                  <p className="text-xs text-slate-600">
                    {edu.institution} {edu.graduationDate ? `• ${edu.graduationDate}` : ''}
                  </p>
                  {edu.gpa && <p className="text-[11px] text-slate-500 font-medium">Honors/GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {(certifications.length > 0 || achievements.length > 0) && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2.5">
              Executive Honors & Certifications
            </h2>
            <div className="space-y-1.5 text-xs text-slate-700">
              {certifications.map((c, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-[#B45309] font-bold">★</span>
                  <span>{typeof c === 'string' ? c : `${c.name || ''} ${c.issuer ? `(${c.issuer})` : ''}`}</span>
                </div>
              ))}
              {achievements.map((a, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-[#B45309] font-bold">★</span>
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
