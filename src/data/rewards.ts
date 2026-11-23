import { AppNotification, Order, PointTransaction, Voucher } from '../types';

export const DEMO_MEMBERSHIP_TIERS = [
  { name: 'Lavender Member', minPoints: 0, maxPoints: 499 },
  { name: 'Velvet Care', minPoints: 500, maxPoints: 1499 },
  { name: 'Botanical Privilege', minPoints: 1500, maxPoints: 99999 },
];

export const INITIAL_POINTS = 320;

export const INITIAL_POINT_HISTORY: PointTransaction[] = [
  {
    id: 'pt-1',
    title: 'Welcome Member Bonus',
    date: '12 Nov 2026',
    points: 150,
    type: 'earned',
  },
  {
    id: 'pt-2',
    title: 'Order #OCZ-2026-1041',
    date: '16 Nov 2026',
    points: 118,
    type: 'earned',
  },
  {
    id: 'pt-3',
    title: 'Skin Profile Completed',
    date: '18 Nov 2026',
    points: 52,
    type: 'earned',
  },
];

export const INITIAL_VOUCHERS: Voucher[] = [
  {
    id: 'v-welcome5',
    code: 'OCZE5',
    title: 'RM5.00 Off Skincare Order',
    description: 'Applicable on orders of RM50.00 or more.',
    discountAmount: 5.0,
    minSpend: 50.0,
    pointsCost: 0,
    expiryDate: '31 Dec 2026',
    redeemed: true,
    used: false,
  },
  {
    id: 'v-care10',
    code: 'GENTLE10',
    title: 'RM10.00 Care Reward',
    description: 'Redeem with 200 points for RM10.00 off orders RM100.00+.',
    discountAmount: 10.0,
    minSpend: 100.0,
    pointsCost: 200,
    expiryDate: '31 Dec 2026',
    redeemed: false,
    used: false,
  },
  {
    id: 'v-hydrate15',
    code: 'HYDRATE15',
    title: 'RM15.00 Privilege Voucher',
    description: 'Redeem with 350 points for RM15.00 off orders RM118.00+.',
    discountAmount: 15.0,
    minSpend: 118.0,
    pointsCost: 350,
    expiryDate: '31 Dec 2026',
    redeemed: false,
    used: false,
  },
];

export const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-demo-1041',
    orderNumber: 'OCZ-2026-1041',
    createdAt: '16 Nov 2026, 2:15 PM',
    status: 'Delivered',
    items: [
      {
        productId: 'soothing-cream',
        name: 'OCZE+ Soothing Cream',
        size: '60ml',
        image: '/assets/products/soothing-cream.png',
        unitPrice: 59.0,
        quantity: 1,
      },
      {
        productId: 'ultra-hydrating-moisturiser',
        name: 'OCZE+ Ultra Hydrating Moisturiser',
        size: '60ml',
        image: '/assets/products/hydrating-moisturiser.png',
        unitPrice: 59.0,
        quantity: 1,
      },
    ],
    subtotal: 118.0,
    discount: 0,
    shippingFee: 0,
    total: 118.0,
    paymentMethod: 'Online Banking',
    shipping: {
      fullName: 'Aisyah Rahman',
      email: 'aisyah@ocze.demo',
      phone: '+60 12-345 6789',
      line1: 'No. 18, Jalan Anggun 4',
      line2: 'Taman Seri Melati',
      postcode: '40150',
      city: 'Shah Alam',
      state: 'Selangor',
      country: 'Malaysia',
    },
    includesGiftPouch: true,
    pointsEarned: 118,
  },
  {
    id: 'ord-demo-1089',
    orderNumber: 'OCZ-2026-1089',
    createdAt: '20 Nov 2026, 10:40 AM',
    status: 'Shipped',
    items: [
      {
        productId: 'soothing-cream',
        name: 'OCZE+ Soothing Cream',
        size: '60ml',
        image: '/assets/products/soothing-cream.png',
        unitPrice: 59.0,
        quantity: 1,
      },
    ],
    subtotal: 59.0,
    discount: 0,
    shippingFee: 8.0,
    total: 67.0,
    paymentMethod: 'E-Wallet',
    shipping: {
      fullName: 'Aisyah Rahman',
      email: 'aisyah@ocze.demo',
      phone: '+60 12-345 6789',
      line1: 'No. 18, Jalan Anggun 4',
      line2: 'Taman Seri Melati',
      postcode: '40150',
      city: 'Shah Alam',
      state: 'Selangor',
      country: 'Malaysia',
    },
    includesGiftPouch: false,
    pointsEarned: 59,
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Complimentary OCZE+ Gift Pouch',
    message: 'Add any 2 confirmed skincare tubes to receive a complimentary OCZE+ Gift Pouch.',
    time: 'Today',
    read: false,
    targetScreen: 'shop',
  },
  {
    id: 'notif-2',
    title: 'Order OCZ-2026-1089 Shipped',
    message: 'Your OCZE+ Soothing Cream parcel is on the way.',
    time: '2 days ago',
    read: false,
    targetScreen: 'orders',
  },
  {
    id: 'notif-3',
    title: 'Special Launch Price: RM59.00',
    message: 'Soothing Cream and Ultra Hydrating Moisturiser are available at RM59.00 (NP RM79.00).',
    time: '4 days ago',
    read: true,
    targetScreen: 'product-detail',
    targetProductId: 'soothing-cream',
  },
];
