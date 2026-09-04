'use client';

import { ProductVariant } from '@/types';
import { HardDrive, Palette } from 'lucide-react';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
}

export default function VariantSelector({
  variants,
  selectedVariant,
  onSelectVariant,
}: VariantSelectorProps) {
  // Extract unique storages and unique colors
  const storages = Array.from(new Set(variants.map((v) => v.storage)));
  const colors = Array.from(new Set(variants.map((v) => v.color)));

  const handleStorageChange = (storage: string) => {
    // Find variant with the current color and new storage, or fallback to first matching storage
    const match =
      variants.find(
        (v) => v.storage === storage && v.color === selectedVariant.color
      ) || variants.find((v) => v.storage === storage);

    if (match) {
      onSelectVariant(match);
    }
  };

  const handleColorChange = (color: string) => {
    // Find variant with new color and current storage, or fallback to first matching color
    const match =
      variants.find(
        (v) => v.color === color && v.storage === selectedVariant.storage
      ) || variants.find((v) => v.color === color);

    if (match) {
      onSelectVariant(match);
    }
  };

  return (
    <div className="space-y-8">
      {/* Storage Selector */}
      {storages.length > 1 && (
        <div>
          <div className="flex items-center justify-between text-[13px] font-semibold text-[#1d1d1f] mb-3">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-[#86868b]" />
              SELECT STORAGE
            </span>
            <span className="text-[#86868b] font-medium">{selectedVariant.storage}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {storages.map((storage) => {
              const isSelected = selectedVariant.storage === storage;
              return (
                <button
                  key={storage}
                  onClick={() => handleStorageChange(storage)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    isSelected
                      ? 'border-[#8B5CF6] ring-1 ring-[#8B5CF6] bg-white text-[#1d1d1f] shadow-sm'
                      : 'bg-white text-[#1d1d1f] border-[#d2d2d7] hover:border-[#86868b]'
                  }`}
                >
                  <span>{storage}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
