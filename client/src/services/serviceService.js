import api from './api';

export const getServices = () => api.get('/services');
export const getServiceBySlug = (slug) => api.get(`/services/${slug}`);
export const createService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);
