import axios from 'axios';

const api = axios.create({
    baseURL: '<your local url>',
});

export default api;