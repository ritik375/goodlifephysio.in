import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';
import SectionHeading from '../components/SectionHeading';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { useClinicInfo } from '../hooks/useClinicInfo';

// Note: this contact form is a lightweight "reach out" form separate from
// the full appointment booking flow (see Appointment page). It composes a
// mailto link so no extra backend endpoint is required for a simple inquiry.
const Contact = () => {
  const { clinicInfo } = useClinicInfo();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const { toast, showToast, closeToast } = useToast();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Website inquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${clinicInfo.email || 'Good Life Physiotherapy & Rehabilitation Centre'}?subject=${subject}&body=${body}`;
    showToast('Opening your email client…');
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | {clinicInfo.clinic_name}</title>
        <meta name="description" content={`Get in touch with ${clinicInfo.clinic_name}. ${clinicInfo.address || ''}`} />
      </Helmet>

      <section className="py-16 lg:py-20">
        <div className="container-clinic">
          <SectionHeading eyebrow="Get in touch" title="We're here to answer your questions" />
        </div>
      </section>

      <section className="pb-24">
        <div className="container-clinic grid lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="card p-6 flex gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                <FaMapMarkerAlt size={18} />
              </div>
              <div>
                <h3 className="font-display font-semibold">Address</h3>
                <p className="text-slate text-sm mt-1">{clinicInfo.address}</p>
              </div>
            </div>
            <div className="card p-6 flex gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                <FaPhoneAlt size={16} />
              </div>
              <div>
                <h3 className="font-display font-semibold">Phone</h3>
                <a href={`tel:${clinicInfo.phone}`} className="text-slate text-sm mt-1 hover:text-primary block">{clinicInfo.phone}</a>
              </div>
            </div>
            <div className="card p-6 flex gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                <FaEnvelope size={16} />
              </div>
              <div>
                <h3 className="font-display font-semibold">Email</h3>
                <a href={`mailto:${clinicInfo.email}`} className="text-slate text-sm mt-1 hover:text-primary block">{clinicInfo.email}</a>
              </div>
            </div>
            <div className="card p-6 flex gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                <FaClock size={16} />
              </div>
              <div>
                <h3 className="font-display font-semibold">Hours</h3>
                <p className="text-slate text-sm mt-1">{clinicInfo.opening_hours}</p>
              </div>
            </div>

            {clinicInfo.map_embed_url && (
              <div className="card overflow-hidden h-64">
                <iframe
                  title="Clinic location"
                  src={clinicInfo.map_embed_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          <div className="card p-7 h-fit">
            <h3 className="font-display text-xl font-semibold mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="label-field">Full name</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label htmlFor="email" className="label-field">Email address</label>
                <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label htmlFor="message" className="label-field">Message</label>
                <textarea id="message" name="message" value={form.message} onChange={handleChange} required rows={5} className="input-field resize-none" />
              </div>
              <button type="submit" className="btn-primary w-full">
                <FaPaperPlane size={13} /> Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <Toast toast={toast} onClose={closeToast} />
    </>
  );
};

export default Contact;
