import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaArrowRight, FaCheckCircle, FaCalendarCheck } from 'react-icons/fa';
import ROMArc from '../components/ROMArc';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';
import DoctorCard from '../components/DoctorCard';
import TestimonialCard from '../components/TestimonialCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useClinicInfo } from '../hooks/useClinicInfo';
import { getServices } from '../services/serviceService';
import { getDoctors } from '../services/doctorService';
import { getTestimonials } from '../services/testimonialService';

const STATS = [
  { value: '12+', label: 'Years of clinical experience' },
  { value: '4,800+', label: 'Patients treated to recovery' },
  { value: '96%', label: 'Patients reporting pain relief' },
  { value: '6', label: 'Specialized treatment programs' },
];

const Home = () => {
  const { clinicInfo } = useClinicInfo();
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, d, t] = await Promise.all([getServices(), getDoctors(), getTestimonials()]);
        setServices(s.data.data.slice(0, 3));
        setDoctors(d.data.data.slice(0, 3));
        setTestimonials(t.data.data.slice(0, 3));
      } catch {
        // page still renders gracefully with empty sections
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <>
      <Helmet>
        <title>{clinicInfo.clinic_name} | {clinicInfo.tagline}</title>
        <meta name="description" content={clinicInfo.about?.slice(0, 155) || clinicInfo.tagline} />
      </Helmet>

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden">
        <div className="container-clinic grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
          <div className="animate-fadeUp">
            <p className="eyebrow mb-5">Evidence-based physiotherapy care</p>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold leading-[1.1]">
              Every recovery has a{' '}
              <span className="relative inline-block text-primary">
                measurable arc
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" preserveAspectRatio="none">
                  <path d="M0 6 Q 100 -2 200 6" stroke="#C9762E" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              , and we track yours from day one.
            </h1>
            <p className="mt-6 text-slate text-lg leading-relaxed max-w-lg">
              {clinicInfo.about || 'Licensed physiotherapists using structured, goal-based rehabilitation plans to get you back to the life you paused.'}
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/appointment" className="btn-primary">
                <FaCalendarCheck /> Book Your First Session
              </Link>
              <Link to="/services" className="btn-secondary">
                Explore Treatments <FaArrowRight size={13} />
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-10">
              {['Certified physiotherapists', 'Personalized recovery plans', 'Modern rehab equipment'].map((item) => (
                <span key={item} className="flex items-center gap-2 text-sm text-slate">
                  <FaCheckCircle className="text-primary" size={14} /> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center animate-fadeUp" style={{ animationDelay: '0.15s' }}>
            <div className="relative w-full max-w-md aspect-square rounded-full bg-primary-light flex items-center justify-center">
              <ROMArc degrees={140} className="w-4/5" />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-surface rounded-2xl shadow-lift px-6 py-4 text-center">
                <p className="font-mono text-2xl font-semibold text-primary">140°</p>
                <p className="text-xs text-slate mt-0.5">Typical shoulder ROM<br />restored within 8 weeks</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Stats ---------------- */}
      <section className="border-y border-line bg-surface">
        <div className="container-clinic grid grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <p className="font-display text-3xl sm:text-4xl font-semibold text-primary">{stat.value}</p>
              <p className="text-sm text-slate mt-1.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Services preview ---------------- */}
      <section className="py-20 lg:py-28">
        <div className="container-clinic">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
            <SectionHeading
              eyebrow="What we treat"
              title="Structured programs for lasting recovery"
              description="Every plan starts with an assessment and a measurable goal — not a generic exercise sheet."
            />
            <Link to="/services" className="btn-secondary text-sm shrink-0">
              View all services <FaArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading services" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>
          )}
        </div>
      </section>

      {/* ---------------- Doctors preview ---------------- */}
      <section className="py-20 lg:py-28 bg-surface border-y border-line">
        <div className="container-clinic">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
            <SectionHeading
              eyebrow="Meet the team"
              title="Physiotherapists who track every degree of progress"
            />
            <Link to="/doctors" className="btn-secondary text-sm shrink-0">
              Meet the full team <FaArrowRight size={12} />
            </Link>
          </div>

          {!loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((d) => <DoctorCard key={d.id} doctor={d} />)}
            </div>
          )}
        </div>
      </section>

      {/* ---------------- Testimonials preview ---------------- */}
      {!loading && testimonials.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="container-clinic">
            <SectionHeading
              eyebrow="Patient outcomes"
              title="Real recoveries, in patients' own words"
              align="center"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {testimonials.map((t) => <TestimonialCard key={t.id} testimonial={t} />)}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- CTA ---------------- */}
      <section className="py-20">
        <div className="container-clinic">
          <div className="bg-ink rounded-card px-8 py-16 text-center relative overflow-hidden">
            <ROMArc degrees={90} className="absolute -right-10 -top-10 w-56 opacity-20" strokeColor="#F2F5F1" showTicks={false} animate={false} />
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-paper max-w-xl mx-auto leading-tight relative">
              Ready to start measuring your own progress?
            </h2>
            <p className="text-paper/70 mt-4 max-w-md mx-auto relative">
              Book an initial assessment and leave with a clear, personalized recovery plan.
            </p>
            <Link to="/appointment" className="btn-accent mt-8 relative">
              <FaCalendarCheck /> Book Your Appointment
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
