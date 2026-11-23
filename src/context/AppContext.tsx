import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  Address,
  AppLanguage,
  AppNotification,
  AppScreen,
  CartItem,
  MainTab,
  Order,
  PaymentMethod,
  PointTransaction,
  ProductCategory,
  ShippingDetails,
  SkinComfortLevel,
  SkinJournalEntry,
  UserAccount,
  Voucher,
} from '../types';
import { AppTranslations, TRANSLATIONS } from '../i18n/translations';
import { getProductById, GIFT_POUCH_PROMO } from '../data/products';
import {
  DEMO_MEMBERSHIP_TIERS,
  INITIAL_DEMO_ORDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_POINT_HISTORY,
  INITIAL_POINTS,
  INITIAL_VOUCHERS,
} from '../data/rewards';
import { formatNowLabel, generateDemoOrderNumber } from '../utils/format';
import {
  getShippingRateByRegion,
  getShippingRegionByState,
  ShippingRegion,
} from '../utils/shipping';

const STORAGE_KEYS = {
  ACCOUNTS: 'ocze_demo_accounts_v1',
  SESSION_USER_ID: 'ocze_session_user_id_v1',
  REMEMBERED_EMAIL: 'ocze_remembered_email_v1',
  CART: 'ocze_cart_v1',
  WISHLIST: 'ocze_wishlist_v1',
  ORDERS: 'ocze_orders_v1',
  ADDRESSES: 'ocze_addresses_v1',
  POINTS: 'ocze_points_v1',
  POINT_HISTORY: 'ocze_point_history_v2',
  VOUCHERS: 'ocze_vouchers_v2',
  APPLIED_VOUCHER_ID: 'ocze_applied_voucher_v2',
  NOTIFICATIONS: 'ocze_notifications_v2',
  SKIN_JOURNAL: 'ocze_skin_journal_v1',
  LANGUAGE: 'ocze_language_v1',
};

const INITIAL_JOURNAL_ENTRIES: SkinJournalEntry[] = [
  {
    id: 'jr-demo-1',
    date: '2026-11-21',
    comfort: 'Calm',
    hydrationScore: 5,
    productsUsed: ['OCZE+ CalmSkin Shower Therapy', 'OCZE+ Ultra Hydrating Moisturiser'],
    notes: 'Skin felt soft and comfortable after evening shower. No tightness before sleep.',
    createdAt: '21 Nov 2026, 9:15 PM',
  },
  {
    id: 'jr-demo-2',
    date: '2026-11-19',
    comfort: 'Recovering',
    hydrationScore: 4,
    productsUsed: ['OCZE+ Soothing Cream'],
    notes: 'Applied a thin layer on dry patches around elbows morning and night. Redness visibly calmer.',
    createdAt: '19 Nov 2026, 8:40 PM',
  },
];

const DEFAULT_DEMO_ACCOUNT: UserAccount = {
  id: 'user-demo-1',
  fullName: 'Aisyah Rahman',
  email: 'aisyah@ocze.demo',
  phone: '+60 12-345 6789',
  password: 'ocze1234',
  skinPreference: 'Sensitive & Dry Skin',
};

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    fullName: 'Aisyah Rahman',
    phone: '+60 12-345 6789',
    line1: 'No. 18, Jalan Anggun 4',
    line2: 'Taman Seri Melati',
    postcode: '40150',
    city: 'Shah Alam',
    state: 'Selangor',
    country: 'Malaysia',
    isDefault: true,
  },
];

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

interface CartTotals {
  itemCount: number;
  subtotal: number;
  discount: number;
  baseShippingFee: number;
  shippingFee: number;
  shippingRegion: ShippingRegion;
  total: number;
  qualifiesForFreeShipping: boolean;
  qualifiesForGiftPouch: boolean;
  freeShippingThreshold: number;
}

interface AppContextValue {
  screen: AppScreen;
  activeTab: MainTab;
  selectedProductId: string;
  selectedOrderId: string;
  shopCategoryFilter: ProductCategory;
  currentUser: UserAccount | null;
  rememberedEmail: string;
  accounts: UserAccount[];
  cart: CartItem[];
  cartTotals: CartTotals;
  wishlist: string[];
  orders: Order[];
  latestOrder: Order | null;
  addresses: Address[];
  checkoutShipping: ShippingDetails;
  selectedPaymentMethod: PaymentMethod;
  points: number;
  membershipTier: string;
  nextTierPoints: number | null;
  pointHistory: PointTransaction[];
  vouchers: Voucher[];
  appliedVoucher: Voucher | null;
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  journalEntries: SkinJournalEntry[];
  logoutModalOpen: boolean;
  toastMessage: string | null;
  language: AppLanguage;
  t: AppTranslations;

  setLanguage: (lang: AppLanguage) => void;
  navigate: (screen: AppScreen, options?: { productId?: string; orderId?: string; category?: ProductCategory }) => void;
  goBack: () => void;
  setShopCategoryFilter: (cat: ProductCategory) => void;
  login: (email: string, password: string, rememberMe: boolean) => { ok: boolean; error?: string };
  signUp: (payload: { fullName: string; email: string; phone: string; password: string }) => { ok: boolean; error?: string };
  updateProfile: (payload: { fullName: string; email: string; phone: string; skinPreference?: string }) => void;
  requestLogout: () => void;
  cancelLogout: () => void;
  confirmLogout: () => void;

  addToCart: (productId: string, quantity?: number) => boolean;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;

  setCheckoutShipping: React.Dispatch<React.SetStateAction<ShippingDetails>>;
  setShippingRegion: (region: ShippingRegion) => void;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;
  placeDemoOrder: () => Order | null;

  addOrUpdateAddress: (address: Omit<Address, 'id'> & { id?: string }) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  redeemVoucher: (voucherId: string) => { ok: boolean; message: string };
  applyVoucherToCart: (voucherId: string | null) => { ok: boolean; message: string };

  addJournalEntry: (entry: {
    date: string;
    comfort: SkinComfortLevel;
    hydrationScore: number;
    productsUsed: string[];
    notes: string;
  }) => void;
  deleteJournalEntry: (id: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const saved = safeParse<UserAccount[]>(localStorage.getItem(STORAGE_KEYS.ACCOUNTS), []);
    if (!saved.some((a) => a.email.toLowerCase() === DEFAULT_DEMO_ACCOUNT.email)) {
      return [DEFAULT_DEMO_ACCOUNT, ...saved];
    }
    return saved;
  });

  const [sessionUserId, setSessionUserId] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.SESSION_USER_ID)
  );

  const [rememberedEmail, setRememberedEmail] = useState<string>(() =>
    localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL) || ''
  );

  const [screen, setScreen] = useState<AppScreen>('splash');
  const [history, setHistory] = useState<AppScreen[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('soothing-cream');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(INITIAL_DEMO_ORDERS[0].id);
  const [shopCategoryFilter, setShopCategoryFilter] = useState<ProductCategory>('All');

  const [cart, setCart] = useState<CartItem[]>(() =>
    safeParse<CartItem[]>(localStorage.getItem(STORAGE_KEYS.CART), [])
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    safeParse<string[]>(localStorage.getItem(STORAGE_KEYS.WISHLIST), ['soothing-cream'])
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    safeParse<Order[]>(localStorage.getItem(STORAGE_KEYS.ORDERS), INITIAL_DEMO_ORDERS)
  );
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [addresses, setAddresses] = useState<Address[]>(() =>
    safeParse<Address[]>(localStorage.getItem(STORAGE_KEYS.ADDRESSES), DEFAULT_ADDRESSES)
  );
  const [points, setPoints] = useState<number>(() =>
    safeParse<number>(localStorage.getItem(STORAGE_KEYS.POINTS), INITIAL_POINTS)
  );
  const [pointHistory, setPointHistory] = useState<PointTransaction[]>(() =>
    safeParse<PointTransaction[]>(localStorage.getItem(STORAGE_KEYS.POINT_HISTORY), INITIAL_POINT_HISTORY)
  );
  const [vouchers, setVouchers] = useState<Voucher[]>(() =>
    safeParse<Voucher[]>(localStorage.getItem(STORAGE_KEYS.VOUCHERS), INITIAL_VOUCHERS)
  );
  const [appliedVoucherId, setAppliedVoucherId] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.APPLIED_VOUCHER_ID)
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    safeParse<AppNotification[]>(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS), INITIAL_NOTIFICATIONS)
  );
  const [journalEntries, setJournalEntries] = useState<SkinJournalEntry[]>(() =>
    safeParse<SkinJournalEntry[]>(localStorage.getItem(STORAGE_KEYS.SKIN_JOURNAL), INITIAL_JOURNAL_ENTRIES)
  );

  const currentUser = useMemo(
    () => accounts.find((a) => a.id === sessionUserId) || null,
    [accounts, sessionUserId]
  );

  const defaultAddr = useMemo(
    () => addresses.find((a) => a.isDefault) || addresses[0],
    [addresses]
  );

  const [checkoutShipping, setCheckoutShipping] = useState<ShippingDetails>(() => ({
    fullName: currentUser?.fullName || defaultAddr?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || defaultAddr?.phone || '',
    line1: defaultAddr?.line1 || '',
    line2: defaultAddr?.line2 || '',
    postcode: defaultAddr?.postcode || '',
    city: defaultAddr?.city || '',
    state: defaultAddr?.state || '',
    country: defaultAddr?.country || 'Malaysia',
  }));

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('Online Banking');
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return saved === 'ms' ? 'ms' : 'en';
  });

  const t = useMemo<AppTranslations>(() => TRANSLATIONS[language], [language]);

  // Sync LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (sessionUserId) {
      localStorage.setItem(STORAGE_KEYS.SESSION_USER_ID, sessionUserId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION_USER_ID);
    }
  }, [sessionUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify(points));
  }, [points]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POINT_HISTORY, JSON.stringify(pointHistory));
  }, [pointHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    if (appliedVoucherId) {
      localStorage.setItem(STORAGE_KEYS.APPLIED_VOUCHER_ID, appliedVoucherId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.APPLIED_VOUCHER_ID);
    }
  }, [appliedVoucherId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SKIN_JOURNAL, JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  // Keep checkout shipping defaults updated when user logs in
  useEffect(() => {
    if (currentUser) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      setCheckoutShipping((prev) => ({
        fullName: prev.fullName || currentUser.fullName,
        email: prev.email || currentUser.email,
        phone: prev.phone || currentUser.phone,
        line1: prev.line1 || def?.line1 || '',
        line2: prev.line2 || def?.line2 || '',
        postcode: prev.postcode || def?.postcode || '',
        city: prev.city || def?.city || '',
        state: prev.state || def?.state || '',
        country: prev.country || def?.country || 'Malaysia',
      }));
    }
  }, [currentUser, addresses]);

  // Splash auto transition
  useEffect(() => {
    if (screen !== 'splash') return;
    const timer = window.setTimeout(() => {
      if (sessionUserId && accounts.some((a) => a.id === sessionUserId)) {
        setScreen('home');
      } else {
        setScreen('welcome');
      }
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [screen, sessionUserId, accounts]);

  // Toast timer
  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    showToast(lang === 'ms' ? 'Bahasa ditukar ke Bahasa Melayu' : 'Language switched to English');
  };

  const navigate: AppContextValue['navigate'] = (nextScreen, options) => {
    if (options?.productId) setSelectedProductId(options.productId);
    if (options?.orderId) setSelectedOrderId(options.orderId);
    if (options?.category) setShopCategoryFilter(options.category);

    setHistory((prev) => (screen === nextScreen ? prev : [...prev.slice(-15), screen]));
    setScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const goBack = () => {
    setHistory((prev) => {
      if (prev.length === 0) {
        setScreen(currentUser ? 'home' : 'welcome');
        return [];
      }
      const next = prev[prev.length - 1];
      setScreen(next);
      return prev.slice(0, -1);
    });
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const activeTab: MainTab = useMemo(() => {
    if (screen === 'shop' || screen === 'product-detail') return 'shop';
    if (screen === 'rewards') return 'rewards';
    if (screen === 'orders' || screen === 'order-detail') return 'orders';
    if (
      screen === 'profile' ||
      screen === 'edit-profile' ||
      screen === 'addresses' ||
      screen === 'wishlist' ||
      screen === 'help' ||
      screen === 'settings'
    ) {
      return 'profile';
    }
    return 'home';
  }, [screen]);

  const appliedVoucher = useMemo(
    () => vouchers.find((v) => v.id === appliedVoucherId && v.redeemed && !v.used) || null,
    [vouchers, appliedVoucherId]
  );

  const cartTotals = useMemo<CartTotals>(() => {
    const freeShippingThreshold = 100;
    let itemCount = 0;
    let subtotal = 0;

    for (const item of cart) {
      const product = getProductById(item.productId);
      if (!product || !product.priceConfirmed || product.sellingPrice === null) continue;
      itemCount += item.quantity;
      subtotal += product.sellingPrice * item.quantity;
    }

    const discount =
      appliedVoucher && subtotal >= appliedVoucher.minSpend
        ? Math.min(appliedVoucher.discountAmount, subtotal)
        : 0;

    const shippingRegion = getShippingRegionByState(checkoutShipping.state);
    const baseShippingFee = getShippingRateByRegion(shippingRegion);
    const qualifiesForFreeShipping = subtotal >= freeShippingThreshold;
    const shippingFee = itemCount === 0 ? 0 : qualifiesForFreeShipping ? 0 : baseShippingFee;
    const total = Math.max(0, subtotal - discount + shippingFee);
    const qualifiesForGiftPouch = itemCount >= GIFT_POUCH_PROMO.minItemsForFreeGift;

    return {
      itemCount,
      subtotal,
      discount,
      baseShippingFee,
      shippingFee,
      shippingRegion,
      total,
      qualifiesForFreeShipping,
      qualifiesForGiftPouch,
      freeShippingThreshold,
    };
  }, [cart, appliedVoucher, checkoutShipping.state]);

  const setShippingRegion = (region: ShippingRegion) => {
    setCheckoutShipping((prev) => {
      const currentRegion = getShippingRegionByState(prev.state);
      if (currentRegion === region) return prev;
      if (region === 'east') {
        return { ...prev, state: 'Sabah' };
      }
      const fallbackPeninsular =
        defaultAddr && getShippingRegionByState(defaultAddr.state) === 'peninsular'
          ? defaultAddr.state
          : 'Selangor';
      return { ...prev, state: fallbackPeninsular };
    });
  };

  const { membershipTier, nextTierPoints } = useMemo(() => {
    const tier =
      DEMO_MEMBERSHIP_TIERS.find((t) => points >= t.minPoints && points <= t.maxPoints) ||
      DEMO_MEMBERSHIP_TIERS[0];
    const idx = DEMO_MEMBERSHIP_TIERS.indexOf(tier);
    const nextTier = DEMO_MEMBERSHIP_TIERS[idx + 1];
    return {
      membershipTier: tier.name,
      nextTierPoints: nextTier ? Math.max(0, nextTier.minPoints - points) : null,
    };
  }, [points]);

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const login: AppContextValue['login'] = (email, password, rememberMe) => {
    const normalized = email.trim().toLowerCase();
    const matched = accounts.find(
      (a) => a.email.toLowerCase() === normalized && a.password === password
    );
    if (!matched) {
      return {
        ok: false,
        error:
          language === 'ms'
            ? 'Emel atau kata laluan tidak tepat. Sila semak maklumat anda dan cuba lagi.'
            : 'Incorrect email or password. Please verify your details and try again.',
      };
    }

    setSessionUserId(matched.id);
    if (rememberMe) {
      setRememberedEmail(matched.email);
      localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, matched.email);
    } else {
      setRememberedEmail('');
      localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL);
    }

    setCheckoutShipping((prev) => ({
      ...prev,
      fullName: matched.fullName,
      email: matched.email,
      phone: matched.phone,
    }));

    setHistory([]);
    setScreen('home');
    const firstName = matched.fullName.split(' ')[0];
    showToast(language === 'ms' ? `Selamat kembali, ${firstName}` : `Welcome back, ${firstName}`);
    return { ok: true };
  };

  const signUp: AppContextValue['signUp'] = ({ fullName, email, phone, password }) => {
    const normalized = email.trim().toLowerCase();
    if (accounts.some((a) => a.email.toLowerCase() === normalized)) {
      return {
        ok: false,
        error:
          language === 'ms'
            ? 'Akaun dengan emel ini sudah wujud. Sila log masuk.'
            : 'An account with this email already exists. Please log in instead.',
      };
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      fullName: fullName.trim(),
      email: normalized,
      phone: phone.trim(),
      password,
      skinPreference: 'Sensitive Skin',
    };

    setAccounts((prev) => [...prev, newUser]);
    setSessionUserId(newUser.id);
    setCheckoutShipping((prev) => ({
      ...prev,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
    }));
    setHistory([]);
    setScreen('home');
    showToast(
      language === 'ms' ? 'Akaun berjaya didaftarkan. Selamat datang ke OCZE+.' : 'Account created. Welcome to OCZE+.'
    );
    return { ok: true };
  };

  const updateProfile: AppContextValue['updateProfile'] = ({
    fullName,
    email,
    phone,
    skinPreference,
  }) => {
    if (!currentUser) return;
    const updated: UserAccount = {
      ...currentUser,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      skinPreference: skinPreference?.trim() || currentUser.skinPreference,
    };
    setAccounts((prev) => prev.map((a) => (a.id === currentUser.id ? updated : a)));
    showToast(language === 'ms' ? 'Maklumat profil dikemas kini' : 'Profile details updated');
  };

  const requestLogout = () => setLogoutModalOpen(true);
  const cancelLogout = () => setLogoutModalOpen(false);
  const confirmLogout = () => {
    setLogoutModalOpen(false);
    setSessionUserId(null);
    setHistory([]);
    setScreen('welcome');
    showToast(language === 'ms' ? 'Anda telah log keluar' : 'You have been logged out');
  };

  const addToCart = (productId: string, quantity = 1): boolean => {
    const product = getProductById(productId);
    if (!product || !product.priceConfirmed || product.sellingPrice === null) {
      showToast(
        language === 'ms'
          ? 'Harga belum disahkan. Tidak boleh ditambah ke troli lagi.'
          : 'Price to be confirmed. Cannot add to cart yet.'
      );
      return false;
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: Math.min(20, i.quantity + quantity) } : i
        );
      }
      return [...prev, { productId, quantity: Math.max(1, quantity) }];
    });
    showToast(
      language === 'ms'
        ? `${product.shortName} ditambah ke troli`
        : `Added ${product.shortName} to cart`
    );
    return true;
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.min(20, quantity) } : i))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
    showToast(language === 'ms' ? 'Item dibuang daripada troli' : 'Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedVoucherId(null);
  };

  const toggleWishlist = (productId: string) => {
    const product = getProductById(productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(
          language === 'ms'
            ? `${product?.shortName || 'Item'} dibuang daripada senarai hajat`
            : `Removed ${product?.shortName || 'item'} from wishlist`
        );
        return prev.filter((id) => id !== productId);
      }
      showToast(
        language === 'ms'
          ? `${product?.shortName || 'Item'} disimpan ke senarai hajat`
          : `Saved ${product?.shortName || 'item'} to wishlist`
      );
      return [...prev, productId];
    });
  };

  const placeDemoOrder = (): Order | null => {
    if (cartTotals.itemCount === 0) return null;

    const orderItems = cart
      .map((item) => {
        const product = getProductById(item.productId);
        if (!product || !product.priceConfirmed || product.sellingPrice === null) return null;
        return {
          productId: product.id,
          name: product.name,
          size: product.size,
          image: product.images[0],
          unitPrice: product.sellingPrice,
          quantity: item.quantity,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    if (orderItems.length === 0) return null;

    const pointsEarned = Math.round(cartTotals.subtotal);
    const orderNumber = generateDemoOrderNumber();
    const createdAt = formatNowLabel();

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt,
      status: 'Processing',
      items: orderItems,
      subtotal: cartTotals.subtotal,
      discount: cartTotals.discount,
      shippingFee: cartTotals.shippingFee,
      total: cartTotals.total,
      paymentMethod: selectedPaymentMethod,
      shipping: { ...checkoutShipping },
      includesGiftPouch: cartTotals.qualifiesForGiftPouch,
      pointsEarned,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLatestOrder(newOrder);
    setSelectedOrderId(newOrder.id);

    // Mark applied voucher used if discount > 0
    if (appliedVoucher && cartTotals.discount > 0) {
      setVouchers((prev) =>
        prev.map((v) => (v.id === appliedVoucher.id ? { ...v, used: true } : v))
      );
    }

    // Add points
    setPoints((prev) => prev + pointsEarned);
    setPointHistory((prev) => [
      {
        id: `pt-${Date.now()}`,
        title: `Order #${orderNumber}`,
        date: createdAt.split(',')[0],
        points: pointsEarned,
        type: 'earned',
      },
      ...prev,
    ]);

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Order ${orderNumber} Placed`,
        message: 'Your order is now being processed.',
        time: 'Just now',
        read: false,
        targetScreen: 'orders',
      },
      ...prev,
    ]);

    clearCart();
    setScreen('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    return newOrder;
  };

  const addOrUpdateAddress: AppContextValue['addOrUpdateAddress'] = (addr) => {
    setAddresses((prev) => {
      let next = prev;
      if (addr.isDefault) {
        next = next.map((a) => ({ ...a, isDefault: false }));
      }
      if (addr.id) {
        return next.map((a) => (a.id === addr.id ? { ...addr, id: addr.id } : a));
      }
      const newAddr: Address = {
        ...addr,
        id: `addr-${Date.now()}`,
        isDefault: addr.isDefault || prev.length === 0,
      };
      return [newAddr, ...next];
    });
    showToast(language === 'ms' ? 'Alamat disimpan' : 'Address saved');
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => {
      const remaining = prev.filter((a) => a.id !== id);
      if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
        remaining[0] = { ...remaining[0], isDefault: true };
      }
      return remaining;
    });
    showToast(language === 'ms' ? 'Alamat dipadam' : 'Address removed');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    showToast(language === 'ms' ? 'Alamat utama dikemas kini' : 'Default address updated');
  };

  const redeemVoucher: AppContextValue['redeemVoucher'] = (voucherId) => {
    const voucher = vouchers.find((v) => v.id === voucherId);
    if (!voucher) return { ok: false, message: language === 'ms' ? 'Baucar tidak dijumpai.' : 'Voucher not found.' };
    if (voucher.redeemed) return { ok: false, message: language === 'ms' ? 'Baucar telah ditebus.' : 'Voucher already redeemed.' };
    if (points < voucher.pointsCost) {
      return {
        ok: false,
        message:
          language === 'ms'
            ? `Perlukan ${voucher.pointsCost - points} mata lagi.`
            : `Need ${voucher.pointsCost - points} more points.`,
      };
    }

    setPoints((prev) => prev - voucher.pointsCost);
    setPointHistory((prev) => [
      {
        id: `pt-${Date.now()}`,
        title: `Redeemed ${voucher.code}`,
        date: formatNowLabel().split(',')[0],
        points: voucher.pointsCost,
        type: 'redeemed',
      },
      ...prev,
    ]);
    setVouchers((prev) =>
      prev.map((v) => (v.id === voucherId ? { ...v, redeemed: true } : v))
    );
    showToast(language === 'ms' ? `Baucar ${voucher.code} ditebus` : `Redeemed ${voucher.code}`);
    return { ok: true, message: language === 'ms' ? 'Baucar berjaya ditebus!' : 'Voucher redeemed!' };
  };

  const applyVoucherToCart: AppContextValue['applyVoucherToCart'] = (voucherId) => {
    if (!voucherId) {
      setAppliedVoucherId(null);
      showToast(language === 'ms' ? 'Baucar dibuang' : 'Voucher removed');
      return { ok: true, message: language === 'ms' ? 'Baucar dibuang' : 'Voucher removed' };
    }
    const v = vouchers.find((item) => item.id === voucherId && item.redeemed && !item.used);
    if (!v) return { ok: false, message: language === 'ms' ? 'Baucar tidak tersedia.' : 'Voucher unavailable.' };
    if (cartTotals.subtotal < v.minSpend) {
      return {
        ok: false,
        message:
          language === 'ms'
            ? `Belanja minimum RM${v.minSpend.toFixed(2)} diperlukan untuk ${v.code}.`
            : `Minimum spend of RM${v.minSpend.toFixed(2)} required for ${v.code}.`,
      };
    }
    setAppliedVoucherId(v.id);
    showToast(language === 'ms' ? `Baucar ${v.code} digunakan` : `Applied voucher ${v.code}`);
    return { ok: true, message: language === 'ms' ? 'Baucar digunakan!' : 'Voucher applied!' };
  };

  const addJournalEntry: AppContextValue['addJournalEntry'] = ({
    date,
    comfort,
    hydrationScore,
    productsUsed,
    notes,
  }) => {
    const newEntry: SkinJournalEntry = {
      id: `jr-${Date.now()}`,
      date,
      comfort,
      hydrationScore,
      productsUsed,
      notes: notes.trim(),
      createdAt: formatNowLabel(),
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
    showToast(language === 'ms' ? 'Rekod Jurnal Kulit disimpan' : 'Skin journal entry saved');
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((e) => e.id !== id));
    showToast(language === 'ms' ? 'Rekod jurnal dipadam' : 'Journal entry removed');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const value: AppContextValue = {
    screen,
    activeTab,
    selectedProductId,
    selectedOrderId,
    shopCategoryFilter,
    currentUser,
    rememberedEmail,
    accounts,
    cart,
    cartTotals,
    wishlist,
    orders,
    latestOrder,
    addresses,
    checkoutShipping,
    selectedPaymentMethod,
    points,
    membershipTier,
    nextTierPoints,
    pointHistory,
    vouchers,
    appliedVoucher,
    notifications,
    unreadNotificationsCount,
    journalEntries,
    logoutModalOpen,
    toastMessage,
    language,
    t,
    setLanguage,
    navigate,
    goBack,
    setShopCategoryFilter,
    login,
    signUp,
    updateProfile,
    requestLogout,
    cancelLogout,
    confirmLogout,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    setCheckoutShipping,
    setShippingRegion,
    setSelectedPaymentMethod,
    placeDemoOrder,
    addOrUpdateAddress,
    deleteAddress,
    setDefaultAddress,
    redeemVoucher,
    applyVoucherToCart,
    addJournalEntry,
    deleteJournalEntry,
    markNotificationRead,
    markAllNotificationsRead,
    showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
