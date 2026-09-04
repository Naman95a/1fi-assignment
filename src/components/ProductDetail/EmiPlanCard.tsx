'use client';

import { EmiPlan } from '@/types';
import { formatINR } from '@/lib/utils';

interface EmiPlanCardProps {
  plan: EmiPlan;
  isSelected: boolean;
  onSelect: (plan: EmiPlan) => void;
}

export default function EmiPlanCard({
  plan,
  isSelected,
  onSelect,
}: EmiPlanCardProps) {
  const isZeroCost = plan.interestRate === 0;

  return (
    <div
      onClick={() => onSelect(plan)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(plan);
        }
      }}
      className={`group relative cursor-pointer rounded-[24px] border p-5 transition-all duration-300 ease-out select-none animate-fade-in-up ${
        isSelected
          ? 'border-[#8B5CF6] bg-[#fbf9ff] shadow-[0_0_0_1px_#8B5CF6]'
          : 'border-[#d2d2d7] bg-white hover:border-[#86868b] hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Radio Indicator & Amounts */}
        <div className="flex items-start gap-4">
          {/* Radio Button */}
          <div
            className={`mt-1 w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all ${
              isSelected
                ? 'border-[#8B5CF6] bg-[#8B5CF6]'
                : 'border-[#d2d2d7] bg-white group-hover:border-[#86868b]'
            }`}
          >
            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>

          <div>
            {/* Monthly amount x tenure matching reference */}
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-[#1d1d1f] text-lg sm:text-xl tracking-tight">
                {formatINR(plan.monthlyAmount)}
                <span className="text-[13px] font-medium text-[#86868b]"> / month</span>
              </span>
            </div>
            <div className="text-[#86868b] font-medium text-[13px] mt-0.5 mb-1.5">
              × {plan.tenureMonths} months
            </div>

            {/* Additional cashback text in green matching reference */}
            {plan.cashbackAmount > 0 && (
              <p className="text-[13px] font-semibold text-emerald-600 mt-1">
                Cashback {formatINR(plan.cashbackAmount)}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Interest Tag */}
        <div className="text-right shrink-0 flex flex-col items-end gap-2">
          <span
            className={`text-[12px] font-medium px-2.5 py-1 rounded-md inline-block transition-colors ${
              isZeroCost
                ? 'text-emerald-700 bg-emerald-100/50'
                : 'text-[#1d1d1f] bg-[#ebebeb]'
            }`}
          >
            {plan.interestRate}%
          </span>

          {plan.isPopular && (
            <div className="text-[10px] font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 px-2 py-0.5 rounded uppercase tracking-widest">
              Popular
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
