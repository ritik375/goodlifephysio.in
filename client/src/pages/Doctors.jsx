import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SectionHeading from '../components/SectionHeading';
import DoctorCard from '../components/DoctorCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getDoctors } from '../services/doctorService';
import { useClinicInfo } from '../hooks/useClinicInfo';

const Doctors = () => {
  const { clinicInfo } = useClinicInfo();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await getDoctors();
        setDoctors(data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Doctors | {clinicInfo.clinic_name}</title>
        <meta name="description" content="Meet our licensed, specialized physiotherapists." />
      </Helmet>

      <section className="py-16 lg:py-20">
        <div className="container-clinic">
          <SectionHeading
            eyebrow="Our team"
            title="Licensed physiotherapists, each with a clinical specialty"
            description="From sports rehab to neurological recovery, our team pairs deep specialization with a shared, structured approach to care."
          />
        </div>
      </section>

      <section className="pb-24">
        <div className="container-clinic">
          {loading ? (
            <LoadingSpinner label="Loading team" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((d) => <DoctorCard key={d.id} doctor={d} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Doctors;
