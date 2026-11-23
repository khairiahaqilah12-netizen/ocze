import React, { useState } from 'react';
import { Award, Check, Gift, History, Ticket } from 'lucide-react';
import { TopHeader } from '../../components/layout/TopHeader';
import { useApp } from '../../context/AppContext';
import { formatRM } from '../../utils/format';

type RewardsTab = 'vouchers' | 'redeem' | 'history';

export const RewardsScreen: React.FC = () => {
  const {
    points,
    membershipTier,
    nextTierPoints,
    pointHistory,
    vouchers,
    redeemVoucher,
    applyVoucherToCart,
    cartTotals,
    navigate,
    showToast,
    language,
    t,
  } = useApp();

  const [tab, setTab] = useState<RewardsTab>('vouchers');

  const availableVouchers = vouchers.filter((v) => v.redeemed && !v.used);
  const redeemableVouchers = vouchers.filter((v) => !v.redeemed);

  const progressPct = nextTierPoints !== null
    ? Math.min(100, Math.round(((points % 500) / 500) * 100))
    : 100;

  const handleUseVoucher = (voucherId: string) => {
    if (cartTotals.itemCount === 0) {
      navigate('shop');
      showToast(
        language === 'ms'
          ? 'Tambah produk ke troli untuk menggunakan baucar ini'
          : 'Add products to your cart to apply this promo voucher'
      );
      return;
    }
    const res = applyVoucherToCart(voucherId);
    if (res.ok) {
      navigate('cart');
    } else {
      showToast(res.message);
    }
  };

  const handleRedeem = (voucherId: string) => {
    const res = redeemVoucher(voucherId);
    if (!res.ok) {
      showToast(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8FD] pb-24">
      <TopHeader title={t.rewards.title} showCart />

      <main className="px-4 pt-4 space-y-4">
        {/* Loyalty Summary Card */}
        <section className="rounded-3xl bg-gradient-to-br from-[#E9E1F3] via-white to-[#F7EAF1] border border-[#DDD3EE] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[12px] font-medium text-[#5B4B8A]">
                {t.rewards.programme} · {membershipTier}
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-[30px] font-bold text-[#221E2C] tabular-nums">
                  {points}
                </span>
                <span className="text-[13px] font-medium text-[#635B73]">
                  {t.rewards.pointsLabel}
                </span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-white border border-[#E9E1F3] flex items-center justify-center text-[#6D5D9B] shrink-0">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-white overflow-hidden border border-[#E9E1F3]">
              <div
                className="h-full bg-[#7C69AE] rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-2 text-[12px] text-[#635B73]">
              {nextTierPoints !== null
                ? `${nextTierPoints} ${t.rewards.nextTierPrefix}`
                : t.rewards.maxTier}
            </p>
          </div>
        </section>

        {/* Sub-navigation Tabs */}
        <div
          role="tablist"
          aria-label="Rewards Sections"
          className="grid grid-cols-3 gap-1.5 p-1 bg-[#EFE9F7] rounded-2xl"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'vouchers'}
            onClick={() => setTab('vouchers')}
            className={`min-h-[42px] px-2.5 py-2 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              tab === 'vouchers'
                ? 'bg-white text-[#221E2C] shadow-xs'
                : 'text-[#635B73] hover:text-[#221E2C]'
            }`}
          >
            <Ticket className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.rewards.tabs.vouchers}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tab === 'redeem'}
            onClick={() => setTab('redeem')}
            className={`min-h-[42px] px-2.5 py-2 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              tab === 'redeem'
                ? 'bg-white text-[#221E2C] shadow-xs'
                : 'text-[#635B73] hover:text-[#221E2C]'
            }`}
          >
            <Gift className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.rewards.tabs.redeem}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tab === 'history'}
            onClick={() => setTab('history')}
            className={`min-h-[42px] px-2.5 py-2 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              tab === 'history'
                ? 'bg-white text-[#221E2C] shadow-xs'
                : 'text-[#635B73] hover:text-[#221E2C]'
            }`}
          >
            <History className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.rewards.tabs.history}</span>
          </button>
        </div>

        {/* Available Vouchers */}
        {tab === 'vouchers' && (
          <section className="space-y-3">
            <h2 className="font-display text-[18px] font-bold text-[#221E2C]">
              {t.rewards.availableVouchers}
            </h2>
            {availableVouchers.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E9E1F3] p-6 text-center">
                <p className="text-[14px] text-[#635B73]">
                  {t.rewards.noVouchers}
                </p>
                <button
                  type="button"
                  onClick={() => setTab('redeem')}
                  className="mt-4 min-h-[44px] px-5 py-2 rounded-xl bg-[#7C69AE] text-white text-[14px] font-semibold cursor-pointer"
                >
                  {t.rewards.browseRewards}
                </button>
              </div>
            ) : (
              availableVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="bg-white rounded-2xl border border-[#E9E1F3] p-4 space-y-3"
                >
                  <div>
                    <p className="text-[12px] font-semibold text-[#6D5D9B]">
                      {t.rewards.codeLabel} {voucher.code} · {t.rewards.validUntil} {voucher.expiryDate}
                    </p>
                    <h3 className="mt-1 font-display text-[16px] font-bold text-[#221E2C]">
                      {voucher.title}
                    </h3>
                    <p className="mt-1 text-[13px] text-[#635B73]">
                      {voucher.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUseVoucher(voucher.id)}
                    className="w-full min-h-[44px] px-5 py-2 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] text-white text-[13px] font-semibold cursor-pointer"
                  >
                    {t.rewards.useInCart}
                  </button>
                </div>
              ))
            )}
          </section>
        )}

        {/* Redeem Rewards */}
        {tab === 'redeem' && (
          <section className="space-y-3">
            <h2 className="font-display text-[18px] font-bold text-[#221E2C]">
              {t.rewards.redeemRewards}
            </h2>
            {redeemableVouchers.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E9E1F3] p-6 text-center">
                <Check className="w-8 h-8 text-[#6D5D9B] mx-auto" />
                <p className="mt-2 text-[14px] font-medium text-[#221E2C]">
                  {t.rewards.allRedeemed}
                </p>
              </div>
            ) : (
              redeemableVouchers.map((voucher) => {
                const canAfford = points >= voucher.pointsCost;
                return (
                  <div
                    key={voucher.id}
                    className="bg-white rounded-2xl border border-[#E9E1F3] p-4 space-y-3"
                  >
                    <div>
                      <p className="text-[12px] font-semibold text-[#6D5D9B] tabular-nums">
                        {voucher.pointsCost} {t.rewards.pointsCostSuffix} {formatRM(voucher.minSpend)}
                      </p>
                      <h3 className="mt-1 font-display text-[16px] font-bold text-[#221E2C]">
                        {voucher.title}
                      </h3>
                      <p className="mt-1 text-[13px] text-[#635B73]">
                        {voucher.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRedeem(voucher.id)}
                      className={`w-full min-h-[44px] px-5 py-2 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer ${
                        canAfford
                          ? 'bg-[#7C69AE] hover:bg-[#6A579C] text-white'
                          : 'bg-[#F6F2FB] border border-[#DDD3EE] text-[#7B7487]'
                      }`}
                    >
                      {t.rewards.redeemBtn}
                    </button>
                  </div>
                );
              })
            )}
          </section>
        )}

        {/* Points History */}
        {tab === 'history' && (
          <section className="space-y-3.5">
            <h2 className="font-display text-[19px] font-bold text-[#221E2C]">
              {t.rewards.pointsHistory}
            </h2>
            <div className="bg-white rounded-3xl border border-[#E9E1F3] divide-y divide-[#F2ECF9]">
              {pointHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-[14px] font-semibold text-[#221E2C]">
                      {item.title}
                    </p>
                    <p className="text-[12px] text-[#635B73]">{item.date}</p>
                  </div>
                  <span
                    className={`text-[15px] font-bold tabular-nums shrink-0 ${
                      item.type === 'earned' ? 'text-[#5B4B8A]' : 'text-[#8E355B]'
                    }`}
                  >
                    {item.type === 'earned' ? '+' : '-'}
                    {item.points} {t.rewards.ptsSuffix}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
