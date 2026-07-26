import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://testimonial-platform-gbds.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function submitTestimonial(formData) {
  return api.post('/testimonials/submit', formData);
}

export function getAllTestimonials(status, page, limit) {
  return api.get('/testimonials', {
    params: { status, page, limit }
  });
}

export function getApprovedTestimonials(page, limit) {
  return api.get('/testimonials/approved', {
    params: { page, limit }
  });
}

export function updateTestimonialStatus(id, status) {
  return api.patch(`/testimonials/${id}/status`, { status });
}

export function deleteTestimonial(id) {
  return api.delete(`/testimonials/${id}`);
}

export const testimonialApi = {
  submit: submitTestimonial,
  getAll: getAllTestimonials,
  getApproved: getApprovedTestimonials,
  updateStatus: updateTestimonialStatus,
  delete: deleteTestimonial,
};

export default api;