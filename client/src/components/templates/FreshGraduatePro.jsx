import React from 'react';

export const FreshGraduatePro = ({ resume }) => {
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
      
      {/* Student / Fresher Header */}
      <div className="pb-5 border-b-2 border-slate-200 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold tracking-wider uppercase mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            Graduate Candidate & Early Career Profile
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
            {personalInfo.fullName || 'Graduate Candidate'}
          </h1>
          <p className="text-sm font-semibold text-[#6D5EF7] mt-0.5">
            {personalInfo.title || 'Computer Science Graduate & Junior Engineer'}
          </p>
        </div>

        <div className="text-xs text-slate-600 space-y-0.5 sm:text-right">
          {personalInfo.email && (
            <div>
              <a href={`mailto:${personalInfo.email}`} className="text-[#6D5EF7] font-semibold hover:underline">
                {personalInfo.email}
              </a>
            </div>
          )}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
          <div className="flex sm:justify-end gap-2 text-slate-500 text-[11px] pt-1">
            {personalInfo.github && <span>github.com/{personalInfo.github.replace(/.*github\.com\//, '')}</span>}
            {personalInfo.linkedin && <span>linkedin.com/in/{personalInfo.linkedin.replace(/.*linkedin\.com\/in\//, '')}</span>}
          </div>
        </div>
      </div>

      {/* Career Objective / Summary */}
      {summary && (
        <div className="mb-6 p-3.5 bg-slate-50/80 rounded-xl border-l-4 border-[#6D5EF7] border-y border-r border-slate-200/80">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#6D5EF7] mb-1">
            Career Objective & Professional Strengths
          </h2>
          <p className="text-slate-700 leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* Priority 1: Education (Prominently featured for Fresh Graduates) */}
      {education && education.length > 0 && (
        <div className="mb-6 bg-gradient-to-r from-teal-50/40 via-violet-50/20 to-transparent p-4 rounded-xl border border-teal-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              Education & Academic Credentials
            </span>
            <span className="text-[10px] text-teal-700 uppercase font-bold tracking-wider">Top Priority</span>
          </h2>
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                  <span className="font-bold text-sm text-[#0F172A]">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Graduation: {edu.graduationDate || 'Recent'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 mt-0.5">
                  <span className="font-medium text-slate-700">{edu.institution} {edu.location ? `• ${edu.location}` : ''}</span>
                  {edu.gpa && (
                    <span className="inline-block px-2 py-0.5 bg-teal-50 text-teal-800 font-bold rounded text-[11px] border border-teal-200 mt-1 sm:mt-0">
                      GPA / Honors: {edu.gpa}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority 2: Technical Skills & Coursework */}
      {(skills.technical?.length > 0 || skills.soft?.length > 0) && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] border-b border-slate-200 pb-1 mb-2.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6D5EF7]"></span>
            Technical Skills & Tooling
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {(skills.technical || []).map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-50 text-violet-900 border border-violet-200"
              >
                {skill}
              </span>
            ))}
            {(skills.soft || []).map((s, idx) => (
              <span
                key={`soft-${idx}`}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Priority 3: Academic & Capstone Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] border-b border-slate-200 pb-1 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            Academic Capstone Projects & Software Development
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx} className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-xs text-[#0F172A]">{proj.title}</span>
                  {proj.role && <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">{proj.role}</span>}
                </div>
                {proj.description && <p className="text-xs text-slate-600 mb-1.5">{proj.description}</p>}
                {(proj.bullets || []).map((bullet, bIdx) => (
                  <p key={bIdx} className="text-xs text-slate-700 flex items-start gap-1.5 leading-snug">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>{bullet}</span>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority 4: Internships / Relevant Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] border-b border-slate-200 pb-1 mb-3.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6D5EF7]"></span>
            Internships & Professional Experience
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="pl-3 border-l-2 border-[#6D5EF7]/40">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-0.5">
                  <div>
                    <span className="font-bold text-sm text-[#0F172A]">{exp.role}</span>
                    <span className="text-xs font-semibold text-[#6D5EF7] ml-2">@ {exp.company}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.location && <p className="text-[11px] text-slate-500 mb-1.5">{exp.location}</p>}
                <ul className="space-y-1 text-slate-700 text-xs">
                  {(exp.bullets || []).map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-1.5 leading-snug">
                      <span className="text-[#6D5EF7]">▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Extracurricular Activities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
        {(certifications.length > 0) && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              Certifications & Training
            </h2>
            <div className="space-y-1 text-xs text-slate-700">
              {certifications.map((c, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-teal-600 font-bold">★</span>
                  <span>{typeof c === 'string' ? c : `${c.name || ''} ${c.issuer ? `(${c.issuer})` : ''}`}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(achievements.length > 0) && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6D5EF7]"></span>
              Campus Leadership & Achievements
            </h2>
            <div className="space-y-1 text-xs text-slate-700">
              {achievements.map((a, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-[#6D5EF7] font-bold">★</span>
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
