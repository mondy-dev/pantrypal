import api from './api';

export const getShoppingList = async () => {
    const response = await api.get('/shopping-list');
    return response.data;
};

export const addShoppingItem = async (name, quantity, unit) => {
    const response = await api.post('/shopping-list', { name, quantity, unit });
    return response.data;
};

export const updateShoppingItem = async (id, name, quantity, unit) => {
    const response = await api.put(`/shopping-list/${id}`, { name, quantity, unit });
    return response.data;
};

export const togglePurchased = async (id) => {
    const response = await api.put(`/shopping-list/${id}/toggle`);
    return response.data;
};

export const deleteShoppingItem = async (id) => {
    await api.delete(`/shopping-list/${id}`);
};