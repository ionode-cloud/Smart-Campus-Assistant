import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://smart-campus-assistant-1-djcd.onrender.com/api';

const locationAPI = axios.create({
    baseURL: `${API_BASE}/locations`,
    headers: { 'Content-Type': 'application/json' }
});

export const getAllLocations = async () => {
    const res = await locationAPI.get('/');
    // Map locationId -> id for frontend compatibility
    return res.data.data.map(loc => ({ ...loc, id: loc.locationId }));
};

export const getLocationById = async (id) => {
    const res = await locationAPI.get(`/${id}`);
    const loc = res.data.data;
    return { ...loc, id: loc.locationId };
};

export const createLocation = async (locationData) => {
    const res = await locationAPI.post('/', locationData);
    return res.data.data;
};

export const updateLocation = async (id, locationData) => {
    const res = await locationAPI.put(`/${id}`, locationData);
    return res.data.data;
};

export const deleteLocation = async (id) => {
    const res = await locationAPI.delete(`/${id}`);
    return res.data;
};
