import { createContext, useState, useEffect } from 'react';
import { getClinicInfo } from '../services/clinicInfoService';

export const ClinicInfoContext = createContext(null);

// Sensible fallback so the UI never breaks if the API is briefly unreachable.
const FALLBACK_INFO = {
  clinic_name: 'MotionWell Physiotherapy',
  tagline: 'Restoring movement. Rebuilding strength.',
  about: '',
  address: '',
  phone: '',
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '',
  email: '',
  map_embed_url: '',
  facebook_url: '',
  instagram_url: '',
  linkedin_url: '',
  opening_hours: '',
};

export const ClinicInfoProvider = ({ children }) => {
  const [clinicInfo, setClinicInfo] = useState(FALLBACK_INFO);
  const [infoLoading, setInfoLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const { data } = await getClinicInfo();
        if (data.data) setClinicInfo(data.data);
      } catch {
        // keep fallback
      } finally {
        setInfoLoading(false);
      }
    };
    fetchInfo();
  }, []);

  return (
    <ClinicInfoContext.Provider value={{ clinicInfo, setClinicInfo, infoLoading }}>
      {children}
    </ClinicInfoContext.Provider>
  );
};
