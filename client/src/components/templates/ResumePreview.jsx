import React from 'react';
import { ATSClassic } from './ATSClassic';
import { ModernProfessional } from './ModernProfessional';
import { MinimalElegant } from './MinimalElegant';
import { TechnicalResume } from './TechnicalResume';
import { ExecutiveProfile } from './ExecutiveProfile';
import { ExecutiveElite } from './ExecutiveElite';
import { TechInnovator } from './TechInnovator';
import { DataSciencePro } from './DataSciencePro';
import { CreativePortfolio } from './CreativePortfolio';
import { FreshGraduatePro } from './FreshGraduatePro';

export const ResumePreview = React.forwardRef(({ resume, zoom = 100, forExport = false }, ref) => {
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
      case 'executive-elite':
        return <ExecutiveElite resume={resume} />;
      case 'tech-innovator':
        return <TechInnovator resume={resume} />;
      case 'data-science-pro':
        return <DataSciencePro resume={resume} />;
      case 'creative-portfolio':
        return <CreativePortfolio resume={resume} />;
      case 'fresh-graduate-pro':
        return <FreshGraduatePro resume={resume} />;
      case 'ats-classic':
      default:
        return <ATSClassic resume={resume} />;
    }
  };

  const scale = zoom / 100;

  return (
    <div className={`flex justify-center w-full overflow-auto p-3 sm:p-6 bg-[#0B1120] rounded-2xl border border-[rgba(166,184,225,0.16)] shadow-[inset_0_2px_12px_rgba(0,0,0,0.6)] ${forExport ? 'p-0 bg-white border-none' : ''}`}>
      <div 
        ref={ref}
        id={forExport ? "resume-export-container" : "resume-printable-node"}
        className="resume-a4-sheet bg-white shadow-[0_15px_45px_rgba(0,0,0,0.7)] rounded-sm transition-transform duration-200 origin-top print:shadow-none print:transform-none"
        style={forExport ? { width: '210mm', minHeight: '297mm', transform: 'none', margin: 0, boxShadow: 'none' } : {
          transform: `scale(${scale})`,
          marginBottom: `${(scale - 1) * 1100}px`
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
