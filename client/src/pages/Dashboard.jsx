import { useState, useEffect } from 'react';
import { testimonialApi } from '../services/api';
import TestimonialCard from '../components/TestimonialCard';

const Dashboard = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTestimonials();
  }, [filter]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const status = filter === 'all' ? undefined : filter;
      const response = await testimonialApi.getAll(status);
      setTestimonials(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch testimonials');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await testimonialApi.updateStatus(id, 'approved');
      await fetchTestimonials();
    } catch (err) {
      setError('Failed to approve testimonial');
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await testimonialApi.updateStatus(id, 'rejected');
      await fetchTestimonials();
    } catch (err) {
      setError('Failed to reject testimonial');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await testimonialApi.delete(id);
        await fetchTestimonials();
      } catch (err) {
        setError('Failed to delete testimonial');
        console.error(err);
      }
    }
  };

  const getStatusCount = (status) => {
    return testimonials.filter(t => status === 'all' ? true : t.status === status).length;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Moderation Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            All ({getStatusCount('all')})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Pending ({getStatusCount('pending')})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Approved ({getStatusCount('approved')})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded ${filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Rejected ({getStatusCount('rejected')})
          </button>
        </div>

        {/* Testimonials List */}
        {testimonials.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No testimonials found</p>
        ) : (
          <div>
            {testimonials.map(testimonial => (
              <TestimonialCard
                key={testimonial._id}
                testimonial={testimonial}
                showActions={true}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;