import React from 'react';

export const PageSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-[#141E33] rounded-lg w-64 border border-[rgba(166,184,225,0.14)]" />
        <div className="h-4 bg-[#101A2D] rounded w-96 border border-[rgba(166,184,225,0.1)]" />
      </div>

      {/* Main card skeleton */}
      <div className="bg-[#141E33] rounded-2xl border border-[rgba(166,184,225,0.16)] p-8 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-[#101A2D] rounded-xl border border-[rgba(166,184,225,0.1)]" />
          <div className="h-32 bg-[#101A2D] rounded-xl border border-[rgba(166,184,225,0.1)]" />
          <div className="h-32 bg-[#101A2D] rounded-xl border border-[rgba(166,184,225,0.1)]" />
        </div>
        <div className="h-48 bg-[#101A2D]/80 rounded-xl border border-[rgba(166,184,225,0.1)]" />
      </div>
    </div>
  );
};
