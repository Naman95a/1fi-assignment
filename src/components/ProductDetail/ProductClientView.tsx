'use client';

import { useState, useMemo } from 'react';
import { Product, ProductVariant, EmiPlan } from '@/types';
import { formatINR } from '@/lib/utils';
import ImageGallery from './ImageGallery';
import VariantSelector from './VariantSelector';
import EmiPlanCard from './EmiPlanCard';
import SimulatedCheckoutModal from './SimulatedCheckoutModal';
import Link from 'next/link';
import { Truck, ShieldCheck, Info, Sparkles, ArrowRight } from 'lucide-react';

interface ProductClientViewProps {
  product: Product;
}

export default function ProductClientView({ product }: ProductClientViewProps) {
  const defaultVar = product.variants.find((v) => v.isDefault) || product.variants[0];
  const [activeVariant, setActiveVariant] = useState<ProductVariant>(defaultVar);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeEmiPlans = useMemo(() => {
    if (activeVariant.emiPlans && activeVariant.emiPlans.length > 0) return activeVariant.emiPlans;
    if (product.emiPlans && product.emiPlans.length > 0) return product.emiPlans;
    return [];
  }, [activeVariant, product]);

  const defaultPlan = useMemo(() => {
    return activeEmiPlans.find((p) => p.tenureMonths === 12) || activeEmiPlans[0] || null;
  }, [activeEmiPlans]);

  const [selectedPlan, setSelectedPlan] = useState<EmiPlan | null>(defaultPlan);

  const handleVariantChange = (variant: ProductVariant) => {
    setActiveVariant(variant);
    if (selectedPlan && variant.emiPlans) {
      const match = variant.emiPlans.find((p) => p.tenureMonths === selectedPlan.tenureMonths);
      if (match) setSelectedPlan(match);
      else setSelectedPlan(variant.emiPlans[0] || null);
    }
  };

  const savings = activeVariant.mrp - activeVariant.price;

  // Split plans into Recommended (12m) and others
  const recommendedPlan = activeEmiPlans.find(p => p.tenureMonths === 12);
  const otherPlans = activeEmiPlans.filter(p => p.tenureMonths !== 12);

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8 space-y-12 pb-32 lg:pb-16 animate-in fade-in duration-500">
      
      {/* 1. Refined Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[13px] text-[#86868b] font-medium">
        <Link href="/" className="hover:text-[#1d1d1f] transition-colors">Home</Link>
        <span className="text-[#d2d2d7]">/</span>
        <Link href="/" className="hover:text-[#1d1d1f] transition-colors">Smartphones</Link>
        <span className="text-[#d2d2d7]">/</span>
        <span className="text-[#1d1d1f]">{product.name}</span>
      </nav>

      {/* 2. Main Two-Column Structure */}
      <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 items-start">
        
        {/* Left Column: Product Image Gallery */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-32 relative">
          <ImageGallery
            images={activeVariant.images || []}
            activeVariant={activeVariant}
            allVariants={product.variants}
            onSelectVariant={handleVariantChange}
            brand={product.brand}
          />
        </div>

        {/* Right Column: Information, Variants, Checkout */}
        <div className="w-full lg:w-1/2 flex flex-col">
          
          {/* Header Info */}
          <div className="space-y-4 mb-10 pb-8 border-b border-[#d2d2d7]/50">
            {product.badge && (
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#0071e3] bg-[#0071e3]/10 px-3 py-1 rounded-full">
                {product.badge}
              </span>
            )}
            <h1 className="text-4xl sm:text-[44px] font-bold text-[#1d1d1f] tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-lg text-[#86868b] font-medium">
              {activeVariant.storage}
            </p>

            <div className="pt-2 flex flex-col gap-1">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-[#1d1d1f] tracking-tight">
                  {formatINR(activeVariant.price)}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-[13px]">
                {activeVariant.mrp > activeVariant.price && (
                  <span className="text-[#86868b] line-through font-medium">
                    MRP {formatINR(activeVariant.mrp)}
                  </span>
                )}
                {savings > 0 && (
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Save {formatINR(savings)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Variant Selector (Storage) */}
          <div className="mb-12">
            <VariantSelector
              variants={product.variants}
              selectedVariant={activeVariant}
              onSelectVariant={handleVariantChange}
            />
          </div>

          {/* EMI Section */}
          <div className="mb-12">
            <div className="flex flex-col gap-1 mb-6">
              <h3 className="text-[13px] font-semibold text-[#1d1d1f] uppercase tracking-wide">Select EMI Plan</h3>
              <div className="flex items-center gap-1.5 text-[13px] text-[#86868b] font-medium">
                <span>EMI plans backed by mutual funds</span>
                <span title="Mutual funds generate compounding returns that offset finance charges over time." className="cursor-help">
                  <Info className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div className="space-y-8">
              {recommendedPlan && (
                <div className="space-y-3">
                  <h4 className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider">Recommended</h4>
                  <EmiPlanCard
                    plan={recommendedPlan}
                    isSelected={selectedPlan?.id === recommendedPlan.id}
                    onSelect={(p) => setSelectedPlan(p)}
                  />
                </div>
              )}
              
              {otherPlans.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider">Other Plans</h4>
                  <div className="space-y-3">
                    {otherPlans.map((plan) => (
                      <EmiPlanCard
                        key={plan.id}
                        plan={plan}
                        isSelected={selectedPlan?.id === plan.id}
                        onSelect={(p) => setSelectedPlan(p)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Sticky Purchase Summary */}
          <div className="hidden lg:block sticky bottom-6 bg-[#fbfbfd] border border-[#d2d2d7]/50 rounded-[24px] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.04)] z-30 space-y-4 backdrop-blur-xl">
            {selectedPlan && (
              <div className="text-[14px] text-[#86868b] font-medium flex items-center justify-between">
                <span>Selected:</span>
                <span className="font-bold text-[#1d1d1f]">
                  {formatINR(selectedPlan.monthlyAmount)}/mo × {selectedPlan.tenureMonths} months
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              disabled={!selectedPlan}
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] active:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-[16px] transition-all shadow-sm text-[15px]"
            >
              {selectedPlan ? `Continue with ${formatINR(selectedPlan.monthlyAmount)}/mo` : 'Select a Plan'}
            </button>
            <div className="flex items-center justify-center gap-6 pt-2 text-[12px] font-semibold text-[#86868b]">
              <div className="flex items-center gap-1.5"><Truck className="w-4 h-4" />Free Delivery</div>
              <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" />1 Yr Warranty</div>
            </div>
          </div>

          {/* Mutual Fund Explainer (Moved below purchase) */}
          <div className="mt-16 bg-[#f5f5f7] rounded-[32px] p-8 sm:p-10 border border-[#ebebeb] space-y-6">
            <div className="flex items-center gap-2 text-[#8B5CF6] text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <span>The 1Fi Advantage</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f] leading-tight">
              Understanding mutual-fund-backed EMI
            </h3>
            <p className="text-[#86868b] text-[15px] font-medium leading-relaxed">
              When you choose a 1Fi EMI plan, a portion of the financing cost is structured into mutual funds. As the fund generates returns over the tenure of your {selectedPlan?.tenureMonths || 12}-month plan, it naturally offsets the borrowing cost.
            </p>
            <div className="flex items-center justify-between gap-2 p-4 bg-white rounded-2xl shadow-sm text-center text-xs font-semibold text-[#86868b]">
              <span>Smartphone</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#d2d2d7]" />
              <span>EMI Plan</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#d2d2d7]" />
              <span className="text-[#8B5CF6]">Mutual Fund Backing</span>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-[#d2d2d7]/50 z-40 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.08)]">
        {selectedPlan ? (
          <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
            <div className="flex flex-col">
              <span className="font-extrabold text-[17px] text-[#1d1d1f] tracking-tight">{formatINR(selectedPlan.monthlyAmount)}<span className="text-sm font-medium text-[#86868b]">/mo</span></span>
              <span className="text-[11px] font-medium text-[#86868b]">
                {selectedPlan.tenureMonths} months
              </span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold px-8 py-3.5 rounded-full active:scale-95 transition-all text-[15px]"
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
            <span className="text-sm font-medium text-[#86868b]">Select a plan</span>
            <button disabled className="bg-[#f5f5f7] text-[#86868b] font-medium px-8 py-3.5 rounded-full text-base">
              Continue
            </button>
          </div>
        )}
      </div>

      <SimulatedCheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        variant={activeVariant}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}
