import { FaStar, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating = 5, size = 14, interactive = false, onChange }) => (
  <div className="flex gap-1" role={interactive ? 'radiogroup' : undefined} aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => {
      const filled = n <= rating;
      const Icon = filled ? FaStar : FaRegStar;
      return interactive ? (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className="text-accent"
        >
          <Icon size={size} />
        </button>
      ) : (
        <Icon key={n} size={size} className="text-accent" />
      );
    })}
  </div>
);

export default StarRating;
