import mongoose from 'mongoose'

export const PRODUCT_CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Other']

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 140 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true, trim: true, maxlength: 2500 },
  category: { type: String, required: true, enum: PRODUCT_CATEGORIES },
  priceRwf: { type: Number, required: true, min: 1, validate: Number.isInteger },
  compareAtPriceRwf: {
    type: Number,
    min: 0,
    default: null,
    validate: { validator: (value) => value === null || Number.isInteger(value), message: 'Compare-at price must be a whole number.' },
  },
  stockQuantity: { type: Number, min: 0, default: 0, validate: Number.isInteger },
  sku: { type: String, trim: true, uppercase: true, sparse: true, unique: true },
  images: {
    type: [String],
    default: [],
    validate: { validator: (images) => images.length <= 8, message: 'A product can have at most 8 images.' },
  },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

productSchema.index({ name: 'text', description: 'text' })
productSchema.index({ category: 1, isActive: 1 })

const Product = mongoose.model('Product', productSchema)
export default Product
