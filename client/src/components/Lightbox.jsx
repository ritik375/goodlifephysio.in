import { FaTimes } from 'react-icons/fa';
import { resolveImage } from '../services/api';

const Lightbox = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-ink/90 flex items-center justify-center p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-6 right-6 text-white/80 hover:text-white p-2"
      >
        <FaTimes size={26} />
      </button>
      <figure onClick={(e) => e.stopPropagation()} className="max-w-4xl w-full">
        <img
          src={resolveImage(item.image, '/placeholder-image.svg')}
          alt={item.title}
          className="w-full max-h-[80vh] object-contain rounded-card"
        />
        <figcaption className="text-white/80 text-center mt-4 font-mono text-sm">{item.title}</figcaption>
      </figure>
    </div>
  );
};

export default Lightbox;
