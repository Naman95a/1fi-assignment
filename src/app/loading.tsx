export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Skeleton */}
      <section className="relative w-full h-[80vh] min-h-[600px] bg-[#0A0A0A] overflow-hidden pt-28 pb-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center h-full">
            <div className="space-y-6 animate-pulse">
              <div className="w-48 h-8 bg-white/10 rounded-full" />
              <div className="w-full h-16 bg-white/10 rounded-xl" />
              <div className="w-3/4 h-16 bg-white/10 rounded-xl" />
              <div className="w-2/3 h-6 bg-white/10 rounded-md mt-4" />
              <div className="w-40 h-12 bg-[#8B5CF6]/50 rounded-full mt-8" />
            </div>
            <div className="hidden lg:flex justify-end items-center">
              <div className="w-[400px] h-[500px] bg-white/5 rounded-[32px] animate-pulse border border-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="py-24 bg-[#fbfbfd]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-[28px] p-6 h-[460px] animate-pulse shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between mb-8">
                    <div className="w-16 h-6 bg-slate-200 rounded-full" />
                    <div className="w-16 h-6 bg-slate-200 rounded-full" />
                  </div>
                  <div className="w-full h-48 bg-slate-100 rounded-2xl mb-8" />
                  <div className="w-3/4 h-6 bg-slate-200 rounded-md mb-2" />
                  <div className="w-1/2 h-4 bg-slate-100 rounded-md" />
                </div>
                <div className="w-full h-12 bg-slate-100 rounded-[16px] mt-4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
