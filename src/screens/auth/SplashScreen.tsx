import React from 'react';
import { OCZE_LOGO_URL } from '../../data/products';
import { useApp } from '../../context/AppContext';

export const SplashScreen: React.FC = () => {
  const { navigate, currentUser } = useApp();

  return (
    <div
      onClick={() => navigate(currentUser ? 'home' : 'welcome')}
      className="min-h-screen w-full bg-[#E9E1F3] flex flex-col items-center justify-center px-6 py-12 text-center cursor-pointer select-none"
    >
      <div className="flex flex-col items-center max-w-xs mx-auto">
        <div className="bg-white/80 backdrop-blur-xs rounded-3xl px-8 py-6 shadow-sm border border-white">
          <img
            src={OCZE_LOGO_URL}
            alt="OCZE+"
            className="h-14 w-auto mx-auto object-contain"
          />
        </div>
        <p className="mt-5 font-display text-[15px] font-medium text-[#4F4469] tracking-tight">
          Gentle Care, Happy Skin
        </p>
        <div className="mt-8 flex items-center gap-1.5" aria-hidden="true">
          <span className="w-2 h-2 rounded-full bg-[#A092C5] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-[#D5A0BD] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-[#A092C5] animate-bounce" />
        </div>
      </div>
    </div>
  );
};
