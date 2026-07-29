import { useState, useEffect } from 'react';
import { FaTrash, FaFilter } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { getAppointments, updateAppointmentStatus, deleteAppointment } from '../../services/appointmentService';

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'];
const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { toast, showToast, closeToast } = useToast();

  const fetchAppointments = async (status = filter) => {
    setLoading(true);
    try {
      const { data } = await getAppointments(status || undefined);
      setAppointments(data.data);
    } catch {
      showToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(filter); }, [filter]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      showToast('Appointment status updated');
      fetchAppointments();
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAppointment(deleteTarget.id);
      showToast('Appointment deleted');
      setDeleteTarget(null);
      fetchAppointments();
    } catch {
      showToast('Failed to delete appointment', 'error');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Appointments</h1>
          <p className="text-slate text-sm mt-1">View and manage appointment requests from patients.</p>
        </div>
        <div className="flex items-center gap-2">
          <FaFilter size={13} className="text-slate-light" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field py-2 text-sm w-auto">
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card mt-8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left text-xs text-slate-light uppercase tracking-wide bg-paper">
                  <th className="px-5 py-3 font-medium">Patient</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Service / Doctor</th>
                  <th className="px-5 py-3 font-medium">Date & Time</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id} className="border-t border-line align-top">
                    <td className="px-5 py-4 font-medium">{a.full_name}</td>
                    <td className="px-5 py-4 text-xs text-slate">
                      <p>{a.email}</p>
                      <p>{a.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate">
                      <p>{a.service_title || '—'}</p>
                      <p>{a.doctor_name || 'No preference'}</p>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs">{a.preferred_date}<br />{a.preferred_time}</td>
                    <td className="px-5 py-4">
                      <select
                        value={a.status}
                        onChange={(e) => handleStatusChange(a.id, e.target.value)}
                        className={`text-xs font-medium px-2.5 py-1.5 rounded-full capitalize border-0 ${STATUS_COLORS[a.status]}`}
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => setDeleteTarget(a)} aria-label="Delete appointment" className="text-red-400 hover:text-red-600">
                        <FaTrash size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-slate">No appointment requests found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this appointment?"
        message={`The request from "${deleteTarget?.full_name}" will be permanently removed.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
};

export default AdminAppointments;
