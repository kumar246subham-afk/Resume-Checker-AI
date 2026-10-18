import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Check, 
  SkipForward 
} from 'lucide-react';

export const OnboardingPage = () => {
  const { user, updateUserPreferences } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [currentStatus, setCurrentStatus] = useState('Experienced');
  const [targetJobRole, setTargetJobRole] = useState('Full Stack Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Mid Level (3-5 yrs)');
  const [preferredTemplate, setPreferredTemplate] = useState('ats-classic');
  const [loading, setLoading] = useState(false);

  const statuses = [
    { title: 'Student', desc: 'Enrolled in university or college program', icon: GraduationCap },
    { title: 'Fresher', desc: 'Recent graduate entering the job market', icon: Sparkles },
    { title: 'Experienced', desc: 'Professional looking for career progression', icon: Briefcase },
    { title: 'Career Switcher', desc: 'Transitioning into a new industry or role', icon: Layers }
  ];

  const experienceLevels = [
    'Entry Level (0-2 yrs)',
    'Mid Level (3-5 yrs)',
    'Senior (5-8 yrs)',
    'Lead/Executive (8+ yrs)'
  ];

  const templates = [
    { id: 'ats-classic', name: 'ATS Classic', desc: 'Standard single-column layout, optimal machine parsing' },
    { id: 'modern-pro', name: 'Modern Professional', desc: 'Violet accents, clear skill tags, contemporary feel' },
    { id: 'minimal-elegant', name: 'Minimal Elegant', desc: 'Spacious typography, refined spacing' },
    { id: 'tech-resume', name: 'Technical Resume', desc: 'Developer badges, GitHub & systems focus' },
    { id: 'executive-profile', name: 'Executive Profile', desc: 'Leadership achievements & milestone emphasis' }
  ];

  const popularRoles = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Engineer',
    'Full Stack Developer',
    'Data Scientist',
    'Data Analyst',
    'DevOps Engineer',
    'Product Manager',
    'UI/UX Designer'
  ];

  const handleFinish = async () => {
    setLoading(true);
    await updateUserPreferences({
      currentStatus,
      targetJobRole,
      experienceLevel,
      preferredTemplate,
      onboardingCompleted: true
    });
    setLoading(false);
    navigate('/dashboard');
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto w-full">
        {/* Progress Bar & Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span>Step {step} of 3</span>
            <button
              onClick={handleSkip}
              className="inline-flex items-center gap-1 text-[#6D5EF7] hover:underline"
            >
              Skip for now <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#6D5EF7] h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Card Content */}
        <div className="bg-white rounded-2xl shadow-premium border border-slate-200/80 p-6 sm:p-8">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-extrabold text-[#111827]">
                  What best describes your current status?
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  We customize template recommendations and phrasing guidance based on your profile.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {statuses.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setCurrentStatus(item.title)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      currentStatus === item.title
                        ? 'border-[#6D5EF7] bg-violet-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <item.icon className={`w-5 h-5 ${currentStatus === item.title ? 'text-[#6D5EF7]' : 'text-slate-500'}`} />
                      {currentStatus === item.title && (
                        <div className="w-4 h-4 rounded-full bg-[#6D5EF7] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-xs text-[#111827]">{item.title}</h3>
                    <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">{item.desc}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] shadow-md transition"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-extrabold text-[#111827]">
                  What is your target role and experience?
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  Used by our ATS engine to prioritize role-specific keywords.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Job Title
                </label>
                <input
                  type="text"
                  value={targetJobRole}
                  onChange={(e) => setTargetJobRole(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#6D5EF7]"
                />

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {popularRoles.slice(0, 6).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setTargetJobRole(role)}
                      className="px-2 py-1 rounded text-[11px] font-medium bg-slate-100 text-slate-700 hover:bg-violet-100 hover:text-violet-700 transition"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Experience Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {experienceLevels.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExperienceLevel(lvl)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                        experienceLevel === lvl
                          ? 'border-[#6D5EF7] bg-violet-50 text-[#6D5EF7]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-2/3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] shadow-md transition"
                >
                  Next Step <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-extrabold text-[#111827]">
                  Choose your preferred resume style
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  You can change this template anytime with one click in the editor.
                </p>
              </div>

              <div className="space-y-2">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setPreferredTemplate(tpl.id)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                      preferredTemplate === tpl.id
                        ? 'border-[#6D5EF7] bg-violet-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#111827]">{tpl.name}</h4>
                      <p className="text-[11px] text-[#64748B]">{tpl.desc}</p>
                    </div>
                    {preferredTemplate === tpl.id && (
                      <div className="w-5 h-5 rounded-full bg-[#6D5EF7] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="w-1/3 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={loading}
                  className="w-2/3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-[#6D5EF7] hover:bg-[#5A4BE0] shadow-md transition disabled:opacity-50"
                >
                  {loading ? 'Finalizing Profile...' : 'Complete & Go to Dashboard'}
                  {!loading && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
