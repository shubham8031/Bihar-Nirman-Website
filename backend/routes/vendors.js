const express  = require('express');
const router   = express.Router();
const Vendor   = require('../models/Vendor');
const { protect, adminOnly, vendorOrAdmin } = require('../middleware/auth');

// GET /api/vendors  — public listing with filters
router.get('/', async (req, res) => {
  try {
    const { category, district, businessType, search, featured, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (district)      query.district     = district;
    if (businessType)  query.businessType = businessType;
    if (featured)      query.isFeatured   = true;
    if (search)        query.$text = { $search: search };
    if (category)      query.category = category;

    const skip  = (page - 1) * limit;
    const total = await Vendor.countDocuments(query);
    const vendors = await Vendor.find(query)
      .populate('category', 'name icon slug')
      .sort({ isFeatured: -1, rating: -1, createdAt: -1 })
      .skip(skip).limit(Number(limit));

    res.json({ vendors, total, page: Number(page),
      pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/vendors/:id  — single vendor public
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ _id: req.params.id, isActive: true })
      .populate('category', 'name icon slug');
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/vendors  — register as vendor
router.post('/', protect, async (req, res) => {
  try {
    const vendor = await Vendor.create({ ...req.body, user: req.user._id });
    res.status(201).json(vendor);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT /api/vendors/:id  — update (vendor owner or admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Not found' });
    if (vendor.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    const updated = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/vendors/:id  — soft delete
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Vendor.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Vendor removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/vendors/my/listings  — vendor's own listings
router.get('/my/listings', protect, async (req, res) => {
  try {
    const vendors = await Vendor.find({ user: req.user._id });
    res.json(vendors);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
