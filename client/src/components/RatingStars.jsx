const RatingStars = ({ rating, interactive = false, onRatingChange = null }) => {
  const handleClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          className={`text-2xl ${!interactive ? 'cursor-default' : 'cursor-pointer'}`}
          disabled={!interactive}
        >
          {star <= rating ? (
            <span className="text-yellow-400">★</span>
          ) : (
            <span className="text-gray-300">★</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default RatingStars;