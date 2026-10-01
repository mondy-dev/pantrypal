import api from './api';

export const register = async (firstName, middleName, lastName, email, password) => {
    const response = await api.post('/auth/register', {
        firstName,
        middleName,
        lastName,
        email,
        password,
    });
    return response.data;
};

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};
export const verifyEmail = async (token) => {
    const response = await api.get('/auth/verify-email', { params: { token } });
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

export const resetPassword = async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
};