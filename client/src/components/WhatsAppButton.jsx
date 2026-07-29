import { FaWhatsapp } from 'react-icons/fa';
import { useClinicInfo } from '../hooks/useClinicInfo';

const WhatsAppButton = () => {
  const { clinicInfo } = useClinicInfo();
  const number = clinicInfo.whatsapp || import.meta.env.VITE_WHATSAPP_NUMBER;

  if (!number) return null;

  const message = encodeURIComponent(
    `Hi ${clinicInfo.clinic_name || 'MotionWell Physiotherapy'}, I'd like to know more about your treatments.`
  );

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full
                 bg-[#25D366] text-white shadow-lift hover:scale-105 transition-transform duration-200 animate-pulseSoft"
    >
      <FaWhatsapp size={28} />
    </a>
  );
};

export default WhatsAppButton;
