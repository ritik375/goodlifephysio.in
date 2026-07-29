import api from './api';

export const getDoctors = () => api.get('/doctors');
export const getDoctorById = (id) => api.get(`/doctors/${id}`);

export const createDoctor = (formData) =>
  api.post('/doctors', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updateDoctor = (id, formData) =>
  api.put(`/doctors/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const deleteDoctor = (id) => api.delete(`/doctors/${id}`);
