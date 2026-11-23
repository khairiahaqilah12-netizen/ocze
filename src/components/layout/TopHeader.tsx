import React from 'react';
import { ArrowLeft, Bell, ShoppingBag } from 'lucide-react';
import { OCZE_LOGO_URL } from '../../data/products';
import { useApp } from '../../context/AppContext';

interface TopHeaderProps {
  title?: string;
  showBack?: boolean;
  showBrandLogo?: boolean;
  showNotifications?: boolean;
  showCart?: boolean;
  onBack?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  showBack = false,
  showBrandLogo = false,
  showNotifications = false,
  showCart = true,
  onBack,
}) => {
  const { navigate, goBack, cartTotals, unreadNotificationsCount, language, setLanguage, t } = useApp();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-[#E9E1F3]">
      <div className="w-full px-4 h-14 flex items-center justify-between gap-3">
        {/* Left Zone */}
        <div className="flex items-center min-w-[44px]">
          {showBack ? (
            <button
              type="button"
              onClick={onBack || goBack}
              aria-label={t.common.back}
              className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center rounded-xl text-[#221E2C] hover:bg-[#F6F2FB] active:scale-95 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : showBrandLogo ? (
            <button
              type="button"
              onClick={() => navigate('home')}
              aria-label="OCZE+"
              className="flex items-center py-1 focus-visible:outline-2 focus-visible:outline-[#A092C5] rounded-lg cursor-pointer"
            >
              <img
                src={OCZE_LOGO_URL}
                alt="OCZE+"
                className="h-7 w-auto object-contain"
              />
            </button>
          ) : (
            <div className="w-11" />
          )}
        </div>

        {/* Center Zone */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          {title ? (
            <h1 className="font-display text-[17px] sm:text-[18px] font-semibold text-[#221E2C] truncate text-center">
              {title}
            </h1>
          ) : null}
        </div>

        {/* Right Zone */}
        <div className="flex items-center justify-end gap-1 min-w-[44px]">
          {showBrandLogo && (
            <div
              role="group"
              aria-label={t.common.language}
              className="flex items-center rounded-lg border border-[#E9E1F3] bg-[#FAF8FD] p-0.5 mr-0.5"
            >
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#7C69AE] text-white'
                    : 'text-[#635B73] hover:text-[#221E2C]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ms')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  language === 'ms'
                    ? 'bg-[#7C69AE] text-white'
                    : 'text-[#635B73] hover:text-[#221E2C]'
                }`}
              >
                BM
              </button>
            </div>
          )}
          {showNotifications && (
            <button
              type="button"
              onClick={() => navigate('notifications')}
              aria-label={t.subScreens.notificationsTitle}
              className="relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#221E2C] hover:bg-[#F6F2FB] transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#D5A0BD] text-[#221E2C] text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          )}
          {showCart && (
            <button
              type="button"
              onClick={() => navigate('cart')}
              aria-label={`${t.cart.title} (${cartTotals.itemCount})`}
              className="relative min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center rounded-xl text-[#221E2C] hover:bg-[#F6F2FB] transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartTotals.itemCount > 0 && (
                <span className="absolute top-2 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#6D5D9B] text-white text-[10px] font-semibold flex items-center justify-center tabular-nums">
                  {cartTotals.itemCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
