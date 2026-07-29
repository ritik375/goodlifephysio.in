import { useState, useEffect } from 'react';
import { FaTrash, FaCheckCircle, FaEyeSlash } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';
import StarRating from '../../components/StarRating';
import { useToast } from '../../hooks/useToast';
import { getTestimonials, updateTestimonial, deleteTestimonial } from '../../services/testimonialService';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toast, showToast, closeToast } = useToast();

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data } = await getTestimonials();
      setTestimonials(data.data);
    } catch {
      showToast('Failed to load testimonials', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const toggleApproval = async (t) => {
    try {
      await updateTestimonial(t.id, { ...t, is_approved: t.is_approved ? 0 : 1 });
      showToast(t.is_approved ? 'Testimonial hidden from site' : 'Testimonial approved and live');
      fetchTestimonials();
    } catch {
      showToast('Failed to update testimonial', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTestimonial(deleteTarget.id);
      showToast('Testimonial deleted');
      setDeleteTarget(null);
      fetchTestimonials();
    } catch {
      showToast('Failed to delete testimonial', 'error');
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Testimonials</h1>
      <p className="text-slate text-sm mt-1">Approve patient-submitted reviews before they appear on the site.</p>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {testimonials.map((t) => (
            <div key={t.id} className="card p-5">
              <div className="flex items-start justify-between">
                <StarRating rating={t.rating} size={13} />
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${t.is_approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {t.is_approved ? 'Live' : 'Pending'}
                </span>
              </div>
              <p className="text-sm text-ink/80 mt-3 leading-relaxed line-clamp-4">{t.message}</p>
              <div className="mt-4 pt-3 border-t border-line">
                <p className="font-medium text-sm">{t.patient_name}</p>
                {t.condition_treated && <p className="text-xs text-slate-light">{t.condition_treated}</p>}
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => toggleApproval(t)} className="btn-secondary text-xs flex-1 py-2">
                  {t.is_approved ? <><FaEyeSlash size={11} /> Hide</> : <><FaCheckCircle size={11} /> Approve</>}
                </button>
                <button onClick={() => setDeleteTarget(t)} className="flex-1 text-xs py-2 rounded-full border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center gap-2">
                  <FaTrash size={11} /> Delete
                </button>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && <p className="col-span-full text-center text-slate py-16">No testimonials submitted yet.</p>}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this testimonial?"
        message="This review will be permanently removed."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
};

export default AdminTestimonials;
