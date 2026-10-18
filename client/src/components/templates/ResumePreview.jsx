import React from 'react';
import { ATSClassic } from './ATSClassic';
import { ModernProfessional } from './ModernProfessional';
import { MinimalElegant } from './MinimalElegant';
import { TechnicalResume } from './TechnicalResume';
import { ExecutiveProfile } from './ExecutiveProfile';

export const ResumePreview = ({ resume, zoom = 100 }) => {
  const templateId = resume?.templateId || 'ats-classic';

  const renderTemplate = () => {
    switch (templateId) {
      case 'modern-pro':
        return <ModernProfessional resume={resume} />;
      case 'minimal-elegant':
        return <MinimalElegant resume={resume} />;
      case 'tech-resume':
        return <TechnicalResume resume={resume} />;
      case 'executive-profile':
        return <ExecutiveProfile resume={resume} />;
      case 'ats-classic':
      default:
        return <ATSClassic resume={resume} />;
    }
  };

  const scale = zoom / 100;

  return (
    <div className="flex justify-center w-full overflow-auto p-2 sm:p-6 bg-slate-100/80 rounded-xl border border-slate-200">
      <div 
        id="resume-printable-node"
        className="resume-a4-sheet bg-white shadow-xl rounded-sm transition-transform duration-200 origin-top"
        style={{
          transform: `scale(${scale})`,
          marginBottom: `${(scale - 1) * 1100}px`
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
};
