import React from 'react';

export const ScoreRing = ({
  score = 0,
  size = 120,
  strokeWidth = 10,
  showLabel = true,
  subtext = 'ATS Score',
  theme = 'light',
  dark = false
}) => {
  const isDark = dark || theme === 'dark';
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let colorClass = '#EF4444'; // Red / Needs Work
  let badgeColor = isDark
    ? 'bg-[#FF728A]/10 text-[#FF728A] border-[#FF728A]/30'
    : 'bg-rose-50 text-rose-700 border-rose-200';
  let grade = 'Needs Work';

  if (normalizedScore >= 85) {
    colorClass = '#10B981'; // Turquoise / emerald green
    badgeColor = isDark
      ? 'bg-[#32D6A0]/10 text-[#32D6A0] border-[#32D6A0]/30 shadow-[0_0_10px_rgba(50,214,160,0.15)]'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200';
    grade = 'Excellent';
  } else if (normalizedScore >= 70) {
    colorClass = '#6C5CE7'; // Violet
    badgeColor = isDark
      ? 'bg-[#7865FF]/15 text-[#9182FF] border-[#7865FF]/40 shadow-[0_0_10px_rgba(120,101,255,0.2)]'
      : 'bg-violet-50 text-violet-700 border-violet-200';
    grade = 'Strong';
  } else if (normalizedScore >= 50) {
    colorClass = '#F59E0B'; // Amber
    badgeColor = isDark
      ? 'bg-[#FFC56E]/10 text-[#FFC56E] border-[#FFC56E]/30'
      : 'bg-amber-50 text-amber-700 border-amber-200';
    grade = 'Average';
  }

  // Stroke color for track circle
  const trackStroke = isDark ? 'rgba(166, 184, 225, 0.16)' : '#E2E8F0';

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <defs>
            <filter id={`glow-${normalizedScore}-${isDark ? 'dark' : 'light'}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={colorClass} floodOpacity={isDark ? 0.45 : 0.25} />
            </filter>
          </defs>
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackStroke}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorClass}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            filter={`url(#glow-${normalizedScore}-${isDark ? 'dark' : 'light'})`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-text pointer-events-auto z-10">
          <span
            className={
              isDark
                ? "text-3xl sm:text-[42px] font-black tracking-tight leading-none"
                : "text-3xl sm:text-[44px] md:text-[46px] font-black tracking-tight leading-none"
            }
            style={{
              color: isDark ? '#F4F6FF' : '#111827',
              opacity: 1
            }}
          >
            {normalizedScore}
          </span>
          <span
            className={
              isDark
                ? "text-[11px] uppercase font-bold tracking-wider mt-0.5"
                : "text-xs sm:text-[16px] font-bold tracking-normal mt-0.5"
            }
            style={{
              color: isDark ? '#8D9AB5' : '#64748B',
              opacity: 1
            }}
          >
            / 100
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-3 text-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}>
            {grade}
          </span>
          {subtext && (
            <p
              className={isDark ? "text-[13px] text-[#B5C0D6] mt-1 font-medium" : "text-xs sm:text-sm text-[#64748B] mt-1 font-semibold"}
              style={{ color: isDark ? '#B5C0D6' : '#64748B' }}
            >
              {subtext}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
