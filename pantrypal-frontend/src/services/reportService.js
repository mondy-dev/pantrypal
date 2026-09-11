import api from './api';

export const getInventoryReport = async () => {
    const response = await api.get('/reports/inventory');
    return response.data;
};

export const getExpirationReport = async () => {
    const response = await api.get('/reports/expiration');
    return response.data;
};

export const getConsumptionReport = async () => {
    const response = await api.get('/reports/consumption');
    return response.data;
};

export const getWasteReport = async () => {
    const response = await api.get('/reports/waste');
    return response.data;
};