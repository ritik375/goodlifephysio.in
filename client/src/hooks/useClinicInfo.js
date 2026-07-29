import { useContext } from 'react';
import { ClinicInfoContext } from '../context/ClinicInfoContext';

export const useClinicInfo = () => {
  const context = useContext(ClinicInfoContext);
  if (!context) {
    throw new Error('useClinicInfo must be used within a ClinicInfoProvider');
  }
  return context;
};
