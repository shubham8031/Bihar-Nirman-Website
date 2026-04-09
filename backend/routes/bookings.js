const express = require('express');
const router  = express.Router();
const Booking = require('../models/Booking');
const Product = require('../models/Product');
const Vendor  = require('../models/Vendor');
const { protect } = require('../middleware/auth');

// POST /api/bookings  — user books a product
router.post('/', protect, async (req, res) => {
  try {
    const { vendorId, productId, quantity, quantityUnit,
            deliveryAddress, deliveryDistrict, deliveryDate,
            specialNote, paymentMode } = req.body;

    const product = await Product.findById(productId);
    const vendor  = await Vendor.findById(vendorId);
    if (!product || !vendor) return res.status(404).json({ message: 'Product or Vendor not found' });

    const totalAmount = product.price * quantity;

    const booking = await Booking.create({
      user: req.user._id, vendor: vendorId, product: productId,
      quantity, quantityUnit: quantityUnit || product.priceUnit,
      totalAmount, deliveryAddress, deliveryDistrict,
      deliveryDate, specialNote, paymentMode,
      customerName:  req.user.name,
      customerPhone: req.user.phone,
      vendorPhone:   vendor.ownerPhone,
      statusHistory: [{ status: 'Pending', note: 'Booking placed by customer' }],
    });

    // Increment vendor booking count
    await Vendor.findByIdAndUpdate(vendorId, { $inc: { totalBookings: 1 } });

    await booking.populate(['user','vendor','product']);
    res.status(201).json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/bookings/my  — user's own bookings
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('vendor','businessName ownerPhone district')
      .populate('product','name price priceUnit')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/bookings/vendor/:vendorId  — vendor sees their bookings
router.get('/vendor/:vendorId', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ vendor: req.params.vendorId })
      .populate('user','name phone')
      .populate('product','name price')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/bookings/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user','name phone email')
      .populate('vendor','businessName ownerName ownerPhone address district')
      .populate('product','name price priceUnit specifications');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/bookings/:id/status  — vendor updates status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status, note } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: { statusHistory: { status, note: note || `Status changed to ${status}` } },
      },
      { new: true }
    );
    res.json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/bookings/:id  — user cancels
router.delete('/:id', protect, async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id,
      { status: 'Cancelled',
        $push: { statusHistory: { status: 'Cancelled', note: 'Cancelled by user' } } }
    );
    res.json({ message: 'Booking cancelled' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
