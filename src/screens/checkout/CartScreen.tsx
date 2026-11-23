import React from 'react';
import { Gift, Minus, Plus, ShoppingBag, Tag, Trash2, Truck } from 'lucide-react';
import { TopHeader } from '../../components/layout/TopHeader';
import { GIFT_POUCH_PROMO, getProductById } from '../../data/products';
import { useApp } from '../../context/AppContext';
import { formatRM } from '../../utils/format';
import { SHIPPING_RATES } from '../../utils/shipping';

export const CartScreen: React.FC = () => {
  const {
    cart,
    cartTotals,
    setShippingRegion,
    navigate,
    updateCartQuantity,
    removeFromCart,
    vouchers,
    appliedVoucher,
    applyVoucherToCart,
    showToast,
    t,
  } = useApp();

  const availableVouchers = vouchers.filter((v) => v.redeemed && !v.used);

  const handleVoucherChange = (voucherId: string) => {
    if (!voucherId) {
      applyVoucherToCart(null);
      return;
    }
    const res = applyVoucherToCart(voucherId);
    if (!res.ok) {
      showToast(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8FD] pb-24">
      <TopHeader title={t.cart.title} showBack showCart={false} />

      <main className="px-4 pt-4">
        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E9E1F3] p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F6F2FB] flex items-center justify-center text-[#7C69AE]">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h2 className="mt-5 font-display text-[21px] font-bold text-[#221E2C]">
              {t.cart.emptyTitle}
            </h2>
            <p className="mt-2 text-[14px] text-[#635B73]">
              {t.cart.emptyDesc}
            </p>
            <button
              type="button"
              onClick={() => navigate('shop')}
              className="mt-6 w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] text-white text-[15px] font-semibold transition-colors cursor-pointer"
            >
              {t.cart.continueShopping}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cart Items List */}
            <div className="space-y-3">
              {cart.map((item) => {
                const product = getProductById(item.productId);
                if (!product || !product.priceConfirmed || product.sellingPrice === null) {
                  return null;
                }
                const lineTotal = product.sellingPrice * item.quantity;

                return (
                  <div
                    key={item.productId}
                    className="bg-white rounded-2xl border border-[#E9E1F3] p-3.5 flex gap-3.5 items-center"
                  >
                    <button
                      type="button"
                      onClick={() => navigate('product-detail', { productId: product.id })}
                      className="w-20 h-20 shrink-0 rounded-xl bg-[#FAF8FD] border border-[#F0E9F8] p-2 cursor-pointer"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => navigate('product-detail', { productId: product.id })}
                            className="text-left cursor-pointer w-full"
                          >
                            <h3 className="font-display text-[15px] font-semibold text-[#221E2C] truncate hover:text-[#6D5D9B]">
                              {product.name}
                            </h3>
                          </button>
                          <p className="text-[12px] text-[#635B73]">
                            {product.size} <span aria-hidden="true">·</span> {formatRM(product.sellingPrice)} {t.common.each}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          aria-label={`Remove ${product.name}`}
                          className="min-h-[38px] min-w-[38px] -mr-1.5 -mt-1 flex items-center justify-center rounded-lg text-[#7B7487] hover:text-[#9E3F64] hover:bg-[#FDF2F6] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-xl border border-[#DDD3EE] bg-[#FAF8FD]">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(product.id, item.quantity - 1)}
                            aria-label={`Decrease quantity of ${product.name}`}
                            className="min-h-[36px] min-w-[36px] flex items-center justify-center text-[#221E2C] hover:bg-[#E9E1F3]/60 rounded-l-xl cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-[14px] font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(product.id, item.quantity + 1)}
                            aria-label={`Increase quantity of ${product.name}`}
                            className="min-h-[36px] min-w-[36px] flex items-center justify-center text-[#221E2C] hover:bg-[#E9E1F3]/60 rounded-r-xl cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-[15px] font-bold text-[#221E2C] tabular-nums">
                          {formatRM(lineTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Complimentary Gift Pouch Status */}
              <div
                className={`rounded-2xl border p-3.5 flex items-center gap-3 ${
                  cartTotals.qualifiesForGiftPouch
                    ? 'bg-[#F7EAF1]/60 border-[#E5C6D8]'
                    : 'bg-white border-[#E9E1F3]'
                }`}
              >
                <div className="w-13 h-13 shrink-0 rounded-xl bg-white border border-[#E9E1F3] p-1">
                  <img
                    src={GIFT_POUCH_PROMO.image}
                    alt={GIFT_POUCH_PROMO.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#7A3F5D]">
                    <Gift className="w-3.5 h-3.5" />
                    <span>
                      {cartTotals.qualifiesForGiftPouch
                        ? t.cart.giftUnlocked
                        : t.cart.giftProgress}
                    </span>
                  </div>
                  <p className="text-[13px] font-semibold text-[#221E2C] mt-0.5">
                    {GIFT_POUCH_PROMO.name}
                  </p>
                  <p className="text-[12px] text-[#635B73]">
                    {cartTotals.qualifiesForGiftPouch
                      ? t.cart.giftUnlockedDesc
                      : t.cart.giftNeedMore}
                  </p>
                </div>
                {cartTotals.qualifiesForGiftPouch && (
                  <span className="text-[12px] font-bold text-[#6D5D9B] shrink-0">
                    {t.common.free}
                  </span>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5 space-y-4">
              <h2 className="font-display text-[18px] font-bold text-[#221E2C]">
                {t.cart.orderSummary}
              </h2>

              <div>
                <label
                  htmlFor="cart-voucher-select"
                  className="flex items-center gap-1.5 text-[13px] font-medium text-[#221E2C] mb-1.5"
                >
                  <Tag className="w-3.5 h-3.5 text-[#6D5D9B]" />
                  <span>{t.cart.promoVoucher}</span>
                </label>
                <select
                  id="cart-voucher-select"
                  value={appliedVoucher?.id || ''}
                  onChange={(e) => handleVoucherChange(e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] text-[13px] text-[#221E2C] focus:border-[#7C69AE] focus:outline-none cursor-pointer"
                >
                  <option value="">{t.cart.noVoucher}</option>
                  {availableVouchers.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.code} — {formatRM(v.discountAmount)} (min {formatRM(v.minSpend)})
                    </option>
                  ))}
                </select>
                {appliedVoucher && cartTotals.subtotal < appliedVoucher.minSpend && (
                  <p className="mt-1.5 text-[12px] text-[#8E355B]">
                    {t.cart.spendMoreVoucherPrefix} {formatRM(appliedVoucher.minSpend - cartTotals.subtotal)} {t.cart.spendMoreVoucherSuffix} {appliedVoucher.code}.
                  </p>
                )}
              </div>

              <div>
                <p className="flex items-center gap-1.5 text-[13px] font-medium text-[#221E2C] mb-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#6D5D9B]" />
                  <span>{t.cart.shippingDestination}</span>
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShippingRegion('peninsular')}
                    className={`rounded-xl border px-3 py-2.5 text-left transition-colors cursor-pointer ${
                      cartTotals.shippingRegion === 'peninsular'
                        ? 'bg-[#F6F2FB] border-[#7C69AE]'
                        : 'bg-[#FAF8FD] border-[#E9E1F3] hover:border-[#CFC3E4]'
                    }`}
                  >
                    <p className="text-[12px] font-semibold text-[#221E2C]">
                      {t.cart.peninsularShort}
                    </p>
                    <p className="text-[12px] font-bold text-[#6D5D9B] tabular-nums mt-0.5">
                      {formatRM(SHIPPING_RATES.peninsular)}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingRegion('east')}
                    className={`rounded-xl border px-3 py-2.5 text-left transition-colors cursor-pointer ${
                      cartTotals.shippingRegion === 'east'
                        ? 'bg-[#F6F2FB] border-[#7C69AE]'
                        : 'bg-[#FAF8FD] border-[#E9E1F3] hover:border-[#CFC3E4]'
                    }`}
                  >
                    <p className="text-[12px] font-semibold text-[#221E2C]">
                      {t.cart.eastName}
                    </p>
                    <p className="text-[12px] font-bold text-[#6D5D9B] tabular-nums mt-0.5">
                      {formatRM(SHIPPING_RATES.east)}
                    </p>
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-[14px] pt-2 border-t border-[#F2ECF9]">
                <div className="flex items-center justify-between text-[#635B73]">
                  <span>
                    {t.cart.subtotal} ({cartTotals.itemCount}{' '}
                    {cartTotals.itemCount === 1 ? t.common.item : t.common.items})
                  </span>
                  <span className="font-medium text-[#221E2C] tabular-nums">
                    {formatRM(cartTotals.subtotal)}
                  </span>
                </div>

                {cartTotals.discount > 0 && (
                  <div className="flex items-center justify-between text-[#6D5D9B]">
                    <span>{t.cart.voucherDiscount} ({appliedVoucher?.code})</span>
                    <span className="font-semibold tabular-nums">
                      -{formatRM(cartTotals.discount)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[#635B73]">
                  <span>
                    {t.cart.shippingFee} (
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

                {!cartTotals.qualifiesForFreeShipping ? (
                  <p className="text-[12px] text-[#635B73]">
                    {t.cart.freeShippingHintPrefix} {formatRM(cartTotals.freeShippingThreshold - cartTotals.subtotal)} {t.cart.freeShippingHintSuffix}
                  </p>
                ) : (
                  <p className="text-[12px] text-[#6D5D9B] font-medium">
                    {t.cart.freeShippingUnlocked}
                  </p>
                )}

                <div className="pt-3 border-t border-[#E9E1F3] flex items-center justify-between">
                  <span className="font-display text-[16px] font-bold text-[#221E2C]">
                    {t.cart.totalAmount}
                  </span>
                  <span className="font-display text-[20px] font-bold text-[#221E2C] tabular-nums">
                    {formatRM(cartTotals.total)}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => navigate('checkout')}
                  className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] active:scale-[0.99] text-white text-[15px] font-semibold transition-all cursor-pointer"
                >
                  {t.cart.proceedCheckout}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('shop')}
                  className="w-full min-h-[46px] px-6 py-2.5 rounded-xl bg-white hover:bg-[#FAF8FD] border border-[#DDD3EE] text-[#4F407A] text-[14px] font-semibold transition-colors cursor-pointer"
                >
                  {t.cart.continueShopping}
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};
