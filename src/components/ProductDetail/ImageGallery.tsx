'use client';

import { useState, useEffect } from 'react';
import { VariantImage, ProductVariant } from '@/types';

interface ImageGalleryProps {
  images: VariantImage[];
  activeVariant: ProductVariant;
  allVariants: ProductVariant[];
  onSelectVariant: (variant: ProductVariant) => void;
  badge?: string | null;
  brand?: string;
}

export default function ImageGallery({
  images,
  activeVariant,
  allVariants,
  onSelectVariant,
  brand,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0].url);
    }
  }, [images, activeVariant]);

  // Unique color variants for color dots
  const uniqueColorVariants = allVariants.filter(
    (v, index, self) => index === self.findIndex((t) => t.color === v.color)
  );

  return (
    <div className="relative flex flex-col items-center p-6 sm:p-10 bg-[#fbfbfd] rounded-[32px] overflow-hidden border border-[#d2d2d7]/30 shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,48,224,0.04),transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 w-full flex flex-col md:flex-row gap-6 items-center justify-center">
        
        {/* Thumbnails (Vertical on Desktop, Horizontal on Mobile) */}
        {images.length > 1 && (
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[400px] order-2 md:order-1 no-scrollbar p-1">
            {images.map((img, idx) => (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setSelectedImage(img.url)}
                className={`w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-2xl overflow-hidden border-2 p-1.5 bg-white transition-all ${
                  selectedImage === img.url
                    ? 'border-[#8B5CF6] shadow-sm ring-2 ring-[#8B5CF6]/10'
                    : 'border-transparent hover:border-[#d2d2d7] opacity-70 hover:opacity-100 shadow-sm'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.alt || `Angle ${idx + 1}`}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main product showcase image */}
        <div className={`w-full aspect-[4/5] flex items-center justify-center order-1 md:order-2 ${brand === 'Apple' ? 'max-w-[280px] sm:max-w-[400px]' : 'max-w-[200px] sm:max-w-[280px] px-2'}`}>
          {selectedImage ? (
            <img
              src={selectedImage}
              alt={activeVariant.name}
              className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 ease-out hover:scale-[1.02] mix-blend-darken"
            />
          ) : (
            <div className="w-full h-full bg-[#f5f5f7] rounded-3xl animate-pulse" />
          )}
        </div>
      </div>

      {/* Finishes section */}
      <div className="mt-10 flex flex-col items-center gap-4 w-full border-t border-[#d2d2d7]/40 pt-6">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[13px] font-medium text-[#86868b]">
            Available in {uniqueColorVariants.length} finishes
          </span>
          <span className="text-[15px] font-semibold text-[#1d1d1f]">
            Color: <span className="text-[#8B5CF6]">{activeVariant.color}</span>
          </span>
        </div>
        <div className="flex items-center gap-4 p-2.5 bg-white rounded-full shadow-[0_4px_12px_rgb(0,0,0,0.05)] border border-[#d2d2d7]/30">
          {uniqueColorVariants.map((v) => {
            const isSelected = activeVariant.color === v.color;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelectVariant(v)}
                title={v.color}
                className={`w-7 h-7 rounded-full transition-all flex items-center justify-center ${
                  isSelected
                    ? 'ring-2 ring-[#8B5CF6] ring-offset-2 scale-110 shadow-md'
                    : 'hover:scale-110 opacity-80 hover:opacity-100 shadow-sm'
                }`}
                style={{ backgroundColor: v.colorHex }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
