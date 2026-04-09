const express  = require('express');
const router   = express.Router();
const Product  = require('../models/Product');
const Vendor   = require('../models/Vendor');
const { protect } = require('../middleware/auth');

// GET /api/products?vendor=xxx  — all products for a vendor (public)
router.get('/', async (req, res) => {
  try {
    const { vendor, category } = req.query;
    const query = { isActive: true };
    if (vendor)   query.vendor   = vendor;
    if (category) query.category = category;

    const products = await Product.find(query)
      .populate('vendor', 'businessName district')
      .populate('category', 'name icon')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true })
      .populate('vendor').populate('category','name icon');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/products  — vendor adds product
router.post('/', protect, async (req, res) => {
  try {
    // verify vendor ownership
    const vendor = await Vendor.findById(req.body.vendor);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    if (vendor.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not your vendor listing' });

    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT /api/products/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/products/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Product removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
