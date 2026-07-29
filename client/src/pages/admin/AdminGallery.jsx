import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaTimes, FaImage } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { resolveImage } from '../../services/api';
import { getGallery, createGalleryImage, deleteGalleryImage } from '../../services/galleryService';

const EMPTY_FORM = { title: '', category: 'Facility', display_order: 0 };

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const { toast, showToast, closeToast } = useToast();

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const { data } = await getGallery();
      setImages(data.data);
    } catch {
      showToast('Failed to load gallery', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGallery(); }, []);

  const openCreate = () => { setForm(EMPTY_FORM); setImageFile(null); setPreview(null); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return showToast('Please select an image to upload', 'error');
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append('image', imageFile);
      await createGalleryImage(formData);
      showToast('Image uploaded successfully');
      closeModal();
      fetchGallery();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to upload image', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGalleryImage(deleteTarget.id);
      showToast('Image deleted');
      setDeleteTarget(null);
      fetchGallery();
    } catch {
      showToast('Failed to delete image', 'error');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Gallery</h1>
          <p className="text-slate text-sm mt-1">Upload and manage clinic photos.</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm"><FaPlus size={12} /> Upload Image</button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {images.map((img) => (
            <div key={img.id} className="card overflow-hidden group relative">
              <div className="aspect-square bg-primary-light">
                <img src={resolveImage(img.image, '/placeholder-image.svg')} alt={img.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{img.title}</p>
                <p className="text-xs text-slate-light font-mono">{img.category}</p>
              </div>
              <button
                onClick={() => setDeleteTarget(img)}
                aria-label="Delete image"
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 text-red-500 flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity shadow-soft"
              >
                <FaTrash size={13} />
              </button>
            </div>
          ))}
          {images.length === 0 && <p className="col-span-full text-center text-slate py-16">No images uploaded yet.</p>}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[70] bg-ink/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface rounded-card max-w-md w-full p-6 my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold">Upload Image</h2>
              <button onClick={closeModal} aria-label="Close"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label
                htmlFor="gallery-file"
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-line rounded-card
                           h-40 cursor-pointer hover:border-primary transition-colors overflow-hidden"
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <FaImage size={24} className="text-slate-light" />
                    <span className="text-sm text-slate">Click to select an image</span>
                  </>
                )}
                <input id="gallery-file" type="file" accept="image/*" onChange={handleFileChange} className="hidden" required />
              </label>
              <div>
                <label className="label-field">Title</label>
                <input name="title" value={form.title} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="label-field">Category</label>
                <input name="category" value={form.category} onChange={handleChange} className="input-field" placeholder="e.g. Facility, Sessions, Equipment" />
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
                {saving ? 'Uploading…' : 'Upload Image'}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this image?"
        message="This image will be permanently removed from the gallery."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
};

export default AdminGallery;
