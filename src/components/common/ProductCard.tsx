import React from 'react';
import { Heart, Plus } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatRM } from '../../utils/format';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigate, addToCart, wishlist, toggleWishlist, t } = useApp();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <article className="group flex flex-col h-full bg-white rounded-2xl border border-[#E9E1F3] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#A092C5]/10">
      {/* Image Stage */}
      <div className="relative aspect-square w-full bg-white border-b border-[#F2ECF9] overflow-hidden">
        <button
          type="button"
          onClick={() => navigate('product-detail', { productId: product.id })}
          className="w-full h-full block cursor-pointer focus-visible:outline-2 focus-visible:outline-[#A092C5]"
          aria-label={`View ${product.name}`}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </button>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute top-2 right-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-[#E9E1F3] text-[#635B73] hover:text-[#B86E95] transition-colors cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? 'fill-[#D5A0BD] text-[#B86E95]' : ''
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4">
        <p className="text-[12px] text-[#635B73] truncate">
          {product.size} <span aria-hidden="true">·</span>{' '}
          {t.shop.categories[product.category] || product.category}
        </p>

        <button
          type="button"
          onClick={() => navigate('product-detail', { productId: product.id })}
          className="text-left mt-1 cursor-pointer"
        >
          <h3 className="font-display text-[15px] sm:text-[16px] font-semibold text-[#221E2C] leading-snug line-clamp-2 min-h-[42px] group-hover:text-[#6D5D9B] transition-colors">
            {product.name}
          </h3>
        </button>

        {/* Price Row */}
        <div className="mt-2 min-h-[28px] flex items-baseline gap-2 flex-wrap">
          {product.priceConfirmed && product.sellingPrice !== null ? (
            <>
              <span className="text-[16px] font-bold text-[#221E2C] tabular-nums">
                {formatRM(product.sellingPrice)}
              </span>
              {product.originalPrice !== null && (
                <span className="text-[12px] text-[#7B7487] line-through tabular-nums">
                  {formatRM(product.originalPrice)}
                </span>
              )}
            </>
          ) : (
            <span className="text-[13px] font-medium text-[#6D5D9B]">
              Price to be confirmed
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-3">
          {product.priceConfirmed && product.sellingPrice !== null ? (
            <button
              type="button"
              onClick={() => addToCart(product.id, 1)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#7C69AE] hover:bg-[#6A579C] active:scale-[0.98] text-white text-[14px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>{t.common.addToCart}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('product-detail', { productId: product.id })}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#F6F2FB] hover:bg-[#E9E1F3] border border-[#D8CBEB] text-[#5B4B8A] text-[14px] font-medium flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{t.common.viewDetails}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
