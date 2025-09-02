// src/api/axios.ts
import axios from 'axios';

export const toolHost = 'http://tool.test.com'; // Replace with your actual host URL

const api = axios.create({
    baseURL: `${toolHost}/api`,
    withCredentials: true,
});


export default api