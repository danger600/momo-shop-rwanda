import mongoose from 'mongoose'
import Product from '../models/Product.js'

function makeSlug(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function escapeRegex(value) {
  return value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

export async function listProducts(req, res) {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1)
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 12, 1), 50)
  const filter = { isActive: true }

  if (req.query.category) filter.category = req.query.category
  if (req.query.q && String(req.query.q).trim()) {
    const search = new RegExp(escapeRegex(String(req.query.q).trim()), 'i')
    filter.$or = [{ name: search }, { description: search }, { category: search }]
  }

  const [items, total] = await Promise.all([
    Product.find(filter).select('-__v').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(filter),
  ])

  return res.status(200).json({
    success: true,
    data: { products: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
  })
}

export async function getProduct(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID.' })
  }

  const product = await Product.findOne({ _id: req.params.id, isActive: true }).select('-__v')
  if (!product) return res.status(404).json({ success: false, message: 'Product not found.' })
  return res.status(200).json({ success: true, data: { product } })
}

export async function createProduct(req, res) {
  const product = await Product.create({
    ...req.body,
    slug: makeSlug(req.body.name),
    createdBy: req.user._id,
  })
  return res.status(201).json({ success: true, message: 'Product created successfully.', data: { product } })
}

export async function updateProduct(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID.' })
  }

  const updates = { ...req.body }
  if (updates.name) updates.slug = makeSlug(updates.name)

  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, isActive: true },
    updates,
    { new: true, runValidators: true },
  )
  if (!product) return res.status(404).json({ success: false, message: 'Product not found.' })
  return res.status(200).json({ success: true, message: 'Product updated successfully.', data: { product } })
}

export async function archiveProduct(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID.' })
  }

  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, isActive: true },
    { isActive: false },
    { new: true },
  )
  if (!product) return res.status(404).json({ success: false, message: 'Product not found.' })
  return res.status(200).json({ success: true, message: 'Product archived successfully.' })
}
