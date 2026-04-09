const express  = require('express');
const router   = express.Router();
const User     = require('../models/User');
const Vendor   = require('../models/Vendor');
const Booking  = require('../models/Booking');
const Review   = require('../models/Review');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [users, vendors, bookings, pendingReviews] = await Promise.all([
      User.countDocuments(),
      Vendor.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Review.countDocuments({ isApproved: false }),
    ]);
    res.json({ users, vendors, bookings, pendingReviews });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// All users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Verify vendor
router.patch('/vendors/:id/verify', async (req, res) => {
  try {
    const v = await Vendor.findByIdAndUpdate(req.params.id,
      { isVerified: true }, { new: true });
    res.json(v);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Feature vendor
router.patch('/vendors/:id/feature', async (req, res) => {
  try {
    const v = await Vendor.findById(req.params.id);
    const updated = await Vendor.findByIdAndUpdate(req.params.id,
      { isFeatured: !v.isFeatured }, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Approve review
router.patch('/reviews/:id/approve', async (req, res) => {
  try {
    const r = await Review.findByIdAndUpdate(req.params.id,
      { isApproved: true }, { new: true });
    res.json(r);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// All bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user','name phone')
      .populate('vendor','businessName')
      .populate('product','name')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
