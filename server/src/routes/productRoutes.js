import { Router } from 'express'
import { archiveProduct, createProduct, getProduct, listProducts, updateProduct } from '../controllers/productController.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { productCreateSchema, productUpdateSchema } from '../validation/schemas.js'

const router = Router()

router.get('/', asyncHandler(listProducts))
router.get('/:id', asyncHandler(getProduct))
router.post('/', authenticate, requireAdmin, validate(productCreateSchema), asyncHandler(createProduct))
router.patch('/:id', authenticate, requireAdmin, validate(productUpdateSchema), asyncHandler(updateProduct))
router.delete('/:id', authenticate, requireAdmin, asyncHandler(archiveProduct))

export default router
