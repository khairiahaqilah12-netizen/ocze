import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Copy,
  Headphones,
  Mail,
  MessageSquarePlus,
  Package,
  Search,
  Send,
  ShieldCheck,
  Truck,
  X,
} from 'lucide-react';
import { TopHeader } from '../../components/layout/TopHeader';
import { useApp } from '../../context/AppContext';
import { AppScreen } from '../../types';

type FaqCategory = 'all' | 'products' | 'shipping' | 'orders' | 'safety';

interface FaqItem {
  id: string;
  category: Exclude<FaqCategory, 'all'>;
  q: string;
  a: string;
  actionLabel?: string;
  actionScreen?: AppScreen;
}

interface SupportTicket {
  id: string;
  topic: string;
  orderNumber?: string;
  message: string;
  createdAt: string;
  status: 'Received';
}

const TICKETS_STORAGE_KEY = 'ocze_support_tickets_v1';

export const HelpCenterScreen: React.FC = () => {
  const { language, currentUser, orders, navigate, showToast } = useApp();
  const isMs = language === 'ms';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-shipping');

  // Support Inquiry Form State
  const [topic, setTopic] = useState<string>('shipping');
  const [orderRef, setOrderRef] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const raw = localStorage.getItem(TICKETS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SupportTicket[]) : [];
    } catch {
      return [];
    }
  });

  const categories: { id: FaqCategory; label: string }[] = isMs
    ? [
        { id: 'all', label: 'Semua' },
        { id: 'products', label: 'Produk & Kulit' },
        { id: 'shipping', label: 'Penghantaran' },
        { id: 'orders', label: 'Pesanan & Bayaran' },
        { id: 'safety', label: 'Keselamatan & SGS' },
      ]
    : [
        { id: 'all', label: 'All' },
        { id: 'products', label: 'Products & Skin' },
        { id: 'shipping', label: 'Shipping' },
        { id: 'orders', label: 'Orders & Payment' },
        { id: 'safety', label: 'Safety & SGS' },
      ];

  const faqs: FaqItem[] = useMemo(
    () =>
      isMs
        ? [
            {
              id: 'faq-shipping',
              category: 'shipping',
              q: 'Berapakah caj penghantaran untuk Semenanjung serta Sabah & Sarawak?',
              a: 'Caj penghantaran standard ialah RM8.00 untuk Semenanjung Malaysia dan RM10.00 untuk Sabah & Sarawak. Pesanan RM100.00 ke atas layak menerima penghantaran percuma secara automatik.',
            },
            {
              id: 'faq-delivery-time',
              category: 'shipping',
              q: 'Berapa lama tempoh penghantaran pesanan saya?',
              a: 'Pesanan diproses dalam 1 hari bekerja. Anggaran penghantaran ialah 1–3 hari bekerja untuk Semenanjung Malaysia dan 3–5 hari bekerja untuk Sabah & Sarawak.',
            },
            {
              id: 'faq-sensitive-skin',
              category: 'products',
              q: 'Adakah produk OCZE+ sesuai untuk kulit sensitif, ekzema, dan kanak-kanak?',
              a: 'Ya. Semua produk OCZE+ dirumus lembut tanpa steroid, tanpa paraben, dan tanpa pewangi tiruan serta diuji secara dermatologi untuk kulit sensitif dan kering.',
              actionLabel: 'Buka Panduan Kulit',
              actionScreen: 'skin-guide',
            },
            {
              id: 'faq-sets',
              category: 'products',
              q: 'Apakah beza Set Lengkap (RM159) dan Twin Care (RM69)?',
              a: 'OCZE+ Complete Set (RM159.00, NP RM257.00) mengandungi CalmSkin Shower Therapy 160ml, Soothing Cream 60ml & Ultra Hydrating Moisturiser 60ml. Twin Care (2 × 30ml, RM69.00) pula ialah set percubaan 2 langkah untuk kegunaan harian atau travel.',
            },
            {
              id: 'faq-gift-pouch',
              category: 'products',
              q: 'Bagaimana untuk layak menerima OCZE+ Gift Pouch percuma?',
              a: 'Pesanan yang mengandungi 2 item atau lebih akan membuka OCZE+ Gift Pouch secara percuma di dalam Troli Belian anda (tidak dijual secara berasingan).',
            },
            {
              id: 'faq-payment',
              category: 'orders',
              q: 'Apakah kaedah pembayaran yang diterima?',
              a: 'Kami menyokong Perbankan Dalam Talian (FPX), Kad Debit/Kredit (Visa & Mastercard), serta E-Dompet (Touch ’n Go, GrabPay & Boost).',
            },
            {
              id: 'faq-points',
              category: 'orders',
              q: 'Bagaimana cara mengumpul dan menebus Mata OCZE+?',
              a: 'Anda menerima 1 Mata OCZE+ bagi setiap RM1 yang dibelanjakan. Mata boleh ditebus menjadi baucar diskaun di halaman Ganjaran.',
              actionLabel: 'Lihat Ganjaran',
              actionScreen: 'rewards',
            },
            {
              id: 'faq-sgs',
              category: 'safety',
              q: 'Apakah bukti ujian keselamatan makmal dan pengiktirafan OCZE+?',
              a: 'OCZE+ Soothing Cream telah menjalani ujian tampalan dermatologi bebas oleh SGS (No. Laporan GZCPCH26005855-01_EN) ke atas 33 subjek dengan skor 0 iritasi pada bacaan 0.5j, 24j & 48j. Produk juga berdaftar notifikasi KKM, diperakui Halal, serta memenangi anugerah CRI 2026 & MPI 2025.',
            },
          ]
        : [
            {
              id: 'faq-shipping',
              category: 'shipping',
              q: 'What are the shipping rates for Peninsular Malaysia and Sabah & Sarawak?',
              a: 'Standard shipping is RM8.00 for Peninsular Malaysia (Semenanjung) and RM10.00 for Sabah & Sarawak. Orders of RM100.00 and above automatically enjoy free shipping.',
            },
            {
              id: 'faq-delivery-time',
              category: 'shipping',
              q: 'How long will delivery take?',
              a: 'Orders are packed within 1 working day. Estimated delivery is 1–3 working days for Peninsular Malaysia and 3–5 working days for Sabah & Sarawak.',
            },
            {
              id: 'faq-sensitive-skin',
              category: 'products',
              q: 'Are OCZE+ products safe for sensitive, eczema-prone skin and kids?',
              a: 'Yes. All OCZE+ formulas are steroid-free, paraben-free, and fragrance-free, and are dermatologically evaluated for sensitive and dry skin comfort.',
              actionLabel: 'Open Skin Guide',
              actionScreen: 'skin-guide',
            },
            {
              id: 'faq-sets',
              category: 'products',
              q: 'What is included in Complete Set (RM159) vs Twin Care (RM69)?',
              a: 'OCZE+ Complete Set (RM159.00, NP RM257.00) includes full-sized CalmSkin Shower Therapy 160ml, Soothing Cream 60ml & Ultra Hydrating Moisturiser 60ml. Twin Care (2 × 30ml, RM69.00) is our 2-step starter duo.',
            },
            {
              id: 'faq-gift-pouch',
              category: 'products',
              q: 'How do I receive the complimentary OCZE+ Gift Pouch?',
              a: 'Orders containing 2 or more items automatically unlock the complimentary OCZE+ Gift Pouch in your Shopping Cart (not sold separately).',
            },
            {
              id: 'faq-payment',
              category: 'orders',
              q: 'Which payment methods are accepted?',
              a: 'We support Online Banking (FPX), Debit/Credit Cards (Visa & Mastercard), and E-Wallets (Touch ’n Go, GrabPay & Boost).',
            },
            {
              id: 'faq-points',
              category: 'orders',
              q: 'How do OCZE+ Points and vouchers work?',
              a: 'You earn 1 OCZE+ Point for every RM1 spent. Redeem points for discount vouchers in the Rewards tab and apply them in your Cart.',
              actionLabel: 'View Rewards',
              actionScreen: 'rewards',
            },
            {
              id: 'faq-sgs',
              category: 'safety',
              q: 'What lab safety tests and awards does OCZE+ hold?',
              a: 'OCZE+ Soothing Cream completed independent SGS Dermatology Patch Testing (Report GZCPCH26005855-01_EN) across 33 subjects with 0 irritation at 0.5h, 24h & 48h. OCZE+ is also KKM cosmetic notified, Halal certified, and an award winner at CRI 2026 & MPI 2025.',
            },
          ],
    [isMs]
  );

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return faqs.filter((item) => {
      const catMatch = selectedCategory === 'all' || item.category === selectedCategory;
      if (!catMatch) return false;
      if (!q) return true;
      return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
    });
  }, [faqs, searchQuery, selectedCategory]);

  const topicOptions = isMs
    ? [
        { value: 'shipping', label: 'Penghantaran & Kos Pos' },
        { value: 'order', label: 'Status Pesanan' },
        { value: 'product', label: 'Nasihat Produk & Kulit' },
        { value: 'other', label: 'Lain-lain Pertanyaan' },
      ]
    : [
        { value: 'shipping', label: 'Shipping & Delivery' },
        { value: 'order', label: 'Order Status' },
        { value: 'product', label: 'Product & Skin Advice' },
        { value: 'other', label: 'General Inquiry' },
      ];

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback silent if clipboard restricted in iframe
    }
    showToast(isMs ? `${label} disalin` : `${label} copied`);
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (message.trim().length < 8) {
      setFormError(
        isMs
          ? 'Sila terangkan pertanyaan anda (sekurang-kurangnya 8 aksara).'
          : 'Please describe your question (at least 8 characters).'
      );
      return;
    }

    const topicLabel = topicOptions.find((opt) => opt.value === topic)?.label || topic;
    const refId = `SUP-${Math.floor(1000 + Math.random() * 8999)}`;
    const nowLabel = new Date().toLocaleDateString(isMs ? 'ms-MY' : 'en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const newTicket: SupportTicket = {
      id: refId,
      topic: topicLabel,
      orderNumber: orderRef || undefined,
      message: message.trim(),
      createdAt: nowLabel,
      status: 'Received',
    };

    const next = [newTicket, ...tickets].slice(0, 10);
    setTickets(next);
    try {
      localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota error
    }

    setMessage('');
    setOrderRef('');
    showToast(
      isMs
        ? `Pertanyaan dihantar (${refId}). Pasukan kami akan membalas tidak lama lagi.`
        : `Inquiry submitted (${refId}). Our team will respond shortly.`
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8FD] pb-24">
      <TopHeader
        title={isMs ? 'Pusat Bantuan' : 'Help Center'}
        showBack
        showCart={false}
      />

      <main className="px-4 pt-4 space-y-4">
        {/* Hero Search Card */}
        <section className="rounded-3xl bg-gradient-to-br from-[#EFE8FA] via-[#FAF7FE] to-[#F7EAF1] border border-[#E5D9F4] p-5 space-y-3.5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E5D9F4] flex items-center justify-center text-[#5B4B8A] shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-[19px] font-bold text-[#221E2C] leading-snug">
                {isMs ? 'Bagaimana kami boleh bantu anda?' : 'How can we help you today?'}
              </h1>
              <p className="text-[12px] text-[#635B73] mt-0.5">
                {isMs
                  ? 'Cari jawapan pantas atau hubungi pasukan Khidmat Pelanggan OCZE+.'
                  : 'Find quick answers or reach out to OCZE+ Customer Care.'}
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-[#7B7487] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isMs
                  ? 'Cari soalan (cth. Sabah, SGS, ekzema, pesanan)...'
                  : 'Search questions (e.g. Sabah, SGS, eczema, order)...'
              }
              className="w-full min-h-[44px] pl-10 pr-9 rounded-xl border border-[#DDD3EE] bg-white text-[13px] text-[#221E2C] placeholder:text-[#8E869E] focus:border-[#7C69AE] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full hover:bg-[#F2ECF9] flex items-center justify-center text-[#7B7487] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </section>

        {/* Quick Shortcuts */}
        <section className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => navigate('orders')}
            className="rounded-2xl bg-white border border-[#E9E1F3] hover:border-[#A092C5] p-3 flex flex-col items-center text-center gap-1.5 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#F6F2FB] flex items-center justify-center text-[#5B4B8A]">
              <Package className="w-4 h-4" />
            </div>
            <span className="text-[12px] font-semibold text-[#221E2C] leading-tight">
              {isMs ? 'Jejak Pesanan' : 'Track Orders'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('skin-guide')}
            className="rounded-2xl bg-white border border-[#E9E1F3] hover:border-[#A092C5] p-3 flex flex-col items-center text-center gap-1.5 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#F6F2FB] flex items-center justify-center text-[#5B4B8A]">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-[12px] font-semibold text-[#221E2C] leading-tight">
              {isMs ? 'Panduan Kulit' : 'Skin Guide'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('rewards')}
            className="rounded-2xl bg-white border border-[#E9E1F3] hover:border-[#A092C5] p-3 flex flex-col items-center text-center gap-1.5 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#F6F2FB] flex items-center justify-center text-[#5B4B8A]">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-[12px] font-semibold text-[#221E2C] leading-tight">
              {isMs ? 'Baucar & Mata' : 'Vouchers'}
            </span>
          </button>
        </section>

        {/* Shipping Rate Quick Reference */}
        <section className="rounded-2xl bg-white border border-[#E9E1F3] p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#F6F2FB] flex items-center justify-center text-[#6D5D9B] shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-[#221E2C]">
                {isMs ? 'Kadar Pos Malaysia' : 'Malaysia Shipping Rates'}
              </p>
              <p className="text-[12px] text-[#635B73]">
                {isMs
                  ? 'Semenanjung RM8 · Sabah & Sarawak RM10 · Percuma RM100+'
                  : 'Peninsular RM8 · Sabah & Sarawak RM10 · Free RM100+'}
              </p>
            </div>
          </div>
        </section>

        {/* Topic Filter & Expandable FAQs */}
        <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-[17px] font-bold text-[#221E2C]">
              {isMs ? 'Soalan Lazim (FAQ)' : 'Frequently Asked Questions'}
            </h2>
            <span className="text-[11px] font-semibold text-[#6D5D9B] tabular-nums">
              {filteredFaqs.length} {isMs ? 'topik' : 'topics'}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#7C69AE] border-[#7C69AE] text-white'
                      : 'bg-[#FAF8FD] border-[#E9E1F3] text-[#635B73] hover:text-[#221E2C]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl bg-[#FAF8FD] border border-[#EFE8F9] p-5 text-center space-y-2">
              <p className="text-[14px] font-semibold text-[#221E2C]">
                {isMs ? 'Tiada jawapan sepadan ditemui' : 'No matching questions found'}
              </p>
              <p className="text-[12px] text-[#635B73]">
                {isMs
                  ? 'Cuba kata kunci lain atau hantar pertanyaan anda di borang di bawah.'
                  : 'Try another keyword or submit your question using the form below.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F2ECF9]">
              {filteredFaqs.map((item) => {
                const isOpen = openFaqId === item.id;
                return (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      className="w-full flex items-start justify-between gap-3 text-left py-1 cursor-pointer"
                    >
                      <span className="font-display text-[14px] font-semibold text-[#221E2C] leading-snug">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#6D5D9B] shrink-0 mt-0.5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-2 space-y-2.5 pr-1">
                        <p className="text-[13px] text-[#635B73] leading-relaxed">
                          {item.a}
                        </p>
                        {item.actionLabel && item.actionScreen && (
                          <button
                            type="button"
                            onClick={() => navigate(item.actionScreen!)}
                            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#5B4B8A] bg-[#F6F2FB] hover:bg-[#E9E1F3] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <span>{item.actionLabel}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Direct Customer Care Contact Info */}
        <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5 space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-[17px] font-bold text-[#221E2C]">
                {isMs ? 'Hubungi Khidmat Pelanggan' : 'Contact Customer Care'}
              </h2>
              <p className="text-[12px] text-[#635B73] mt-0.5">
                {isMs
                  ? 'Isnin – Jumaat · 9:00 PG – 6:00 PTG (MYT)'
                  : 'Mon – Fri · 9:00 AM – 6:00 PM (MYT)'}
              </p>
            </div>
            <ShieldCheck className="w-5 h-5 text-[#6D5D9B] shrink-0" />
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            <button
              type="button"
              onClick={() => handleCopy('care@oczeplus.demo', isMs ? 'Emel sokongan' : 'Support email')}
              className="w-full rounded-2xl bg-[#FAF8FD] hover:bg-[#F3EEF9] border border-[#E9E1F3] px-3.5 py-3 flex items-center justify-between gap-2 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Mail className="w-4 h-4 text-[#6D5D9B] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-[#635B73]">
                    {isMs ? 'Emel Sokongan' : 'Support Email'}
                  </p>
                  <p className="text-[13px] font-semibold text-[#221E2C] truncate">
                    care@oczeplus.demo
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5B4B8A] shrink-0">
                <Copy className="w-3.5 h-3.5" />
                <span>{isMs ? 'Salin' : 'Copy'}</span>
              </span>
            </button>
          </div>
        </section>

        {/* Submit Support Inquiry Form */}
        <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5 space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="w-4 h-4 text-[#6D5D9B]" />
            <h2 className="font-display text-[17px] font-bold text-[#221E2C]">
              {isMs ? 'Hantar Pertanyaan' : 'Send an Inquiry'}
            </h2>
          </div>

          <form onSubmit={handleSubmitTicket} className="space-y-3">
            {currentUser && (
              <p className="text-[12px] text-[#635B73]">
                {isMs ? 'Menghantar sebagai:' : 'Submitting as:'}{' '}
                <span className="font-semibold text-[#221E2C]">
                  {currentUser.fullName} ({currentUser.email})
                </span>
              </p>
            )}

            <div>
              <label
                htmlFor="help-topic"
                className="block text-[12px] font-medium text-[#221E2C] mb-1"
              >
                {isMs ? 'Topik Pertanyaan' : 'Topic'}
              </label>
              <select
                id="help-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] text-[13px] text-[#221E2C] focus:border-[#7C69AE] focus:outline-none cursor-pointer"
              >
                {topicOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {orders.length > 0 && (
              <div>
                <label
                  htmlFor="help-order"
                  className="block text-[12px] font-medium text-[#221E2C] mb-1"
                >
                  {isMs ? 'Nombor Pesanan (Pilihan)' : 'Order Number (Optional)'}
                </label>
                <select
                  id="help-order"
                  value={orderRef}
                  onChange={(e) => setOrderRef(e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] text-[13px] text-[#221E2C] focus:border-[#7C69AE] focus:outline-none cursor-pointer"
                >
                  <option value="">
                    {isMs ? 'Tiada / Pertanyaan Umum' : 'None / General Question'}
                  </option>
                  {orders.map((ord) => (
                    <option key={ord.id} value={ord.orderNumber}>
                      #{ord.orderNumber} — {ord.createdAt.split(',')[0]}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label
                htmlFor="help-message"
                className="block text-[12px] font-medium text-[#221E2C] mb-1"
              >
                {isMs ? 'Mesej Anda' : 'Your Message'}
              </label>
              <textarea
                id="help-message"
                rows={3}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder={
                  isMs
                    ? 'Tulis soalan berkaitan produk, penghantaran atau pesanan anda...'
                    : 'Write your question about products, shipping, or your order...'
                }
                className="w-full p-3 rounded-xl border border-[#DDD3EE] bg-[#FAF8FD] focus:bg-white text-[13px] text-[#221E2C] focus:border-[#7C69AE] focus:outline-none resize-none"
              />
              {formError && <p className="mt-1 text-[12px] text-[#8E355B]">{formError}</p>}
            </div>

            <button
              type="submit"
              className="w-full min-h-[46px] px-5 py-2.5 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] active:scale-[0.99] text-white text-[14px] font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isMs ? 'Hantar Pertanyaan' : 'Submit Inquiry'}</span>
            </button>
          </form>

          {tickets.length > 0 && (
            <div className="pt-4 border-t border-[#F2ECF9] space-y-2.5">
              <p className="text-[12px] font-semibold text-[#5B4B8A]">
                {isMs ? 'Pertanyaan Dihantar' : 'Submitted Inquiries'}
              </p>
              <div className="space-y-2">
                {tickets.map((tk) => (
                  <div
                    key={tk.id}
                    className="rounded-2xl bg-[#FAF8FD] border border-[#E9E1F3] p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12px] font-bold text-[#221E2C] tabular-nums">
                        {tk.id} · {tk.topic}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3C7B5C]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isMs ? 'Diterima' : 'Received'}</span>
                      </span>
                    </div>
                    {tk.orderNumber && (
                      <p className="text-[11px] text-[#6D5D9B] font-medium tabular-nums">
                        {isMs ? 'Pesanan:' : 'Order:'} #{tk.orderNumber}
                      </p>
                    )}
                    <p className="text-[12px] text-[#635B73] leading-relaxed">{tk.message}</p>
                    <p className="text-[11px] text-[#8C849A]">{tk.createdAt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
