import React from 'react';
import { LOGIN_HERO_IMAGE, OCZE_LOGO_URL } from '../../data/products';
import { useApp } from '../../context/AppContext';

export const WelcomeScreen: React.FC = () => {
  const { navigate, language, setLanguage, t } = useApp();

  return (
    <div className="min-h-screen w-full bg-[#FAF8FD] flex flex-col items-center justify-center px-5 py-6">
      <div className="w-full max-w-md mx-auto flex flex-col items-center text-center">
        {/* Language Switcher Top Row */}
        <div className="w-full flex justify-end mb-3">
          <div
            role="group"
            aria-label={t.common.language}
            className="inline-flex items-center rounded-xl border border-[#DDD3EE] bg-white p-1 shadow-2xs"
          >
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer ${
                language === 'en'
                  ? 'bg-[#7C69AE] text-white'
                  : 'text-[#635B73] hover:text-[#221E2C]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ms')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer ${
                language === 'ms'
                  ? 'bg-[#7C69AE] text-white'
                  : 'text-[#635B73] hover:text-[#221E2C]'
              }`}
            >
              Bahasa Melayu
            </button>
          </div>
        </div>

        {/* Centered Brand Logo */}
        <img
          src={OCZE_LOGO_URL}
          alt="OCZE+"
          className="h-10 w-auto mx-auto object-contain"
        />

        {/* Uploaded Login/Onboarding Visual */}
        <div className="mt-5 w-full max-w-[270px] bg-white rounded-3xl border border-[#E9E1F3] p-2 shadow-xs">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#E9E1F3]/40">
            <img
              src={LOGIN_HERO_IMAGE}
              alt="OCZE+ Gentle Care for Family"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-[50%_52%]"
            />
          </div>
        </div>

        {/* Centered Welcome Copy */}
        <div className="mt-7 px-2">
          <h1 className="font-display text-[26px] sm:text-[30px] font-bold text-[#221E2C] leading-tight text-balance">
            {t.welcome.title}
          </h1>
          <p className="mt-2.5 text-[15px] text-[#635B73] leading-relaxed">
            {t.welcome.subtitle}
          </p>
        </div>

        {/* Centered Equal-Width Primary & Secondary Actions */}
        <div className="mt-7 w-full space-y-3">
          <button
            type="button"
            onClick={() => navigate('login')}
            className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] active:scale-[0.99] text-white text-[15px] font-semibold transition-all cursor-pointer"
          >
            {t.welcome.login}
          </button>
          <button
            type="button"
            onClick={() => navigate('signup')}
            className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-white hover:bg-[#F6F2FB] border border-[#D8CBEB] text-[#4F407A] text-[15px] font-semibold transition-colors cursor-pointer"
          >
            {t.welcome.createAccount}
          </button>
        </div>

        <p className="mt-6 text-[12px] text-[#7B7487]">
          {t.welcome.tagline}
        </p>
      </div>
    </div>
  );
};
