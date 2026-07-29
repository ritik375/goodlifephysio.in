import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaNotesMedical, FaUserMd, FaImages, FaCommentDots,
  FaCalendarCheck, FaCog, FaSignOutAlt, FaBars, FaExternalLinkAlt,
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { to: '/admin/services', label: 'Services', icon: FaNotesMedical },
  { to: '/admin/doctors', label: 'Doctors', icon: FaUserMd },
  { to: '/admin/gallery', label: 'Gallery', icon: FaImages },
  { to: '/admin/testimonials', label: 'Testimonials', icon: FaCommentDots },
  { to: '/admin/appointments', label: 'Appointments', icon: FaCalendarCheck },
  { to: '/admin/settings', label: 'Clinic Settings', icon: FaCog },
];

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-paper">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-ink text-paper flex flex-col transition-transform duration-300
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center gap-2.5 px-6 py-6 border-b border-paper/10">
          <svg width="30" height="30" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="#C9762E" />
            <path d="M8 22 C8 14, 12 10, 16 10 C20 10, 24 14, 24 22" stroke="#16302B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="16" cy="10" r="2.2" fill="#16302B" />
          </svg>
          <span className="font-display font-semibold text-lg">Admin Panel</span>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-paper/70 hover:bg-paper/10 hover:text-paper'
                }`
              }
            >
              <Icon size={15} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-5 border-t border-paper/10 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-paper/70 hover:bg-paper/10 hover:text-paper"
          >
            <FaExternalLinkAlt size={13} /> View Site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-paper/70 hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <FaSignOutAlt size={15} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-ink/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between bg-surface border-b border-line px-6 py-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu" className="text-ink">
            <FaBars size={20} />
          </button>
          <span className="font-display font-semibold">Admin Panel</span>
          <div className="w-5" />
        </header>

        <header className="hidden lg:flex items-center justify-between bg-surface border-b border-line px-8 py-4">
          <p className="text-sm text-slate">Welcome back, <span className="text-ink font-medium">{admin?.name}</span></p>
          <p className="text-xs font-mono text-slate-light">{admin?.email}</p>
        </header>

        <main className="flex-1 p-5 sm:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
