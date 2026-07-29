import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { getIcon, ICON_OPTIONS } from '../../utils/iconMap';
import { getServices, createService, updateService, deleteService } from '../../services/serviceService';

const EMPTY_FORM = {
  title: '', short_description: '', description: '', icon: 'FaNotesMedical',
  duration_minutes: 45, display_order: 0, is_active: 1,
};

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const { toast, showToast, closeToast } = useToast();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data } = await getServices();
      setServices(data.data);
    } catch {
      showToast('Failed to load services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (service) => { setEditing(service); setForm(service); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateService(editing.id, form);
        showToast('Service updated successfully');
      } else {
        await createService(form);
        showToast('Service created successfully');
      }
      closeModal();
      fetchServices();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save service', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteService(deleteTarget.id);
      showToast('Service deleted');
      setDeleteTarget(null);
      fetchServices();
    } catch {
      showToast('Failed to delete service', 'error');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Services</h1>
          <p className="text-slate text-sm mt-1">Manage treatment programs shown on the website.</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm"><FaPlus size={12} /> Add Service</button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {services.map((service) => {
            const Icon = getIcon(service.icon);
            return (
              <div key={service.id} className="card p-5">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                    <Icon size={16} />
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${service.is_active ? 'bg-green-100 text-green-700' : 'bg-slate/10 text-slate'}`}>
                    {service.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <h3 className="font-display font-semibold mt-4">{service.title}</h3>
                <p className="text-slate text-sm mt-1.5 line-clamp-2">{service.short_description}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => openEdit(service)} className="btn-secondary text-xs flex-1 py-2"><FaEdit size={11} /> Edit</button>
                  <button onClick={() => setDeleteTarget(service)} className="flex-1 text-xs py-2 rounded-full border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center gap-2">
                    <FaTrash size={11} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[70] bg-ink/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface rounded-card max-w-lg w-full p-6 my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold">{editing ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={closeModal} aria-label="Close"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-field">Title</label>
                <input name="title" value={form.title} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="label-field">Short description</label>
                <input name="short_description" value={form.short_description} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="label-field">Full description</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="input-field resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Icon</label>
                  <select name="icon" value={form.icon} onChange={handleChange} className="input-field">
                    {ICON_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt.replace('Fa', '')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-field">Duration (min)</label>
                  <input type="number" name="duration_minutes" value={form.duration_minutes} onChange={handleChange} min={5} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Display order</label>
                  <input type="number" name="display_order" value={form.display_order} onChange={handleChange} className="input-field" />
                </div>
                {editing && (
                  <div>
                    <label className="label-field">Status</label>
                    <select name="is_active" value={form.is_active} onChange={handleChange} className="input-field">
                      <option value={1}>Active</option>
                      <option value={0}>Hidden</option>
                    </select>
                  </div>
                )}
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
                {saving ? 'Saving…' : editing ? 'Update Service' : 'Create Service'}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this service?"
        message={`"${deleteTarget?.title}" will be permanently removed.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
};

export default AdminServices;
