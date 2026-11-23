import React from 'react';
import { Check, Gift, HelpCircle } from 'lucide-react';
import { TopHeader } from '../../components/layout/TopHeader';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';
import { formatRM } from '../../utils/format';
import { getShippingRegionByState } from '../../utils/shipping';

const STEPS: OrderStatus[] = ['Processing', 'Shipped', 'Delivered'];

export const OrderDetailScreen: React.FC = () => {
  const { orders, selectedOrderId, navigate, addToCart, t } = useApp();
  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAF8FD] pb-24">
        <TopHeader title={t.orders.detailTitle} showBack showCart />
        <main className="max-w-xl mx-auto px-4 pt-10 text-center">
          <button
            type="button"
            onClick={() => navigate('orders')}
            className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#7C69AE] text-white text-[14px] font-semibold cursor-pointer"
          >
            {t.orders.backOrders}
          </button>
        </main>
      </div>
    );
  }

  const activeIdx = STEPS.indexOf(order.status);

  const handleReorder = () => {
    order.items.forEach((item) => {
      addToCart(item.productId, item.quantity);
    });
    navigate('cart');
  };

  return (
    <div className="min-h-screen bg-[#FAF8FD] pb-24">
      <TopHeader title={t.orders.detailTitle} showBack showCart />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-5 space-y-5">
        {/* Order Header & Progress */}
        <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-[12px] text-[#635B73]">{t.orders.orderNumber}</p>
              <h1 className="font-display text-[20px] font-bold text-[#221E2C] tabular-nums">
                {order.orderNumber}
              </h1>
              <p className="text-[13px] text-[#635B73] mt-0.5">{order.createdAt}</p>
            </div>
            <span className="text-[14px] font-semibold text-[#5B4B8A]">
              {t.orders.statuses[order.status]}
            </span>
          </div>

          {/* 3-Step Timeline */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {STEPS.map((step, idx) => {
              const reached = idx <= activeIdx;
              return (
                <div key={step} className="flex flex-col items-center text-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold ${
                      reached
                        ? 'bg-[#7C69AE] text-white'
                        : 'bg-[#F0E9F8] text-[#7B7487]'
                    }`}
                  >
                    {reached ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`mt-1.5 text-[12px] font-medium ${
                      reached ? 'text-[#221E2C]' : 'text-[#7B7487]'
                    }`}
                  >
                    {t.orders.statuses[step]}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Purchased Products */}
        <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5 sm:p-6 space-y-4">
          <h2 className="font-display text-[18px] font-bold text-[#221E2C]">
            {t.orders.purchased}
          </h2>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => navigate('product-detail', { productId: item.productId })}
                  className="w-16 h-16 shrink-0 rounded-xl bg-[#FAF8FD] border border-[#F0E9F8] p-1.5 cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </button>
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

          <div className="pt-4 border-t border-[#F2ECF9] space-y-2 text-[14px]">
            <div className="flex justify-between text-[#635B73]">
              <span>{t.checkout.subtotal}</span>
              <span className="text-[#221E2C] tabular-nums">{formatRM(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#6D5D9B]">
                <span>{t.checkout.voucherDiscount}</span>
                <span className="tabular-nums">-{formatRM(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#635B73]">
              <span>
                {t.checkout.shippingFee} (
                {getShippingRegionByState(order.shipping.state) === 'east'
                  ? t.cart.eastName
                  : t.cart.peninsularShort}
                )
              </span>
              <span className="text-[#221E2C] tabular-nums">
                {order.shippingFee === 0 ? t.common.free : formatRM(order.shippingFee)}
              </span>
            </div>
            <div className="pt-2 border-t border-[#E9E1F3] flex justify-between items-center">
              <span className="font-display text-[16px] font-bold text-[#221E2C]">
                {t.orders.totalAmount}
              </span>
              <span className="font-display text-[19px] font-bold text-[#221E2C] tabular-nums">
                {formatRM(order.total)}
              </span>
            </div>
          </div>
        </section>

        {/* Shipping & Payment Info */}
        <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5 space-y-4 text-[13px]">
          <div>
            <p className="font-semibold text-[#221E2C]">{t.confirmation.shippingAddress}</p>
            <p className="mt-1.5 text-[#635B73] leading-relaxed">
              {order.shipping.fullName}
              <br />
              {order.shipping.phone}
              <br />
              {order.shipping.line1}
              {order.shipping.line2 ? `, ${order.shipping.line2}` : ''}
              <br />
              {order.shipping.postcode} {order.shipping.city}, {order.shipping.state},{' '}
              {order.shipping.country}
            </p>
          </div>
          <div className="pt-3 border-t border-[#F2ECF9] flex items-center justify-between">
            <span className="text-[#635B73]">{t.confirmation.paymentMethod}</span>
            <span className="font-semibold text-[#221E2C]">
              {t.payment.methods[order.paymentMethod].title}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#635B73]">{t.orders.pointsEarned}</span>
            <span className="text-[#6D5D9B] font-semibold tabular-nums">
              +{order.pointsEarned} {t.orders.pointsSuffix}
            </span>
          </div>
        </section>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleReorder}
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] text-white text-[14px] font-semibold transition-colors cursor-pointer"
          >
            {t.orders.buyAgain}
          </button>
          <button
            type="button"
            onClick={() => navigate('help')}
            className="w-full min-h-[46px] px-5 py-2.5 rounded-xl bg-[#F6F2FB] hover:bg-[#E9E1F3] border border-[#DDD3EE] text-[#4F407A] text-[13px] font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{t.orders.needHelpBtn}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('orders')}
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-white hover:bg-[#FAF8FD] border border-[#DDD3EE] text-[#221E2C] text-[14px] font-semibold transition-colors cursor-pointer"
          >
            {t.orders.backOrders}
          </button>
        </div>
      </main>
    </div>
  );
};
