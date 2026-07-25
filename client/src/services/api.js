import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Testimonial API functions
export const testimonialApi = {
  // Submit a new testimonial
  submit: (data) => api.post('/testimonials/submit', data),
  
  // Get all testimonials (with optional status filter)
  getAll: (status) => api.get('/testimonials', { params: { status } }),
  
  // Get approved testimonials (public)
  getApproved: () => api.get('/testimonials/approved'),
  
  // Update testimonial status
  updateStatus: (id, status) => api.patch(`/testimonials/${id}/status`, { status }),
  
  // Delete testimonial
  delete: (id) => api.delete(`/testimonials/${id}`),
};

export default api;