import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Gift,
  Heart,
  HelpCircle,
  NotebookPen,
  Plus,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import { TopHeader } from '../../components/layout/TopHeader';
import {
  BOTANICAL_DUO_BANNER_IMAGE,
  CERTIFICATES_BANNER_IMAGE,
  GIFT_POUCH_PROMO,
  HERO_BANNER_IMAGE,
  SGS_DERMATOLOGY_IMAGE,
  getProductById,
} from '../../data/products';
import { useApp } from '../../context/AppContext';
import { ProductCategory } from '../../types';
import { formatRM } from '../../utils/format';

const CATEGORY_KEYS: Exclude<ProductCategory, 'All'>[] = [
  'Soothing Care',
  'Hydration',
  'Shower Gel',
  'Bundles',
];

export const HomeScreen: React.FC = () => {
  const {
    navigate,
    points,
    membershipTier,
    addToCart,
    wishlist,
    toggleWishlist,
    journalEntries,
    t,
  } = useApp();

  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTrustModal, setActiveTrustModal] = useState<'sgs' | 'award' | null>(null);
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const heroSlides = [
    {
      id: 'hero-range',
      image: HERO_BANNER_IMAGE,
      alt: 'OCZE+ Soothing Cream, Ultra Hydrating Moisturiser, and CalmSkin Shower Therapy',
      badge: t.home.badge,
      title: t.home.heroTitle,
      desc: t.home.heroDesc,
      ctaLabel: t.home.shopNow,
      isContain: false,
      onCtaClick: () => navigate('shop', { category: 'All' }),
    },
    {
      id: 'hero-sgs',
      image: SGS_DERMATOLOGY_IMAGE,
      alt: 'OCZE+ SGS Dermatology Test — Clinically evaluated for skin irritation, suitable for sensitive skin',
      badge: t.home.heroSlides.sgsBadge,
      title: t.home.heroSlides.sgsTitle,
      desc: t.home.heroSlides.sgsDesc,
      ctaLabel: t.home.heroSlides.sgsCta,
      isContain: true,
      onCtaClick: () => setActiveTrustModal('sgs'),
    },
    {
      id: 'hero-awards',
      image: CERTIFICATES_BANNER_IMAGE,
      alt: 'OCZE+ Award-Winning Innovation — CRI 2026 Best of the Best, Gold Award, Best Cluster & MPI 2025',
      badge: t.home.heroSlides.awardsBadge,
      title: t.home.heroSlides.awardsTitle,
      desc: t.home.heroSlides.awardsDesc,
      ctaLabel: t.home.heroSlides.awardsCta,
      isContain: false,
      onCtaClick: () => setActiveTrustModal('award'),
    },
    {
      id: 'hero-duo',
      image: BOTANICAL_DUO_BANNER_IMAGE,
      alt: 'OCZE+ Soothing Cream & Ultra Hydrating Moisturiser botanical duo',
      badge: t.home.heroSlides.duoBadge,
      title: t.home.heroSlides.duoTitle,
      desc: t.home.heroSlides.duoDesc,
      ctaLabel: t.home.heroSlides.duoCta,
      isContain: false,
      onCtaClick: () => navigate('shop', { category: 'Bundles' }),
    },
  ];

  useEffect(() => {
    if (isAutoPaused || activeTrustModal !== null) return;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [isAutoPaused, activeTrustModal, heroSlides.length]);

  const goPrevSlide = () => {
    setIsAutoPaused(true);
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goNextSlide = () => {
    setIsAutoPaused(true);
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 40) {
      if (delta < 0) goNextSlide();
      else goPrevSlide();
    }
  };

  const currentSlide = heroSlides[activeSlide];

  const dailyEssentials = [
    getProductById('soothing-cream'),
    getProductById('ultra-hydrating-moisturiser'),
    getProductById('calmskin-shower-therapy'),
  ].filter((p): p is NonNullable<typeof p> => Boolean(p));

  const valueSets = [
    {
      product: getProductById('complete-set'),
      badge: t.home.completeBadge,
      shortDesc: t.home.completeDesc,
    },
    {
      product: getProductById('twin-care'),
      badge: t.home.twinBadge,
      shortDesc: t.home.twinDesc,
    },
  ].filter((item): item is { product: NonNullable<typeof item.product>; badge: string; shortDesc: string } =>
    Boolean(item.product)
  );

  const latestJournal = journalEntries[0];

  return (
    <div className="min-h-screen bg-[#FAF8FD] pb-24">
      <TopHeader showBrandLogo showNotifications showCart />

      <main className="px-4 pt-4 space-y-6">
        {/* 1. Interactive Hero Carousel (3 Slides incl. Certificates & Winning Awards) */}
        <section className="bg-[#E9E1F3] rounded-3xl overflow-hidden border border-[#DDD3EE]">
          <div
            className="relative aspect-video w-full overflow-hidden bg-[#DDD3EE]/40"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex w-full h-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {heroSlides.map((slide) => {
                const isInteractiveSlide = slide.id === 'hero-awards' || slide.id === 'hero-sgs';
                const handleSlideClick =
                  slide.id === 'hero-awards'
                    ? () => setActiveTrustModal('award')
                    : slide.id === 'hero-sgs'
                    ? () => setActiveTrustModal('sgs')
                    : undefined;
                return (
                  <div
                    key={slide.id}
                    onClick={handleSlideClick}
                    className={`w-full h-full shrink-0 ${
                      slide.isContain ? 'bg-[#F8EDFA]' : ''
                    } ${isInteractiveSlide ? 'cursor-pointer' : ''}`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full ${
                        slide.isContain ? 'object-contain' : 'object-cover object-center'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Prev / Next Controls */}
            <button
              type="button"
              onClick={goPrevSlide}
              aria-label="Previous slide"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-[#4F407A] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={goNextSlide}
              aria-label="Next slide"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-[#4F407A] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/85 backdrop-blur-xs px-2.5 py-1 rounded-full">
              {heroSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => {
                    setIsAutoPaused(true);
                    setActiveSlide(idx);
                  }}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeSlide === idx ? 'w-5 bg-[#7C69AE]' : 'w-1.5 bg-[#C5B8DD]'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-5 text-center flex flex-col items-center">
            <p className="text-[12px] font-semibold tracking-wide text-[#5B4B8A]">
              {currentSlide.badge}
            </p>
            <h1 className="mt-1.5 font-display text-[24px] font-bold text-[#221E2C] leading-tight text-balance">
              {currentSlide.title}
            </h1>
            <p className="mt-2 text-[13px] text-[#4B445A] leading-relaxed max-w-xs">
              {currentSlide.desc}
            </p>
            <div className="mt-4 w-full">
              <button
                type="button"
                onClick={currentSlide.onCtaClick}
                className="w-full min-h-[46px] px-6 py-2.5 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] active:scale-[0.98] text-white text-[15px] font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>{currentSlide.ctaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* 1.5 Separated Trust Cards: SGS Lab Tested vs Award-Winning */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-[17px] font-bold text-[#221E2C]">
              {t.home.trustTitle}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setActiveTrustModal('sgs')}
              className="text-left rounded-2xl bg-white border border-[#E9E1F3] hover:border-[#A092C5] p-3.5 flex flex-col justify-between transition-colors cursor-pointer"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#F6F2FB] border border-[#E4D9F4] flex items-center justify-center text-[#5B4B8A]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="mt-2.5 font-display text-[14px] font-bold text-[#221E2C]">
                  {t.home.sgsTitle}
                </h3>
                <p className="mt-0.5 text-[11px] text-[#635B73] leading-snug">
                  {t.home.sgsDesc}
                </p>
              </div>
              <span className="mt-2.5 inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#5B4B8A]">
                <span>{t.home.sgsAction}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTrustModal('award')}
              className="text-left rounded-2xl bg-white border border-[#E9E1F3] hover:border-[#D5B570] p-3.5 flex flex-col justify-between transition-colors cursor-pointer"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#FBF3E2] border border-[#EED9AE] flex items-center justify-center text-[#8B651D]">
                  <Trophy className="w-4 h-4" />
                </div>
                <h3 className="mt-2.5 font-display text-[14px] font-bold text-[#221E2C]">
                  {t.home.awardTitle}
                </h3>
                <p className="mt-0.5 text-[11px] text-[#635B73] leading-snug">
                  {t.home.awardDesc}
                </p>
              </div>
              <span className="mt-2.5 inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#8B651D]">
                <span>{t.home.awardAction}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setActiveTrustModal('sgs')}
            className="w-full rounded-xl bg-[#F6F2FB]/80 hover:bg-[#EFE8F9] border border-[#E9E1F3] px-3 py-2 flex items-center justify-center gap-2 text-[11px] font-medium text-[#5B4B8A] flex-wrap text-center transition-colors cursor-pointer"
          >
            <span>{t.home.kkmLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{t.home.halalLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{t.home.steroidFreeLabel}</span>
          </button>
        </section>

        {/* 2. Skin Care Companion (Personal Hub) */}
        <section>
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="font-display text-[19px] font-bold text-[#221E2C]">
              {t.home.companionTitle}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => navigate('skin-guide')}
              className="text-left p-4 rounded-2xl bg-[#F6F2FB] border border-[#DDD3EE] hover:border-[#A092C5] transition-all cursor-pointer flex flex-col justify-between min-h-[116px]"
            >
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#6D5D9B]">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <span className="font-display text-[14px] font-semibold text-[#221E2C] block">
                  {t.home.skinGuide}
                </span>
                <span className="mt-0.5 text-[12px] text-[#635B73] block leading-snug">
                  {t.home.skinGuideDesc}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('skin-journal')}
              className="text-left p-4 rounded-2xl bg-[#F7EAF1]/70 border border-[#E5C6D8] hover:border-[#D5A0BD] transition-all cursor-pointer flex flex-col justify-between min-h-[116px]"
            >
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#8C4D6D]">
                <NotebookPen className="w-4 h-4" />
              </div>
              <div className="mt-3">
                <span className="font-display text-[14px] font-semibold text-[#221E2C] block">
                  {t.home.skinJournal}
                </span>
                <span className="mt-0.5 text-[12px] text-[#635B73] block truncate tabular-nums">
                  {latestJournal
                    ? `${t.skinJournal.comfortLabels[latestJournal.comfort]} · ${latestJournal.hydrationScore}/5`
                    : t.home.skinJournalEmpty}
                </span>
              </div>
            </button>
          </div>
        </section>

        {/* 3. Shop by Category */}
        <section>
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="font-display text-[19px] font-bold text-[#221E2C]">
              {t.home.shopByCategory}
            </h2>
            <button
              type="button"
              onClick={() => navigate('shop', { category: 'All' })}
              className="text-[13px] font-semibold text-[#6D5D9B] hover:text-[#4F407A] inline-flex items-center gap-0.5 min-h-[44px] cursor-pointer whitespace-nowrap"
            >
              <span>{t.home.viewShop}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {CATEGORY_KEYS.map((catKey) => (
              <button
                key={catKey}
                type="button"
                onClick={() => navigate('shop', { category: catKey })}
                className="text-left p-3.5 rounded-2xl bg-white border border-[#E9E1F3] hover:border-[#A092C5] hover:bg-[#FCF9FF] transition-all cursor-pointer min-h-[76px] flex flex-col justify-between"
              >
                <span className="font-display text-[14px] font-semibold text-[#221E2C]">
                  {t.shop.categories[catKey]}
                </span>
                <span className="mt-1 text-[12px] text-[#635B73]">
                  {t.home.catSubs[catKey]}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 4. Daily Essentials (Best Sellers · Horizontal Swipe, Zero Duplication) */}
        <section>
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="font-display text-[19px] font-bold text-[#221E2C]">
                {t.home.dailyEssentials}
              </h2>
              <p className="text-[12px] text-[#635B73]">
                {t.home.dailyEssentialsSub}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('shop', { category: 'All' })}
              className="text-[13px] font-semibold text-[#6D5D9B] hover:text-[#4F407A] inline-flex items-center gap-0.5 min-h-[44px] cursor-pointer whitespace-nowrap"
            >
              <span>{t.home.allItems}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="-mx-4 px-4 flex gap-3 overflow-x-auto no-scrollbar snap-x pb-1">
            {dailyEssentials.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <article
                  key={product.id}
                  className="w-[178px] shrink-0 snap-start flex flex-col bg-white rounded-2xl border border-[#E9E1F3] overflow-hidden"
                >
                  <div className="relative aspect-square w-full bg-white border-b border-[#F2ECF9]">
                    <button
                      type="button"
                      onClick={() => navigate('product-detail', { productId: product.id })}
                      className="w-full h-full block cursor-pointer"
                      aria-label={`View ${product.name}`}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain p-3"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                      className="absolute top-2 right-2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-full bg-white/90 border border-[#E9E1F3] text-[#635B73] hover:text-[#B86E95] cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isWishlisted ? 'fill-[#D5A0BD] text-[#B86E95]' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-3.5 flex flex-col flex-1">
                    <p className="text-[11px] text-[#635B73] truncate">
                      {product.size} · {t.shop.categories[product.category] || product.category}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('product-detail', { productId: product.id })}
                      className="text-left mt-1 cursor-pointer"
                    >
                      <h3 className="font-display text-[14px] font-semibold text-[#221E2C] leading-snug line-clamp-2 min-h-[38px] hover:text-[#6D5D9B]">
                        {product.name}
                      </h3>
                    </button>
                    <div className="mt-1.5 flex items-baseline gap-1.5">
                      <span className="text-[15px] font-bold text-[#221E2C] tabular-nums">
                        {formatRM(product.sellingPrice!)}
                      </span>
                      {product.originalPrice !== null && (
                        <span className="text-[11px] text-[#7B7487] line-through tabular-nums">
                          {formatRM(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="mt-auto pt-2.5">
                      <button
                        type="button"
                        onClick={() => addToCart(product.id, 1)}
                        className="w-full min-h-[40px] px-3 py-1.5 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] text-white text-[13px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t.common.addToCart}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 5. Value Sets & Free Gift Promotion */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-[19px] font-bold text-[#221E2C]">
                {t.home.valueSets}
              </h2>
              <p className="text-[12px] text-[#635B73]">
                {t.home.valueSetsSub}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('shop', { category: 'Bundles' })}
              className="text-[13px] font-semibold text-[#6D5D9B] hover:text-[#4F407A] inline-flex items-center gap-0.5 min-h-[44px] cursor-pointer whitespace-nowrap"
            >
              <span>{t.home.bundles}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {valueSets.map(({ product, badge, shortDesc }) => (
              <article
                key={product.id}
                className="rounded-3xl bg-white border border-[#E9E1F3] p-4 space-y-3.5"
              >
                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => navigate('product-detail', { productId: product.id })}
                    className="w-24 h-24 shrink-0 rounded-2xl bg-[#FAF8FD] border border-[#F0E9F8] p-2 cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6D5D9B]">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{badge}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('product-detail', { productId: product.id })}
                      className="text-left w-full cursor-pointer"
                    >
                      <h3 className="font-display text-[16px] font-bold text-[#221E2C] mt-0.5 hover:text-[#6D5D9B]">
                        {product.name}
                      </h3>
                    </button>
                    <p className="text-[12px] text-[#635B73] mt-0.5 leading-snug">
                      {shortDesc}
                    </p>
                    {product.sellingPrice !== null && (
                      <div className="mt-1.5 flex items-baseline gap-2">
                        <span className="font-display text-[16px] font-bold text-[#221E2C] tabular-nums">
                          {formatRM(product.sellingPrice)}
                        </span>
                        {product.originalPrice !== null && (
                          <span className="text-[12px] text-[#7B7487] line-through tabular-nums">
                            {formatRM(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => navigate('product-detail', { productId: product.id })}
                    className="min-h-[42px] px-3 py-2 rounded-xl bg-[#F6F2FB] hover:bg-[#E9E1F3] border border-[#D8CBEB] text-[#4F407A] text-[13px] font-semibold transition-colors cursor-pointer"
                  >
                    {t.common.viewDetails}
                  </button>
                  <button
                    type="button"
                    onClick={() => addToCart(product.id, 1)}
                    className="min-h-[42px] px-3 py-2 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] text-white text-[13px] font-semibold transition-colors cursor-pointer"
                  >
                    {t.common.addToCart}
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Gift Pouch Compact Promo Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-[#F7EAF1] via-white to-[#E9E1F3] border border-[#E5D5EB] p-4 flex items-center gap-3.5">
            <div className="w-18 h-18 shrink-0 rounded-2xl bg-white border border-[#E9E1F3] p-1.5 flex items-center justify-center">
              <img
                src={GIFT_POUCH_PROMO.image}
                alt={GIFT_POUCH_PROMO.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7A3F5D]">
                <Gift className="w-3.5 h-3.5" />
                <span>{t.home.freeGiftLabel}</span>
              </div>
              <h3 className="font-display text-[15px] font-bold text-[#221E2C] mt-0.5">
                {GIFT_POUCH_PROMO.name}
              </h3>
              <p className="mt-0.5 text-[12px] text-[#4B445A] leading-snug">
                {t.home.giftPouchDesc}
              </p>
            </div>
          </div>
        </section>

        {/* 6. Rewards Preview */}
        <section className="rounded-3xl bg-[#E9E1F3]/75 border border-[#DDD3EE] p-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-[#6D5D9B] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-[#5B4B8A] truncate">
                {membershipTier}
              </p>
              <h2 className="font-display text-[16px] font-bold text-[#221E2C] tabular-nums">
                {points} {t.home.pointsUnit}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('rewards')}
            className="min-h-[42px] px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF8FD] border border-[#D8CBEB] text-[#4F407A] text-[13px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <span>{t.home.rewardsBtn}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </section>

        {/* 7. Help Center Preview */}
        <section className="rounded-3xl bg-white border border-[#E9E1F3] p-4.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#F6F2FB] flex items-center justify-center text-[#6D5D9B] shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-[15px] font-bold text-[#221E2C]">
                {t.home.helpCenterTitle}
              </h2>
              <p className="text-[12px] text-[#635B73] truncate">
                {t.home.helpCenterDesc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('help')}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#F6F2FB] hover:bg-[#E9E1F3] border border-[#DDD3EE] text-[#4F407A] text-[12px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <span>{t.home.helpCenterBtn}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </section>
      </main>

      {/* Dedicated SGS Lab Testing OR Winning Awards Modal */}
      {activeTrustModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="trust-modal-title"
          onClick={() => setActiveTrustModal(null)}
          className="fixed inset-0 z-50 bg-[#221E2C]/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[400px] max-h-[88vh] overflow-y-auto bg-white rounded-3xl border border-[#DDD3EE] shadow-xl"
          >
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xs border-b border-[#EFE8F9] px-4 py-3.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    activeTrustModal === 'award'
                      ? 'bg-[#FBF3E2] text-[#8B651D]'
                      : 'bg-[#F6F2FB] text-[#5B4B8A]'
                  }`}
                >
                  {activeTrustModal === 'award' ? (
                    <Trophy className="w-4 h-4" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <h2
                    id="trust-modal-title"
                    className="font-display text-[17px] font-bold text-[#221E2C] truncate"
                  >
                    {activeTrustModal === 'award' ? t.home.awardModal.title : t.home.sgsModal.title}
                  </h2>
                  <p className="text-[11px] text-[#635B73] truncate">
                    {activeTrustModal === 'award'
                      ? t.home.awardModal.subtitle
                      : t.home.sgsModal.subtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTrustModal(null)}
                aria-label={t.home.awardModal.close}
                className="w-9 h-9 rounded-full bg-[#F6F2FB] hover:bg-[#E9E1F3] text-[#4F407A] flex items-center justify-center shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {activeTrustModal === 'award' ? (
                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[#E9E1F3] bg-[#E9E1F3]/30">
                  <img
                    src={CERTIFICATES_BANNER_IMAGE}
                    alt={t.home.awardModal.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-square w-full rounded-2xl overflow-hidden border border-[#E9E1F3] bg-[#F8EDFA]">
                  <img
                    src={SGS_DERMATOLOGY_IMAGE}
                    alt={t.home.sgsModal.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <div className="space-y-2.5">
                {(activeTrustModal === 'award'
                  ? t.home.awardModal.items
                  : t.home.sgsModal.items
                ).map((item) => (
                  <div
                    key={item.title}
                    className={`rounded-2xl border p-3 flex items-start gap-2.5 ${
                      activeTrustModal === 'award'
                        ? 'bg-[#FDFBF5] border-[#EFE3C4]'
                        : 'bg-[#FAF8FD] border-[#E9E1F3]'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        activeTrustModal === 'award' ? 'text-[#8B651D]' : 'text-[#6D5D9B]'
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="font-display text-[13px] font-bold text-[#221E2C]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[#635B73] leading-snug">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveTrustModal(null)}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] text-white text-[14px] font-semibold transition-colors cursor-pointer"
              >
                {activeTrustModal === 'award' ? t.home.awardModal.close : t.home.sgsModal.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
