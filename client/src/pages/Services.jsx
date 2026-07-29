import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getServices } from '../services/serviceService';
import { useClinicInfo } from '../hooks/useClinicInfo';

const Services = () => {
  const { clinicInfo } = useClinicInfo();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await getServices();
        setServices(data.data);
      } catch {
        setError('Unable to load services right now. Please try again shortly.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Services | {clinicInfo.clinic_name}</title>
        <meta name="description" content="Explore our full range of physiotherapy treatments, from sports rehabilitation to chronic pain management." />
      </Helmet>

      <section className="py-16 lg:py-20">
        <div className="container-clinic">
          <SectionHeading
            eyebrow="Treatment programs"
            title="Physiotherapy services designed around your recovery goal"
            description="Each program pairs hands-on treatment with a structured exercise plan, reviewed regularly against your measured progress."
          />
        </div>
      </section>

      <section className="pb-24">
        <div className="container-clinic">
          {loading && <LoadingSpinner label="Loading services" />}
          {error && <p className="text-center text-red-500 py-10">{error}</p>}
          {!loading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Services;
