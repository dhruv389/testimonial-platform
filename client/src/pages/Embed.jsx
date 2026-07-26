import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { testimonialApi } from '../services/api';
import RatingStars from '../components/RatingStars';

const Embed = () => {
  const [searchParams] = useSearchParams();
  const accent = searchParams.get('accent') || '#4f46e5';
  const layout = searchParams.get('layout') || 'grid';
  const limitParam = parseInt(searchParams.get('limit')) || 6;

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchTestimonials(1, true);
  }, []);

  const fetchTestimonials = async (pageNum, isReset) => {
    try {
      if (isReset) setLoading(true);
      else setLoadingMore(true);
      setError('');

      const res = await testimonialApi.getApproved(pageNum, limitParam);
      const data = res.data;
      const items = Array.isArray(data) ? data : (data.testimonials || []);
      const paginationInfo = data.pagination;

      if (isReset) setTestimonials(items);
      else setTestimonials(prev => [...prev, ...items]);

      setPage(pageNum);
      setHasMore(paginationInfo ? paginationInfo.hasMore : false);
    } catch (err) {
      setError('Unable to load testimonials.');
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  if (loading && testimonials.length === 0) {
    return (
      <div className="p-6 text-center">
        <div 
          className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: `${accent} transparent ${accent} ${accent}` }}
        ></div>
        <p className="mt-2 text-sm text-gray-500">Loading testimonials...</p>
      </div>
    );
  }

  if (error && testimonials.length === 0) {
    return (
      <div className="p-6 text-center border border-red-200 bg-red-50 rounded-lg">
        <p className="text-red-600 font-medium text-sm">{error}</p>
        <button
          onClick={() => fetchTestimonials(1, true)}
          className="mt-3 px-3 py-1.5 text-white text-xs font-semibold rounded shadow-sm"
          style={{ backgroundColor: accent }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!loading && testimonials.length === 0) {
    return (
      <div className="p-6 text-center border border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500 text-sm">No testimonials available yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4 w-full bg-transparent">
      <div className={layout === 'list' ? 'flex flex-col gap-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
        {testimonials.map(item => (
          <div
            key={item._id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center space-x-3 mb-3">
                {item.photo ? (
                  <img src={item.photo} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                    style={{ backgroundColor: accent }}
                  >
                    {getInitials(item.name)}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.company}</p>
                </div>
              </div>

              <div className="mb-2">
                <RatingStars rating={item.rating} />
              </div>

              <p className="text-gray-700 text-sm italic mb-4">"{item.testimonial}"</p>
            </div>

            {item.createdAt && (
              <div className="text-right text-xs text-gray-400">
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={() => fetchTestimonials(page + 1, false)}
            disabled={loadingMore}
            className="px-4 py-2 text-white font-medium text-xs rounded-lg transition disabled:opacity-50"
            style={{ backgroundColor: accent }}
          >
            {loadingMore ? 'Loading...' : 'Load More Testimonials'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Embed;
