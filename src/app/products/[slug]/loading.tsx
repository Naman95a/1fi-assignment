export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-0 py-8 sm:py-12">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-8 animate-pulse">
        <div className="w-16 h-4 bg-slate-200 rounded" />
        <div className="w-4 h-4 bg-slate-200 rounded" />
        <div className="w-24 h-4 bg-slate-200 rounded" />
        <div className="w-4 h-4 bg-slate-200 rounded" />
        <div className="w-32 h-4 bg-slate-300 rounded" />
      </div>

      <div className="bg-white rounded-[32px] p-6 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-10 animate-pulse">
        
        {/* Top Header Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-8 border-b border-slate-100">
          <div className="lg:col-span-7 space-y-4">
            <div className="w-20 h-6 bg-rose-100 rounded" />
            <div className="w-3/4 h-12 bg-slate-200 rounded-xl" />
            <div className="w-1/4 h-6 bg-slate-100 rounded" />
          </div>
          <div className="lg:col-span-5 lg:text-right space-y-4 mt-4 lg:mt-0 lg:flex lg:flex-col lg:items-end">
            <div className="w-48 h-10 bg-slate-200 rounded-xl" />
            <div className="w-32 h-4 bg-slate-100 rounded" />
            <div className="w-64 h-4 bg-slate-100 rounded" />
          </div>
        </div>

        {/* 2-Column Body Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="w-full aspect-[4/5] bg-slate-100 rounded-[32px]" />
            <div className="w-full h-40 bg-slate-50 rounded-[24px]" />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full h-24 bg-slate-50 rounded-[20px] border border-slate-100" />
            ))}
            <div className="w-full h-16 bg-slate-200 rounded-full mt-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
