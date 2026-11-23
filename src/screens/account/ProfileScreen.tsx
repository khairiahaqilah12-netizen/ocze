import React from 'react';
import {
  Award,
  BookOpen,
  ChevronRight,
  Globe,
  Heart,
  HelpCircle,
  LogOut,
  MapPin,
  NotebookPen,
  Package,
  Settings,
  UserPen,
} from 'lucide-react';
import { TopHeader } from '../../components/layout/TopHeader';
import { useApp } from '../../context/AppContext';
import { AppScreen } from '../../types';
import { getInitials } from '../../utils/format';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    navigate,
    requestLogout,
    wishlist,
    points,
    orders,
    journalEntries,
    language,
    setLanguage,
    t,
  } = useApp();

  const displayName = currentUser?.fullName || 'OCZE+ Guest';
  const displayEmail = currentUser?.email || 'demo@ocze.com';
  const initials = getInitials(displayName);

  const menuItems: {
    label: string;
    subtitle?: string;
    screen: AppScreen;
    Icon: React.FC<{ className?: string }>;
  }[] = [
    {
      label: t.profile.editProfile,
      subtitle: `${t.subScreens.skinCareFocus} & ${t.signup.phone.toLowerCase()}`,
      screen: 'edit-profile',
      Icon: UserPen,
    },
    {
      label: t.profile.myOrders,
      subtitle: `${orders.length} ${orders.length === 1 ? t.profile.orderSingle : t.profile.orderPlural}`,
      screen: 'orders',
      Icon: Package,
    },
    {
      label: t.profile.myAddresses,
      subtitle: t.profile.myAddressesSub,
      screen: 'addresses',
      Icon: MapPin,
    },
    {
      label: t.profile.wishlist,
      subtitle: `${wishlist.length} ${wishlist.length === 1 ? t.profile.savedSingle : t.profile.savedPlural}`,
      screen: 'wishlist',
      Icon: Heart,
    },
    {
      label: t.profile.rewards,
      subtitle: `${points} ${t.profile.pointsAvailable}`,
      screen: 'rewards',
      Icon: Award,
    },
    {
      label: t.profile.skinGuide,
      subtitle: t.profile.skinGuideSub,
      screen: 'skin-guide',
      Icon: BookOpen,
    },
    {
      label: t.profile.skinJournal,
      subtitle: `${journalEntries.length} ${journalEntries.length === 1 ? t.profile.entrySingle : t.profile.entryPlural}`,
      screen: 'skin-journal',
      Icon: NotebookPen,
    },
    {
      label: t.profile.help,
      subtitle: t.profile.helpSub,
      screen: 'help',
      Icon: HelpCircle,
    },
    {
      label: t.profile.settings,
      subtitle: t.profile.settingsSub,
      screen: 'settings',
      Icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8FD] pb-24">
      <TopHeader title={t.profile.title} showCart />

      <main className="px-4 pt-4 space-y-4">
        {/* Profile Header with Initials Avatar (No Human Photos) */}
        <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5 flex flex-col items-center gap-3 text-center">
          <div
            aria-hidden="true"
            className="w-18 h-18 rounded-full bg-[#E9E1F3] border-2 border-[#D5A0BD]/50 flex items-center justify-center font-display text-[22px] font-bold text-[#4F407A] shrink-0"
          >
            {initials}
          </div>

          <div className="w-full min-w-0">
            <h2 className="font-display text-[20px] font-bold text-[#221E2C] truncate">
              {displayName}
            </h2>
            <p className="text-[13px] text-[#635B73] truncate">{displayEmail}</p>
            {currentUser?.skinPreference && (
              <p className="mt-1 text-[12px] text-[#6D5D9B] font-medium">
                {t.profile.skinProfile} {currentUser.skinPreference}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate('edit-profile')}
            className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-[#F6F2FB] hover:bg-[#E9E1F3] text-[#4F407A] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            {t.profile.editProfile}
          </button>
        </section>

        {/* Quick Language Switcher */}
        <section className="bg-white rounded-3xl border border-[#E9E1F3] p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#F6F2FB] flex items-center justify-center text-[#6D5D9B] shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-[14px] font-semibold text-[#221E2C]">
                {t.common.language}
              </p>
              <p className="text-[12px] text-[#635B73] truncate">
                {t.langName}
              </p>
            </div>
          </div>

          <div
            role="group"
            aria-label={t.common.chooseLanguage}
            className="inline-flex items-center rounded-xl border border-[#E9E1F3] bg-[#FAF8FD] p-1 shrink-0"
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
              Melayu
            </button>
          </div>
        </section>

        {/* Menu List */}
        <section className="bg-white rounded-3xl border border-[#E9E1F3] divide-y divide-[#F2ECF9] overflow-hidden">
          {menuItems.map(({ label, subtitle, screen, Icon }) => (
            <button
              key={screen}
              type="button"
              onClick={() => navigate(screen)}
              className="w-full min-h-[62px] px-5 py-3.5 flex items-center gap-4 text-left hover:bg-[#FAF8FD] transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F6F2FB] flex items-center justify-center text-[#6D5D9B] shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-[15px] font-semibold text-[#221E2C]">
                  {label}
                </p>
                {subtitle && (
                  <p className="text-[12px] text-[#635B73] truncate">{subtitle}</p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-[#8C849A] shrink-0" />
            </button>
          ))}
        </section>

        {/* Logout Action */}
        <section>
          <button
            type="button"
            onClick={requestLogout}
            className="w-full min-h-[52px] px-5 py-3.5 rounded-2xl bg-white hover:bg-[#FDF2F6] border border-[#E9E1F3] hover:border-[#E5B8CA] text-[#8E355B] font-display text-[15px] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.profile.logout}</span>
          </button>
        </section>
      </main>
    </div>
  );
};
