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

export const deleteFoodItem = async (id) => {
    await api.delete(`/food/${id}`);
};