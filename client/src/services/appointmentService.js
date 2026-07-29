import api from './api';

export const createAppointment = (data) => api.post('/appointments', data);
export const getAppointments = (status) => api.get('/appointments', { params: status ? { status } : {} });
export const updateAppointmentStatus = (id, status) => api.put(`/appointments/${id}/status`, { status });
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);
export const getAppointmentStats = () => api.get('/appointments/stats');
