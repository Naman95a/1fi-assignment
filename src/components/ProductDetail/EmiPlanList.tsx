'use client';

import { useState } from 'react';
import { EmiPlan, ProductVariant, Product } from '@/types';
import { formatINR } from '@/lib/utils';
import EmiPlanCard from './EmiPlanCard';
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp, Info } from 'lucide-react';

interface EmiPlanListProps {
  product: Product;
  variant: ProductVariant;
  plans: EmiPlan[];
  selectedPlan: EmiPlan | null;
  onSelectPlan: (plan: EmiPlan) => void;
  onProceed: () => void;
}

export default function EmiPlanList({
  product,
  variant,
  plans,
  selectedPlan,
  onSelectPlan,
  onProceed,
}: EmiPlanListProps) {
  const savings = variant.mrp - variant.price;

  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
      <div>
        {/* Pricing Header matching reference */}
        <div className="pb-4 border-b border-slate-100">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {formatINR(variant.price)}
            </span>
            {variant.mrp > variant.price && (
              <span className="text-base sm:text-lg text-slate-400 line-through font-medium">
                {formatINR(variant.mrp)}
              </span>
            )}
            {savings > 0 && (
              <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                Save {formatINR(savings)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-2">
            <h3 className="text-sm sm:text-base font-semibold text-slate-700">
              EMI plans backed by mutual funds
            </h3>
            <span
              title="Mutual funds generate compounding returns that offset interest costs over time."
              className="cursor-help text-slate-400 hover:text-slate-600"
            >
              <Info className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* List of EMI plans matching reference layout */}
        <div className="space-y-2.5 mt-4">
          {plans.length > 0 ? (
            plans.map((plan) => (
              <EmiPlanCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlan?.id === plan.id}
                onSelect={onSelectPlan}
              />
            ))
          ) : (
            <div className="py-8 text-center text-slate-500 text-sm">
              No EMI plans available for this variant.
            </div>
          )}
        </div>
      </div>

      {/* Selected Plan Summary & Proceed Action Button */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        {selectedPlan && (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between text-xs">
            <div className="text-slate-600">
              Selected:{' '}
              <span className="font-bold text-slate-900">
                {formatINR(selectedPlan.monthlyAmount)}/mo
              </span>{' '}
              for <span className="font-bold text-slate-900">{selectedPlan.tenureMonths} months</span>
            </div>
            <span className="text-brand-700 font-semibold bg-brand-100/70 px-2 py-0.5 rounded">
              {selectedPlan.interestRate}% Interest
            </span>
          </div>
        )}

        <button
          onClick={onProceed}
          disabled={!selectedPlan}
          className="w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-brand-500/25 transition-all flex items-center justify-center gap-2 group text-base"
        >
          <span>Proceed with Selected Plan</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero prepayment penalty • 100% Digital KYC</span>
        </div>
      </div>
    </div>
  );
}
