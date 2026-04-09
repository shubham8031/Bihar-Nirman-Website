const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/vendors',   require('./routes/vendors'));
app.use('/api/products',  require('./routes/products'));
app.use('/api/bookings',  require('./routes/bookings'));
app.use('/api/reviews',   require('./routes/reviews'));
app.use('/api/categories',require('./routes/categories'));
app.use('/api/admin',     require('./routes/admin'));

// ── Health ──────────────────────────────────────────────────
app.get('/', (req, res) =>
  res.json({ message: '🏗️  Bihar Nirman Hub API Running' })
);

// ── DB + Listen ─────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  });
