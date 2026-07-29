import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import { useClinicInfo } from '../hooks/useClinicInfo';

const Footer = () => {
  const { clinicInfo } = useClinicInfo();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-paper mt-24">
      <div className="container-clinic grid grid-cols-1 md:grid-cols-4 gap-10 py-16">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <svg width="30" height="30" viewBox="0 0 32 32">
              <rect width="32" height="32" rx="8" fill="#C9762E" />
              <path d="M8 22 C8 14, 12 10, 16 10 C20 10, 24 14, 24 22" stroke="#16302B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="16" cy="10" r="2.2" fill="#16302B" />
            </svg>
            <span className="font-display text-xl font-semibold">{clinicInfo.clinic_name}</span>
          </div>
          <p className="text-paper/70 max-w-sm leading-relaxed text-sm">
            {clinicInfo.tagline}
          </p>
          <div className="flex gap-3 mt-6">
            {clinicInfo.facebook_url && (
              <a href={clinicInfo.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                 className="h-9 w-9 flex items-center justify-center rounded-full bg-paper/10 hover:bg-primary transition-colors">
                <FaFacebookF size={14} />
              </a>
            )}
            {clinicInfo.instagram_url && (
              <a href={clinicInfo.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                 className="h-9 w-9 flex items-center justify-center rounded-full bg-paper/10 hover:bg-primary transition-colors">
                <FaInstagram size={14} />
              </a>
            )}
            {clinicInfo.linkedin_url && (
              <a href={clinicInfo.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                 className="h-9 w-9 flex items-center justify-center rounded-full bg-paper/10 hover:bg-primary transition-colors">
                <FaLinkedinIn size={14} />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-paper/70">
            <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
            <li><Link to="/services" className="hover:text-accent transition-colors">Our Services</Link></li>
            <li><Link to="/doctors" className="hover:text-accent transition-colors">Our Doctors</Link></li>
            <li><Link to="/appointment" className="hover:text-accent transition-colors">Book Appointment</Link></li>
            <li><Link to="/admin/login" className="hover:text-accent transition-colors">Admin Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-paper/70">
            {clinicInfo.address && (
              <li className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="mt-0.5 shrink-0 text-accent" /> <span>{clinicInfo.address}</span>
              </li>
            )}
            {clinicInfo.phone && (
              <li className="flex items-center gap-2.5">
                <FaPhoneAlt className="shrink-0 text-accent" /> <a href={`tel:${clinicInfo.phone}`} className="hover:text-accent">{clinicInfo.phone}</a>
              </li>
            )}
            {clinicInfo.email && (
              <li className="flex items-center gap-2.5">
                <FaEnvelope className="shrink-0 text-accent" /> <a href={`mailto:${clinicInfo.email}`} className="hover:text-accent">{clinicInfo.email}</a>
              </li>
            )}
            {clinicInfo.opening_hours && (
              <li className="flex items-start gap-2.5">
                <FaClock className="mt-0.5 shrink-0 text-accent" /> <span>{clinicInfo.opening_hours}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10 py-5">
        <p className="container-clinic text-center text-xs text-paper/50 font-mono">
          © {year} {clinicInfo.clinic_name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
