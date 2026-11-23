import React from 'react';
import { LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LogoutDialog: React.FC = () => {
  const { logoutModalOpen, cancelLogout, confirmLogout, t } = useApp();

  if (!logoutModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
      className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 flex items-center justify-center p-5 bg-[#221E2C]/45 backdrop-blur-xs"
    >
      <div className="w-full max-w-sm bg-white rounded-3xl border border-[#E9E1F3] p-6 shadow-xl text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#F6F2FB] flex items-center justify-center text-[#6D5D9B] mb-4">
          <LogOut className="w-5 h-5" />
        </div>

        <h2
          id="logout-dialog-title"
          className="font-display text-[20px] font-semibold text-[#221E2C]"
        >
          {t.profile.logoutConfirmTitle}
        </h2>
        <p className="mt-2 text-[14px] text-[#635B73]">
          {t.profile.logoutConfirmDesc}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={cancelLogout}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[#DDD3EE] bg-white hover:bg-[#FAF8FD] text-[#221E2C] text-[14px] font-medium transition-colors cursor-pointer"
          >
            {t.common.cancel}
          </button>
          <button
            type="button"
            onClick={confirmLogout}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] text-white text-[14px] font-medium transition-colors cursor-pointer"
          >
            {t.profile.logout}
          </button>
        </div>
      </div>
    </div>
  );
};
