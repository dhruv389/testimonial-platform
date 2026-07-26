import { useState, useEffect } from 'react';
import { testimonialApi } from '../services/api';
import TestimonialCard from '../components/TestimonialCard';

const Dashboard = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [counts, setCounts] = useState({ all: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    fetchTestimonials();
  }, [filter]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError('');
      const statusParam = filter === 'all' ? undefined : filter;
      const response = await testimonialApi.getAll(statusParam);
      
      const items = Array.isArray(response.data) ? response.data : (response.data.testimonials || []);
      setTestimonials(items);

      // Also update overall status counts
      if (filter === 'all') {
        const pCount = items.filter(t => t.status === 'pending').length;
        const aCount = items.filter(t => t.status === 'approved').length;
        const rCount = items.filter(t => t.status === 'rejected').length;
        setCounts({
          all: items.length,
          pending: pCount,
          approved: aCount,
          rejected: rCount
        });
      }
    } catch (err) {
      setError('Failed to fetch testimonials. Please try again.');
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

  return (
    <div className="min-h-screen bg-radial-mesh pb-16">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
              <span>🛡️</span>
              <span>Admin Moderation</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Testimonial Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Review, approve, or analyze incoming customer testimonials.
            </p>
          </div>
        </div>

        {/* Stats Grid Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{counts.all}</p>
          </div>
          <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/80 shadow-xs">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-extrabold text-amber-900 mt-1">{counts.pending}</p>
          </div>
          <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200/80 shadow-xs">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Approved</p>
            <p className="text-2xl font-extrabold text-emerald-900 mt-1">{counts.approved}</p>
          </div>
          <div className="bg-rose-50/60 rounded-xl p-4 border border-rose-200/80 shadow-xs">
            <p className="text-xs font-bold text-rose-700 uppercase tracking-wider">Rejected</p>
            <p className="text-2xl font-extrabold text-rose-900 mt-1">{counts.rejected}</p>
          </div>
        </div>

        {/* Main Card Wrapper */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-6 sm:p-8">
          
          {/* Error State with Retry */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl mb-6 flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={fetchTestimonials}
                className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* Filter Pill Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-100 pb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                filter === 'all' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All {counts.all > 0 ? `(${counts.all})` : ''}
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                filter === 'pending' 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pending {counts.pending > 0 ? `(${counts.pending})` : ''}
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                filter === 'approved' 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Approved {counts.approved > 0 ? `(${counts.approved})` : ''}
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                filter === 'rejected' 
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Rejected {counts.rejected > 0 ? `(${counts.rejected})` : ''}
            </button>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="animate-pulse bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && testimonials.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-medium text-sm">
                No testimonials found for status: <span className="capitalize font-bold text-slate-800">{filter}</span>
              </p>
            </div>
          )}

          {/* Testimonials List */}
          {!loading && testimonials.length > 0 && (
            <div className="space-y-4">
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
    </div>
  );
};

export default Dashboard;