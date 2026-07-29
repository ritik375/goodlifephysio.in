import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaClock, FaArrowLeft, FaCalendarCheck } from 'react-icons/fa';
import { getIcon } from '../utils/iconMap';
import LoadingSpinner from '../components/LoadingSpinner';
import { getServiceBySlug } from '../services/serviceService';
import { useClinicInfo } from '../hooks/useClinicInfo';

const ServiceDetail = () => {
  const { slug } = useParams();
  const { clinicInfo } = useClinicInfo();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const { data } = await getServiceBySlug(slug);
        setService(data.data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  if (loading) return <LoadingSpinner label="Loading service" />;

  if (notFound || !service) {
    return (
      <div className="container-clinic py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Service not found</h1>
        <Link to="/services" className="btn-secondary mt-6 inline-flex"><FaArrowLeft size={12} /> Back to services</Link>
      </div>
    );
  }

  const Icon = getIcon(service.icon);

  return (
    <>
      <Helmet>
        <title>{service.title} | {clinicInfo.clinic_name}</title>
        <meta name="description" content={service.short_description} />
      </Helmet>

      <section className="py-16">
        <div className="container-clinic max-w-3xl">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-slate hover:text-primary mb-8">
            <FaArrowLeft size={12} /> All services
          </Link>

          <div className="h-14 w-14 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-6">
            <Icon size={26} />
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">{service.title}</h1>
          <p className="text-slate text-lg mt-4 leading-relaxed">{service.short_description}</p>

          <div className="flex items-center gap-2 mt-6 text-sm font-mono text-slate border-y border-line py-4">
            <FaClock size={13} /> Typical session length: {service.duration_minutes} minutes
          </div>

          <div className="prose prose-p:text-slate prose-p:leading-relaxed mt-8">
            <p>{service.description}</p>
          </div>

          <Link to="/appointment" className="btn-primary mt-10">
            <FaCalendarCheck /> Book this treatment
          </Link>
        </div>
      </section>
    </>
  );
};

export default ServiceDetail;
