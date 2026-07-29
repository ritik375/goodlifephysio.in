import { Helmet } from 'react-helmet-async';
import { FaBullseye, FaEye, FaHandsHelping } from 'react-icons/fa';
import SectionHeading from '../components/SectionHeading';
import ROMArc from '../components/ROMArc';
import { useClinicInfo } from '../hooks/useClinicInfo';

const VALUES = [
  { icon: FaBullseye, title: 'Goal-Driven Care', text: 'Every treatment plan begins with a measurable functional goal, reviewed and adjusted at every visit.' },
  { icon: FaEye, title: 'Evidence-Based Practice', text: 'Our protocols follow current musculoskeletal and neuro-rehabilitation research, not one-size-fits-all routines.' },
  { icon: FaHandsHelping, title: 'Patient Partnership', text: 'Recovery works best as a partnership — we explain the "why" behind every exercise so you stay engaged.' },
];

const About = () => {
  const { clinicInfo } = useClinicInfo();

  return (
    <>
      <Helmet>
        <title>About Us | {clinicInfo.clinic_name}</title>
        <meta name="description" content={`Learn about ${clinicInfo.clinic_name}'s approach to physiotherapy and rehabilitation care.`} />
      </Helmet>

      <section className="py-16 lg:py-24">
        <div className="container-clinic grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow mb-4">About the clinic</p>
            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
              Care built around your <span className="text-primary">range of motion</span>, not our schedule.
            </h1>
            <p className="mt-6 text-slate leading-relaxed text-lg">
              {clinicInfo.about}
            </p>
          </div>
          <div className="flex items-center justify-center">
            <ROMArc degrees={165} className="w-full max-w-sm" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface border-y border-line">
        <div className="container-clinic">
          <SectionHeading
            eyebrow="Why patients choose us"
            title="A philosophy of care built on three principles"
            align="center"
          />
          <div className="grid sm:grid-cols-3 gap-6 mt-12">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card p-7 text-center">
                <div className="h-12 w-12 rounded-xl bg-primary-light text-primary flex items-center justify-center mx-auto mb-5">
                  <Icon size={20} />
                </div>
                <h3 className="font-display text-lg font-semibold">{title}</h3>
                <p className="text-slate text-sm mt-2.5 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-clinic grid lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-1">
            <SectionHeading eyebrow="Our approach" title="How a typical recovery plan unfolds" />
          </div>
          <ol className="lg:col-span-2 space-y-6">
            {[
              { step: 'Assessment', text: 'A detailed movement and pain assessment to identify the root cause, not just the symptom.' },
              { step: 'Baseline', text: 'We measure your starting range of motion, strength, and function to set a realistic recovery target.' },
              { step: 'Active Treatment', text: 'A combination of manual therapy, guided exercise, and modalities tailored to your condition.' },
              { step: 'Progress Review', text: 'Regular re-measurement against your baseline so your plan adapts as you improve.' },
            ].map((item, i) => (
              <li key={item.step} className="flex gap-5">
                <span className="font-mono text-sm text-primary shrink-0 w-8 pt-1">{String(i + 1).padStart(2, '0')}</span>
                <div className="border-l border-line pl-5 pb-2">
                  <h4 className="font-display text-lg font-semibold">{item.step}</h4>
                  <p className="text-slate text-sm mt-1.5 leading-relaxed">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
};

export default About;
