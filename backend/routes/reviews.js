// ── reviews.js ───────────────────────────────────────────────
const express  = require('express');
const router   = express.Router();
const Review   = require('../models/Review');
const Vendor   = require('../models/Vendor');
const { protect } = require('../middleware/auth');

router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const reviews = await Review.find({ vendor: req.params.vendorId, isApproved: true })
      .populate('user','name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const { vendor, rating, comment } = req.body;
    const review = await Review.create({ vendor, user: req.user._id, rating, comment });

    // Recalculate vendor rating
    const all = await Review.find({ vendor, isApproved: true });
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    await Vendor.findByIdAndUpdate(vendor, { rating: avg.toFixed(1), reviewCount: all.length });

    res.status(201).json(review);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
