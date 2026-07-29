import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaLock, FaEnvelope, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <Helmet><title>Admin Login | Good Life Physiotherapy & Rehabilitation Centre</title></Helmet>

      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <svg width="34" height="34" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="#1F6F5C" />
            <path d="M8 22 C8 14, 12 10, 16 10 C20 10, 24 14, 24 22" stroke="#F2F5F1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="16" cy="10" r="2.2" fill="#C9762E" />
          </svg>
          <span className="font-display text-xl font-semibold">Good Life Physiotherapy & Rehabilitation Centre</span>
        </Link>

        <div className="card p-8">
          <h1 className="font-display text-2xl font-semibold text-center">Admin Login</h1>
          <p className="text-slate text-sm text-center mt-1.5">Sign in to manage your clinic website</p>

          {error && (
            <p className="mt-5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="email" className="label-field">Email address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-light" size={14} />
                <input id="email" type="email" name="email" required value={form.email} onChange={handleChange} className="input-field pl-11" placeholder="admin@motionwell.com" />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="label-field">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-light" size={14} />
                <input id="password" type="password" name="password" required value={form.password} onChange={handleChange} className="input-field pl-11" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              <FaSignInAlt size={14} /> {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-light mt-6 font-mono">
          Default: admin@goodlifephysio.com / Admin@123
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
