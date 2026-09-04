import { z } from 'zod';

export const createOrderSchema = z.object({
  variantId: z.string().min(1, 'Variant ID is required'),
  emiPlanId: z.string().min(1, 'EMI Plan ID is required'),
  customerName: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must be under 100 characters'),
  customerPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  customerEmail: z
    .string()
    .email('Please enter a valid email address'),
  panNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val),
      'Please enter a valid 10-character PAN number (e.g. ABCDE1234F)'
    ),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
