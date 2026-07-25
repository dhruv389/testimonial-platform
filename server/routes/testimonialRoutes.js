const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');


// Public routes
router.post('/submit',testimonialController.submitTestimonial);
router.get('/approved', testimonialController.getApprovedTestimonials);

// Admin routes (in a real app, you'd add authentication)
router.get('/', testimonialController.getTestimonials);
router.patch('/:id/status', testimonialController.updateTestimonialStatus);
router.delete('/:id', testimonialController.deleteTestimonial);

module.exports = router;