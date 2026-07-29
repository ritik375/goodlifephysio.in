import { useState, useEffect } from 'react';
import { FaSave, FaKey } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useClinicInfo } from '../../hooks/useClinicInfo';
import { getClinicInfo, updateClinicInfo } from '../../services/clinicInfoService';
import { changePassword } from '../../services/authService';

const FIELDS = [
  { name: 'clinic_name', label: 'Clinic name' },
  { name: 'tagline', label: 'Tagline' },
  { name: 'about', label: 'About (shown on Home & About pages)', textarea: true },
  { name: 'address', label: 'Address' },
  { name: 'phone', label: 'Phone number' },
  { name: 'whatsapp', label: 'WhatsApp number (digits only, with country code)' },
  { name: 'email', label: 'Email address' },
  { name: 'opening_hours', label: 'Opening hours' },
  { name: 'map_embed_url', label: 'Google Maps embed URL', textarea: true },
  { name: 'facebook_url', label: 'Facebook URL' },
  { name: 'instagram_url', label: 'Instagram URL' },
  { name: 'linkedin_url', label: 'LinkedIn URL' },
];

const AdminClinicSettings = () => {
  const { setClinicInfo } = useClinicInfo();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, showToast, closeToast } = useToast();

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    getClinicInfo().then(({ data }) => setForm(data.data)).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateClinicInfo(form);
      setClinicInfo(data.data);
      showToast('Clinic information updated successfully');
    } catch {
      showToast('Failed to update clinic information', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwSaving(true);
    try {
      await changePassword(pwForm.currentPassword, pwForm.newPassword);
      showToast('Password changed successfully');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setPwSaving(false);
    }
  };

  if (loading || !form) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold">Clinic Settings</h1>
      <p className="text-slate text-sm mt-1">Update the information shown across your public website.</p>

      <form onSubmit={handleSubmit} className="card p-6 mt-8 space-y-5">
        {FIELDS.map(({ name, label, textarea }) => (
          <div key={name}>
            <label className="label-field">{label}</label>
            {textarea ? (
              <textarea name={name} value={form[name] || ''} onChange={handleChange} rows={3} className="input-field resize-none" />
            ) : (
              <input name={name} value={form[name] || ''} onChange={handleChange} className="input-field" />
            )}
          </div>
        ))}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          <FaSave size={13} /> {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>

      <form onSubmit={handlePasswordChange} className="card p-6 mt-6 space-y-5">
        <h2 className="font-display font-semibold flex items-center gap-2"><FaKey size={14} /> Change Password</h2>
        <div>
          <label className="label-field">Current password</label>
          <input type="password" required value={pwForm.currentPassword} onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))} className="input-field" />
        </div>
        <div>
          <label className="label-field">New password</label>
          <input type="password" required minLength={6} value={pwForm.newPassword} onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))} className="input-field" />
        </div>
        <button type="submit" disabled={pwSaving} className="btn-secondary disabled:opacity-60">
          {pwSaving ? 'Updating…' : 'Update Password'}
        </button>
      </form>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
};

export default AdminClinicSettings;
