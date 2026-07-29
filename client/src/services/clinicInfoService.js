import api from './api';

export const getClinicInfo = () => api.get('/clinic-info');
export const updateClinicInfo = (data) => api.put('/clinic-info', data);
