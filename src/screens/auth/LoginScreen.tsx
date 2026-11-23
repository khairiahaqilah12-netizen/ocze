import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { LOGIN_HERO_IMAGE, OCZE_LOGO_URL } from '../../data/products';
import { useApp } from '../../context/AppContext';
import { isValidEmail } from '../../utils/format';

export const LoginScreen: React.FC = () => {
  const { navigate, login, rememberedEmail, language, setLanguage, t } = useApp();
  const [email, setEmail] = useState(rememberedEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(Boolean(rememberedEmail));
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError(t.login.errEmailRequired);
      return;
    }
    if (!isValidEmail(email)) {
      setError(t.login.errEmailInvalid);
      return;
    }
    if (!password) {
      setError(t.login.errPasswordRequired);
      return;
    }

    const res = login(email, password, rememberMe);
    if (!res.ok && res.error) {
      setError(res.error);
    }
  };

  const fillDemoAccount = () => {
    setEmail('aisyah@ocze.demo');
    setPassword('ocze1234');
    setRememberMe(true);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      {/* Top Login Visual Banner */}
      <div className="relative w-full h-[265px] overflow-hidden bg-[#E9E1F3] shrink-0">
        <img
          src={LOGIN_HERO_IMAGE}
          alt="OCZE+ Gentle Care"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[50%_38%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-white/75 via-transparent to-black/10 pointer-events-none"
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={() => navigate('welcome')}
          aria-label={t.common.back}
          className="absolute top-4 left-4 min-h-[42px] min-w-[42px] inline-flex items-center justify-center rounded-full bg-white/90 backdrop-blur-xs border border-[#E9E1F3] text-[#221E2C] hover:bg-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div
          role="group"
          aria-label={t.common.language}
          className="absolute top-4 right-4 flex items-center rounded-full bg-white/90 backdrop-blur-xs border border-[#E9E1F3] p-0.5"
        >
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
              language === 'en' ? 'bg-[#7C69AE] text-white' : 'text-[#635B73]'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('ms')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
              language === 'ms' ? 'bg-[#7C69AE] text-white' : 'text-[#635B73]'
            }`}
          >
            BM
          </button>
        </div>
      </div>

      {/* Login Form Sheet */}
      <div className="relative z-10 -mt-6 flex-1 bg-white rounded-t-[28px] border-t border-[#E9E1F3] px-5 pt-6 pb-8">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center">
            <img
              src={OCZE_LOGO_URL}
              alt="OCZE+"
              className="h-9 w-auto mx-auto object-contain"
            />
            <h1 className="mt-4 font-display text-[24px] font-bold text-[#221E2C]">
              {t.login.title}
            </h1>
            <p className="mt-1 text-[14px] text-[#635B73]">
              {t.login.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            {error && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-[#FDF2F6] border border-[#E9BFD2] text-[#8E355B] text-[13px]"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="login-email"
                className="block text-[13px] font-medium text-[#221E2C] mb-1.5"
              >
                {t.login.email}
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full min-h-[46px] px-3.5 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] focus:bg-white focus:border-[#7C69AE] focus:outline-none text-[15px] text-[#221E2C] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-[13px] font-medium text-[#221E2C] mb-1.5"
              >
                {t.login.password}
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.login.passwordPlaceholder}
                  className="w-full min-h-[46px] pl-3.5 pr-12 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] focus:bg-white focus:border-[#7C69AE] focus:outline-none text-[15px] text-[#221E2C] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#635B73] hover:text-[#221E2C] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <label className="inline-flex items-center gap-2 min-h-[44px] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#C8B9E2] accent-[#7C69AE] cursor-pointer"
                />
                <span className="text-[13px] text-[#635B73]">{t.login.rememberMe}</span>
              </label>

              <button
                type="button"
                onClick={() => navigate('forgot-password')}
                className="min-h-[44px] px-1 text-[13px] font-medium text-[#6D5D9B] hover:text-[#4F407A] cursor-pointer"
              >
                {t.login.forgotPassword}
              </button>
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] active:scale-[0.99] text-white text-[15px] font-semibold transition-all cursor-pointer"
            >
              {t.login.submit}
            </button>
          </form>

          {/* Demo Account Quick Fill */}
          <div className="mt-5 pt-5 border-t border-[#F0E9F8]">
            <button
              type="button"
              onClick={fillDemoAccount}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#F6F2FB] hover:bg-[#E9E1F3] text-[#4F407A] text-[13px] font-medium transition-colors cursor-pointer"
            >
              {t.login.fillDemo}
            </button>
          </div>

          <p className="mt-6 text-center text-[14px] text-[#635B73]">
            {t.login.newHere}{' '}
            <button
              type="button"
              onClick={() => navigate('signup')}
              className="font-semibold text-[#6D5D9B] hover:text-[#4F407A] cursor-pointer"
            >
              {t.login.signUp}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
