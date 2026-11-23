import React, { useEffect, useState } from 'react';
import {
  Check,
  Heart,
  Info,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trophy,
} from 'lucide-react';
import { TopHeader } from '../../components/layout/TopHeader';
import { ProductCard } from '../../components/common/ProductCard';
import { PRODUCTS, getProductById } from '../../data/products';
import { useApp } from '../../context/AppContext';
import { formatRM } from '../../utils/format';

export const ProductDetailScreen: React.FC = () => {
  const {
    selectedProductId,
    navigate,
    addToCart,
    wishlist,
    toggleWishlist,
    language,
    t,
  } = useApp();

  const HIGHLIGHT_MS: Record<string, string> = {
    'SGS Lab Tested': 'Ujian Makmal SGS',
    'Award-Winning': 'Pemenang Anugerah',
    'Steroid-Free': 'Bebas Steroid',
    'Paraben Free': 'Bebas Paraben',
    'Fragrance Free': 'Bebas Pewangi',
    'Paraben Free & Fragrance Free': 'Bebas Paraben & Pewangi',
    'Dermatologically Tested': 'Diuji Secara Dermatologi',
    'KKM Approved': 'Kelulusan KKM',
    'Halal Certified': 'Diperakui Halal',
    'Fast-Absorbing': 'Cepat Meresap',
    'Naturally Derived Active Ingredients': 'Bahan Aktif Semula Jadi',
    'Tulsi Extract Formula': 'Formula Ekstrak Tulsi',
    'Full 3-Step Routine': 'Rutin Lengkap 3 Langkah',
  };

  const product = getProductById(selectedProductId) || PRODUCTS[0];
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setActiveImageIdx(0);
    setQuantity(1);
  }, [product.id]);

  const isWishlisted = wishlist.includes(product.id);
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 2);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  return (
    <div className="min-h-screen bg-[#FAF8FD] pb-24">
      <TopHeader title={product.shortName} showBack showCart />

      <main className="px-4 pt-4 space-y-5">
        {/* Image Gallery */}
        <section className="space-y-3">
          <div className="aspect-square w-full bg-white rounded-3xl border border-[#E9E1F3] overflow-hidden flex items-center justify-center p-4">
            <img
              src={product.images[activeImageIdx] || product.images[0]}
              alt={`${product.name} view ${activeImageIdx + 1}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={img + idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  aria-label={`View photo ${idx + 1}`}
                  className={`w-18 h-18 shrink-0 rounded-2xl bg-white border overflow-hidden p-1.5 transition-all cursor-pointer ${
                    activeImageIdx === idx
                      ? 'border-[#7C69AE] ring-2 ring-[#E9E1F3]'
                      : 'border-[#E9E1F3] opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Purchase & Core Info Module */}
        <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5 space-y-4">
          <div>
            <p className="text-[12px] font-medium text-[#635B73]">
              {t.shop.categories[product.category] || product.category} <span aria-hidden="true">·</span> {product.size}
            </p>
            <h1 className="mt-1 font-display text-[22px] font-bold text-[#221E2C] leading-tight">
              {product.name}
            </h1>
            <p className="mt-1 text-[13px] text-[#635B73]">
              {product.tagline}
            </p>
          </div>

          {/* Pricing */}
          <div className="pt-2 border-t border-[#F2ECF9]">
            {product.priceConfirmed && product.sellingPrice !== null ? (
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-[24px] font-bold text-[#221E2C] tabular-nums">
                  {formatRM(product.sellingPrice)}
                </span>
                {product.originalPrice !== null && (
                  <span className="text-[14px] text-[#7B7487] line-through tabular-nums">
                    {formatRM(product.originalPrice)}
                  </span>
                )}
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-[#F6F2FB] border border-[#DDD3EE] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#6D5D9B] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[14px] font-semibold text-[#4F407A]">
                    Price to be confirmed
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#635B73]">
                    Checkout is disabled until official retail pricing is confirmed. You may save this item to your wishlist.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Trust Credentials (SGS + Award-Winning) */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl bg-[#F6F2FB] border border-[#E4D9F4] p-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#5B4B8A] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-[#221E2C] leading-tight">
                  {t.home.sgsTitle}
                </p>
                <p className="text-[10px] text-[#635B73] truncate">
                  {t.home.kkmLabel}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#FBF6EA] border border-[#EED9AE] p-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#8B651D] shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-[#221E2C] leading-tight">
                  {t.home.awardTitle}
                </p>
                <p className="text-[10px] text-[#635B73] truncate">
                  CRI 2026 · MPI 2025
                </p>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap gap-x-3.5 gap-y-2 text-[12px] text-[#4B445A]">
            {product.highlights.map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#7C69AE] shrink-0" />
                <span>{language === 'ms' ? (HIGHLIGHT_MS[item] || item) : item}</span>
              </span>
            ))}
          </div>

          {/* Quantity & Add to Cart + Wishlist */}
          <div className="pt-1 space-y-2.5">
            {product.priceConfirmed && product.sellingPrice !== null ? (
              <div className="flex items-center gap-2.5">
                <div className="inline-flex items-center rounded-xl border border-[#DDD3EE] bg-[#FAF8FD]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="min-h-[46px] min-w-[42px] flex items-center justify-center text-[#221E2C] hover:bg-[#E9E1F3]/60 rounded-l-xl cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-9 text-center text-[15px] font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    aria-label="Increase quantity"
                    className="min-h-[46px] min-w-[42px] flex items-center justify-center text-[#221E2C] hover:bg-[#E9E1F3]/60 rounded-r-xl cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 min-h-[48px] px-4 py-3 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] active:scale-[0.99] text-white text-[15px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t.common.addToCart}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled
                  className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#ECE7F4] text-[#7B7487] text-[15px] font-semibold cursor-not-allowed"
                >
                  Price to be Confirmed
                </button>
                {product.includedProductIds && (
                  <div className="grid grid-cols-2 gap-2">
                    {product.includedProductIds.map((pid) => {
                      const sub = getProductById(pid);
                      if (!sub) return null;
                      return (
                        <button
                          key={pid}
                          type="button"
                          onClick={() => navigate('product-detail', { productId: pid })}
                          className="min-h-[44px] px-3 py-2 rounded-xl bg-white border border-[#D8CBEB] hover:bg-[#F6F2FB] text-[#4F407A] text-[12px] font-medium transition-colors cursor-pointer truncate"
                        >
                          View {sub.shortName}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl border text-[14px] font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isWishlisted
                  ? 'bg-[#F7EAF1] border-[#D5A0BD] text-[#7A3F5D]'
                  : 'bg-white border-[#DDD3EE] hover:bg-[#FAF8FD] text-[#221E2C]'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  isWishlisted ? 'fill-[#D5A0BD] text-[#B86E95]' : ''
                }`}
              />
              <span>{isWishlisted ? t.productDetail.savedWishlist : t.productDetail.addWishlist}</span>
            </button>
          </div>

          {product.promotionalGiftNote && (
            <p className="text-[12px] text-[#635B73] pt-2 border-t border-[#F2ECF9]">
              {product.promotionalGiftNote}
            </p>
          )}
        </section>

        {/* Description & Benefits */}
        <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5 space-y-5">
          <div>
            <h2 className="font-display text-[18px] font-bold text-[#221E2C]">
              {t.productDetail.description}
            </h2>
            <p className="mt-2 text-[14px] text-[#4B445A] leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="pt-4 border-t border-[#F2ECF9]">
            <h2 className="font-display text-[18px] font-bold text-[#221E2C]">
              {t.productDetail.benefits}
            </h2>
            <ul className="mt-3 space-y-2">
              {product.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-2.5 text-[14px] text-[#4B445A]"
                >
                  <Check className="w-4 h-4 text-[#7C69AE] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Key Ingredients */}
        <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5">
          <h2 className="font-display text-[18px] font-bold text-[#221E2C]">
            {t.productDetail.ingredients}
          </h2>
          {product.ingredientsNote && (
            <p className="mt-2 text-[13px] text-[#635B73] leading-relaxed">
              {product.ingredientsNote}
            </p>
          )}
          <div className="mt-3 space-y-3.5">
            {product.ingredients.map((ing) => (
              <div
                key={ing.name}
                className="pb-3 border-b border-[#F2ECF9] last:border-b-0 last:pb-0"
              >
                <p className="text-[14px] font-semibold text-[#221E2C]">
                  {ing.name}
                  {ing.subtitle && (
                    <span className="font-normal text-[#635B73]">
                      {' '}
                      ({ing.subtitle})
                    </span>
                  )}
                </p>
                <ul className="mt-1 space-y-0.5 text-[13px] text-[#635B73]">
                  {ing.benefits.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* How to Use */}
        <section className="bg-white rounded-3xl border border-[#E9E1F3] p-5">
          <h2 className="font-display text-[18px] font-bold text-[#221E2C]">
            {t.productDetail.howToUse}
          </h2>
          <ol className="mt-3 space-y-3">
            {product.howToUse.map((step, idx) => (
              <li key={step} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#E9E1F3] text-[#4F407A] text-[12px] font-bold flex items-center justify-center shrink-0 tabular-nums">
                  {idx + 1}
                </span>
                <span className="text-[14px] text-[#4B445A] leading-snug pt-0.5">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Related Products */}
        <section>
          <h2 className="font-display text-[18px] font-bold text-[#221E2C] mb-3">
            {t.productDetail.relatedProducts}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
