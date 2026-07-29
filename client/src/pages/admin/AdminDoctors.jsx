import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaUserMd } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { resolveImage } from '../../services/api';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '../../services/doctorService';

const EMPTY_FORM = {
  name: '', designation: '', specialization: '', experience_years: 0,
  bio: '', email: '', phone: '', display_order: 0, is_active: 1,
};

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const { toast, showToast, closeToast } = useToast();

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const { data } = await getDoctors();
      setDoctors(data.data);
    } catch {
      showToast('Failed to load doctors', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setPhotoFile(null); setPreview(null); setModalOpen(true); };
  const openEdit = (doctor) => { setEditing(doctor); setForm(doctor); setPhotoFile(null); setPreview(null); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'photo' && value !== null && value !== undefined) formData.append(key, value);
      });
      if (photoFile) formData.append('photo', photoFile);

      if (editing) {
        await updateDoctor(editing.id, formData);
        showToast('Doctor updated successfully');
      } else {
        await createDoctor(formData);
        showToast('Doctor added successfully');
      }
      closeModal();
      fetchDoctors();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save doctor', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoctor(deleteTarget.id);
      showToast('Doctor removed');
      setDeleteTarget(null);
      fetchDoctors();
    } catch {
      showToast('Failed to delete doctor', 'error');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Doctors</h1>
          <p className="text-slate text-sm mt-1">Manage physiotherapist profiles shown on the website.</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm"><FaPlus size={12} /> Add Doctor</button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="card p-5">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary-light text-primary flex items-center justify-center overflow-hidden shrink-0">
                  {doctor.photo ? (
                    <img src={resolveImage(doctor.photo)} alt={doctor.name} className="h-full w-full object-cover" />
                  ) : (
                    <FaUserMd size={22} />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-semibold truncate">{doctor.name}</h3>
                  <p className="text-slate text-xs mt-0.5 truncate">{doctor.designation}</p>
                </div>
              </div>
              <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mt-4 ${doctor.is_active ? 'bg-green-100 text-green-700' : 'bg-slate/10 text-slate'}`}>
                {doctor.is_active ? 'Active' : 'Hidden'}
              </span>
              <div className="flex gap-2 mt-4">
                <button onClick={() => openEdit(doctor)} className="btn-secondary text-xs flex-1 py-2"><FaEdit size={11} /> Edit</button>
                <button onClick={() => setDeleteTarget(doctor)} className="flex-1 text-xs py-2 rounded-full border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center gap-2">
                  <FaTrash size={11} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
       <div className="fixed inset-0 z-[70] bg-ink/60 overflow-y-auto">
  <div className="min-h-screen flex justify-center items-start py-6 px-4">
    <div className="bg-surface rounded-card max-w-lg w-full p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-lg font-semibold">
          {editing ? 'Edit Doctor' : 'Add Doctor'}
        </h2>

        <button onClick={closeModal} aria-label="Close">
          <FaTimes />
        </button>
      </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary-light text-primary flex items-center justify-center overflow-hidden shrink-0">
                  {preview || editing?.photo ? (
                    <img src={preview || resolveImage(editing?.photo)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <FaUserMd size={26} />
                  )}
                </div>
                <div>
                  <label className="label-field mb-0">Photo</label>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Full name</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="input-field" />
                </div>
                <div>
                  <label className="label-field">Experience (years)</label>
                  <input type="number" name="experience_years" value={form.experience_years} onChange={handleChange} min={0} className="input-field" />
                </div>
              </div>
              <div>
                <label className="label-field">Designation</label>
                <input name="designation" value={form.designation} onChange={handleChange} required className="input-field" placeholder="e.g. Senior Physiotherapist, MPT" />
              </div>
              <div>
                <label className="label-field">Specialization</label>
                <input name="specialization" value={form.specialization} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="label-field">Bio</label>
                <textarea name="bio" value={form.bio || ''} onChange={handleChange} rows={3} className="input-field resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Email</label>
                  <input type="email" name="email" value={form.email || ''} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="label-field">Phone</label>
                  <input name="phone" value={form.phone || ''} onChange={handleChange} className="input-field" />
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
                {saving ? 'Saving…' : editing ? 'Update Doctor' : 'Add Doctor'}
              </button>
         </form>
    </div>
  </div>
</div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Remove this doctor?"
        message={`"${deleteTarget?.name}" will be permanently removed from the website.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
};

export default AdminDoctors;
