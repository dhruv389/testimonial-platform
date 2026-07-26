const Testimonial = require('../models/Testimonial');

// Submit a new testimonial
exports.submitTestimonial = async (req, res) => {
  try {
    const { name, email, company, testimonial, rating, website, hp } = req.body;
    
    // 1. Anti-bot Honeypot check
    if (website || hp) {
      return res.status(400).json({ error: 'Junk submission detected.' });
    }

    // 2. Basic field validation
    if (!name || !email || !company || !testimonial || !rating) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // 3. Junk validation (minimum testimonial length & rating range)
    const trimmedText = testimonial.trim();
    if (trimmedText.length < 5) {
      return res.status(400).json({ error: 'Testimonial text must be at least 5 characters long.' });
    }

    const numericRating = parseInt(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    // 4. Duplicate submission check (same email and exact testimonial text)
    const normalizedEmail = email.trim().toLowerCase();
    const existingDuplicate = await Testimonial.findOne({
      email: normalizedEmail,
      testimonial: trimmedText
    });

    if (existingDuplicate) {
      return res.status(400).json({ 
        error: 'Duplicate submission detected. You have already submitted this testimonial.' 
      });
    }

    // Create testimonial
    const newTestimonial = new Testimonial({
      name: name.trim(),
      email: normalizedEmail,
      company: company.trim(),
      testimonial: trimmedText,
      rating: numericRating,
      status: 'pending'
    });

    // Handle photo upload if provided (base64 or URL)
    if (req.body.photo) {
      newTestimonial.photo = req.body.photo;
    }

    await newTestimonial.save();
    
    res.status(201).json({ 
      message: 'Testimonial submitted successfully', 
      testimonial: newTestimonial 
    });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ error: 'Failed to submit testimonial' });
  }
};

// Get all testimonials (with optional status filter & pagination)
exports.getTestimonials = async (req, res) => {
  try {
    const { status, page, limit } = req.query;
    const filter = status ? { status } : {};
    
    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, parseInt(limit) || 10);
      const skip = (pageNum - 1) * limitNum;

      const total = await Testimonial.countDocuments(filter);
      const testimonials = await Testimonial.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      const totalPages = Math.ceil(total / limitNum);

      return res.json({
        testimonials,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
          hasMore: pageNum < totalPages
        }
      });
    }

    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

// Get approved testimonials (for public wall & widget, with pagination support)
exports.getApprovedTestimonials = async (req, res) => {
  try {
    const { page, limit } = req.query;

    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, parseInt(limit) || 6);
      const skip = (pageNum - 1) * limitNum;

      const total = await Testimonial.countDocuments({ status: 'approved' });
      const testimonials = await Testimonial.find({ status: 'approved' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      const totalPages = Math.ceil(total / limitNum);

      return res.json({
        testimonials,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
          hasMore: pageNum < totalPages
        }
      });
    }

    const testimonials = await Testimonial.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error('Get approved error:', error);
    res.status(500).json({ error: 'Failed to fetch approved testimonials' });
  }
};

// Update testimonial status (approve/reject)
exports.updateTestimonialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after' }
    );

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ message: 'Status updated successfully', testimonial });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
};

// Delete testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    
    const testimonial = await Testimonial.findByIdAndDelete(id);
    
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
};