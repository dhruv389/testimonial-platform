import { useState, useEffect } from 'react';
import { testimonialApi } from '../services/api';
import TestimonialCard from '../components/TestimonialCard';

const Wall = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApprovedTestimonials();
  }, []);

  const fetchApprovedTestimonials = async () => {
    try {
      setLoading(true);
      const response = await testimonialApi.getApproved();
      setTestimonials(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load testimonials');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading testimonials...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Testimonials</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No approved testimonials yet</p>
            <p className="text-gray-400 mt-2">Check back later!</p>
          </div>
        ) : (
          <div>
            {testimonials.map(testimonial => (
              <TestimonialCard
                key={testimonial._id}
                testimonial={testimonial}
                showActions={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wall;