import React, { useState } from 'react';
import { Bell, Check, MapPin, Plus, Trash2 } from 'lucide-react';
import { TopHeader } from '../../components/layout/TopHeader';
import { ProductCard } from '../../components/common/ProductCard';
import { PRODUCTS } from '../../data/products';
import { useApp } from '../../context/AppContext';
import { formatRM, isValidEmail, isValidPhone } from '../../utils/format';
import {
  EAST_MALAYSIA_STATES,
  PENINSULAR_STATES,
  SHIPPING_RATES,
} from '../../utils/shipping';

export const EditProfileScreen: React.FC = () => {
  const { currentUser, updateProfile, goBack, t } = useApp();
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [skinPreference, setSkinPreference] = useState(
    currentUser?.skinPreference || 'Sensitive & Dry Skin'
  );
  const [error, setError] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (fullName.trim().length < 2) {
      setError(t.signup.errName);
      return;
    }
    if (!isValidEmail(email)) {
      setError(t.signup.errEmail);
      return;
    }
    if (!isValidPhone(phone)) {
      setError(t.signup.errPhone);
      return;
    }
    updateProfile({ fullName, email, phone, skinPreference });
    goBack();
  };

  return (
    <div className="min-h-screen bg-[#FAF8FD] pb-24">
      <TopHeader title={t.profile.editProfile} showBack showCart={false} />
      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-5">
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl border border-[#E9E1F3] p-5 sm:p-6 space-y-4"
          noValidate
        >
          {error && (
            <div className="p-3 rounded-xl bg-[#FDF2F6] border border-[#E9BFD2] text-[#8E355B] text-[13px]">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="ep-name" className="block text-[13px] font-medium text-[#221E2C] mb-1.5">
              {t.signup.fullName}
            </label>
            <input
              id="ep-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full min-h-[46px] px-3.5 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] focus:bg-white focus:border-[#7C69AE] focus:outline-none text-[14px]"
            />
          </div>

          <div>
            <label htmlFor="ep-email" className="block text-[13px] font-medium text-[#221E2C] mb-1.5">
              {t.signup.email}
            </label>
            <input
              id="ep-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[46px] px-3.5 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] focus:bg-white focus:border-[#7C69AE] focus:outline-none text-[14px]"
            />
          </div>

          <div>
            <label htmlFor="ep-phone" className="block text-[13px] font-medium text-[#221E2C] mb-1.5">
              {t.signup.phone}
            </label>
            <input
              id="ep-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full min-h-[46px] px-3.5 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] focus:bg-white focus:border-[#7C69AE] focus:outline-none text-[14px]"
            />
          </div>

          <div>
            <label htmlFor="ep-skin" className="block text-[13px] font-medium text-[#221E2C] mb-1.5">
              {t.subScreens.skinCareFocus}
            </label>
            <select
              id="ep-skin"
              value={skinPreference}
              onChange={(e) => setSkinPreference(e.target.value)}
              className="w-full min-h-[46px] px-3.5 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] focus:bg-white focus:border-[#7C69AE] focus:outline-none text-[14px]"
            >
              <option value="Sensitive & Dry Skin">Sensitive &amp; Dry Skin</option>
              <option value="Eczema-Prone Skin">Eczema-Prone Skin</option>
              <option value="Daily Gentle Hydration">Daily Gentle Hydration</option>
              <option value="Allergy-Prone Skin">Allergy-Prone Skin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] text-white text-[15px] font-semibold transition-colors cursor-pointer"
          >
            {t.subScreens.saveChanges}
          </button>
        </form>
      </main>
    </div>
  );
};

export const AddressesScreen: React.FC = () => {
  const { addresses, addOrUpdateAddress, deleteAddress, setDefaultAddress, currentUser, language, t } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [label, setLabel] = useState('Home');
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [postcode, setPostcode] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [country, setCountry] = useState('Malaysia');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !line1.trim() || !postcode.trim() || !city.trim() || !stateVal.trim()) {
      setError(
        language === 'ms'
          ? 'Sila lengkapkan semua ruangan alamat yang diperlukan.'
          : 'Please complete all required address fields.'
      );
      return;
    }
    addOrUpdateAddress({
      label: label.trim() || 'Address',
      fullName: fullName.trim(),
      phone: phone.trim(),
      line1: line1.trim(),
      line2: line2.trim(),
      postcode: postcode.trim(),
      city: city.trim(),
      state: stateVal.trim(),
      country: country.trim() || 'Malaysia',
      isDefault: addresses.length === 0,
    });
    setLine1('');
    setLine2('');
    setPostcode('');
    setCity('');
    setStateVal('');
    setError(null);
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8FD] pb-24">
      <TopHeader title={t.profile.myAddresses} showBack showCart={false} />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-5 space-y-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowAdd((prev) => !prev)}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showAdd ? t.subScreens.closeForm : t.subScreens.addNewAddress}</span>
          </button>
        </div>

        {showAdd && (
          <form
            onSubmit={handleAdd}
            className="bg-white rounded-3xl border border-[#E9E1F3] p-5 space-y-3.5"
          >
            <h2 className="font-display text-[17px] font-bold text-[#221E2C]">
              {t.subScreens.newShippingAddress}
            </h2>
            {error && (
              <p className="text-[13px] text-[#8E355B] bg-[#FDF2F6] p-2.5 rounded-xl">
                {error}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder={language === 'ms' ? 'Label (cth. Rumah, Pejabat)' : 'Label (e.g. Home, Office)'}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="min-h-[44px] px-3 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] text-[14px]"
              />
              <input
                type="text"
                placeholder={t.checkout.fullName}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="min-h-[44px] px-3 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] text-[14px]"
              />
            </div>
            <input
              type="tel"
              placeholder={t.checkout.phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full min-h-[44px] px-3 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] text-[14px]"
            />
            <input
              type="text"
              placeholder={t.checkout.line1}
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              className="w-full min-h-[44px] px-3 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] text-[14px]"
            />
            <input
              type="text"
              placeholder={t.checkout.line2}
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
              className="w-full min-h-[44px] px-3 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] text-[14px]"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder={t.checkout.postcode}
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="min-h-[44px] px-3 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] text-[14px]"
              />
              <input
                type="text"
                placeholder={t.checkout.city}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="min-h-[44px] px-3 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] text-[14px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={stateVal}
                onChange={(e) => setStateVal(e.target.value)}
                className="min-h-[44px] px-3 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] text-[14px] cursor-pointer"
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
              <input
                type="text"
                placeholder={t.checkout.country}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="min-h-[44px] px-3 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] text-[14px]"
              />
            </div>
            <button
              type="submit"
              className="w-full min-h-[46px] rounded-xl bg-[#7C69AE] text-white text-[14px] font-semibold cursor-pointer"
            >
              {t.subScreens.saveAddress}
            </button>
          </form>
        )}

        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white rounded-2xl border border-[#E9E1F3] p-4 sm:p-5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#6D5D9B]" />
                  <span className="font-display text-[15px] font-bold text-[#221E2C]">
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[12px] font-semibold text-[#6D5D9B]">
                      {t.subScreens.defaultTag}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-[12px] font-semibold text-[#6D5D9B] hover:underline min-h-[36px] px-2 cursor-pointer"
                    >
                      {t.subScreens.setDefault}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteAddress(addr.id)}
                    aria-label="Delete address"
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#7B7487] hover:text-[#8E355B] cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-[13px] text-[#4B445A]">
                {addr.fullName} · {addr.phone}
              </p>
              <p className="text-[13px] text-[#635B73]">
                {addr.line1}
                {addr.line2 ? `, ${addr.line2}` : ''}, {addr.postcode} {addr.city},{' '}
                {addr.state}, {addr.country}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export const WishlistScreen: React.FC = () => {
  const { wishlist, navigate, t } = useApp();
  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-[#FAF8FD] pb-24">
      <TopHeader title={t.subScreens.wishlistTitle} showBack showCart />
      <main className="px-4 pt-4">
        {savedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E9E1F3] p-8 text-center">
            <h2 className="font-display text-[19px] font-bold text-[#221E2C]">
              {t.subScreens.wishlistEmptyTitle}
            </h2>
            <p className="mt-1.5 text-[14px] text-[#635B73]">
              {t.subScreens.wishlistEmptyDesc}
            </p>
            <button
              type="button"
              onClick={() => navigate('shop')}
              className="mt-5 w-full min-h-[46px] px-6 py-2.5 rounded-xl bg-[#7C69AE] text-white text-[14px] font-semibold cursor-pointer"
            >
              {t.subScreens.exploreShop}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export const SettingsScreen: React.FC = () => {
  const { showToast, language, setLanguage, t } = useApp();
  const [promoAlerts, setPromoAlerts] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);

  return (
    <div className="min-h-screen bg-[#FAF8FD] pb-24">
      <TopHeader title={t.profile.settings} showBack showCart={false} />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-5 space-y-4">
        {/* App Language Section */}
        <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5 sm:p-6 space-y-3">
          <div>
            <p className="font-display text-[15px] font-semibold text-[#221E2C]">
              {t.subScreens.appLanguage}
            </p>
            <p className="text-[13px] text-[#635B73]">
              {t.subScreens.appLanguageDesc}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`min-h-[46px] px-4 py-2.5 rounded-xl border text-[14px] font-semibold transition-colors cursor-pointer ${
                language === 'en'
                  ? 'bg-[#7C69AE] border-[#7C69AE] text-white'
                  : 'bg-[#FAF8FD] border-[#DDD3EE] text-[#221E2C] hover:bg-[#F6F2FB]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ms')}
              className={`min-h-[46px] px-4 py-2.5 rounded-xl border text-[14px] font-semibold transition-colors cursor-pointer ${
                language === 'ms'
                  ? 'bg-[#7C69AE] border-[#7C69AE] text-white'
                  : 'bg-[#FAF8FD] border-[#DDD3EE] text-[#221E2C] hover:bg-[#F6F2FB]'
              }`}
            >
              Bahasa Melayu
            </button>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5 sm:p-6 divide-y divide-[#F2ECF9]">
          <div className="pb-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-[15px] font-semibold text-[#221E2C]">
                {t.subScreens.orderStatusUpdates}
              </p>
              <p className="text-[13px] text-[#635B73]">
                {t.subScreens.orderStatusUpdatesDesc}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={orderUpdates}
              onClick={() => {
                setOrderUpdates((v) => !v);
                showToast(language === 'ms' ? 'Keutamaan dikemas kini' : 'Preference updated');
              }}
              className={`w-12 h-7 rounded-full transition-colors p-0.5 cursor-pointer shrink-0 ${
                orderUpdates ? 'bg-[#7C69AE]' : 'bg-[#D8CBEB]'
              }`}
            >
              <span
                className={`block w-6 h-6 rounded-full bg-white transition-transform ${
                  orderUpdates ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-[15px] font-semibold text-[#221E2C]">
                {t.subScreens.skincarePromos}
              </p>
              <p className="text-[13px] text-[#635B73]">
                {t.subScreens.skincarePromosDesc}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={promoAlerts}
              onClick={() => {
                setPromoAlerts((v) => !v);
                showToast(language === 'ms' ? 'Keutamaan dikemas kini' : 'Preference updated');
              }}
              className={`w-12 h-7 rounded-full transition-colors p-0.5 cursor-pointer shrink-0 ${
                promoAlerts ? 'bg-[#7C69AE]' : 'bg-[#D8CBEB]'
              }`}
            >
              <span
                className={`block w-6 h-6 rounded-full bg-white transition-transform ${
                  promoAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export const NotificationsScreen: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, navigate, t } = useApp();

  return (
    <div className="min-h-screen bg-[#FAF8FD] pb-24">
      <TopHeader title={t.subScreens.notificationsTitle} showBack showCart />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-5 space-y-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="min-h-[40px] px-3 text-[13px] font-semibold text-[#6D5D9B] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{t.subScreens.markAllRead}</span>
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                markNotificationRead(n.id);
                if (n.targetScreen) {
                  navigate(n.targetScreen, { productId: n.targetProductId });
                }
              }}
              className={`w-full text-left p-4 rounded-2xl border transition-colors flex items-start gap-3.5 cursor-pointer ${
                n.read
                  ? 'bg-white border-[#E9E1F3]'
                  : 'bg-[#F6F2FB] border-[#D8CBEB]'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E9E1F3] flex items-center justify-center text-[#6D5D9B] shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-[15px] font-semibold text-[#221E2C]">
                    {n.title}
                  </p>
                  <span className="text-[12px] text-[#7B7487] shrink-0">{n.time}</span>
                </div>
                <p className="mt-1 text-[13px] text-[#635B73]">{n.message}</p>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};
