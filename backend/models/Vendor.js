const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  // ── Basic Info ─────────────────────────────────────────
  businessName: { type: String, required: true, trim: true },
  businessType: {
    type: String,
    enum: ['Bricks Factory', 'Cement Dealer', 'Sand (Balu) Supplier',
           'Chhar/Gitti Supplier', 'Wood & Timber', 'Tiles & Marble',
           'Iron & Steel', 'Electrical & Plumbing', 'Paint Dealer', 'Other'],
    required: true,
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },

  // ── Owner / Manager ────────────────────────────────────
  ownerName:       { type: String, required: true },
  ownerPhone:      { type: String, required: true },
  ownerWhatsapp:   { type: String },
  managerName:     { type: String },
  managerPhone:    { type: String },
  managerEmail:    { type: String },
  establishedYear: { type: Number },

  // ── Location ───────────────────────────────────────────
  address:   { type: String, required: true },
  village:   { type: String },
  block:     { type: String },
  district: {
    type: String,
    required: true,
    enum: [
      'Patna','Gaya','Muzaffarpur','Bhagalpur','Darbhanga','Ara (Bhojpur)',
      'Begusarai','Munger','Chapra (Saran)','Samastipur','Nalanda','Vaishali',
      'Sitamarhi','Madhubani','Supaul','Araria','Kishanganj','Purnia',
      'Katihar','Madhepura','Saharsa','Banka','Jamui','Lakhisarai',
      'Sheikhpura','Nawada','Aurangabad','Jehanabad','Arwal','Rohtas',
      'Kaimur','Buxar','Gopalganj','West Champaran','East Champaran',
      'Siwan','Sheohar','Khagaria',
    ],
  },
  pincode: { type: String },
  googleMapLink: { type: String },

  // ── Business Details ───────────────────────────────────
  gstNumber:       { type: String },
  licenseNumber:   { type: String },
  description:     { type: String },
  deliveryAvailable: { type: Boolean, default: false },
  deliveryRadius:  { type: String }, // e.g. "50 km"
  minimumOrder:    { type: String },
  paymentModes:    [{ type: String, enum: ['Cash','UPI','Bank Transfer','Cheque','Credit'] }],
  workingHours:    { type: String, default: '8:00 AM - 6:00 PM' },
  workingDays:     { type: String, default: 'Monday - Saturday' },

  // ── Media ──────────────────────────────────────────────
  logo:    { type: String },
  images:  [{ type: String }],

  // ── Meta ───────────────────────────────────────────────
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isVerified:   { type: Boolean, default: false },
  isActive:     { type: Boolean, default: true },
  isFeatured:   { type: Boolean, default: false },
  totalBookings:{ type: Number, default: 0 },
  rating:       { type: Number, default: 0 },
  reviewCount:  { type: Number, default: 0 },
}, { timestamps: true });

vendorSchema.index({ businessName: 'text', district: 1, businessType: 1 });

module.exports = mongoose.model('Vendor', vendorSchema);
