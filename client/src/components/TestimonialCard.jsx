import RatingStars from './RatingStars';

const TestimonialCard = ({ testimonial, showActions = false, onApprove, onReject, onDelete }) => {
  const { name, company, testimonial: text, rating, photo, status, createdAt } = testimonial;
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {photo ? (
            <img 
              src={photo} 
              alt={name} 
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
              <span className="text-gray-600 text-xl font-bold">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-gray-600 text-sm">{company}</p>
          </div>
        </div>
        
        {status && (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
      </div>

      <RatingStars rating={rating} interactive={false} />
      
      <p className="mt-3 text-gray-700">{text}</p>
      
      <div className="mt-2 text-sm text-gray-500">
        {formatDate(createdAt)}
      </div>

      {showActions && status === 'pending' && (
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => onApprove && onApprove(testimonial._id)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Approve
          </button>
          <button
            onClick={() => onReject && onReject(testimonial._id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Reject
          </button>
        </div>
      )}

      {showActions && onDelete && (
        <button
          onClick={() => onDelete(testimonial._id)}
          className="mt-2 text-red-500 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default TestimonialCard;