import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#080D1B]/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div 
          className={`relative transform overflow-hidden rounded-2xl bg-[#141E33] text-left shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all sm:my-8 w-full ${maxWidth} border border-[rgba(166,184,225,0.18)] animate-scale-up text-[#F4F6FF]`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[rgba(166,184,225,0.14)] px-6 py-4 bg-[#101A2D]/60">
            <h3 className="text-lg font-bold text-[#F4F6FF] tracking-tight">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#8D9AB5] hover:bg-[#192640] hover:text-[#F4F6FF] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 max-h-[80vh] overflow-y-auto text-[#B5C0D6]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
