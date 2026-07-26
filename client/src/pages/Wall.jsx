import { useState, useEffect } from 'react';
import { testimonialApi } from '../services/api';
import TestimonialCard from '../components/TestimonialCard';

const Wall = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchApprovedTestimonials(1, true);
  }, []);

  const fetchApprovedTestimonials = async (pageNum = 1, isReset = false) => {
    try {
      if (isReset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError('');

      const limit = 6;
      const response = await testimonialApi.getApproved(pageNum, limit);
      const data = response.data;

      const newItems = Array.isArray(data) ? data : (data.testimonials || []);
      const paginationInfo = data.pagination;

      if (isReset) {
        setTestimonials(newItems);
      } else {
        setTestimonials(prev => [...prev, ...newItems]);
      }

      setPage(pageNum);
      setHasMore(paginationInfo ? paginationInfo.hasMore : false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load testimonials. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    fetchApprovedTestimonials(page + 1, false);
  };

  return (
    <div className="min-h-screen bg-radial-mesh pb-16">
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-10 max-w-4xl">
        
        {/* Header Hero Section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3">
            <span>⭐</span>
            <span>Wall of Love</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Customer Praise & Reviews
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto mt-2 sm:mt-3 px-2">
            Explore authentic feedback from customers who trust our product every day.
          </p>
          
          <div className="mt-5 sm:mt-6 flex justify-center">
            <a
              href="/"
              className="inline-flex items-center space-x-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-indigo-500/20"
            >
              <span>Share Your Experience</span>
              <span>✨</span>
            </a>
          </div>
        </div>

        {/* Main Content Card Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-4 sm:p-6 md:p-8">

          {/* Error State with Retry */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
              <div>
                <p className="font-bold">Error Loading Testimonials</p>
                <p>{error}</p>
              </div>
              <button
                onClick={() => fetchApprovedTestimonials(1, true)}
                className="px-4 py-2 bg-rose-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-rose-700 transition shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="animate-pulse bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/6"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && testimonials.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300 p-6">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                💬
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800">No approved testimonials yet</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
                Be the first customer to share your story and inspire others!
              </p>
              <div className="mt-5">
                <a
                  href="/"
                  className="inline-flex items-center px-4 py-2 text-xs sm:text-sm font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition"
                >
                  Submit Testimonial
                </a>
              </div>
            </div>
          )}

          {/* Testimonials List */}
          {!loading && testimonials.length > 0 && (
            <div>
              <div className="space-y-4">
                {testimonials.map(testimonial => (
                  <TestimonialCard
                    key={testimonial._id}
                    testimonial={testimonial}
                    showActions={false}
                  />
                ))}
              </div>

              {/* Pagination / Load More */}
              {hasMore && (
                <div className="text-center mt-8 pt-6 border-t border-slate-100">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-slate-800 shadow-md transition disabled:opacity-50 inline-flex items-center space-x-2"
                  >
                    {loadingMore ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <span>Load More Testimonials</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wall;