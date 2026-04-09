const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const Category = require('../models/Category');
const Vendor   = require('../models/Vendor');
const Product  = require('../models/Product');
const User     = require('../models/User');

const categories = [
  { name: 'Bricks (ईंट)',       slug: 'bricks',   icon: '🧱', sortOrder: 1, description: 'All types of bricks for construction' },
  { name: 'Cement (सीमेंट)',    slug: 'cement',   icon: '🏗️', sortOrder: 2, description: 'OPC, PPC and white cement' },
  { name: 'Sand / Balu (बालू)', slug: 'balu',     icon: '🪨', sortOrder: 3, description: 'River sand and machine sand' },
  { name: 'Chhar / Gitti',      slug: 'chhar',    icon: '⛏️', sortOrder: 4, description: 'Stone chips and gitti for construction' },
  { name: 'Wood (लकड़ी)',       slug: 'wood',     icon: '🪵', sortOrder: 5, description: 'Timber, teak, sal and other wood' },
  { name: 'Tiles (टाइल्स)',    slug: 'tiles',    icon: '🔲', sortOrder: 6, description: 'Floor, wall and roof tiles' },
  { name: 'Iron & Steel (लोहा)',slug: 'iron',     icon: '⚙️', sortOrder: 7, description: 'TMT bars, rods and steel items' },
  { name: 'Paint (रंग)',        slug: 'paint',    icon: '🎨', sortOrder: 8, description: 'Interior, exterior and waterproof paint' },
];

const vendorSeeds = [
  // ── BRICKS ───────────────────────────────────────────────────────
  {
    businessName: 'Shri Ram Brick Factory',
    businessType: 'Bricks Factory',
    ownerName: 'Ram Narayan Singh',       ownerPhone: '9801234501',
    ownerWhatsapp: '9801234501',
    managerName: 'Mohan Lal',             managerPhone: '9801234502',
    managerEmail: 'mohanlal@gmail.com',
    establishedYear: 1998,
    address: 'NH-31, Near Rajendra Setu, Mokama',
    village: 'Mokama', block: 'Mokama', district: 'Patna',
    pincode: '803302',
    deliveryAvailable: true, deliveryRadius: '80 km',
    minimumOrder: '5000 bricks',
    paymentModes: ['Cash','UPI','Bank Transfer'],
    description: 'One of the largest brick factories in Patna district. Supplying 1st class red bricks since 1998.',
    workingHours: '6:00 AM - 7:00 PM',
    isFeatured: true, isVerified: true,
    products: [
      { name: '1st Class Bricks (1 नंबर ईंट)', productCode: 'BRICK-1NO',
        description: 'Best quality smooth surface bricks, 9x4.5x3 inch, compressive strength >105 kg/cm²',
        grade: '1st Class', price: 15000, priceUnit: 'per 1000 pieces',
        minOrderQty: 5, minOrderUnit: '5000 pieces', gstPercent: 5,
        specifications: [
          {key:'Size', value:'9 × 4.5 × 3 inch'}, {key:'Weight', value:'3.5 kg/piece'},
          {key:'Compressive Strength', value:'>105 kg/cm²'}, {key:'Water Absorption', value:'<15%'},
          {key:'Color', value:'Red/Orange'}, {key:'Firing', value:'Kiln fired'},
        ], inStock: true, stockQty: '10 lakh pieces available' },
      { name: '2nd Class Bricks (2 नंबर ईंट)', productCode: 'BRICK-2NO',
        description: 'Good quality bricks suitable for inner walls and general construction',
        grade: '2nd Class', price: 10000, priceUnit: 'per 1000 pieces',
        minOrderQty: 5, minOrderUnit: '5000 pieces', gstPercent: 5,
        specifications: [
          {key:'Size', value:'9 × 4.5 × 3 inch'}, {key:'Weight', value:'3.2 kg/piece'},
          {key:'Compressive Strength', value:'>70 kg/cm²'}, {key:'Water Absorption', value:'<20%'},
        ], inStock: true, stockQty: '15 lakh pieces available' },
      { name: '3rd Class Bricks (3 नंबर ईंट)', productCode: 'BRICK-3NO',
        description: 'Economy bricks for temporary structures and filling',
        grade: '3rd Class', price: 7000, priceUnit: 'per 1000 pieces',
        minOrderQty: 5, minOrderUnit: '5000 pieces',
        specifications: [
          {key:'Size', value:'9 × 4.5 × 3 inch'}, {key:'Weight', value:'3.0 kg/piece'},
        ], inStock: true, stockQty: '8 lakh pieces available' },
      { name: 'Fly Ash Bricks', productCode: 'BRICK-FLYASH',
        description: 'Eco-friendly lightweight fly ash bricks, better insulation',
        price: 8500, priceUnit: 'per 1000 pieces',
        specifications: [
          {key:'Size', value:'9 × 4.5 × 3 inch'}, {key:'Weight', value:'2.8 kg/piece'},
          {key:'Type', value:'Fly Ash / Eco-friendly'}, {key:'Thermal Insulation', value:'Better than clay bricks'},
        ], inStock: true },
    ],
  },
  {
    businessName: 'Bihar Brick Industries',
    businessType: 'Bricks Factory',
    ownerName: 'Suresh Prasad Yadav',     ownerPhone: '9801234511',
    managerName: 'Vijay Kumar',           managerPhone: '9801234512',
    establishedYear: 2005,
    address: 'Danapur Industrial Area, Danapur',
    village: 'Danapur', block: 'Danapur', district: 'Patna',
    pincode: '801503',
    deliveryAvailable: true, deliveryRadius: '60 km',
    minimumOrder: '10000 bricks',
    paymentModes: ['Cash','UPI','Cheque'],
    isFeatured: false, isVerified: true,
    products: [
      { name: '1st Class Bricks', grade: '1st Class',
        price: 14500, priceUnit: 'per 1000 pieces',
        specifications: [{key:'Size', value:'9 × 4.5 × 3 inch'},{key:'Grade', value:'IS 1077'}],
        inStock: true },
      { name: '2nd Class Bricks', grade: '2nd Class',
        price: 9500, priceUnit: 'per 1000 pieces', inStock: true },
    ],
  },

  // ── CEMENT ───────────────────────────────────────────────────────
  {
    businessName: 'Patna Cement Traders',
    businessType: 'Cement Dealer',
    ownerName: 'Ashok Kumar Gupta',       ownerPhone: '9801234521',
    ownerWhatsapp: '9801234521',
    managerName: 'Ranjit Singh',          managerPhone: '9801234522',
    establishedYear: 2010,
    address: 'Fraser Road, Near Gandhi Maidan, Patna',
    district: 'Patna', pincode: '800001',
    deliveryAvailable: true, deliveryRadius: '30 km',
    minimumOrder: '20 bags',
    paymentModes: ['Cash','UPI','Bank Transfer','Credit'],
    isFeatured: true, isVerified: true,
    products: [
      { name: 'Ultratech OPC 53 Grade Cement', brand: 'Ultratech',
        grade: 'OPC 53', price: 395, priceUnit: 'per 50 kg bag',
        minOrderQty: 20, minOrderUnit: '20 bags', gstPercent: 28,
        specifications: [{key:'Grade', value:'OPC 53'},{key:'Brand', value:'Ultratech'},
          {key:'Weight', value:'50 kg per bag'},{key:'Setting Time', value:'30 min initial'}],
        inStock: true, stockQty: '500 bags in stock' },
      { name: 'ACC PPC Cement', brand: 'ACC',
        grade: 'PPC', price: 370, priceUnit: 'per 50 kg bag',
        specifications: [{key:'Grade', value:'PPC'},{key:'Brand', value:'ACC'},
          {key:'Best For', value:'RCC work, plastering'}],
        inStock: true },
      { name: 'Ambuja OPC 43 Grade Cement', brand: 'Ambuja',
        grade: 'OPC 43', price: 385, priceUnit: 'per 50 kg bag',
        specifications: [{key:'Grade', value:'OPC 43'},{key:'Brand', value:'Ambuja'}],
        inStock: true },
      { name: 'JK Super Cement PPC', brand: 'JK',
        grade: 'PPC', price: 360, priceUnit: 'per 50 kg bag', inStock: true },
      { name: 'White Cement (Birla White)', brand: 'Birla White',
        price: 25, priceUnit: 'per kg',
        specifications: [{key:'Use', value:'Tiles joining, putty work'},{key:'Brand', value:'Birla White'}],
        inStock: true },
    ],
  },
  {
    businessName: 'Muzaffarpur Cement Agency',
    businessType: 'Cement Dealer',
    ownerName: 'Dinesh Prasad',           ownerPhone: '9801234531',
    district: 'Muzaffarpur', address: 'Station Road, Muzaffarpur',
    deliveryAvailable: true, deliveryRadius: '50 km',
    paymentModes: ['Cash','UPI'],
    products: [
      { name: 'Ultratech OPC 53', brand: 'Ultratech', grade: 'OPC 53',
        price: 398, priceUnit: 'per 50 kg bag', inStock: true },
      { name: 'Shree Ultra PPC', brand: 'Shree',
        price: 365, priceUnit: 'per 50 kg bag', inStock: true },
    ],
  },

  // ── BALU (SAND) ──────────────────────────────────────────────────
  {
    businessName: 'Ganga Balu Suppliers',
    businessType: 'Sand (Balu) Supplier',
    ownerName: 'Nagendra Singh',          ownerPhone: '9801234541',
    ownerWhatsapp: '9801234541',
    managerName: 'Rakesh Thakur',         managerPhone: '9801234542',
    establishedYear: 2008,
    address: 'Ganga Ghat, Hajipur',
    district: 'Vaishali', village: 'Hajipur',
    deliveryAvailable: true, deliveryRadius: '100 km',
    minimumOrder: '1 tractor trolley (5 CFT)',
    paymentModes: ['Cash','UPI','Bank Transfer'],
    isFeatured: true, isVerified: true,
    products: [
      { name: 'Ganga River Sand (Fine Balu)', grade: 'Fine / Plaster Grade',
        description: 'Premium Ganga river sand, ideal for plastering and masonry work',
        price: 1800, priceUnit: 'per CFT (cubic feet)',
        minOrderQty: 5, minOrderUnit: '5 CFT (1 tractor)',
        specifications: [{key:'Type', value:'River Sand'},{key:'Source', value:'River Ganga'},
          {key:'Grading', value:'Fine (Zone II)'},{key:'Use', value:'Plastering, masonry'}],
        inStock: true, stockQty: 'Available in bulk' },
      { name: 'Coarse Sand (Mota Balu)', grade: 'Coarse / Construction Grade',
        description: 'Coarse sand for RCC work and concrete mixing',
        price: 2200, priceUnit: 'per CFT',
        specifications: [{key:'Type', value:'Coarse River Sand'},{key:'Grading', value:'Zone III'},
          {key:'Use', value:'RCC, concrete mix'}],
        inStock: true },
      { name: 'M-Sand (Machine Sand)', grade: 'M-Sand',
        description: 'Manufactured sand - consistent quality, good for concrete',
        price: 1500, priceUnit: 'per CFT', inStock: true,
        specifications: [{key:'Type', value:'Manufactured Sand'},{key:'IS Standard', value:'IS 383:2016'}] },
    ],
  },

  // ── CHHAR / GITTI ────────────────────────────────────────────────
  {
    businessName: 'Rohtas Stone Crushers',
    businessType: 'Chhar/Gitti Supplier',
    ownerName: 'Vikram Bahadur Singh',    ownerPhone: '9801234551',
    managerName: 'Pramod Kumar',          managerPhone: '9801234552',
    address: 'Dehri-on-Sone, Rohtas',
    district: 'Rohtas', establishedYear: 2003,
    deliveryAvailable: true, deliveryRadius: '150 km',
    minimumOrder: '1 truck load',
    paymentModes: ['Cash','Bank Transfer','Cheque'],
    isFeatured: true, isVerified: true,
    products: [
      { name: '20mm Stone Chips (Gitti)', grade: '20mm',
        description: '20mm crushed stone for concrete and RCC work',
        price: 1200, priceUnit: 'per CFT',
        specifications: [{key:'Size', value:'20mm'},{key:'Type', value:'Crushed Granite'},
          {key:'Use', value:'Concrete mix, RCC'}], inStock: true },
      { name: '10mm Stone Chips', grade: '10mm',
        price: 1400, priceUnit: 'per CFT',
        specifications: [{key:'Size', value:'10mm'},{key:'Use', value:'Fine concrete, plaster base'}],
        inStock: true },
      { name: 'Chhar (6mm Chips)', grade: '6mm',
        price: 1600, priceUnit: 'per CFT',
        specifications: [{key:'Size', value:'6mm'},{key:'Use', value:'Roof waterproofing, filter'}],
        inStock: true },
      { name: 'Stone Dust (Pathar Ka Chura)', grade: 'Dust',
        price: 600, priceUnit: 'per CFT',
        specifications: [{key:'Use', value:'Brick laying, floor base filling'}],
        inStock: true },
    ],
  },

  // ── WOOD ─────────────────────────────────────────────────────────
  {
    businessName: 'Bihar Timber & Wood Mart',
    businessType: 'Wood & Timber',
    ownerName: 'Arun Kumar Verma',        ownerPhone: '9801234561',
    ownerWhatsapp: '9801234561',
    managerName: 'Shyam Kishore',         managerPhone: '9801234562',
    address: 'Timber Market, Exhibition Road, Patna',
    district: 'Patna', establishedYear: 2000,
    deliveryAvailable: true, deliveryRadius: '50 km',
    minimumOrder: '1 CFT',
    paymentModes: ['Cash','UPI','Bank Transfer'],
    isFeatured: true, isVerified: true,
    products: [
      { name: 'Teak Wood (Sagwan / Sagon)', grade: '1st Class Teak',
        description: 'Best quality teak wood for doors, windows and furniture',
        price: 2800, priceUnit: 'per CFT', priceNegotiable: true,
        specifications: [{key:'Wood Type', value:'Teak (Tectona grandis)'},
          {key:'Origin', value:'Myanmar / Indian Teak'},{key:'Best For', value:'Doors, windows, furniture'}],
        inStock: true },
      { name: 'Sal Wood (Sakhua)', grade: '1st Class Sal',
        description: 'Strong Bihar-local sal wood, good for heavy construction',
        price: 1800, priceUnit: 'per CFT',
        specifications: [{key:'Wood Type', value:'Sal (Shorea robusta)'},
          {key:'Origin', value:'Jharkhand / Bihar forests'},{key:'Best For', value:'Beams, rafters, shuttering'}],
        inStock: true },
      { name: 'Shisham (Rosewood)', grade: '1st Class',
        price: 2200, priceUnit: 'per CFT', priceNegotiable: true,
        specifications: [{key:'Wood Type', value:'Indian Rosewood'},{key:'Best For', value:'Furniture, flooring'}],
        inStock: true },
      { name: 'Plywood (18mm BWR)', brand: 'Century Ply',
        grade: 'BWR Grade', price: 120, priceUnit: 'per sq ft',
        specifications: [{key:'Thickness', value:'18mm'},{key:'Grade', value:'BWR (Boiling Water Resistant)'},
          {key:'Size', value:"8 × 4 feet (standard sheet)"}], inStock: true },
      { name: 'Shuttering Plywood', grade: 'Commercial',
        price: 65, priceUnit: 'per sq ft',
        specifications: [{key:'Thickness', value:'12mm'},{key:'Use', value:'Concrete shuttering/formwork'}],
        inStock: true },
    ],
  },

  // ── TILES ─────────────────────────────────────────────────────────
  {
    businessName: 'Gaya Tiles & Marble Emporium',
    businessType: 'Tiles & Marble',
    ownerName: 'Rajeev Ranjan',           ownerPhone: '9801234571',
    ownerWhatsapp: '9801234571',
    managerName: 'Priya Ranjan',          managerPhone: '9801234572',
    address: 'Bodhgaya Road, Near Bus Stand, Gaya',
    district: 'Gaya', establishedYear: 2012,
    deliveryAvailable: true, deliveryRadius: '80 km',
    minimumOrder: '10 sq ft',
    paymentModes: ['Cash','UPI','Bank Transfer'],
    isFeatured: true, isVerified: true,
    products: [
      { name: 'Vitrified Floor Tiles 2×2 ft', brand: 'Kajaria',
        description: 'Premium vitrified tiles for living room and bedroom flooring',
        price: 55, priceUnit: 'per sq ft',
        specifications: [{key:'Size', value:'600×600mm (2×2 ft)'},{key:'Brand', value:'Kajaria'},
          {key:'Finish', value:'Glossy / Matt'},{key:'Thickness', value:'8mm'}],
        inStock: true },
      { name: 'Wall Tiles (Bathroom) 1×1.5 ft', brand: 'Somany',
        price: 40, priceUnit: 'per sq ft',
        specifications: [{key:'Size', value:'300×450mm'},{key:'Use', value:'Bathroom, kitchen walls'},
          {key:'Brand', value:'Somany'}], inStock: true },
      { name: 'Outdoor Anti-Skid Tiles', brand: 'Orient',
        price: 45, priceUnit: 'per sq ft',
        specifications: [{key:'Surface', value:'Anti-skid'},{key:'Best For', value:'Balcony, parking, outdoor'}],
        inStock: true },
      { name: 'White Marble (Makrana)', grade: '1st Quality',
        price: 180, priceUnit: 'per sq ft', priceNegotiable: true,
        specifications: [{key:'Origin', value:'Makrana, Rajasthan'},{key:'Thickness', value:'18mm'},
          {key:'Use', value:'Floor, staircase'}], inStock: true },
      { name: 'Granite (Black/Grey)', grade: 'A Grade',
        price: 150, priceUnit: 'per sq ft',
        specifications: [{key:'Type', value:'Granite'},{key:'Colors', value:'Black, Grey, Red'},
          {key:'Thickness', value:'15mm'}], inStock: true },
      { name: 'Kota Stone', grade: 'Natural',
        price: 45, priceUnit: 'per sq ft',
        specifications: [{key:'Origin', value:'Kota, Rajasthan'},{key:'Use', value:'Outdoor, steps, compound'}],
        inStock: true },
    ],
  },

  // ── IRON & STEEL ─────────────────────────────────────────────────
  {
    businessName: 'Bhagalpur Iron & Steel',
    businessType: 'Iron & Steel',
    ownerName: 'Manoj Kumar Singh',       ownerPhone: '9801234581',
    managerName: 'Santosh Roy',           managerPhone: '9801234582',
    address: 'Tilkamanjhi, Bhagalpur',
    district: 'Bhagalpur', establishedYear: 2006,
    deliveryAvailable: true, deliveryRadius: '100 km',
    paymentModes: ['Cash','Bank Transfer','Cheque'],
    isVerified: true,
    products: [
      { name: 'TMT Bar 8mm (SAIL)', brand: 'SAIL',
        price: 58000, priceUnit: 'per ton',
        specifications: [{key:'Diameter', value:'8mm'},{key:'Grade', value:'Fe 500D'},
          {key:'Brand', value:'SAIL'}], inStock: true },
      { name: 'TMT Bar 10mm (Tata Tiscon)', brand: 'Tata Tiscon',
        price: 57500, priceUnit: 'per ton',
        specifications: [{key:'Diameter', value:'10mm'},{key:'Grade', value:'Fe 500D'}],
        inStock: true },
      { name: 'TMT Bar 12mm', brand: 'Jindal',
        price: 57000, priceUnit: 'per ton', inStock: true },
      { name: 'MS Angle Iron (50×50×5mm)', grade: 'Structural',
        price: 62000, priceUnit: 'per ton', inStock: true },
    ],
  },

  // ── PAINT ─────────────────────────────────────────────────────────
  {
    businessName: 'Asian Paint Dealer - Darbhanga',
    businessType: 'Paint Dealer',
    ownerName: 'Kapil Dev Jha',           ownerPhone: '9801234591',
    address: 'Laheriasarai, Darbhanga',
    district: 'Darbhanga',
    deliveryAvailable: true, deliveryRadius: '40 km',
    paymentModes: ['Cash','UPI'],
    isVerified: true,
    products: [
      { name: 'Asian Paints Apcolite Interior Emulsion', brand: 'Asian Paints',
        price: 200, priceUnit: 'per litre',
        specifications: [{key:'Type', value:'Interior Emulsion'},{key:'Coverage', value:'130-150 sq ft/litre'}],
        inStock: true },
      { name: 'Asian Paints Apex Exterior Emulsion', brand: 'Asian Paints',
        price: 240, priceUnit: 'per litre',
        specifications: [{key:'Type', value:'Exterior Weatherproof'},{key:'Finish', value:'Smooth'}],
        inStock: true },
      { name: 'Berger WeatherCoat (Exterior)', brand: 'Berger',
        price: 220, priceUnit: 'per litre', inStock: true },
      { name: 'Cement Primer', brand: 'Asian Paints',
        price: 120, priceUnit: 'per litre', inStock: true },
      { name: 'Waterproof Coating (Dr. Fixit)', brand: 'Dr. Fixit',
        price: 350, priceUnit: 'per litre',
        specifications: [{key:'Use', value:'Roof, terrace waterproofing'}], inStock: true },
    ],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected');

  // Clear existing
  await Promise.all([
    Category.deleteMany({}), Vendor.deleteMany({}), Product.deleteMany({}),
  ]);

  // Insert categories
  const cats = await Category.insertMany(categories);
  const catMap = {};
  cats.forEach((c) => { catMap[c.slug] = c._id; });
  console.log(`✅ ${cats.length} categories seeded`);

  const slugMap = {
    'Bricks Factory': 'bricks', 'Cement Dealer': 'cement',
    'Sand (Balu) Supplier': 'balu', 'Chhar/Gitti Supplier': 'chhar',
    'Wood & Timber': 'wood', 'Tiles & Marble': 'tiles',
    'Iron & Steel': 'iron', 'Paint Dealer': 'paint',
  };

  let vendorCount = 0; let productCount = 0;

  for (const vs of vendorSeeds) {
    const { products, ...vendorData } = vs;
    vendorData.category = catMap[slugMap[vendorData.businessType]];

    const vendor = await Vendor.create(vendorData);
    vendorCount++;

    for (const pd of products) {
      await Product.create({
        ...pd, vendor: vendor._id,
        category: catMap[slugMap[vendor.businessType]],
      });
      productCount++;
    }
  }

  console.log(`✅ ${vendorCount} vendors seeded`);
  console.log(`✅ ${productCount} products seeded`);
  console.log('🎉 Database seeded successfully!');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
