import React, { useState } from 'react';
import { Building2, Check, CreditCard, Lock, Smartphone } from 'lucide-react';
import { TopHeader } from '../../components/layout/TopHeader';
import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';
import { formatRM } from '../../utils/format';

const PAYMENT_METHOD_KEYS: {
  id: PaymentMethod;
  Icon: React.FC<{ className?: string }>;
}[] = [
  { id: 'Online Banking', Icon: Building2 },
  { id: 'Debit/Credit Card', Icon: CreditCard },
  { id: 'E-Wallet', Icon: Smartphone },
];

export const PaymentScreen: React.FC = () => {
  const {
    cartTotals,
    checkoutShipping,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    placeDemoOrder,
    navigate,
    t,
  } = useApp();

  const [submitting, setSubmitting] = useState(false);

  if (cartTotals.itemCount === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8FD] pb-24">
        <TopHeader title={t.payment.title} showBack showCart />
        <main className="max-w-xl mx-auto px-4 pt-10 text-center">
          <div className="bg-white rounded-3xl border border-[#E9E1F3] p-8">
            <h2 className="font-display text-[20px] font-bold text-[#221E2C]">
              {t.payment.noItems}
            </h2>
            <button
              type="button"
              onClick={() => navigate('shop')}
              className="mt-5 min-h-[46px] px-6 py-2.5 rounded-xl bg-[#7C69AE] text-white text-[14px] font-semibold cursor-pointer"
            >
              {t.payment.returnShop}
            </button>
          </div>
        </main>
      </div>
    );
  }

  const handleConfirm = () => {
    if (submitting) return;
    setSubmitting(true);
    window.setTimeout(() => {
      placeDemoOrder();
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FAF8FD] pb-24">
      <TopHeader title={t.payment.title} showBack showCart={false} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-5 space-y-5">
        {/* Secure Notice */}
        <div className="rounded-2xl bg-[#F6F2FB] border border-[#DDD3EE] p-4 flex items-start gap-3">
          <Lock className="w-4 h-4 text-[#6D5D9B] shrink-0 mt-0.5" />
          <p className="text-[13px] text-[#4B445A]">
            {t.payment.notice}
          </p>
        </div>

        {/* Payment Methods */}
        <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5 sm:p-6 space-y-4">
          <h2 className="font-display text-[19px] font-bold text-[#221E2C]">
            {t.payment.selectMethod}
          </h2>

          <div className="space-y-3" role="radiogroup" aria-label={t.payment.selectMethod}>
            {PAYMENT_METHOD_KEYS.map(({ id, Icon }) => {
              const selected = selectedPaymentMethod === id;
              const copy = t.payment.methods[id];
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setSelectedPaymentMethod(id)}
                  className={`w-full text-left p-4 rounded-2xl border flex items-center gap-4 transition-all cursor-pointer min-h-[68px] ${
                    selected
                      ? 'bg-[#F6F2FB] border-[#7C69AE] ring-1 ring-[#7C69AE]'
                      : 'bg-white border-[#E9E1F3] hover:border-[#C8B9E2]'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      selected
                        ? 'bg-[#7C69AE] text-white'
                        : 'bg-[#FAF8FD] text-[#635B73]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-display text-[15px] font-semibold text-[#221E2C]">
                      {copy.title}
                    </p>
                    <p className="text-[13px] text-[#635B73]">{copy.subtitle}</p>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                      selected
                        ? 'bg-[#7C69AE] border-[#7C69AE] text-white'
                        : 'border-[#C8B9E2]'
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Order & Shipping Summary */}
        <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5 sm:p-6 space-y-4">
          <h2 className="font-display text-[19px] font-bold text-[#221E2C]">
            {t.payment.summary}
          </h2>

          <div className="text-[13px] text-[#635B73] space-y-1 pb-3 border-b border-[#F2ECF9]">
            <p className="font-semibold text-[#221E2C]">{t.payment.deliveringTo}</p>
            <p>
              {checkoutShipping.fullName} · {checkoutShipping.phone}
            </p>
            <p>
              {checkoutShipping.line1}
              {checkoutShipping.line2 ? `, ${checkoutShipping.line2}` : ''},{' '}
              {checkoutShipping.postcode} {checkoutShipping.city}, {checkoutShipping.state},{' '}
              {checkoutShipping.country}
            </p>
          </div>

          <div className="space-y-2 text-[14px]">
            <div className="flex justify-between text-[#635B73]">
              <span>{t.payment.selectedMethod}</span>
              <span className="font-medium text-[#221E2C]">
                {t.payment.methods[selectedPaymentMethod].title}
              </span>
            </div>
            <div className="flex justify-between text-[#635B73]">
              <span>{t.checkout.subtotal}</span>
              <span className="font-medium text-[#221E2C] tabular-nums">{formatRM(cartTotals.subtotal)}</span>
            </div>
            {cartTotals.discount > 0 && (
              <div className="flex justify-between text-[#6D5D9B]">
                <span>{t.checkout.voucherDiscount}</span>
                <span className="font-semibold tabular-nums">-{formatRM(cartTotals.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#635B73]">
              <span>
                {t.checkout.shippingFee} (
                {cartTotals.shippingRegion === 'east'
                  ? t.cart.eastName
                  : t.cart.peninsularShort}
                )
              </span>
              <span className="font-medium text-[#221E2C] tabular-nums">
                {cartTotals.shippingFee === 0 ? (
                  <>
                    <span className="line-through text-[#8B839B] mr-1.5">
                      {formatRM(cartTotals.baseShippingFee)}
                    </span>
                    <span className="text-[#6D5D9B] font-semibold">{t.common.free}</span>
                  </>
                ) : (
                  formatRM(cartTotals.shippingFee)
                )}
              </span>
            </div>
            <div className="pt-3 border-t border-[#E9E1F3] flex justify-between items-center">
              <span className="font-display text-[16px] font-bold text-[#221E2C]">
                {t.payment.totalPayment}
              </span>
              <span className="font-display text-[22px] font-bold text-[#221E2C] tabular-nums">
                {formatRM(cartTotals.total)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] active:scale-[0.99] disabled:opacity-70 text-white text-[15px] font-semibold transition-all cursor-pointer"
          >
            {submitting ? t.payment.processing : t.payment.confirm}
          </button>
        </section>
      </main>
    </div>
  );
};
