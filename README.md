# 🏗️ Bihar Nirman Hub — बिहार निर्माण हब

> Bihar's #1 Construction Material Marketplace — Find verified suppliers of Bricks, Cement, Sand, Gitti, Wood, Tiles, Iron & Paint across all 38 districts of Bihar.

---

## 🚀 How to Run (VS Code Terminal)

### Step 1 — Clone / Open in VS Code
Open this project folder in VS Code, then open Terminal (`Ctrl + `` ` ``).

### Step 2 — Install ALL dependencies (one command)
```bash
npm run install-all
```
This installs root, backend and frontend dependencies automatically.

### Step 3 — Setup Environment Variables
```bash
cd backend
cp .env.example .env
```
Open `.env` and fill in:
- `MONGODB_URI` → Your MongoDB Atlas connection string
- `JWT_SECRET`  → Any random secret string

### Step 4 — Seed the Database (Bihar data)
```bash
cd backend
npm run seed
```
This adds **8 categories**, **8+ vendors** and **35+ products** with real Bihar data.

### Step 5 — Run Both Servers
```bash
cd ..
npm run dev
```
- **Backend** → http://localhost:5000
- **Frontend** → http://localhost:3000

---

## 📁 Project Structure

```
bihar-nirman/
├── backend/
│   ├── models/
│   │   ├── User.js          # User accounts
│   │   ├── Vendor.js        # Factory/Shop listings
│   │   ├── Product.js       # Bricks, Cement, etc.
│   │   ├── Booking.js       # Order bookings
│   │   ├── Review.js        # Vendor reviews
│   │   └── Category.js      # Material categories
│   ├── routes/
│   │   ├── auth.js          # Login, Register, Profile
│   │   ├── vendors.js       # Vendor CRUD + listings
│   │   ├── products.js      # Product CRUD
│   │   ├── bookings.js      # Booking management
│   │   ├── reviews.js       # Reviews
│   │   ├── categories.js    # Categories
│   │   └── admin.js         # Admin panel APIs
│   ├── middleware/
│   │   └── auth.js          # JWT authentication
│   ├── utils/
│   │   └── seed.js          # Database seeder
│   ├── server.js            # Express main file
│   └── .env.example         # Environment template
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── pages/
        │   ├── HomePage.js        # Home with hero + categories
        │   ├── VendorsPage.js     # All vendors with filters
        │   ├── VendorDetail.js    # Single vendor + products + booking
        │   ├── CategoryPage.js    # Category-wise vendor listing
        │   ├── LoginPage.js       # Login
        │   ├── RegisterPage.js    # Register (user/vendor)
        │   ├── BookingsPage.js    # My bookings + status
        │   ├── ProfilePage.js     # Edit profile
        │   └── AdminPage.js       # Admin dashboard
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.js      # Navigation with mobile menu
        │   │   └── Footer.js      # Footer with links
        │   └── common/
        │       ├── VendorCard.js  # Vendor listing card
        │       └── ProductCard.js # Product with price + book button
        ├── context/
        │   └── AuthContext.js     # Global auth state
        ├── utils/
        │   └── api.js             # All API calls
        └── App.js                 # Router + routes
```

---

## 🌟 Features

### For Buyers (Users)
- 🔍 Search vendors by name, district, material type
- 🗂️ Browse by 8 categories (Bricks, Cement, Balu, Chhar, Wood, Tiles, Iron, Paint)
- 📍 Filter by any of 38 Bihar districts
- 🏭 View detailed vendor page — owner name, manager name, contact numbers
- 💰 See all products with current prices
- 📋 Book materials with delivery address + date
- 📞 Direct call/WhatsApp to vendor
- 📦 Track booking status (Pending → Confirmed → Dispatched → Delivered)
- ⭐ Write reviews for vendors

### For Vendors/Suppliers
- 🏭 Register your factory/shop
- 📦 List all your products with prices, grades, specifications
- 👥 Manage incoming booking requests
- 📊 View your total bookings

### For Admin
- 📊 Dashboard with stats (users, vendors, bookings)
- ✅ Verify vendors
- ⭐ Feature vendors on homepage
- 👁️ View all users and bookings

---

## 🛒 Pre-loaded Data (after seed)

| Category | Vendors | Products |
|----------|---------|---------|
| 🧱 Bricks (ईंट) | 2 | 1st class ₹15,000, 2nd class ₹10,000, 3rd class ₹7,000, Fly Ash ₹8,500 |
| 🏗️ Cement | 2 | Ultratech OPC 53 ₹395/bag, ACC PPC ₹370/bag, Ambuja ₹385/bag |
| 🪨 Balu / Sand | 1 | River Sand ₹1,800/CFT, Coarse ₹2,200/CFT, M-Sand ₹1,500/CFT |
| ⛏️ Chhar / Gitti | 1 | 20mm ₹1,200/CFT, 10mm ₹1,400/CFT, Stone Dust ₹600/CFT |
| 🪵 Wood | 1 | Teak ₹2,800/CFT, Sal ₹1,800/CFT, Plywood ₹120/sqft |
| 🔲 Tiles | 1 | Vitrified ₹55/sqft, Wall Tiles ₹40/sqft, Marble ₹180/sqft |
| ⚙️ Iron | 1 | TMT 8mm SAIL ₹58,000/ton, TMT 10mm Tata ₹57,500/ton |
| 🎨 Paint | 1 | Asian Paints Interior ₹200/L, Exterior ₹240/L |

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user/vendor |
| POST | `/api/auth/login` | Login |
| GET  | `/api/vendors` | List vendors (filter by district, type) |
| GET  | `/api/vendors/:id` | Single vendor detail |
| GET  | `/api/products?vendor=id` | Products for a vendor |
| POST | `/api/bookings` | Create booking |
| GET  | `/api/bookings/my` | My bookings |
| GET  | `/api/categories` | All categories |
| GET  | `/api/dashboard/stats` | (admin) stats |

---

## 🚀 Deploy

**Backend** → [Railway](https://railway.app) or [Render](https://render.com)
**Frontend** → [Vercel](https://vercel.com)

Set environment variables on your hosting platform same as `.env`.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router 6, Axios, React Hot Toast, React Icons
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Auth**: JWT (JSON Web Tokens)
- **Database**: MongoDB Atlas (free tier works)

---

*Built for Bihar 🙏 — Ghar banao aasani se!*
