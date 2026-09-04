import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductClientView from '@/components/ProductDetail/ProductClientView';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const rawSlug = params.slug;
  const slug =
    rawSlug === 'samsung-s24-ultra' ? 'samsung-s26-ultra' :
    rawSlug === 'google-pixel-9-pro' ? 'google-pixel-11-pro' :
    rawSlug === 'google-pixel-10-pro' ? 'google-pixel-11-pro' : rawSlug;

  const product = await prisma.product.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
  });

  if (!product) {
    return {
      title: 'Product Not Found | 1Fi',
    };
  }

  return {
    title: `${product.name} - Mutual Fund Backed EMI Plans | 1Fi`,
    description: `Buy ${product.name} on 0% effective EMI backed by mutual funds. Instant approval, no cost EMI options, and guaranteed cashback with 1Fi.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const rawSlug = params.slug;
  const slug =
    rawSlug === 'samsung-s24-ultra' ? 'samsung-s26-ultra' :
    rawSlug === 'google-pixel-9-pro' ? 'google-pixel-11-pro' :
    rawSlug === 'google-pixel-10-pro' ? 'google-pixel-11-pro' : rawSlug;

  const product = await prisma.product.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
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
      },
      emiPlans: {
        orderBy: { tenureMonths: 'asc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-[#f5f5f7] min-h-screen pt-4">
      <ProductClientView product={product as any} />
    </div>
  );
}
