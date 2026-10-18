import React from 'react';

export const ExecutiveProfile = ({ resume }) => {
  const { personalInfo = {}, summary = '', experience = [], education = [], skills = {}, achievements = [], certifications = [] } = resume?.sections || {};

  return (
    <div className="font-sans text-[#0F172A] text-[13px] leading-relaxed p-8 sm:p-12 max-w-[850px] mx-auto bg-white min-h-[1100px] shadow-sm print:p-0 print:shadow-none">
      {/* Executive Header */}
      <div className="border-b-2 border-slate-900 pb-5 mb-6 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center sm:items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
            {personalInfo.fullName || 'Alex Morgan'}
          </h1>
          <p className="text-sm font-bold text-slate-600 tracking-wider uppercase mt-1">
            {personalInfo.title || 'Vice President of Engineering / Technology Leader'}
          </p>
        </div>

        <div className="text-xs text-slate-600 sm:text-right mt-3 sm:mt-0 space-y-0.5">
          {personalInfo.location && <div className="font-medium text-slate-800">{personalInfo.location}</div>}
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.linkedin && <div className="text-slate-500">{personalInfo.linkedin}</div>}
        </div>
      </div>

      {/* Executive Summary */}
      {summary && (
        <div className="mb-6 bg-slate-50 border-l-4 border-slate-800 p-4 rounded-r">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
            Executive Profile & Strategic Leadership
          </h2>
          <p className="text-slate-700 leading-relaxed text-sm">
            {summary}
          </p>
        </div>
      )}

      {/* Core Competencies Callout */}
      {(skills.technical?.length > 0 || skills.soft?.length > 0) && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2.5">
            Core Executive Competencies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1.5 gap-x-4 text-xs font-medium text-slate-800">
            {[...(skills.soft || []), ...(skills.technical || []).slice(0, 6)].map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-slate-800 rounded-full"></span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-3">
            Executive Career History
          </h2>
          <div className="space-y-5">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex flex-col sm:flex-row justify-between items-baseline mb-0.5">
                  <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                  <span className="text-xs font-semibold text-slate-500">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-700 mb-1.5">
                  {exp.company} {exp.location && `| ${exp.location}`}
                </div>
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

      {/* Key Achievements */}
      {achievements && achievements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2">
            Selected Strategic Achievements
          </h2>
          <div className="space-y-1.5 text-xs text-slate-800">
            {achievements.map((a, idx) => (
              <div key={a.id || idx} className="flex gap-2">
                <span className="font-bold text-slate-900">• {a.title}:</span>
                <span className="text-slate-700">{a.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Credentials */}
      {education && education.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-2">
            Education & Board Credentials
          </h2>
          <div className="space-y-2 text-xs">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="flex justify-between">
                <div>
                  <strong className="text-slate-900">{edu.degree} in {edu.fieldOfStudy}</strong> — {edu.institution}
                </div>
                <span className="text-slate-500">{edu.graduationDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
