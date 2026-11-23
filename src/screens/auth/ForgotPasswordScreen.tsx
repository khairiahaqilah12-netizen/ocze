import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { OCZE_LOGO_URL } from '../../data/products';
import { useApp } from '../../context/AppContext';
import { isValidEmail } from '../../utils/format';

export const ForgotPasswordScreen: React.FC = () => {
  const { navigate, t } = useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError(t.forgot.errEmail);
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8FD] flex flex-col px-5 py-6 sm:py-10">
      <div className="w-full max-w-md mx-auto">
        <button
          type="button"
          onClick={() => navigate('login')}
          aria-label={t.forgot.backToLogin}
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
              {t.forgot.title}
            </h1>
            <p className="mt-1.5 text-[14px] text-[#635B73]">
              {t.forgot.subtitle}
            </p>
          </div>

          {submitted ? (
            <div className="mt-6 text-center space-y-5">
              <div className="p-5 rounded-2xl bg-[#F6F2FB] border border-[#DDD3EE]">
                <CheckCircle2 className="w-10 h-10 text-[#6D5D9B] mx-auto" />
                <h2 className="mt-3 font-display text-[17px] font-semibold text-[#221E2C]">
                  {t.forgot.sentTitle}
                </h2>
                <p className="mt-1.5 text-[14px] text-[#635B73]">
                  {t.forgot.sentPrefix}{' '}
                  <span className="font-medium text-[#221E2C]">{email}</span>
                  {t.forgot.sentSuffix}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('login')}
                className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] text-white text-[15px] font-semibold transition-colors cursor-pointer"
              >
                {t.forgot.backToLogin}
              </button>
            </div>
          ) : (
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
                  htmlFor="forgot-email"
                  className="block text-[13px] font-medium text-[#221E2C] mb-1.5"
                >
                  {t.forgot.email}
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full min-h-[46px] px-3.5 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] focus:bg-white focus:border-[#7C69AE] focus:outline-none text-[15px] text-[#221E2C]"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] text-white text-[15px] font-semibold transition-colors cursor-pointer"
              >
                {t.forgot.submit}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => navigate('login')}
                  className="min-h-[44px] px-3 text-[14px] font-medium text-[#6D5D9B] hover:text-[#4F407A] cursor-pointer"
                >
                  {t.forgot.backToLogin}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
