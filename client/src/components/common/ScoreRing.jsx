import React from 'react';

export const ScoreRing = ({ score = 0, size = 120, strokeWidth = 10, showLabel = true, subtext = 'ATS Score' }) => {
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let colorClass = '#DC2626'; // Red
  let badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
  let grade = 'Needs Work';

  if (normalizedScore >= 85) {
    colorClass = '#16A34A'; // Green
    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    grade = 'Excellent';
  } else if (normalizedScore >= 70) {
    colorClass = '#6D5EF7'; // Violet
    badgeColor = 'bg-violet-50 text-violet-700 border-violet-200';
    grade = 'Strong';
  } else if (normalizedScore >= 50) {
    colorClass = '#D97706'; // Amber
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
    grade = 'Average';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
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
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center label */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-[#111827] tracking-tight">
            {normalizedScore}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B]">
            / 100
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-3 text-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
            {grade}
          </span>
          {subtext && <p className="text-xs text-[#64748B] mt-1 font-medium">{subtext}</p>}
        </div>
      )}
    </div>
  );
};
