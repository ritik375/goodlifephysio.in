import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import SectionHeading from '../components/SectionHeading';
import GalleryItem from '../components/GalleryItem';
import Lightbox from '../components/Lightbox';
import LoadingSpinner from '../components/LoadingSpinner';
import { getGallery } from '../services/galleryService';
import { useClinicInfo } from '../hooks/useClinicInfo';

const Gallery = () => {
  const { clinicInfo } = useClinicInfo();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await getGallery();
        setImages(data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = useMemo(() => ['All', ...new Set(images.map((i) => i.category))], [images]);
  const filtered = activeCategory === 'All' ? images : images.filter((i) => i.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>Gallery | {clinicInfo.clinic_name}</title>
        <meta name="description" content="A look inside our clinic facility, equipment, and treatment sessions." />
      </Helmet>

      <section className="py-16 lg:py-20">
        <div className="container-clinic">
          <SectionHeading eyebrow="Inside the clinic" title="A look at our facility and sessions" />

          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    activeCategory === cat
                      ? 'bg-primary text-white border-primary'
                      : 'border-line text-slate hover:border-primary hover:text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="pb-24">
        <div className="container-clinic">
          {loading ? (
            <LoadingSpinner label="Loading gallery" />
          ) : filtered.length === 0 ? (
            <p className="text-center text-slate py-16">No images in this category yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((img) => (
                <GalleryItem key={img.id} item={img} onClick={setSelected} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Lightbox item={selected} onClose={() => setSelected(null)} />
    </>
  );
};

export default Gallery;
