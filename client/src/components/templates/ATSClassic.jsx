import React from 'react';

export const ATSClassic = ({ resume }) => {
  const { personalInfo = {}, summary = '', experience = [], education = [], skills = {}, projects = [], certifications = [], achievements = [], languages = [], customSections = [] } = resume?.sections || {};

  return (
    <div className="font-serif text-[#111827] text-[13px] leading-relaxed p-8 sm:p-12 max-w-[850px] mx-auto bg-white min-h-[1100px] shadow-sm print:p-0 print:shadow-none">
      {/* Header */}
      <div className="text-center border-b border-gray-400 pb-4 mb-5">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-black">
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        {personalInfo.title && (
          <p className="text-sm font-semibold text-gray-700 mt-1 uppercase tracking-wide">
            {personalInfo.title}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-gray-800 mt-2">
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.email && (
            <>
              <span>•</span>
              <a href={`mailto:${personalInfo.email}`} className="text-black hover:underline">{personalInfo.email}</a>
            </>
          )}
          {personalInfo.location && (
            <>
              <span>•</span>
              <span>{personalInfo.location}</span>
            </>
          )}
          {personalInfo.linkedin && (
            <>
              <span>•</span>
              <span>{personalInfo.linkedin}</span>
            </>
          )}
          {personalInfo.github && (
            <>
              <span>•</span>
              <span>{personalInfo.github}</span>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2 text-black">
            Professional Summary
          </h2>
          <p className="text-gray-900 leading-normal text-justify">
            {summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2 text-black">
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex justify-between items-baseline font-bold text-black">
                  <span>{exp.role} — <span className="font-normal italic">{exp.company}</span></span>
                  <span className="text-xs font-normal text-gray-700">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.location && <p className="text-xs text-gray-600 mb-1">{exp.location}</p>}
                <ul className="list-disc list-outside ml-5 mt-1 space-y-1 text-gray-900">
                  {(exp.bullets || []).map((bullet, bIdx) => (
                    <li key={bIdx} className="pl-1 leading-normal">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2 text-black">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={edu.id || idx}>
                <div className="flex justify-between items-baseline font-bold text-black">
                  <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                  <span className="text-xs font-normal text-gray-700">{edu.graduationDate}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-700 italic">
                  <span>{edu.institution}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
                {edu.highlights && edu.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-5 mt-1 text-gray-800 text-xs">
                    {edu.highlights.map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {(skills.technical?.length > 0 || skills.tools?.length > 0 || skills.soft?.length > 0) && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2 text-black">
            Technical & Professional Skills
          </h2>
          <div className="space-y-1 text-gray-900">
            {skills.technical?.length > 0 && (
              <p><strong className="font-semibold text-black">Technologies & Languages:</strong> {skills.technical.join(', ')}</p>
            )}
            {skills.tools?.length > 0 && (
              <p><strong className="font-semibold text-black">Tools & Frameworks:</strong> {skills.tools.join(', ')}</p>
            )}
            {skills.soft?.length > 0 && (
              <p><strong className="font-semibold text-black">Core Competencies:</strong> {skills.soft.join(', ')}</p>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2 text-black">
            Key Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-black">{proj.name} {proj.role ? `(${proj.role})` : ''}</span>
                  {proj.link && <span className="text-xs text-gray-600">{proj.link}</span>}
                </div>
                {proj.technologies?.length > 0 && (
                  <p className="text-xs text-gray-700 italic mb-1">
                    Technologies: {proj.technologies.join(', ')}
                  </p>
                )}
                {proj.description && <p className="text-gray-800 text-xs mb-1">{proj.description}</p>}
                <ul className="list-disc list-outside ml-5 space-y-1 text-gray-900">
                  {(proj.bullets || []).map((b, bIdx) => (
                    <li key={bIdx} className="pl-1 leading-normal">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2 text-black">
            Certifications
          </h2>
          <div className="space-y-1.5">
            {certifications.map((c, idx) => (
              <div key={c.id || idx} className="flex justify-between text-xs text-gray-900">
                <span><strong className="font-semibold">{c.name}</strong> — {c.issuer}</span>
                <span className="text-gray-600">{c.issueDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements & Awards */}
      {achievements && achievements.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2 text-black">
            Honors & Achievements
          </h2>
          <div className="space-y-1.5 text-xs text-gray-900">
            {achievements.map((a, idx) => (
              <div key={a.id || idx}>
                <strong>{a.title}</strong>: {a.description} {a.date && `(${a.date})`}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
