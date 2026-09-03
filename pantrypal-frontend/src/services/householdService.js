import api from './api';

export const getMyHousehold = async () => {
    const response = await api.get('/households/me');
    return response.data;
};

export const createHousehold = async (name) => {
    const response = await api.post('/households', { name });
    return response.data;
};

export const inviteMember = async (email) => {
    const response = await api.post('/households/invite', { email });
    return response.data;
};

export const removeMember = async (userId) => {
    const response = await api.delete(`/households/members/${userId}`);
    return response.data;
};

export const renameHousehold = async (name) => {
    const response = await api.put('/households', { name });
    return response.data;
};