import { z } from 'zod'
import { PRODUCT_CATEGORIES } from '../models/Product.js'

const passwordSchema = z.string()
  .min(8, 'Password must contain at least 8 characters.')
  .max(72, 'Password must contain no more than 72 characters.')

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  password: passwordSchema,
})

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(72),
})

export const productCreateSchema = z.object({
  name: z.string().trim().min(2).max(140),
  description: z.string().trim().min(5).max(2500),
  category: z.enum(PRODUCT_CATEGORIES),
  priceRwf: z.number().int().positive(),
  compareAtPriceRwf: z.number().int().nonnegative().nullable().optional(),
  stockQuantity: z.number().int().nonnegative().optional(),
  sku: z.string().trim().min(2).max(50).optional(),
  images: z.array(z.string().url()).max(8).optional(),
})

export const productUpdateSchema = productCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: 'Provide at least one product field to update.' },
)
