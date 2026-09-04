'use client';

import { useState } from 'react';
import { formatINR } from '@/lib/utils';
import { TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

export default function EmiCalculator() {
  const [tenure, setTenure] = useState<6 | 12 | 18 | 24>(12);
  
  // Generic baseline for a flagship phone
  const basePrice = 120000;
  
  // Simulated mutual fund yields over tenure (dummy math for demo)
  const monthlyEmi = Math.round(basePrice / tenure);
  const totalYield = Math.round((basePrice * 0.12 * (tenure / 12)));
  const upfrontCashback = tenure >= 12 ? 7500 : 4000;
  
  const effectiveCost = basePrice - totalYield - upfrontCashback;
  const effectiveMonthly = Math.round(effectiveCost / tenure);

  return (
    <div className="bg-[#fcfbfd] rounded-[40px] p-8 md:p-12 shadow-sm border border-[#f5f5f7] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08),transparent_60%)] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
        
        {/* Left Side: Controls */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#f5f5f7] shadow-sm mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span className="text-[12px] font-bold text-[#8B5CF6] uppercase tracking-wider">Interactive Calculator</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-[#1d1d1f] tracking-tight">
              See the math for yourself.
            </h3>
            <p className="text-[15px] text-[#86868b] font-medium mt-3 leading-relaxed">
              Based on a ₹1,20,000 smartphone purchase, see how your mutual fund yields offset your costs over different tenures.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex justify-between text-sm font-semibold text-[#1d1d1f]">
              <span>Select Tenure</span>
              <span className="text-[#8B5CF6]">{tenure} Months</span>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {[6, 12, 18, 24].map((t) => (
                <button
                  key={t}
                  onClick={() => setTenure(t as any)}
                  className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                    tenure === t 
                      ? 'bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-md' 
                      : 'bg-white text-[#86868b] border-[#e5e5ea] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                  }`}
                >
                  {t}m
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#f5f5f7] shadow-sm">
            <AlertCircle className="w-5 h-5 text-[#86868b] shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#86868b] leading-relaxed">
              Returns are calculated based on a projected 12% annualized yield. Mutual fund investments are subject to market risks. Read all scheme related documents carefully.
            </p>
          </div>
        </div>

        {/* Right Side: Results */}
        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Box 1 */}
          <div className="bg-white rounded-[24px] p-6 border border-[#f5f5f7] flex flex-col justify-between shadow-sm hover:-translate-y-1 transition-transform">
            <div className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Standard EMI</div>
            <div className="text-3xl font-bold text-[#1d1d1f]">{formatINR(monthlyEmi)}<span className="text-sm font-medium text-[#86868b]">/mo</span></div>
            <div className="text-[13px] text-[#86868b] mt-4 font-medium">Standard 0% interest monthly payout.</div>
          </div>

          {/* Box 2 */}
          <div className="bg-white rounded-[24px] p-6 border border-[#f5f5f7] flex flex-col justify-between shadow-sm hover:-translate-y-1 transition-transform">
            <div className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">Upfront Cashback</div>
            <div className="text-3xl font-bold text-emerald-500">{formatINR(upfrontCashback)}</div>
            <div className="text-[13px] text-[#86868b] mt-4 font-medium">Credited instantly to your MF portfolio.</div>
          </div>

          {/* Box 3 - Full Width */}
          <div className="sm:col-span-2 bg-gradient-to-br from-[#8B5CF6]/10 to-white/50 rounded-[24px] p-8 border border-[#8B5CF6]/20 shadow-[0_8px_30px_rgba(139,92,246,0.08)] relative overflow-hidden group">
            <div className="absolute top-4 right-4 bg-[#8B5CF6] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Net Cost</div>
            <div className="text-[13px] font-bold text-[#8B5CF6] uppercase tracking-wider mb-2">Effective Monthly Cost</div>
            <div className="flex items-end gap-2">
              <div className="text-5xl font-black text-[#1d1d1f] tracking-tight">{formatINR(effectiveMonthly)}</div>
              <div className="text-base font-medium text-[#86868b] pb-1">/ mo</div>
            </div>
            
            <div className="mt-6 flex items-center gap-2 text-[14px] text-[#1d1d1f] font-medium bg-white w-fit px-4 py-2.5 rounded-full border border-[#f5f5f7] shadow-sm">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Projected yield offset: <span className="font-bold text-emerald-600">{formatINR(totalYield)}</span></span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
