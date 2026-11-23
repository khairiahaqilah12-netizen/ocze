import React from 'react';
import { Award, Home, Package, ShoppingBag, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppScreen, MainTab } from '../../types';

const TABS: { id: MainTab; screen: AppScreen; Icon: React.FC<{ className?: string }> }[] = [
  { id: 'home', screen: 'home', Icon: Home },
  { id: 'shop', screen: 'shop', Icon: ShoppingBag },
  { id: 'rewards', screen: 'rewards', Icon: Award },
  { id: 'orders', screen: 'orders', Icon: Package },
  { id: 'profile', screen: 'profile', Icon: User },
];

export const BottomNav: React.FC = () => {
  const { activeTab, navigate, t } = useApp();

  return (
    <nav
      aria-label="Primary Navigation"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 bg-white/95 backdrop-blur-md border-t border-[#E9E1F3] sm:border-x sm:border-[#E2D8F0] pb-safe"
    >
      <div className="grid grid-cols-5 h-16">
        {TABS.map(({ id, screen, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => navigate(screen)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-1 min-h-[44px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A092C5] ${
                isActive
                  ? 'text-[#7361A3] font-semibold'
                  : 'text-[#7B7487] hover:text-[#221E2C] font-medium'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-150 ${
                  isActive ? 'scale-105 stroke-[2.25]' : 'stroke-[1.75]'
                }`}
              />
              <span className="text-[11px] leading-none tracking-tight whitespace-nowrap">
                {t.nav[id]}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
