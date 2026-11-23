import React, { useMemo, useState } from 'react';
import { ArrowUpDown, Gift, Search, X } from 'lucide-react';
import { TopHeader } from '../../components/layout/TopHeader';
import { ProductCard } from '../../components/common/ProductCard';
import { GIFT_POUCH_PROMO, PRODUCTS } from '../../data/products';
import { useApp } from '../../context/AppContext';
import { ProductCategory, SortOption } from '../../types';

const CATEGORIES: ProductCategory[] = [
  'All',
  'Soothing Care',
  'Hydration',
  'Shower Gel',
  'Bundles',
];

export const ShopScreen: React.FC = () => {
  const { shopCategoryFilter, setShopCategoryFilter, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = PRODUCTS.filter((p) => {
      const matchesCat =
        shopCategoryFilter === 'All' || p.category === shopCategoryFilter;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.size.toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'name-az') return a.name.localeCompare(b.name);
      if (sortBy === 'price-low') {
        const pa = a.sellingPrice ?? Number.MAX_SAFE_INTEGER;
        const pb = b.sellingPrice ?? Number.MAX_SAFE_INTEGER;
        return pa - pb;
      }
      if (sortBy === 'price-high') {
        const pa = a.sellingPrice ?? -1;
        const pb = b.sellingPrice ?? -1;
        return pb - pa;
      }
      return 0;
    });
  }, [shopCategoryFilter, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAF8FD] pb-24">
      <TopHeader title={t.shop.title} showCart />

      <main className="px-4 pt-4 space-y-4">
        {/* Search and Sort Controls */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-[#7B7487] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.shop.searchPlaceholder}
              aria-label={t.shop.searchPlaceholder}
              className="w-full min-h-[44px] pl-10 pr-10 rounded-xl bg-white border border-[#E9E1F3] focus:border-[#7C69AE] focus:outline-none text-[14px] text-[#221E2C]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#635B73] hover:text-[#221E2C] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative">
            <ArrowUpDown className="w-4 h-4 text-[#635B73] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort products"
              className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-white border border-[#E9E1F3] focus:border-[#7C69AE] focus:outline-none text-[13px] text-[#221E2C] cursor-pointer"
            >
              <option value="featured">{t.shop.sortFeatured}</option>
              <option value="price-low">{t.shop.sortPriceLow}</option>
              <option value="price-high">{t.shop.sortPriceHigh}</option>
              <option value="name-az">{t.shop.sortNameAZ}</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Product Categories"
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5"
        >
          {CATEGORIES.map((cat) => {
            const active = shopCategoryFilter === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setShopCategoryFilter(cat)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#7C69AE] text-white'
                    : 'bg-white border border-[#E9E1F3] text-[#635B73] hover:text-[#221E2C]'
                }`}
              >
                {t.shop.categories[cat]}
              </button>
            );
          })}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-[13px] text-[#635B73]">
          <span className="tabular-nums">
            {t.shop.showing} {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? t.shop.productSingle : t.shop.productPlural}
          </span>
          {shopCategoryFilter !== 'All' && (
            <button
              type="button"
              onClick={() => setShopCategoryFilter('All')}
              className="text-[#6D5D9B] font-medium hover:underline cursor-pointer"
            >
              {t.shop.showAll}
            </button>
          )}
        </div>

        {/* 2-Column Mobile Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E9E1F3] p-7 text-center">
            <h2 className="font-display text-[18px] font-semibold text-[#221E2C]">
              {t.shop.noProductsTitle}
            </h2>
            <p className="mt-1.5 text-[13px] text-[#635B73]">
              {t.shop.noProductsDesc}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setShopCategoryFilter('All');
              }}
              className="mt-4 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#7C69AE] text-white text-[14px] font-medium cursor-pointer"
            >
              {t.shop.resetFilters}
            </button>
          </div>
        )}

        {/* Promotional Free Gift Card (Not for standalone sale) */}
        <section className="bg-white rounded-2xl border border-[#E9E1F3] p-4 flex items-center gap-3.5">
          <div className="w-18 h-18 shrink-0 rounded-xl bg-[#FAF8FD] border border-[#F0E9F8] p-1.5">
            <img
              src={GIFT_POUCH_PROMO.image}
              alt={GIFT_POUCH_PROMO.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#8C4D6D]">
              <Gift className="w-3.5 h-3.5" />
              <span>{t.shop.complimentaryGift}</span>
            </div>
            <h3 className="font-display text-[14px] font-semibold text-[#221E2C] mt-0.5">
              {GIFT_POUCH_PROMO.name}
            </h3>
            <p className="mt-0.5 text-[12px] text-[#635B73] leading-snug">
              {t.home.giftPouchDesc}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};
