import api from './api';

export const getGallery = () => api.get('/gallery');

export const createGalleryImage = (formData) =>
  api.post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updateGalleryImage = (id, data) => api.put(`/gallery/${id}`, data);
export const deleteGalleryImage = (id) => api.delete(`/gallery/${id}`);
