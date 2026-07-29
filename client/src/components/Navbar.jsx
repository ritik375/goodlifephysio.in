import logo from "../assets/logo.jpeg";
import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaBars, FaTimes, FaCalendarCheck } from 'react-icons/fa';
import { useClinicInfo } from '../hooks/useClinicInfo';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { clinicInfo } = useClinicInfo();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [window.location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-surface/95 backdrop-blur shadow-soft' : 'bg-paper'
      }`}
    >
      <nav className="container-clinic flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
  src={logo}
  alt="MotionWell Logo"
  className="h-10 w-10 object-contain"
/>
          <span className="font-display text-xl font-semibold leading-none text-ink group-hover:text-primary transition-colors">
            {clinicInfo.clinic_name || 'Good Life Physiotherapy '}
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-ink/80 hover:text-primary'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <Link to="/appointment" className="hidden lg:inline-flex btn-primary text-sm">
          <FaCalendarCheck />
          Book Appointment
        </Link>

        <button
          className="lg:hidden text-ink p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </nav>

      {/* Mobile nav */}
      {isOpen && (
        <div className="lg:hidden border-t border-line bg-surface">
          <ul className="container-clinic flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block py-2.5 text-base font-medium ${isActive ? 'text-primary' : 'text-ink/80'}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-2">
              <Link to="/appointment" onClick={() => setIsOpen(false)} className="btn-primary w-full text-sm">
                <FaCalendarCheck />
                Book Appointment
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
