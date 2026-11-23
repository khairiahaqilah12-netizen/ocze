export type AppLanguage = 'en' | 'ms';

export type AuthScreen =
  | 'splash'
  | 'welcome'
  | 'login'
  | 'signup'
  | 'forgot-password';

export type AppScreen =
  | AuthScreen
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'payment'
  | 'order-confirmation'
  | 'orders'
  | 'order-detail'
  | 'rewards'
  | 'profile'
  | 'edit-profile'
  | 'addresses'
  | 'wishlist'
  | 'help'
  | 'settings'
  | 'notifications'
  | 'skin-guide'
  | 'skin-journal';

export type MainTab = 'home' | 'shop' | 'rewards' | 'orders' | 'profile';

export type ProductCategory =
  | 'All'
  | 'Soothing Care'
  | 'Hydration'
  | 'Shower Gel'
  | 'Bundles';

export type SortOption =
  | 'featured'
  | 'price-low'
  | 'price-high'
  | 'name-az';

export interface ProductIngredient {
  name: string;
  subtitle?: string;
  benefits: string[];
}

export interface Product {
  id: string;
  name: string;
  shortName: string;
  size: string;
  category: Exclude<ProductCategory, 'All'>;
  tagline: string;
  originalPrice: number | null;
  sellingPrice: number | null;
  priceConfirmed: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isBundle?: boolean;
  images: string[];
  description: string;
  highlights: string[];
  benefits: string[];
  ingredientsNote?: string;
  ingredients: ProductIngredient[];
  howToUse: string[];
  includedProductIds?: string[];
  promotionalGiftNote?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  skinPreference?: string;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered';

export type PaymentMethod = 'Online Banking' | 'Debit/Credit Card' | 'E-Wallet';

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  image: string;
  unitPrice: number;
  quantity: number;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  shipping: ShippingDetails;
  includesGiftPouch: boolean;
  pointsEarned: number;
}

export interface PointTransaction {
  id: string;
  title: string;
  date: string;
  points: number;
  type: 'earned' | 'redeemed';
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discountAmount: number;
  minSpend: number;
  pointsCost: number;
  expiryDate: string;
  redeemed: boolean;
  used: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  targetScreen?: AppScreen;
  targetProductId?: string;
}

export type SkinComfortLevel =
  | 'Calm'
  | 'Mild Dryness'
  | 'Itchy / Flare-Up'
  | 'Recovering';

export interface SkinJournalEntry {
  id: string;
  date: string;
  comfort: SkinComfortLevel;
  hydrationScore: number;
  productsUsed: string[];
  notes: string;
  createdAt: string;
}
