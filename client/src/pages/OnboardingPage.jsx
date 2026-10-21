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
import { RESUME_TEMPLATES } from '../data/templatesData';

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
    <div className="min-h-screen bg-[#080D1B] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto w-full">
        {/* Progress Bar & Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-between text-xs font-bold text-[#8D9AB5] mb-2">
            <span>Step {step} of 3</span>
            <button
              onClick={handleSkip}
              className="inline-flex items-center gap-1.5 text-[#35D9E8] hover:underline font-semibold"
            >
              Skip for now <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="w-full bg-[#101A2D] h-2 rounded-full overflow-hidden border border-[rgba(166,184,225,0.12)]">
            <div
              className="bg-gradient-to-r from-[#7865FF] to-[#4285FF] h-full transition-all duration-300 shadow-glow-violet"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Card Content */}
        <div className="bg-[#141E33] rounded-3xl shadow-glow-violet/10 border border-[rgba(166,184,225,0.16)] p-6 sm:p-8 space-y-6">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#F4F6FF]">
                  What best describes your current status?
                </h2>
                <p className="text-sm text-[#B5C0D6] mt-1">
                  We customize template recommendations and phrasing guidance based on your profile.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {statuses.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setCurrentStatus(item.title)}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 hover:-translate-y-0.5 ${
                      currentStatus === item.title
                        ? 'border-[#7865FF] bg-[#192640] shadow-glow-violet/20 ring-1 ring-[#7865FF]'
                        : 'border-[rgba(166,184,225,0.16)] hover:border-[#7865FF]/40 bg-[#101A2D]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <item.icon className={`w-5 h-5 ${currentStatus === item.title ? 'text-[#35D9E8]' : 'text-[#8D9AB5]'}`} />
                      {currentStatus === item.title && (
                        <div className="w-4 h-4 rounded-full bg-[#7865FF] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-[#F4F6FF]">{item.title}</h3>
                    <p className="text-xs text-[#8D9AB5] mt-1 leading-snug">{item.desc}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7865FF] to-[#4285FF] shadow-glow-violet hover:brightness-110 active:scale-95 transition"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#F4F6FF]">
                  What is your target role and experience?
                </h2>
                <p className="text-sm text-[#B5C0D6] mt-1">
                  Used by our ATS engine to prioritize role-specific keywords.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8D9AB5] uppercase tracking-wider mb-1.5">
                  Target Job Title
                </label>
                <input
                  type="text"
                  value={targetJobRole}
                  onChange={(e) => setTargetJobRole(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full px-4 py-2.5 text-sm border border-[rgba(166,184,225,0.18)] rounded-xl bg-[#101A2D] text-[#F4F6FF] placeholder-[#8D9AB5] focus:outline-none focus:border-[#7865FF] transition"
                />

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {popularRoles.slice(0, 6).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setTargetJobRole(role)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#101A2D] text-[#B5C0D6] hover:bg-[#192640] hover:text-[#F4F6FF] border border-[rgba(166,184,225,0.12)] transition"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8D9AB5] uppercase tracking-wider mb-1.5">
                  Experience Level
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {experienceLevels.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExperienceLevel(lvl)}
                      className={`p-3 rounded-xl border text-xs sm:text-[13px] font-semibold text-center transition duration-200 ${
                        experienceLevel === lvl
                          ? 'border-[#7865FF] bg-[#192640] text-[#F4F6FF] ring-1 ring-[#7865FF]'
                          : 'border-[rgba(166,184,225,0.16)] text-[#B5C0D6] bg-[#101A2D] hover:bg-[#192640]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-xl text-sm font-bold text-[#B5C0D6] bg-[#192640] hover:bg-[#233558] border border-[rgba(166,184,225,0.16)] transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-2/3 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7865FF] to-[#4285FF] shadow-glow-violet hover:brightness-110 active:scale-95 transition"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#F4F6FF]">
                  Choose your preferred resume style
                </h2>
                <p className="text-sm text-[#B5C0D6] mt-1">
                  You can change this template anytime with one click in the editor.
                </p>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {RESUME_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setPreferredTemplate(tpl.id)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 ${
                      preferredTemplate === tpl.id
                        ? 'border-[#7865FF] bg-[#192640] shadow-glow-violet/20 ring-1 ring-[#7865FF]'
                        : 'border-[rgba(166,184,225,0.16)] bg-[#101A2D] hover:border-[#7865FF]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#F4F6FF]">{tpl.name}</h4>
                        <span className="text-[10px] font-bold text-[#7865FF] bg-[#7865FF]/10 px-2 py-0.5 rounded border border-[#7865FF]/20 uppercase">
                          {tpl.categoryLabel}
                        </span>
                      </div>
                      <p className="text-xs text-[#8D9AB5] line-clamp-1 mt-0.5">{tpl.desc}</p>
                    </div>
                    {preferredTemplate === tpl.id && (
                      <div className="w-5 h-5 rounded-full bg-[#7865FF] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3 rounded-xl text-sm font-bold text-[#B5C0D6] bg-[#192640] hover:bg-[#233558] border border-[rgba(166,184,225,0.16)] transition"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={loading}
                  className="w-2/3 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7865FF] to-[#4285FF] shadow-glow-violet hover:brightness-110 active:scale-95 transition disabled:opacity-50"
                >
                  {loading ? 'Finalizing Profile...' : 'Complete & Go to Dashboard'}
                  {!loading && <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
