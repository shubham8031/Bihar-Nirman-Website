const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendor:   { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },

  // ── Product Info ───────────────────────────────────────
  name:        { type: String, required: true, trim: true },
  productCode: { type: String }, // e.g. "BRICK-1NO", "OPC-53"
  description: { type: String },
  grade:       { type: String }, // 1st class, 2nd class, OPC 53, etc.
  brand:       { type: String },

  // ── Pricing ────────────────────────────────────────────
  price:        { type: Number, required: true },   // per unit
  priceUnit:    { type: String, default: 'per 1000 pieces' }, // per bag, per CFT, per ton
  minOrderQty:  { type: Number, default: 1 },
  minOrderUnit: { type: String, default: '1000 pieces' },
  gstPercent:   { type: Number, default: 0 },       // GST %
  priceNegotiable: { type: Boolean, default: false },

  // ── Stock ──────────────────────────────────────────────
  inStock:      { type: Boolean, default: true },
  stockQty:     { type: String }, // e.g. "5 lakh pieces available"

  // ── Specs ──────────────────────────────────────────────
  specifications: [{ key: String, value: String }],
  // e.g. [{key: "Size", value: "9x4.5x3 inch"}, {key: "Weight", value: "3.5 kg"}]

  images:  [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
