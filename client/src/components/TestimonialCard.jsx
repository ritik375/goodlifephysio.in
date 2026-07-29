import { FaQuoteLeft } from 'react-icons/fa';
import StarRating from './StarRating';

const TestimonialCard = ({ testimonial }) => (
  <div className="card p-7 flex flex-col h-full">
    <FaQuoteLeft className="text-primary/20 mb-4" size={28} />
    <StarRating rating={testimonial.rating} />
    <p className="text-ink/85 leading-relaxed mt-4 flex-1">{testimonial.message}</p>
    <div className="mt-6 pt-4 border-t border-line">
      <p className="font-display font-semibold">{testimonial.patient_name}</p>
      {testimonial.condition_treated && (
        <p className="text-xs font-mono text-slate mt-0.5">Treated for {testimonial.condition_treated}</p>
      )}
    </div>
  </div>
);

export default TestimonialCard;
