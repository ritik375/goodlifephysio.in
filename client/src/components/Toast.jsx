import { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;
  const isError = toast.type === 'error';

  return (
    <div
      className={`fixed bottom-6 left-6 z-[80] flex items-center gap-3 rounded-xl px-5 py-4 shadow-lift max-w-sm
                  ${isError ? 'bg-red-500' : 'bg-primary'} text-white animate-fadeUp`}
      role="alert"
    >
      {isError ? <FaExclamationCircle size={18} /> : <FaCheckCircle size={18} />}
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button onClick={onClose} aria-label="Dismiss"><FaTimes size={14} /></button>
    </div>
  );
};

export default Toast;
