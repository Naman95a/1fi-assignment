'use client';

import { TrendingUp, Coins, PiggyBank, Sparkles, CheckCircle2 } from 'lucide-react';
import { EmiPlan } from '@/types';
import { formatINR } from '@/lib/utils';

interface MutualFundExplainerProps {
  selectedPlan: EmiPlan | null;
  productPrice: number;
}

export default function MutualFundExplainer({
  selectedPlan,
  productPrice,
}: MutualFundExplainerProps) {
  const tenure = selectedPlan?.tenureMonths || 12;
  const cashback = selectedPlan?.cashbackAmount || 7500;
  
  // Calculate estimated mutual fund returns (assuming 12% p.a. CAGR on SIP or cashback investment)
  const estimatedReturns = Math.round((cashback * Math.pow(1 + 0.12, tenure / 12)) - cashback + (productPrice * 0.04));

  return (
    <div className="bg-gradient-to-br from-brand-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
      {/* Background glowing orb */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-brand-500/20 border border-brand-400/30 rounded-lg text-brand-300">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold tracking-tight">
              Why 1Fi Mutual Fund-Backed EMI is Smarter
            </h3>
          </div>
          <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Effective 0% Real Cost
          </span>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">
          Traditional EMIs drain interest every month. With 1Fi, your EMI is paired with high-performing mutual funds. While you pay your monthly installment, your simultaneous mutual fund SIP earns market returns that offset the borrowing cost.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-brand-300 text-xs font-semibold mb-1">
              <Coins className="w-4 h-4" />
              <span>Instant Cashback</span>
            </div>
            <div className="text-2xl font-black text-white">{formatINR(cashback)}</div>
            <div className="text-[11px] text-slate-400 mt-1">Directly seeded into your portfolio</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
              <PiggyBank className="w-4 h-4" />
              <span>Est. MF Growth</span>
            </div>
            <div className="text-2xl font-black text-emerald-400">+{formatINR(estimatedReturns)}</div>
            <div className="text-[11px] text-slate-400 mt-1">Over {tenure} months compounding</div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Net Device Cost</span>
            </div>
            <div className="text-2xl font-black text-amber-300">
              {formatINR(Math.max(0, productPrice - cashback - estimatedReturns))}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">After cashback & fund appreciation</div>
          </div>
        </div>
      </div>
    </div>
  );
}
