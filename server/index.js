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

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (e.g., widget.js, demo pages)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '..'))); // Also serve demo.html from root if requested

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