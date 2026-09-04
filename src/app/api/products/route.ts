import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        variants: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            emiPlans: {
              where: { tenureMonths: 12 },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedProducts = products.map((prod) => {
      const defaultVariant =
        prod.variants.find((v) => v.isDefault) || prod.variants[0];
      const primaryImg =
        defaultVariant?.images[0]?.url ||
        prod.variants[0]?.images[0]?.url ||
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569';
      const startingMonthlyEmi =
        defaultVariant?.emiPlans[0]?.monthlyAmount ||
        Math.round(prod.basePrice / 12);

      return {
        id: prod.id,
        slug: prod.slug,
        name: prod.name,
        brand: prod.brand,
        description: prod.description,
        badge: prod.badge,
        basePrice: prod.basePrice,
        baseMrp: prod.baseMrp,
        variantsCount: prod.variants.length,
        primaryImage: primaryImg,
        startingMonthlyEmi: startingMonthlyEmi,
        createdAt: prod.createdAt,
      };
    });

    return NextResponse.json(
      {
        success: true,
        count: formattedProducts.length,
        data: formattedProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching products list:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products from database',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
