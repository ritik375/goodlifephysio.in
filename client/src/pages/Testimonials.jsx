import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaPaperPlane } from 'react-icons/fa';
import SectionHeading from '../components/SectionHeading';
import TestimonialCard from '../components/TestimonialCard';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { getTestimonials, createTestimonial } from '../services/testimonialService';
import { useClinicInfo } from '../hooks/useClinicInfo';

const INITIAL_FORM = { patient_name: '', condition_treated: '', rating: 5, message: '' };

const Testimonials = () => {
  const { clinicInfo } = useClinicInfo();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const { toast, showToast, closeToast } = useToast();

  const fetchTestimonials = async () => {
    try {
      const { data } = await getTestimonials();
      setTestimonials(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await createTestimonial(form);
      showToast(data.message || 'Thank you for your review!');
      setForm(INITIAL_FORM);
    } catch (err) {
      showToast(err.response?.data?.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Patient Testimonials | {clinicInfo.clinic_name}</title>
        <meta name="description" content="Read what our patients say about their recovery journey with us." />
      </Helmet>

      <section className="py-16 lg:py-20">
        <div className="container-clinic">
          <SectionHeading eyebrow="Patient stories" title="Recoveries measured in real progress, told in real words" />
        </div>
      </section>

      <section className="pb-20">
        <div className="container-clinic">
          {loading ? (
            <LoadingSpinner label="Loading testimonials" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t) => <TestimonialCard key={t.id} testimonial={t} />)}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-surface border-y border-line">
        <div className="container-clinic max-w-xl">
          <SectionHeading eyebrow="Share your story" title="Tell us about your recovery" />
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="patient_name" className="label-field">Your name</label>
              <input id="patient_name" name="patient_name" value={form.patient_name} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label htmlFor="condition_treated" className="label-field">Condition treated (optional)</label>
              <input id="condition_treated" name="condition_treated" value={form.condition_treated} onChange={handleChange} className="input-field" placeholder="e.g. Lower back pain" />
            </div>
            <div>
              <span className="label-field">Your rating</span>
              <StarRating rating={form.rating} interactive onChange={(n) => setForm((f) => ({ ...f, rating: n }))} size={22} />
            </div>
            <div>
              <label htmlFor="message" className="label-field">Your review</label>
              <textarea id="message" name="message" value={form.message} onChange={handleChange} required minLength={10} rows={4} className="input-field resize-none" />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              <FaPaperPlane size={13} /> {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        </div>
      </section>

      <Toast toast={toast} onClose={closeToast} />
    </>
  );
};

export default Testimonials;
