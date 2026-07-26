const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const testimonialRoutes = require('./routes/testimonialRoutes');

// Load environment variables
dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Configured origins including Vercel frontend and local dev
const allowedOrigins = [
  'https://testimonial-platform-beta.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

// CORS configuration to support frontend domain & embeddable widgets
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (e.g., widget.js, demo pages)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '..')));

// Routes
app.use('/api/testimonials', testimonialRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Testimonial Platform API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});