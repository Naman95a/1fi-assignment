import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const rawSlug = params.slug;
    const slug =
      rawSlug === 'samsung-s24-ultra' ? 'samsung-s26-ultra' :
      rawSlug === 'google-pixel-9-pro' ? 'google-pixel-11-pro' :
      rawSlug === 'google-pixel-10-pro' ? 'google-pixel-11-pro' : rawSlug;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Product slug or ID is required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug: slug }, { id: slug }],
      },
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
          orderBy: { price: 'asc' },
        },
        emiPlans: {
          orderBy: { tenureMonths: 'asc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: `Product not found with slug or ID: ${slug}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error fetching product ${params.slug}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product details',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
