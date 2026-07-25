const Testimonial = require('../models/Testimonial');

// Submit a new testimonial
exports.submitTestimonial = async (req, res) => {
  try {
    const { name, email, company, testimonial, rating } = req.body;
    
    // Basic validation
    if (!name || !email || !company || !testimonial || !rating) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create testimonial
    const newTestimonial = new Testimonial({
      name,
      email,
      company,
      testimonial,
      rating: parseInt(rating),
      status: 'pending'
    });

    // Handle photo upload if provided (simplified - just storing base64 for demo)
    // In production, you'd use cloud storage like Cloudinary
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

// Get all testimonials (with optional status filter)
exports.getTestimonials = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const testimonials = await Testimonial.find(filter)
      .sort({ createdAt: -1 });
    
    res.json(testimonials);
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

// Get approved testimonials (for public wall)
exports.getApprovedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: 'approved' })
      .sort({ createdAt: -1 });
    
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