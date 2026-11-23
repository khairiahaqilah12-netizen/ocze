import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { OCZE_LOGO_URL } from '../../data/products';
import { useApp } from '../../context/AppContext';
import { isValidEmail, isValidPhone } from '../../utils/format';

export const SignUpScreen: React.FC = () => {
  const { navigate, signUp, t } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (fullName.trim().length < 2) {
      setError(t.signup.errName);
      return;
    }
    if (!isValidEmail(email)) {
      setError(t.signup.errEmail);
      return;
    }
    if (!isValidPhone(phone)) {
      setError(t.signup.errPhone);
      return;
    }
    if (password.length < 6) {
      setError(t.signup.errPassLen);
      return;
    }
    if (password !== confirmPassword) {
      setError(t.signup.errPassMatch);
      return;
    }
    if (!acceptedTerms) {
      setError(t.signup.errTerms);
      return;
    }

    const res = signUp({ fullName, email, phone, password });
    if (!res.ok && res.error) {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8FD] flex flex-col px-5 py-6 sm:py-10">
      <div className="w-full max-w-md mx-auto">
        <button
          type="button"
          onClick={() => navigate('welcome')}
          aria-label={t.common.back}
          className="min-h-[44px] min-w-[44px] -ml-2 inline-flex items-center justify-center rounded-xl text-[#221E2C] hover:bg-[#E9E1F3]/60 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="mt-2 bg-white rounded-3xl border border-[#E9E1F3] p-6 sm:p-8 shadow-xs">
          <div className="text-center">
            <img
              src={OCZE_LOGO_URL}
              alt="OCZE+"
              className="h-9 w-auto mx-auto object-contain"
            />
            <h1 className="mt-5 font-display text-[24px] sm:text-[26px] font-bold text-[#221E2C]">
              {t.signup.title}
            </h1>
            <p className="mt-1.5 text-[14px] text-[#635B73]">
              {t.signup.subtitle}
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
                htmlFor="signup-name"
                className="block text-[13px] font-medium text-[#221E2C] mb-1.5"
              >
                {t.signup.fullName}
              </label>
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nurul Aisyah"
                className="w-full min-h-[46px] px-3.5 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] focus:bg-white focus:border-[#7C69AE] focus:outline-none text-[15px] text-[#221E2C]"
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-[13px] font-medium text-[#221E2C] mb-1.5"
              >
                {t.signup.email}
              </label>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full min-h-[46px] px-3.5 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] focus:bg-white focus:border-[#7C69AE] focus:outline-none text-[15px] text-[#221E2C]"
              />
            </div>

            <div>
              <label
                htmlFor="signup-phone"
                className="block text-[13px] font-medium text-[#221E2C] mb-1.5"
              >
                {t.signup.phone}
              </label>
              <input
                id="signup-phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+60 12-345 6789"
                className="w-full min-h-[46px] px-3.5 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] focus:bg-white focus:border-[#7C69AE] focus:outline-none text-[15px] text-[#221E2C]"
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="block text-[13px] font-medium text-[#221E2C] mb-1.5"
              >
                {t.signup.password}
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.signup.passwordPlaceholder}
                  className="w-full min-h-[46px] pl-3.5 pr-12 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] focus:bg-white focus:border-[#7C69AE] focus:outline-none text-[15px] text-[#221E2C]"
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

            <div>
              <label
                htmlFor="signup-confirm-password"
                className="block text-[13px] font-medium text-[#221E2C] mb-1.5"
              >
                {t.signup.confirmPassword}
              </label>
              <div className="relative">
                <input
                  id="signup-confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t.signup.confirmPlaceholder}
                  className="w-full min-h-[46px] pl-3.5 pr-12 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] focus:bg-white focus:border-[#7C69AE] focus:outline-none text-[15px] text-[#221E2C]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#635B73] hover:text-[#221E2C] cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none min-h-[44px]">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-[#C8B9E2] accent-[#7C69AE] cursor-pointer shrink-0"
              />
              <span className="text-[13px] text-[#635B73] leading-snug">
                {t.signup.terms}
              </span>
            </label>

            <button
              type="submit"
              className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] active:scale-[0.99] text-white text-[15px] font-semibold transition-all cursor-pointer"
            >
              {t.signup.submit}
            </button>
          </form>

          <p className="mt-6 text-center text-[14px] text-[#635B73]">
            {t.signup.haveAccount}{' '}
            <button
              type="button"
              onClick={() => navigate('login')}
              className="font-semibold text-[#6D5D9B] hover:text-[#4F407A] cursor-pointer"
            >
              {t.signup.login}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
