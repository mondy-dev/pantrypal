import api from './api';

export const getAllFoodItems = async () => {
    const response = await api.get('/food');
    return response.data;
};

export const getFoodItem = async (id) => {
    const response = await api.get(`/food/${id}`);
    return response.data;
};

export const createFoodItem = async (data) => {
    const response = await api.post('/food', data);
    return response.data;
};

export const updateFoodItem = async (id, data) => {
    const response = await api.put(`/food/${id}`, data);
    return response.data;
};

export const deleteFoodItem = async (id, reason) => {
    await api.delete(`/food/${id}`, { params: { reason } });
};
export const consumeFoodItem = async (id, amount, note) => {
    const response = await api.post(`/food/${id}/consume`, { amount, note });
    return response.data;
};

export const getHistory = async () => {
    const response = await api.get('/food/history');
    return response.data;
};