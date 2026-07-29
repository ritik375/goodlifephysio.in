import { FaSearchPlus } from 'react-icons/fa';
import { resolveImage } from '../services/api';

const GalleryItem = ({ item, onClick }) => (
  <button
    onClick={() => onClick(item)}
    className="relative group aspect-square overflow-hidden rounded-card bg-primary-light block w-full text-left"
  >
    <img
      src={resolveImage(item.image, '/placeholder-image.svg')}
      alt={item.title}
      loading="lazy"
      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
    />
    <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/50 transition-colors duration-300 flex items-center justify-center">
      <FaSearchPlus className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={22} />
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-ink/70 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <p className="text-white text-sm font-medium">{item.title}</p>
    </div>
  </button>
);

export default GalleryItem;
