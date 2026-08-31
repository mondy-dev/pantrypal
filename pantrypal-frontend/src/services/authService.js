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