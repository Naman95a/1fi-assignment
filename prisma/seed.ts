import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to compute EMI
function calculateEmi(principal: number, tenureMonths: number, annualRate: number): number {
  if (annualRate === 0) {
    return Math.round(principal / tenureMonths);
  }
  const monthlyRate = annualRate / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
}

// Plan templates matching assignment requirements & reference image
const planTemplates = [
  { tenure: 3, interestRate: 0, isPopular: false, cashback: 7500 },
  { tenure: 6, interestRate: 0, isPopular: false, cashback: 7500 },
  { tenure: 12, interestRate: 0, isPopular: true, cashback: 7500 },
  { tenure: 24, interestRate: 0, isPopular: false, cashback: 7500 },
  { tenure: 36, interestRate: 10.5, isPopular: false, cashback: 7500 },
  { tenure: 48, interestRate: 10.5, isPopular: false, cashback: 7500 },
  { tenure: 60, interestRate: 10.5, isPopular: false, cashback: 7500 },
];

async function main() {
  console.log('🌱 Starting PostgreSQL database seeding for 1Fi...');

  // 1. Clean existing tables
  await prisma.order.deleteMany();
  await prisma.emiPlan.deleteMany();
  await prisma.variantImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  // -------------------------------------------------------------
  // Product 1: Apple iPhone 17 Pro
  // -------------------------------------------------------------
  const iphone = await prisma.product.create({
    data: {
      slug: 'iphone-17-pro',
      name: 'iPhone 17 Pro',
      brand: 'Apple',
      description: 'Engineered from forged aerospace-grade titanium with an advanced 48MP Pro camera system, Super Retina XDR display with ProMotion up to 120Hz, and ground-breaking battery efficiency backed by flexible mutual fund EMI plans.',
      badge: 'NEW',
      basePrice: 127400,
      baseMrp: 134900,
    },
  });

  const iphoneVariants = [
    {
      name: 'iPhone 17 Pro 256GB - Cosmic Orange',
      color: 'Cosmic Orange',
      colorHex: '#FF8C00',
      storage: '256GB',
      price: 127400,
      mrp: 134900,
      sku: 'IPH-17P-256-ORANGE',
      isDefault: true,
      images: [
        'https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/n/v/a/-original-imahft5nxmyqndhf.jpeg?q=90',
        'https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/x/f/k/-original-imahft5nzadqmyzz.jpeg?q=90',
      ],
    },
    {
      name: 'iPhone 17 Pro 512GB - Cosmic Orange',
      color: 'Cosmic Orange',
      colorHex: '#FF8C00',
      storage: '512GB',
      price: 147400,
      mrp: 154900,
      sku: 'IPH-17P-512-ORANGE',
      isDefault: false,
      images: [
        'https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/n/v/a/-original-imahft5nxmyqndhf.jpeg?q=90',
        'https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/x/f/k/-original-imahft5nzadqmyzz.jpeg?q=90',
      ],
    },
    {
      name: 'iPhone 17 Pro 256GB - Silver',
      color: 'Silver',
      colorHex: '#C0C0C0',
      storage: '256GB',
      price: 127400,
      mrp: 134900,
      sku: 'IPH-17P-256-SILVER',
      isDefault: false,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/b/j/o/-original-imahft5nm9eewyzh.jpeg?q=90',
        'https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/j/x/c/-original-imahft5npy3u7mjx.jpeg?q=90'
      ],
    },
    {
      name: 'iPhone 17 Pro 512GB - Silver',
      color: 'Silver',
      colorHex: '#C0C0C0',
      storage: '512GB',
      price: 147400,
      mrp: 154900,
      sku: 'IPH-17P-512-SILVER',
      isDefault: false,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/b/j/o/-original-imahft5nm9eewyzh.jpeg?q=90',
        'https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/j/x/c/-original-imahft5npy3u7mjx.jpeg?q=90'
      ],
    },
    {
      name: 'iPhone 17 Pro 256GB - Deep Blue',
      color: 'Deep Blue',
      colorHex: '#00008B',
      storage: '256GB',
      price: 127400,
      mrp: 134900,
      sku: 'IPH-17P-256-BLUE',
      isDefault: false,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/5/i/n/-original-imahft5ndwfkx6ez.jpeg?q=90',
        'https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/c/k/m/-original-imahft5nz2k5gfm3.jpeg?q=90'
      ],
    },
    {
      name: 'iPhone 17 Pro 512GB - Deep Blue',
      color: 'Deep Blue',
      colorHex: '#00008B',
      storage: '512GB',
      price: 147400,
      mrp: 154900,
      sku: 'IPH-17P-512-BLUE',
      isDefault: false,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/5/i/n/-original-imahft5ndwfkx6ez.jpeg?q=90',
        'https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/c/k/m/-original-imahft5nz2k5gfm3.jpeg?q=90'
      ],
    },
  ];

  for (const vData of iphoneVariants) {
    const variant = await prisma.productVariant.create({
      data: {
        productId: iphone.id,
        name: vData.name,
        color: vData.color,
        colorHex: vData.colorHex,
        storage: vData.storage,
        price: vData.price,
        mrp: vData.mrp,
        sku: vData.sku,
        isDefault: vData.isDefault,
        images: {
          create: vData.images.map((url, idx) => ({
            url,
            alt: `${vData.name} view ${idx + 1}`,
            isPrimary: idx === 0,
            order: idx,
          })),
        },
      },
    });

    for (const t of planTemplates) {
      let monthly = calculateEmi(vData.price, t.tenure, t.interestRate);
      if (vData.price === 127400) {
        if (t.tenure === 3) monthly = 44967;
        else if (t.tenure === 6) monthly = 22483;
        else if (t.tenure === 12) monthly = 11242;
        else if (t.tenure === 24) monthly = 5621;
        else if (t.tenure === 36) monthly = 4297;
        else if (t.tenure === 48) monthly = 3385;
        else if (t.tenure === 60) monthly = 2842;
      }

      await prisma.emiPlan.create({
        data: {
          productId: iphone.id,
          variantId: variant.id,
          monthlyAmount: monthly,
          tenureMonths: t.tenure,
          interestRate: t.interestRate,
          cashbackAmount: t.cashback,
          mutualFundBacking: 'EMI plans backed by mutual funds',
          isPopular: t.isPopular,
        },
      });
    }
  }

  // -------------------------------------------------------------
  // Product 2: Samsung Galaxy S26 Ultra
  // -------------------------------------------------------------
  const samsung = await prisma.product.create({
    data: {
      slug: 'samsung-s26-ultra',
      name: 'Samsung Galaxy S26 Ultra',
      brand: 'Samsung',
      description: 'Unleash the pinnacle of mobile innovation with Galaxy AI, embedded S Pen stylus, revolutionary 200MP Quad Telephoto imaging system, aerospace titanium armor, and the hyper-efficient Snapdragon 8 flagship platform.',
      badge: 'LATEST FLAGSHIP',
      basePrice: 139999,
      baseMrp: 149999,
    },
  });

  const samsungVariants = [
    {
      name: 'Samsung Galaxy S26 Ultra 256GB - Cobalt Violet',
      color: 'Cobalt Violet',
      colorHex: '#5A4FCF',
      storage: '12GB RAM + 256GB',
      price: 139999,
      mrp: 149999,
      sku: 'SAM-S26U-256-VIOLET',
      isDefault: true,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/y/t/3/-enriched-transparent-original-imahhyzrqqfs6yvp.png?q=90'
      ],
    },
    {
      name: 'Samsung Galaxy S26 Ultra 512GB - Cobalt Violet',
      color: 'Cobalt Violet',
      colorHex: '#5A4FCF',
      storage: '12GB RAM + 512GB',
      price: 154999,
      mrp: 169999,
      sku: 'SAM-S26U-512-VIOLET',
      isDefault: false,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/y/t/3/-enriched-transparent-original-imahhyzrqqfs6yvp.png?q=90'],
    },
    {
      name: 'Samsung Galaxy S26 Ultra 256GB - Black',
      color: 'Black',
      colorHex: '#252525',
      storage: '12GB RAM + 256GB',
      price: 139999,
      mrp: 149999,
      sku: 'SAM-S26U-256-BLACK',
      isDefault: false,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/d/0/x/-original-imahhyzrnhgzvdk4.jpeg?q=90'],
    },
    {
      name: 'Samsung Galaxy S26 Ultra 512GB - Black',
      color: 'Black',
      colorHex: '#252525',
      storage: '12GB RAM + 512GB',
      price: 154999,
      mrp: 169999,
      sku: 'SAM-S26U-512-BLACK',
      isDefault: false,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/d/0/x/-original-imahhyzrnhgzvdk4.jpeg?q=90'],
    },
    {
      name: 'Samsung Galaxy S26 Ultra 256GB - Sky Blue',
      color: 'Sky Blue',
      colorHex: '#87CEEB',
      storage: '12GB RAM + 256GB',
      price: 139999,
      mrp: 149999,
      sku: 'SAM-S26U-256-BLUE',
      isDefault: false,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/o/3/l/-enriched-transparent-original-imahhyzrvdyxntww.png?q=90'],
    },
    {
      name: 'Samsung Galaxy S26 Ultra 512GB - Sky Blue',
      color: 'Sky Blue',
      colorHex: '#87CEEB',
      storage: '12GB RAM + 512GB',
      price: 154999,
      mrp: 169999,
      sku: 'SAM-S26U-512-BLUE',
      isDefault: false,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/o/3/l/-enriched-transparent-original-imahhyzrvdyxntww.png?q=90'],
    },
    {
      name: 'Samsung Galaxy S26 Ultra 256GB - White',
      color: 'White',
      colorHex: '#FFFFFF',
      storage: '12GB RAM + 256GB',
      price: 139999,
      mrp: 149999,
      sku: 'SAM-S26U-256-WHITE',
      isDefault: false,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/u/9/o/-original-imahhyzrehyykjet.jpeg?q=90'],
    },
    {
      name: 'Samsung Galaxy S26 Ultra 512GB - White',
      color: 'White',
      colorHex: '#FFFFFF',
      storage: '12GB RAM + 512GB',
      price: 154999,
      mrp: 169999,
      sku: 'SAM-S26U-512-WHITE',
      isDefault: false,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/u/9/o/-original-imahhyzrehyykjet.jpeg?q=90'],
    },
  ];

  for (const vData of samsungVariants) {
    const variant = await prisma.productVariant.create({
      data: {
        productId: samsung.id,
        name: vData.name,
        color: vData.color,
        colorHex: vData.colorHex,
        storage: vData.storage,
        price: vData.price,
        mrp: vData.mrp,
        sku: vData.sku,
        isDefault: vData.isDefault,
        images: {
          create: vData.images.map((url, idx) => ({
            url,
            alt: `${vData.name} view ${idx + 1}`,
            isPrimary: idx === 0,
            order: idx,
          })),
        },
      },
    });

    for (const t of planTemplates) {
      const monthly = calculateEmi(vData.price, t.tenure, t.interestRate);
      await prisma.emiPlan.create({
        data: {
          productId: samsung.id,
          variantId: variant.id,
          monthlyAmount: monthly,
          tenureMonths: t.tenure,
          interestRate: t.interestRate,
          cashbackAmount: t.cashback,
          mutualFundBacking: 'EMI plans backed by mutual funds',
          isPopular: t.isPopular,
        },
      });
    }
  }

  // -------------------------------------------------------------
  // Product 3: Google Pixel 11 Pro
  // -------------------------------------------------------------
  const pixel = await prisma.product.create({
    data: {
      slug: 'google-pixel-11-pro',
      name: 'Google Pixel 11 Pro',
      brand: 'Google',
      description: 'Experience pure Android perfection with next-gen Google Tensor silicon, Gemini Live multimodal AI assistant, studio-grade triple camera system with 30x Super Res Zoom, and 7 years of Pixel Feature Drops.',
      badge: 'GEMINI AI',
      basePrice: 109999,
      baseMrp: 119999,
    },
  });

  const pixelVariants = [
    {
      name: 'Google Pixel 11 Pro 256GB - Canyon',
      color: 'Canyon',
      colorHex: '#C17767',
      storage: '16GB RAM + 256GB',
      price: 109999,
      mrp: 119999,
      sku: 'GGL-PX11P-256-CANYON',
      isDefault: true,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/r/8/5/-original-imahqszeezpzdzmn.jpeg?q=90'],
    },
    {
      name: 'Google Pixel 11 Pro 512GB - Canyon',
      color: 'Canyon',
      colorHex: '#C17767',
      storage: '16GB RAM + 512GB',
      price: 119999,
      mrp: 129999,
      sku: 'GGL-PX11P-512-CANYON',
      isDefault: false,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/r/8/5/-original-imahqszeezpzdzmn.jpeg?q=90'],
    },
    {
      name: 'Google Pixel 11 Pro 256GB - Fog',
      color: 'Fog',
      colorHex: '#EAE6DF',
      storage: '16GB RAM + 256GB',
      price: 109999,
      mrp: 119999,
      sku: 'GGL-PX11P-256-FOG',
      isDefault: false,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/1/m/f/-original-imahqszejvwyn4h6.jpeg?q=90'],
    },
    {
      name: 'Google Pixel 11 Pro 512GB - Fog',
      color: 'Fog',
      colorHex: '#EAE6DF',
      storage: '16GB RAM + 512GB',
      price: 119999,
      mrp: 129999,
      sku: 'GGL-PX11P-512-FOG',
      isDefault: false,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/1/m/f/-original-imahqszejvwyn4h6.jpeg?q=90'],
    },
    {
      name: 'Google Pixel 11 Pro 256GB - Olive',
      color: 'Olive',
      colorHex: '#808000',
      storage: '16GB RAM + 256GB',
      price: 109999,
      mrp: 119999,
      sku: 'GGL-PX11P-256-OLIVE',
      isDefault: false,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/q/9/y/-original-imahqszecqdhmabj.jpeg?q=90'],
    },
    {
      name: 'Google Pixel 11 Pro 512GB - Olive',
      color: 'Olive',
      colorHex: '#808000',
      storage: '16GB RAM + 512GB',
      price: 119999,
      mrp: 129999,
      sku: 'GGL-PX11P-512-OLIVE',
      isDefault: false,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/q/9/y/-original-imahqszecqdhmabj.jpeg?q=90'],
    },
    {
      name: 'Google Pixel 11 Pro 256GB - Obsidian',
      color: 'Obsidian',
      colorHex: '#1E2022',
      storage: '16GB RAM + 256GB',
      price: 109999,
      mrp: 119999,
      sku: 'GGL-PX11P-256-OBSIDIAN',
      isDefault: false,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/d/i/c/-original-imahqszefvhsy2rs.jpeg?q=90'],
    },
    {
      name: 'Google Pixel 11 Pro 512GB - Obsidian',
      color: 'Obsidian',
      colorHex: '#1E2022',
      storage: '16GB RAM + 512GB',
      price: 119999,
      mrp: 129999,
      sku: 'GGL-PX11P-512-OBSIDIAN',
      isDefault: false,
      images: ['https://rukminim2.flixcart.com/image/2940/2940/xif0q/mobile/d/i/c/-original-imahqszefvhsy2rs.jpeg?q=90'],
    },
  ];

  for (const vData of pixelVariants) {
    const variant = await prisma.productVariant.create({
      data: {
        productId: pixel.id,
        name: vData.name,
        color: vData.color,
        colorHex: vData.colorHex,
        storage: vData.storage,
        price: vData.price,
        mrp: vData.mrp,
        sku: vData.sku,
        isDefault: vData.isDefault,
        images: {
          create: vData.images.map((url, idx) => ({
            url,
            alt: `${vData.name} view ${idx + 1}`,
            isPrimary: idx === 0,
            order: idx,
          })),
        },
      },
    });

    for (const t of planTemplates) {
      const monthly = calculateEmi(vData.price, t.tenure, t.interestRate);
      await prisma.emiPlan.create({
        data: {
          productId: pixel.id,
          variantId: variant.id,
          monthlyAmount: monthly,
          tenureMonths: t.tenure,
          interestRate: t.interestRate,
          cashbackAmount: t.cashback,
          mutualFundBacking: 'EMI plans backed by mutual funds',
          isPopular: t.isPopular,
        },
      });
    }
  }

  console.log('✅ PostgreSQL database seeded successfully with accurate combinations for all products!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
