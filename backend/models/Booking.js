const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor:  { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },

  // ── Booking Details ────────────────────────────────────
  quantity:       { type: Number, required: true },
  quantityUnit:   { type: String },
  totalAmount:    { type: Number },
  deliveryAddress:{ type: String, required: true },
  deliveryDistrict:{ type: String, required: true },
  deliveryDate:   { type: Date },
  specialNote:    { type: String },
  paymentMode:    { type: String, enum: ['Cash','UPI','Bank Transfer','Cheque'], default: 'Cash' },

  // ── Status ─────────────────────────────────────────────
  status: {
    type: String,
    enum: ['Pending','Confirmed','Processing','Dispatched','Delivered','Cancelled'],
    default: 'Pending',
  },
  statusHistory: [{
    status:    String,
    note:      String,
    updatedAt: { type: Date, default: Date.now },
  }],

  // ── Contact snapshot ───────────────────────────────────
  customerName:  String,
  customerPhone: String,
  vendorPhone:   String,
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
