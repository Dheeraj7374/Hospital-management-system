import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    changePassword: (data) => api.post('/auth/change-password', data),
    createAdmin: (data) => api.post('/auth/create-admin', data),
};


export const patientAPI = {
    getAll: () => api.get('/patients'),
    getById: (id) => api.get(`/patients/${id}`),
    create: (data) => api.post('/patients', data),
    update: (id, data) => api.put(`/patients/${id}`, data),
    delete: (id) => api.delete(`/patients/${id}`),
};


export const doctorAPI = {
    getAll: () => api.get('/doctors'),
    getById: (id) => api.get(`/doctors/${id}`),
    create: (data) => api.post('/doctors', data),
    update: (id, data) => api.put(`/doctors/${id}`, data),
    delete: (id) => api.delete(`/doctors/${id}`),
    uploadPhoto: (id, formData) => api.post(`/doctors/${id}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    uploadCertificate: (id, formData) => api.post(`/doctors/${id}/certificate`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};


export const appointmentAPI = {
    getAll: (params) => api.get('/appointments', { params }),
    getById: (id) => api.get(`/appointments/${id}`),
    create: (data) => api.post('/appointments', data),
    update: (id, data) => api.put(`/appointments/${id}`, data),
    delete: (id) => api.delete(`/appointments/${id}`),
    getByDoctorId: (doctorId) => api.get(`/appointments?doctorId=${doctorId}`), 
};


export const billAPI = {
    getAll: () => api.get('/bills'),
    getById: (id) => api.get(`/bills/${id}`),
    create: (data) => api.post('/bills', data),
    update: (id, data) => api.put(`/bills/${id}`, data),
};


export const reportAPI = {
    getAll: (params) => api.get('/reports', { params }),
    upload: (formData) => api.post('/reports/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    download: (id) => api.get(`/reports/download/${id}`, { responseType: 'blob' }),
    delete: (id) => api.delete(`/reports/${id}`),
};

export default api;
