import React from 'react';
import { Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-4 w-full max-w-[410px] flex justify-center"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#221E2C] text-white text-[13px] font-medium shadow-lg">
        <Check className="w-4 h-4 text-[#D5A0BD] shrink-0" />
        <span className="truncate">{toastMessage}</span>
      </div>
    </div>
  );
};
