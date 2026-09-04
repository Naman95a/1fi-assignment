export interface VariantImage {
  id: string;
  variantId: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface EmiPlan {
  id: string;
  productId: string;
  variantId?: string | null;
  tenureMonths: number;
  interestRate: number;
  monthlyAmount: number;
  cashbackAmount: number;
  mutualFundBacking: string;
  isZeroCost: boolean;
  isPopular: boolean;
  processingFee: number;
  totalInterestSaved: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  color: string;
  colorHex: string;
  storage: string;
  mrp: number;
  price: number;
  stock: number;
  sku: string;
  isDefault: boolean;
  images: VariantImage[];
  emiPlans?: EmiPlan[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  tagline?: string | null;
  description: string;
  badge?: string | null;
  baseMrp: number;
  basePrice: number;
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  emiPlans?: EmiPlan[];
}

export interface OrderPayload {
  emiPlanId: string;
  variantId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  panNumber?: string;
}
