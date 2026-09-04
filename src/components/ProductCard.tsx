import Link from 'next/link';
import { Product } from '@/types';
import { formatINR } from '@/lib/utils';
import { ArrowRight, Star, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const defaultVariant = product.variants.find((v) => v.isDefault) || product.variants[0];
  const primaryImage =
    defaultVariant?.images[0]?.url ||
    product.variants[0]?.images[0]?.url ||
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569';

  // Find 12 month EMI or compute
  const emi12m = defaultVariant?.emiPlans?.find((p) => p.tenureMonths === 12);
  const minMonthlyEmi = emi12m ? emi12m.monthlyAmount : Math.round(product.basePrice / 12);

  const uniqueColors = Array.from(new Map(product.variants.map((v) => [v.color, { name: v.color, hex: v.colorHex }])).values());

  // Generate a consistent pseudo-random rating (4.5 - 4.9) and review count based on product ID
  const hash = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rating = (4.5 + (hash % 5) / 10).toFixed(1);
  const reviews = 500 + (hash % 1500);

  return (
    <div className="group bg-white border border-[#f5f5f7] rounded-[28px] hover:border-[#8B5CF6]/20 hover:shadow-[0_12px_40px_rgb(139,92,246,0.08)] hover:-translate-y-1 transition-all duration-400 ease-out flex flex-col justify-between overflow-hidden animate-fade-in-up">
      <div className="p-6 sm:p-8 bg-[#fbfbfd]/50">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          {product.badge ? (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0071e3] bg-[#0071e3]/10 px-3 py-1 rounded-full">
              {product.badge}
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1d1d1f] bg-white px-3 py-1 rounded-full shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
              {product.brand}
            </span>
          )}

          <div className="flex items-center gap-1 text-[11px] text-[#1d1d1f] font-semibold bg-white px-3 py-1 rounded-full shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
            <Star className="w-3.5 h-3.5 fill-[#8B5CF6] text-[#8B5CF6]" />
            <span>{rating} <span className="text-[#86868b] font-medium hidden sm:inline">({reviews})</span></span>
          </div>
        </div>

        {/* Product Image */}
        <div className={`relative w-full aspect-[4/5] my-2 flex items-center justify-center overflow-hidden ${product.brand === 'Apple' ? 'max-h-56' : 'max-h-48'}`}>
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-xl"
          />
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-1.5 text-center">
          <span className="text-[11px] font-bold text-[#86868b] uppercase tracking-wide">
            {product.brand}
          </span>
          <h3 className="text-2xl font-bold text-[#1d1d1f] line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[13px] text-[#86868b] line-clamp-2 leading-relaxed px-2">
            {product.description}
          </p>
        </div>

        {/* Available Variants Swatches Indicator */}
        <div className="mt-6 pt-4 border-t border-[#d2d2d7]/40 flex items-center justify-between text-xs text-[#86868b]">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1.5">
              {uniqueColors.slice(0, 4).map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="w-4 h-4 rounded-full border-2 border-white shadow-xs"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <span className="text-[11px] font-medium text-slate-600 ml-1">
              {uniqueColors.length} {uniqueColors.length === 1 ? 'finish' : 'finishes'}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-md">
            ₹7,500 Cashback
          </span>
        </div>
      </div>

      {/* Pricing & EMI callout footer */}
      <div className="p-6 sm:p-8 pt-0 mt-auto">
        <div className="bg-white rounded-[20px] p-4 shadow-[0_2px_10px_rgb(0,0,0,0.03)] mb-5">
          <div className="text-[12px] font-semibold text-[#86868b] flex items-center justify-between">
            <span>Mutual Fund EMI from</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-md">
              0% Interest
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
              {formatINR(minMonthlyEmi)}
            </span>
            <span className="text-xs text-[#86868b] font-medium">/ mo</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-[10px] uppercase font-bold text-[#86868b]">Total Price</div>
            <div className="text-[15px] font-bold text-[#1d1d1f]">{formatINR(product.basePrice)}</div>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1 text-[13px] font-medium bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-5 py-2.5 rounded-full transition-all"
          >
            <span>View details</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
