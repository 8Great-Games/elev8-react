// src/api/axios.ts
import axios from 'axios';

export const host = '';

const api = axios.create({
    baseURL: `${host}/api`,
    withCredentials: true,
});


export default api