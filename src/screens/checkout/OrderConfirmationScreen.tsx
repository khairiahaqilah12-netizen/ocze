import React from 'react';
import { CheckCircle2, Gift } from 'lucide-react';
import { TopHeader } from '../../components/layout/TopHeader';
import { useApp } from '../../context/AppContext';
import { formatRM } from '../../utils/format';

export const OrderConfirmationScreen: React.FC = () => {
  const { latestOrder, orders, navigate, t } = useApp();
  const order = latestOrder || orders[0];

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAF8FD] pb-24">
        <TopHeader title={t.confirmation.title} showCart={false} />
        <main className="px-4 pt-10 text-center">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#7C69AE] text-white text-[14px] font-semibold cursor-pointer"
          >
            {t.confirmation.backHome}
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8FD] pb-24">
      <TopHeader title={t.confirmation.title} showCart={false} />

      <main className="px-4 pt-4 space-y-4">
        {/* Success Hero Card */}
        <section className="bg-white rounded-3xl border border-[#E9E1F3] p-6 text-center">
          <div className="w-15 h-15 mx-auto rounded-full bg-[#E9E1F3] flex items-center justify-center text-[#5B4B8A]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h1 className="mt-4 font-display text-[23px] font-bold text-[#221E2C]">
            {t.confirmation.successTitle}
          </h1>
          <p className="mt-1.5 text-[14px] text-[#635B73]">
            {t.confirmation.earnedPrefix}{' '}
            <span className="font-semibold text-[#5B4B8A] tabular-nums">
              {order.pointsEarned} {t.confirmation.pointsLabel}
            </span>
            .
          </p>

          <div className="mt-4 px-4 py-3 rounded-2xl bg-[#FAF8FD] border border-[#E9E1F3] text-[13px] space-y-0.5">
            <p>
              {t.confirmation.orderNumber}{' '}
              <strong className="font-semibold text-[#221E2C] tabular-nums">
                {order.orderNumber}
              </strong>
            </p>
            <p className="text-[12px] text-[#635B73]">{order.createdAt}</p>
          </div>
        </section>

        {/* Order Receipt Details */}
        <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5 space-y-4">
          <div>
            <h2 className="font-display text-[17px] font-bold text-[#221E2C] mb-3">
              {t.confirmation.purchased}
            </h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="w-13 h-13 shrink-0 rounded-xl bg-[#FAF8FD] border border-[#F0E9F8] p-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#221E2C] truncate">
                      {item.name}
                    </p>
                    <p className="text-[12px] text-[#635B73] tabular-nums">
                      {item.size} · {t.common.qty} {item.quantity} × {formatRM(item.unitPrice)}
                    </p>
                  </div>
                  <span className="text-[14px] font-semibold text-[#221E2C] tabular-nums">
                    {formatRM(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}

              {order.includesGiftPouch && (
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#F7EAF1]/60 text-[13px] text-[#7A3F5D]">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Gift className="w-4 h-4" />
                    OCZE+ Gift Pouch
                  </span>
                  <span className="font-semibold">{t.confirmation.complimentary}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#F2ECF9] text-[13px]">
            <div>
              <p className="font-semibold text-[#221E2C]">{t.confirmation.shippingAddress}</p>
              <p className="mt-1 text-[#635B73] leading-relaxed">
                {order.shipping.fullName} · {order.shipping.phone}
                <br />
                {order.shipping.line1}
                {order.shipping.line2 ? `, ${order.shipping.line2}` : ''}
                <br />
                {order.shipping.postcode} {order.shipping.city}, {order.shipping.state},{' '}
                {order.shipping.country}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F2ECF9]">
              <span className="text-[#635B73]">{t.confirmation.paymentMethod}</span>
              <span className="font-medium text-[#221E2C]">
                {t.payment.methods[order.paymentMethod].title}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-display text-[15px] font-bold text-[#221E2C]">{t.confirmation.totalPaid}</span>
              <span className="font-display text-[19px] font-bold text-[#221E2C] tabular-nums">
                {formatRM(order.total)}
              </span>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="pt-3 border-t border-[#F2ECF9] space-y-2.5">
            <button
              type="button"
              onClick={() => navigate('orders')}
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] text-white text-[14px] font-semibold transition-colors cursor-pointer"
            >
              {t.confirmation.viewOrders}
            </button>
            <button
              type="button"
              onClick={() => navigate('shop')}
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-[#F6F2FB] hover:bg-[#E9E1F3] border border-[#D8CBEB] text-[#4F407A] text-[14px] font-semibold transition-colors cursor-pointer"
            >
              {t.confirmation.continueShopping}
            </button>
            <button
              type="button"
              onClick={() => navigate('home')}
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF8FD] border border-[#DDD3EE] text-[#221E2C] text-[14px] font-semibold transition-colors cursor-pointer"
            >
              {t.confirmation.backHome}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
