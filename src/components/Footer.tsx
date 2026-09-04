import { ShieldCheck, Zap, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-transparent bg-[#f5f5f7]">
      {/* Main footer */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-[10px] bg-[#8B5CF6] flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              ↑Fi
            </div>
            <div>
              <span className="font-bold text-[#1d1d1f] tracking-tight">1Fi Technologies</span>
              <p className="text-[11px] font-medium text-[#86868b] uppercase tracking-widest mt-0.5">Mutual Fund-Backed Smart Financing</p>
            </div>
          </div>

          <p className="text-[12px] font-medium text-[#86868b]">
            © {new Date().getFullYear()} 1Fi Technologies Pvt Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
