import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaNotesMedical, FaUserMd, FaImages, FaCommentDots, FaCalendarCheck, FaArrowRight } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getServices } from '../../services/serviceService';
import { getDoctors } from '../../services/doctorService';
import { getGallery } from '../../services/galleryService';
import { getTestimonials } from '../../services/testimonialService';
import { getAppointments, getAppointmentStats } from '../../services/appointmentService';

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const AdminDashboard = () => {
  const [counts, setCounts] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [services, doctors, gallery, testimonials, appointments, stats] = await Promise.all([
          getServices(), getDoctors(), getGallery(), getTestimonials(), getAppointments(), getAppointmentStats(),
        ]);
        setCounts({
          services: services.data.count,
          doctors: doctors.data.count,
          gallery: gallery.data.count,
          testimonials: testimonials.data.count,
          appointments: appointments.data.count,
          byStatus: stats.data.data,
        });
        setRecentAppointments(appointments.data.data.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner label="Loading dashboard" />;

  const cards = [
    { label: 'Services', value: counts.services, icon: FaNotesMedical, to: '/admin/services' },
    { label: 'Doctors', value: counts.doctors, icon: FaUserMd, to: '/admin/doctors' },
    { label: 'Gallery Images', value: counts.gallery, icon: FaImages, to: '/admin/gallery' },
    { label: 'Testimonials', value: counts.testimonials, icon: FaCommentDots, to: '/admin/testimonials' },
    { label: 'Appointments', value: counts.appointments, icon: FaCalendarCheck, to: '/admin/appointments' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
      <p className="text-slate text-sm mt-1">An overview of your clinic's website content and activity.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
        {cards.map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to} className="card p-5 hover:shadow-lift transition-shadow group">
            <div className="h-10 w-10 rounded-lg bg-primary-light text-primary flex items-center justify-center mb-4">
              <Icon size={16} />
            </div>
            <p className="font-display text-2xl font-semibold">{value}</p>
            <p className="text-xs text-slate mt-1 flex items-center gap-1.5">
              {label} <FaArrowRight size={9} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-8">
        {counts.byStatus.map((s) => (
          <div key={s.status} className="card p-5 flex items-center justify-between">
            <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${STATUS_COLORS[s.status] || 'bg-slate/10 text-slate'}`}>
              {s.status}
            </span>
            <span className="font-display text-xl font-semibold">{s.count}</span>
          </div>
        ))}
      </div>

      <div className="card mt-8 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h2 className="font-display font-semibold">Recent Appointment Requests</h2>
          <Link to="/admin/appointments" className="text-sm text-primary flex items-center gap-1.5 hover:gap-2.5 transition-all">
            View all <FaArrowRight size={11} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-light uppercase tracking-wide bg-paper">
                <th className="px-6 py-3 font-medium">Patient</th>
                <th className="px-6 py-3 font-medium">Date & Time</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((a) => (
                <tr key={a.id} className="border-t border-line">
                  <td className="px-6 py-3.5">
                    <p className="font-medium">{a.full_name}</p>
                    <p className="text-xs text-slate-light">{a.email}</p>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-xs">{a.preferred_date} · {a.preferred_time}</td>
                  <td className="px-6 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentAppointments.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-slate">No appointment requests yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
