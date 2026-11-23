import React, { useState } from 'react';
import { MapPin, Truck } from 'lucide-react';
import { TopHeader } from '../../components/layout/TopHeader';
import { getProductById } from '../../data/products';
import { useApp } from '../../context/AppContext';
import { formatRM, isValidEmail, isValidPhone } from '../../utils/format';
import {
  EAST_MALAYSIA_STATES,
  PENINSULAR_STATES,
  SHIPPING_RATES,
  getShippingRegionByState,
} from '../../utils/shipping';

export const CheckoutScreen: React.FC = () => {
  const {
    cart,
    cartTotals,
    checkoutShipping,
    setCheckoutShipping,
    addresses,
    navigate,
    language,
    t,
  } = useApp();

  const [form, setForm] = useState(checkoutShipping);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8FD] pb-24">
        <TopHeader title={t.checkout.title} showBack showCart />
        <main className="px-4 pt-8 text-center">
          <div className="bg-white rounded-3xl border border-[#E9E1F3] p-7">
            <h2 className="font-display text-[19px] font-bold text-[#221E2C]">
              {t.checkout.emptyTitle}
            </h2>
            <p className="mt-2 text-[14px] text-[#635B73]">
              {t.checkout.emptyDesc}
            </p>
            <button
              type="button"
              onClick={() => navigate('shop')}
              className="mt-5 w-full min-h-[46px] px-6 py-2.5 rounded-xl bg-[#7C69AE] text-white text-[14px] font-semibold cursor-pointer"
            >
              {t.checkout.browseShop}
            </button>
          </div>
        </main>
      </div>
    );
  }

  const applySavedAddress = (addrId: string) => {
    const found = addresses.find((a) => a.id === addrId);
    if (!found) return;
    setForm((prev) => ({
      ...prev,
      fullName: found.fullName,
      phone: found.phone,
      line1: found.line1,
      line2: found.line2,
      postcode: found.postcode,
      city: found.city,
      state: found.state,
      country: found.country,
    }));
    setCheckoutShipping((prev) => ({ ...prev, state: found.state }));
    setErrors({});
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'state') {
      setCheckoutShipping((prev) => ({ ...prev, state: value }));
    }
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const formRegion = getShippingRegionByState(form.state);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!form.fullName.trim()) nextErrors.fullName = language === 'ms' ? 'Nama penuh diperlukan.' : 'Full name is required.';
    if (!isValidEmail(form.email)) nextErrors.email = language === 'ms' ? 'Alamat emel yang sah diperlukan.' : 'Valid email address is required.';
    if (!isValidPhone(form.phone)) nextErrors.phone = language === 'ms' ? 'Nombor telefon yang sah diperlukan.' : 'Valid phone number is required.';
    if (!form.line1.trim()) nextErrors.line1 = language === 'ms' ? 'Alamat Baris 1 diperlukan.' : 'Address Line 1 is required.';
    if (!form.postcode.trim()) nextErrors.postcode = language === 'ms' ? 'Poskod diperlukan.' : 'Postcode is required.';
    if (!form.city.trim()) nextErrors.city = language === 'ms' ? 'Bandar diperlukan.' : 'City is required.';
    if (!form.state.trim()) nextErrors.state = language === 'ms' ? 'Negeri diperlukan.' : 'State is required.';
    if (!form.country.trim()) nextErrors.country = language === 'ms' ? 'Negara diperlukan.' : 'Country is required.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setCheckoutShipping(form);
    navigate('payment');
  };

  const inputClass = (field: string) =>
    `w-full min-h-[46px] px-3.5 rounded-xl border text-[14px] text-[#221E2C] bg-[#FAF8FD] focus:bg-white focus:outline-none transition-colors ${
      errors[field]
        ? 'border-[#C95A85] focus:border-[#C95A85]'
        : 'border-[#DDD3EE] focus:border-[#7C69AE]'
    }`;

  return (
    <div className="min-h-screen bg-[#FAF8FD] pb-24">
      <TopHeader title={t.checkout.title} showBack showCart={false} />

      <main className="px-4 pt-4">
        <form onSubmit={handleContinue} className="space-y-4" noValidate>
          {/* Customer Details */}
          <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5 space-y-3.5">
            <h2 className="font-display text-[18px] font-bold text-[#221E2C]">
              {t.checkout.customerDetails}
            </h2>

            <div>
              <label htmlFor="co-name" className="block text-[13px] font-medium text-[#221E2C] mb-1.5">
                {t.checkout.fullName}
              </label>
              <input
                id="co-name"
                type="text"
                value={form.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                placeholder="Nurul Aisyah"
                className={inputClass('fullName')}
              />
              {errors.fullName && <p className="mt-1 text-[12px] text-[#8E355B]">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="co-email" className="block text-[13px] font-medium text-[#221E2C] mb-1.5">
                {t.checkout.email}
              </label>
              <input
                id="co-email"
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="you@example.com"
                className={inputClass('email')}
              />
              {errors.email && <p className="mt-1 text-[12px] text-[#8E355B]">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="co-phone" className="block text-[13px] font-medium text-[#221E2C] mb-1.5">
                {t.checkout.phone}
              </label>
              <input
                id="co-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+60 12-345 6789"
                className={inputClass('phone')}
              />
              {errors.phone && <p className="mt-1 text-[12px] text-[#8E355B]">{errors.phone}</p>}
            </div>
          </section>

          {/* Shipping Address */}
          <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5 space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-[18px] font-bold text-[#221E2C]">
                {t.checkout.shippingAddress}
              </h2>
              {addresses.length > 0 && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#6D5D9B]" />
                  <select
                    aria-label={t.checkout.savedAddress}
                    onChange={(e) => applySavedAddress(e.target.value)}
                    defaultValue=""
                    className="text-[12px] font-medium text-[#6D5D9B] bg-[#F6F2FB] border border-[#DDD3EE] rounded-lg px-2 py-1.5 cursor-pointer max-w-[140px]"
                  >
                    <option value="" disabled>
                      {t.checkout.savedAddress}
                    </option>
                    {addresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.label} — {addr.city}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="co-line1" className="block text-[13px] font-medium text-[#221E2C] mb-1.5">
                {t.checkout.line1}
              </label>
              <input
                id="co-line1"
                type="text"
                value={form.line1}
                onChange={(e) => updateField('line1', e.target.value)}
                placeholder={t.checkout.line1Placeholder}
                className={inputClass('line1')}
              />
              {errors.line1 && <p className="mt-1 text-[12px] text-[#8E355B]">{errors.line1}</p>}
            </div>

            <div>
              <label htmlFor="co-line2" className="block text-[13px] font-medium text-[#221E2C] mb-1.5">
                {t.checkout.line2}
              </label>
              <input
                id="co-line2"
                type="text"
                value={form.line2}
                onChange={(e) => updateField('line2', e.target.value)}
                placeholder={t.checkout.line2Placeholder}
                className={inputClass('line2')}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="co-postcode" className="block text-[13px] font-medium text-[#221E2C] mb-1.5">
                  {t.checkout.postcode}
                </label>
                <input
                  id="co-postcode"
                  type="text"
                  value={form.postcode}
                  onChange={(e) => updateField('postcode', e.target.value)}
                  placeholder="40150"
                  className={inputClass('postcode')}
                />
                {errors.postcode && <p className="mt-1 text-[12px] text-[#8E355B]">{errors.postcode}</p>}
              </div>

              <div>
                <label htmlFor="co-city" className="block text-[13px] font-medium text-[#221E2C] mb-1.5">
                  {t.checkout.city}
                </label>
                <input
                  id="co-city"
                  type="text"
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="Shah Alam"
                  className={inputClass('city')}
                />
                {errors.city && <p className="mt-1 text-[12px] text-[#8E355B]">{errors.city}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="co-state" className="block text-[13px] font-medium text-[#221E2C] mb-1.5">
                  {t.checkout.state}
                </label>
                <select
                  id="co-state"
                  value={form.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className={`${inputClass('state')} cursor-pointer`}
                >
                  <option value="" disabled>
                    {t.checkout.selectState}
                  </option>
                  <optgroup label={`${t.cart.peninsularName} (${formatRM(SHIPPING_RATES.peninsular)})`}>
                    {PENINSULAR_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={`${t.cart.eastName} (${formatRM(SHIPPING_RATES.east)})`}>
                    {EAST_MALAYSIA_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </optgroup>
                </select>
                {errors.state && <p className="mt-1 text-[12px] text-[#8E355B]">{errors.state}</p>}
              </div>

              <div>
                <label htmlFor="co-country" className="block text-[13px] font-medium text-[#221E2C] mb-1.5">
                  {t.checkout.country}
                </label>
                <input
                  id="co-country"
                  type="text"
                  value={form.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  placeholder="Malaysia"
                  className={inputClass('country')}
                />
                {errors.country && <p className="mt-1 text-[12px] text-[#8E355B]">{errors.country}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 rounded-xl bg-[#F6F2FB] border border-[#E9E1F3] px-3.5 py-2.5 text-[12px]">
              <span className="inline-flex items-center gap-1.5 text-[#4F407A] font-medium">
                <Truck className="w-3.5 h-3.5 text-[#6D5D9B] shrink-0" />
                <span>
                  {formRegion === 'east' ? t.cart.eastName : t.cart.peninsularName}
                </span>
              </span>
              <span className="font-bold text-[#221E2C] tabular-nums">
                {cartTotals.shippingFee === 0 ? (
                  <>
                    <span className="line-through text-[#8B839B] font-normal mr-1.5">
                      {formatRM(cartTotals.baseShippingFee)}
                    </span>
                    <span className="text-[#6D5D9B]">{t.common.free}</span>
                  </>
                ) : (
                  formatRM(cartTotals.baseShippingFee)
                )}
              </span>
            </div>
          </section>

          {/* Order Summary */}
          <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5 space-y-4">
            <h2 className="font-display text-[18px] font-bold text-[#221E2C]">
              {t.checkout.orderSummary}
            </h2>

            <div className="space-y-3">
              {cart.map((item) => {
                const product = getProductById(item.productId);
                if (!product || !product.priceConfirmed || product.sellingPrice === null) return null;
                return (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="w-13 h-13 shrink-0 rounded-xl bg-[#FAF8FD] border border-[#F0E9F8] p-1">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[#221E2C] truncate">
                        {product.name}
                      </p>
                      <p className="text-[12px] text-[#635B73] tabular-nums">
                        {t.common.qty} {item.quantity} × {formatRM(product.sellingPrice)}
                      </p>
                    </div>
                    <span className="text-[14px] font-semibold text-[#221E2C] tabular-nums shrink-0">
                      {formatRM(product.sellingPrice * item.quantity)}
                    </span>
                  </div>
                );
              })}

              {cartTotals.qualifiesForGiftPouch && (
                <div className="flex items-center justify-between text-[13px] text-[#7A3F5D] bg-[#F7EAF1]/60 rounded-xl px-3 py-2">
                  <span>OCZE+ Gift Pouch</span>
                  <span className="font-semibold">{t.common.free}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 text-[14px] pt-3 border-t border-[#F2ECF9]">
              <div className="flex justify-between text-[#635B73]">
                <span>{t.checkout.subtotal}</span>
                <span className="text-[#221E2C] font-medium tabular-nums">{formatRM(cartTotals.subtotal)}</span>
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
                <span className="text-[#221E2C] font-medium tabular-nums">
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
                <span className="font-display text-[16px] font-bold text-[#221E2C]">{t.checkout.total}</span>
                <span className="font-display text-[20px] font-bold text-[#221E2C] tabular-nums">
                  {formatRM(cartTotals.total)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] active:scale-[0.99] text-white text-[15px] font-semibold transition-all cursor-pointer"
            >
              {t.checkout.continuePayment}
            </button>
          </section>
        </form>
      </main>
    </div>
  );
};
