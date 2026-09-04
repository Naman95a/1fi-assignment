import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import EmiCalculator from '@/components/EmiCalculator';
import Link from 'next/link';
import { 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  Coins, 
  ShieldCheck, 
  Zap, 
  Smartphone,
  ChevronRight
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch products with their variants, images, and EMI plans
  const products = await prisma.product.findMany({
    include: {
      variants: {
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          emiPlans: {
            orderBy: { tenureMonths: 'asc' },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Extract a hero product for the dynamic image (e.g., iPhone 17 Pro if available, otherwise first)
  const heroProduct = products.find(p => p.slug === 'iphone-17-pro') || products[0];
  const heroImage = heroProduct?.variants[0]?.images[0]?.url;
  const startingEmi = heroProduct?.variants[0]?.emiPlans?.find(p => p.tenureMonths === 12)?.monthlyAmount || 11242;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full bg-[#fcfbfd] overflow-hidden pt-28 pb-20 lg:pt-32 lg:pb-32">
        
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="flex flex-col items-start text-left space-y-7 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
                <span className="text-[12px] font-medium text-[#8B5CF6]">Smartphone financing, reimagined</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1d1d1f] leading-[1.1]">
                Own the phone you want. <br />
                <span className="text-[#8B5CF6]">
                  Invest smarter while you pay.
                </span>
              </h1>
              
              <p className="text-[17px] text-[#86868b] font-medium leading-relaxed max-w-lg">
                Choose flexible EMI plans with a mutual-fund-backed financing approach.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
                <Link
                  href="/products/iphone-17-pro"
                  className="w-full sm:w-auto bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[14px] font-medium px-8 py-3 rounded-full transition-all flex items-center justify-center gap-2 group shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  <span>Explore Phones</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="w-full sm:w-auto bg-transparent hover:bg-[#f5f5f7] text-[#1d1d1f] text-[14px] font-medium px-8 py-3 rounded-full transition-colors flex items-center justify-center border border-[#d2d2d7]"
                >
                  How it works
                </Link>
              </div>
            </div>

            {/* Right Content - Hero Showcase */}
            {heroImage && (
              <div className="relative flex justify-center lg:justify-end animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <div className="relative w-full max-w-[400px] aspect-[4/5] flex items-center justify-center">
                  
                  {/* Subtle Off-White/Lavender Presentation Card */}
                  <div className="relative z-10 w-full h-full bg-white rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] flex items-center justify-center p-10 border border-[#f5f5f7] overflow-visible">
                    
                    {/* Inner subtle glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0%,transparent_70%)] rounded-[32px] pointer-events-none" />

                    {/* Floating Widget 1 */}
                    <div className="absolute top-10 -left-6 sm:-left-10 bg-white/95 backdrop-blur-xl border border-[#f5f5f7] rounded-2xl p-3.5 shadow-[0_8px_20px_rgb(0,0,0,0.04)] z-20 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                      <div className="text-[10px] text-[#86868b] uppercase tracking-wider font-bold mb-1">Flexible EMI</div>
                      <div className="text-[#1d1d1f] font-bold text-[15px] flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                        12 Months
                      </div>
                    </div>

                    {/* Floating Widget 2 */}
                    <div className="absolute bottom-20 -right-6 sm:-right-8 bg-white/95 backdrop-blur-xl border border-[#f5f5f7] rounded-2xl p-3.5 shadow-[0_8px_20px_rgb(0,0,0,0.04)] z-20 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                      <div className="text-[10px] text-[#86868b] uppercase tracking-wider font-bold mb-1">Starting From</div>
                      <div className="text-[#1d1d1f] font-bold text-[15px]">₹{startingEmi.toLocaleString('en-IN')}<span className="text-[#86868b] text-[12px] font-medium">/mo</span></div>
                    </div>

                    <img 
                      src={heroImage} 
                      alt="Hero Product Showcase" 
                      className="relative z-10 w-[90%] h-auto object-contain transition-transform duration-700 hover:scale-105 mix-blend-multiply"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 2. TRUST / VALUE STRIP */}
      <section className="border-b border-[#f5f5f7] bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:flex md:flex-row md:items-center md:justify-between md:divide-x md:divide-[#f5f5f7] gap-y-8 md:gap-y-0">
            
            <div className="flex flex-col items-start md:px-8 first:md:pl-0 gap-2 w-full">
              <ShieldCheck className="w-5 h-5 text-[#8B5CF6]" />
              <div>
                <div className="text-[14px] font-semibold text-[#1d1d1f]">Flexible EMI plans</div>
                <div className="text-[12px] text-[#86868b] font-medium mt-0.5">Pay at your own pace</div>
              </div>
            </div>

            <div className="flex flex-col items-start md:px-8 gap-2 w-full">
              <Zap className="w-5 h-5 text-[#8B5CF6]" />
              <div>
                <div className="text-[14px] font-semibold text-[#1d1d1f]">Transparent pricing</div>
                <div className="text-[12px] text-[#86868b] font-medium mt-0.5">Zero hidden fees</div>
              </div>
            </div>

            <div className="flex flex-col items-start md:px-8 gap-2 w-full">
              <TrendingUp className="w-5 h-5 text-[#8B5CF6]" />
              <div>
                <div className="text-[14px] font-semibold text-[#1d1d1f]">Mutual-fund backed</div>
                <div className="text-[12px] text-[#86868b] font-medium mt-0.5">Offset borrowing costs</div>
              </div>
            </div>

            <div className="flex flex-col items-start md:px-8 last:md:pr-0 gap-2 w-full">
              <CheckCircle2 className="w-5 h-5 text-[#8B5CF6]" />
              <div>
                <div className="text-[14px] font-semibold text-[#1d1d1f]">Simple digital experience</div>
                <div className="text-[12px] text-[#86868b] font-medium mt-0.5">Paperless approval</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCT */}
      {(() => {
        const featuredProduct = products.find(p => p.slug === 'samsung-galaxy-s24-ultra') || products[1] || products[0];
        const featuredImage = featuredProduct?.variants[0]?.images[0]?.url;
        const featuredEmi = featuredProduct?.variants[0]?.emiPlans?.find(p => p.tenureMonths === 12)?.monthlyAmount || 0;
        
        if (!featuredProduct || !featuredImage) return null;

        return (
          <section className="py-24 lg:py-32 bg-[#fcfbfd] overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
                <div className="lg:col-span-7 order-2 lg:order-1 relative w-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0%,transparent_60%)] rounded-full pointer-events-none" />
                  <img 
                    src={featuredImage} 
                    alt={featuredProduct.name}
                    className="relative z-10 w-[85%] max-w-[500px] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 mix-blend-darken" 
                  />
                </div>
                
                <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col items-start space-y-7">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#f5f5f7] shadow-sm text-[#8B5CF6] text-[10px] font-bold uppercase tracking-widest">
                    Featured Product
                  </div>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1d1d1f] tracking-tight leading-[1.05]">
                    Your next upgrade. <br />
                    <span className="text-[#86868b]">Without the friction.</span>
                  </h2>
                  <p className="text-[17px] text-[#86868b] font-medium leading-relaxed max-w-md">
                    Experience the new {featuredProduct.name} starting at just <span className="text-[#1d1d1f] font-bold">₹{featuredEmi.toLocaleString('en-IN')}/mo</span>. Beautifully offset by mutual-fund-backed EMI.
                  </p>
                  
                  <div className="pt-2">
                    <Link
                      href={`/products/${featuredProduct.slug}`}
                      className="inline-flex items-center gap-2 bg-[#1d1d1f] hover:bg-[#8B5CF6] text-white text-[15px] font-medium px-8 py-4 rounded-full transition-colors group shadow-[0_8px_20px_rgb(0,0,0,0.08)]"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* 4. PRODUCT SHOWCASE */}
      <section id="products" className="py-24 bg-[#fbfbfd]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-5xl font-bold text-[#1d1d1f] tracking-tight">
                Choose your next phone
              </h2>
              <p className="text-[17px] text-[#86868b] mt-4 font-medium">
                Premium smartphones seamlessly bundled with flexible, investment-backed EMI options.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. THE 1Fi ADVANTAGE */}
      <section className="py-24 lg:py-32 bg-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1d1d1f] tracking-tight mb-6">
              The 1Fi Advantage
            </h2>
            <p className="text-[18px] text-[#86868b] leading-relaxed font-medium">
              Understanding mutual-fund-backed EMI. Your EMI plan doesn't just spread out payments—a portion is structurally invested in top-performing SIPs to generate yields that offset traditional finance costs.
            </p>
          </div>

          <div className="bg-[#fcfbfd] rounded-[40px] border border-[#f5f5f7] shadow-sm p-10 lg:p-16 relative">
            
            <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/30 to-transparent -translate-y-1/2 z-0" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8 relative z-10">
              
              <div className="flex flex-col items-center text-center relative">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-[#f5f5f7] flex items-center justify-center mb-8 rotate-3 transition-transform hover:rotate-0 duration-300">
                  <Smartphone className="w-8 h-8 text-[#1d1d1f]" />
                </div>
                <h3 className="text-xl font-bold text-[#1d1d1f] mb-3">Premium Device</h3>
                <p className="text-[14px] text-[#86868b] font-medium leading-relaxed max-w-[260px]">
                  Take home your flagship smartphone today with zero upfront compromise.
                </p>
                {/* Mobile connector */}
                <div className="lg:hidden w-[1px] h-10 bg-[#8B5CF6]/20 mt-8" />
              </div>

              <div className="flex flex-col items-center text-center relative">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-[#f5f5f7] flex items-center justify-center mb-8 -rotate-3 transition-transform hover:rotate-0 duration-300">
                  <Zap className="w-8 h-8 text-[#1d1d1f]" />
                </div>
                <h3 className="text-xl font-bold text-[#1d1d1f] mb-3">EMI Plan</h3>
                <p className="text-[14px] text-[#86868b] font-medium leading-relaxed max-w-[260px]">
                  Pay predictable monthly installments through our automated digital platform.
                </p>
                {/* Mobile connector */}
                <div className="lg:hidden w-[1px] h-10 bg-[#8B5CF6]/20 mt-8" />
              </div>

              <div className="flex flex-col items-center text-center relative group">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-[0_8px_30px_rgb(139,92,246,0.15)] border border-[#8B5CF6]/20 flex items-center justify-center mb-8 transition-transform group-hover:scale-105 duration-300 relative">
                  <div className="absolute inset-0 bg-[#8B5CF6]/5 rounded-3xl" />
                  <TrendingUp className="w-8 h-8 text-[#8B5CF6] relative z-10" />
                </div>
                <h3 className="text-xl font-bold text-[#1d1d1f] mb-3">Mutual Fund Backing</h3>
                <p className="text-[14px] text-[#86868b] font-medium leading-relaxed max-w-[260px]">
                  A portion is invested in disciplined SIPs, generating yields to offset interest costs.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE EMI CALCULATOR */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <EmiCalculator />
        </div>
      </section>

      {/* 6. HOW IT WORKS TIMELINE */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1d1d1f] tracking-tight">How it works</h2>
            <p className="text-[17px] text-[#86868b] font-medium mt-4">Three simple steps to your new smartphone.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-12 relative">
            {/* Desktop continuous connecting line */}
            <div className="hidden lg:block absolute top-10 left-12 right-12 h-[1px] bg-[#f5f5f7] z-0" />

            {[
              { num: '01', title: 'Choose your phone', desc: 'Select from our curated list of flagship Apple, Samsung, and Google devices.' },
              { num: '02', title: 'Select your EMI plan', desc: 'Pick a tenure that works for you and review mutual-fund offset projections.' },
              { num: '03', title: 'Continue with your application', desc: 'Complete a seamless digital checkout and get instant approval.' }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 bg-white group flex flex-col items-start pr-8">
                <div className="text-[80px] leading-none font-black text-[#f5f5f7] mb-6 group-hover:text-[#8B5CF6]/10 transition-colors tracking-tighter">
                  {step.num}
                </div>
                <h4 className="text-xl font-bold text-[#1d1d1f] mb-3">{step.title}</h4>
                <p className="text-[15px] text-[#86868b] font-medium leading-relaxed max-w-sm">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-8">
          <div className="bg-[#fcfbfd] border border-[#f5f5f7] rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(139,92,246,0.12),transparent_60%)] pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight">
                Your next phone is closer than you think.
              </h2>
              <p className="text-[17px] text-[#86868b] font-medium leading-relaxed">
                Explore available smartphones and choose an EMI plan that works brilliantly for your financial goals.
              </p>
              <div className="pt-4">
                <Link
                  href="/products/iphone-17-pro"
                  className="inline-flex items-center gap-2 bg-[#1d1d1f] hover:bg-[#8B5CF6] text-white text-[15px] font-medium px-8 py-4 rounded-full transition-colors shadow-md"
                >
                  Explore Phones
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

