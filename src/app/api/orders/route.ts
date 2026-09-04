import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createOrderSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON payload provided.',
        },
        { status: 400 }
      );
    }

    // 1. Validate payload schema with Zod
    const validationResult = createOrderSchema.safeParse(body);
    if (!validationResult.success) {
      const issues = validationResult.error.issues || [];
      const formattedErrors = issues.map((e) => e.message).join(', ') || 'Invalid input data';
      return NextResponse.json(
        {
          success: false,
          error: `Validation error: ${formattedErrors}`,
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { variantId, emiPlanId, customerName, customerPhone, customerEmail, panNumber } =
      validationResult.data;

    // 2. Verify that the selected variant exists
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: true,
      },
    });

    if (!variant) {
      return NextResponse.json(
        {
          success: false,
          error: `Selected product variant with ID "${variantId}" does not exist.`,
        },
        { status: 404 }
      );
    }

    // 3. Verify that the selected EMI plan exists
    const emiPlan = await prisma.emiPlan.findUnique({
      where: { id: emiPlanId },
    });

    if (!emiPlan) {
      return NextResponse.json(
        {
          success: false,
          error: `Selected EMI plan with ID "${emiPlanId}" does not exist.`,
        },
        { status: 404 }
      );
    }

    // 4. Verify that the EMI plan belongs to the selected variant or product
    const belongsToVariant = emiPlan.variantId === variant.id;
    const belongsToProduct = emiPlan.productId === variant.productId;

    if (!belongsToVariant && !belongsToProduct) {
      return NextResponse.json(
        {
          success: false,
          error:
            'The selected EMI plan does not belong to this product variant. Please select a valid plan.',
        },
        { status: 400 }
      );
    }

    // 5. Create simulated order record in PostgreSQL database
    const order = await prisma.order.create({
      data: {
        emiPlanId,
        variantId,
        customerName,
        customerPhone,
        customerEmail,
        panNumber: panNumber || null,
        status: 'CONFIRMED',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully (Simulated Mutual Fund EMI Application)',
        data: {
          orderId: order.id,
          status: order.status,
          productName: `${variant.product.name} (${variant.storage} - ${variant.color})`,
          monthlyAmount: emiPlan.monthlyAmount,
          tenureMonths: emiPlan.tenureMonths,
          interestRate: emiPlan.interestRate,
          cashbackAmount: emiPlan.cashbackAmount,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          createdAt: order.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order application:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error while processing simulated order',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
