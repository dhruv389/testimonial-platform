import RatingStars from './RatingStars';
import AiInsightCard from './AiInsightCard';

const TestimonialCard = ({ testimonial, showActions = false, onApprove, onReject, onDelete }) => {
  const { name, company, testimonial: text, rating, photo, status, createdAt } = testimonial;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'rejected': return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-6 mb-4 relative overflow-hidden group">
      {/* Decorative accent top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center space-x-3">
          {photo ? (
            <img 
              src={photo} 
              alt={name} 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-sm shrink-0"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-sm shrink-0">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">{name}</h3>
            <p className="text-slate-500 text-xs font-medium mt-0.5 truncate">{company}</p>
          </div>
        </div>
        
        {status && (
          <span className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold capitalize ${getStatusBadge(status)}`}>
            {status}
          </span>
        )}
      </div>

      <div className="mt-3">
        <RatingStars rating={rating} interactive={false} />
      </div>
      
      {/* Testimonial Quote */}
      <div className="relative mt-2.5">
        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
          "{text}"
        </p>
      </div>
      
      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] sm:text-xs text-slate-400 font-medium">
        <span>Submitted {formatDate(createdAt)}</span>
      </div>

      {/* Modular AI Insights Component */}
      <AiInsightCard text={text} />

      {/* Moderation Actions */}
      {showActions && status === 'pending' && (
        <div className="mt-4 flex space-x-2 border-t border-slate-100 pt-3">
          <button
            onClick={() => onApprove && onApprove(testimonial._id)}
            className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Approve
          </button>
          <button
            onClick={() => onReject && onReject(testimonial._id)}
            className="flex-1 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Reject
          </button>
        </div>
      )}

      {showActions && onDelete && (
        <div className="mt-2 text-right">
          <button
            onClick={() => onDelete(testimonial._id)}
            className="text-rose-500 hover:text-rose-700 text-[11px] sm:text-xs font-semibold transition underline"
          >
            Delete Testimonial
          </button>
        </div>
      )}
    </div>
  );
};

export default TestimonialCard;