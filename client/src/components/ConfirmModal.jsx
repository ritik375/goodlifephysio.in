import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmModal = ({ open, title = 'Are you sure?', message, onConfirm, onCancel, confirmLabel = 'Delete' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-ink/60 flex items-center justify-center p-6" role="dialog" aria-modal="true">
      <div className="bg-surface rounded-card max-w-sm w-full p-6 shadow-lift">
        <div className="h-11 w-11 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <FaExclamationTriangle size={18} />
        </div>
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        {message && <p className="text-sm text-slate mt-2 leading-relaxed">{message}</p>}
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="btn-secondary flex-1 text-sm">Cancel</button>
          <button
            onClick={onConfirm}
            className="flex-1 text-sm inline-flex items-center justify-center gap-2 bg-red-500 text-white font-medium
                       px-6 py-3 rounded-full hover:bg-red-600 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
