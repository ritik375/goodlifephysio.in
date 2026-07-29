import { useState, useCallback } from 'react';

// Small local toast-state hook — each page/layout that needs toasts
// creates its own instance and renders <Toast toast={toast} onClose={...} />.
export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const closeToast = useCallback(() => setToast(null), []);

  return { toast, showToast, closeToast };
};
