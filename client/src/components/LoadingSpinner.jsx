// Lightweight loading indicator shaped like a partial ROM arc sweeping —
// consistent with the site's goniometer motif instead of a generic spinner.
const LoadingSpinner = ({ size = 40, label = 'Loading' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16" role="status" aria-live="polite">
    <svg width={size} height={size} viewBox="0 0 50 50" className="animate-spin">
      <circle
        cx="25" cy="25" r="20"
        fill="none"
        stroke="#DCE3DE"
        strokeWidth="4"
      />
      <path
        d="M25 5 A20 20 0 0 1 45 25"
        fill="none"
        stroke="#1F6F5C"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
    <span className="text-sm text-slate font-mono tracking-wide">{label}…</span>
  </div>
);

export default LoadingSpinner;
