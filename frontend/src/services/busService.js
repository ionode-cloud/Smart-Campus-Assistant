import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://smart-campus-assistant-1-djcd.onrender.com/api';

const busAPI = axios.create({
    baseURL: `${API_BASE}/buses`,
    headers: { 'Content-Type': 'application/json' }
});

export const getAllBuses = async () => {
    const res = await busAPI.get('/');
    return res.data.data;
};

export const getBusById = async (id) => {
    const res = await busAPI.get(`/${id}`);
    return res.data.data;
};

export const createBus = async (busData) => {
    const res = await busAPI.post('/', busData);
    return res.data.data;
};

export const updateBus = async (id, busData) => {
    const res = await busAPI.put(`/${id}`, busData);
    return res.data.data;
};

export const deleteBus = async (id) => {
    const res = await busAPI.delete(`/${id}`);
    return res.data;
};
