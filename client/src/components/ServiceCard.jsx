import { Link } from 'react-router-dom';
import { FaArrowRight, FaClock } from 'react-icons/fa';
import { getIcon } from '../utils/iconMap';

const ServiceCard = ({ service }) => {
  const Icon = getIcon(service.icon);

  return (
    <Link
      to={`/services/${service.slug}`}
      className="card group flex flex-col p-7 hover:shadow-lift hover:-translate-y-1 transition-all duration-300"
    >
      <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary-light text-primary mb-5">
        <Icon size={22} />
      </div>
      <h3 className="font-display text-xl font-semibold mb-2">{service.title}</h3>
      <p className="text-slate text-sm leading-relaxed flex-1">{service.short_description}</p>
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-line">
        <span className="flex items-center gap-1.5 text-xs font-mono text-slate">
          <FaClock size={11} /> {service.duration_minutes} min
        </span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
          Learn more <FaArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
};

export default ServiceCard;
