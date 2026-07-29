import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaCalendarCheck, FaCheckCircle } from 'react-icons/fa';
import SectionHeading from '../components/SectionHeading';
import { getServices } from '../services/serviceService';
import { getDoctors } from '../services/doctorService';
import { createAppointment } from '../services/appointmentService';
import { useClinicInfo } from '../hooks/useClinicInfo';

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM',
];

const INITIAL_FORM = {
  full_name: '', email: '', phone: '', service_id: '', doctor_id: '',
  preferred_date: '', preferred_time: '', message: '',
};

const Appointment = () => {
  const { clinicInfo } = useClinicInfo();
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getServices().then(({ data }) => setServices(data.data)).catch(() => {});
    getDoctors().then(({ data }) => setDoctors(data.data)).catch(() => {});
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = 'Full name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (form.phone.trim().length < 7) e.phone = 'Enter a valid phone number';
    if (!form.preferred_date) e.preferred_date = 'Select a preferred date';
    if (!form.preferred_time) e.preferred_time = 'Select a preferred time';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await createAppointment({
        ...form,
        service_id: form.service_id || null,
        doctor_id: form.doctor_id || null,
      });
      setSuccess(true);
      setForm(INITIAL_FORM);
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        const mapped = {};
        apiErrors.forEach((er) => { mapped[er.field] = er.message; });
        setErrors(mapped);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <section className="py-24">
        <div className="container-clinic max-w-lg text-center">
          <div className="h-16 w-16 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle size={28} />
          </div>
          <h1 className="font-display text-3xl font-semibold">Appointment request received</h1>
          <p className="text-slate mt-4 leading-relaxed">
            Thank you! Our front desk will call or email you shortly to confirm your slot at {clinicInfo.clinic_name}.
          </p>
          <button onClick={() => setSuccess(false)} className="btn-primary mt-8">Book Another Appointment</button>
        </div>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>Book an Appointment | {clinicInfo.clinic_name}</title>
        <meta name="description" content="Book your physiotherapy appointment online in minutes." />
      </Helmet>

      <section className="py-16 lg:py-20">
        <div className="container-clinic">
          <SectionHeading
            eyebrow="Book a visit"
            title="Schedule your appointment"
            description="Tell us a bit about what you need, and pick a time that works for you. We'll confirm within one business day."
          />
        </div>
      </section>

      <section className="pb-24">
        <div className="container-clinic max-w-2xl">
          <form onSubmit={handleSubmit} className="card p-8 space-y-6" noValidate>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="full_name" className="label-field">Full name</label>
                <input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} className="input-field" />
                {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="label-field">Phone number</label>
                <input id="phone" name="phone" value={form.phone} onChange={handleChange} className="input-field" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="label-field">Email address</label>
              <input id="email" type="email" name="email" value={form.email} onChange={handleChange} className="input-field" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="service_id" className="label-field">Service (optional)</label>
                <select id="service_id" name="service_id" value={form.service_id} onChange={handleChange} className="input-field">
                  <option value="">Select a service</option>
                  {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="doctor_id" className="label-field">Preferred doctor (optional)</label>
                <select id="doctor_id" name="doctor_id" value={form.doctor_id} onChange={handleChange} className="input-field">
                  <option value="">No preference</option>
                  {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="preferred_date" className="label-field">Preferred date</label>
                <input id="preferred_date" type="date" name="preferred_date" min={today} value={form.preferred_date} onChange={handleChange} className="input-field" />
                {errors.preferred_date && <p className="text-red-500 text-xs mt-1">{errors.preferred_date}</p>}
              </div>
              <div>
                <label htmlFor="preferred_time" className="label-field">Preferred time</label>
                <select id="preferred_time" name="preferred_time" value={form.preferred_time} onChange={handleChange} className="input-field">
                  <option value="">Select a time</option>
                  {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.preferred_time && <p className="text-red-500 text-xs mt-1">{errors.preferred_time}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="label-field">Anything we should know? (optional)</label>
              <textarea id="message" name="message" value={form.message} onChange={handleChange} rows={4} className="input-field resize-none" placeholder="Briefly describe your symptoms or concern" />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              <FaCalendarCheck /> {submitting ? 'Submitting…' : 'Request Appointment'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Appointment;
