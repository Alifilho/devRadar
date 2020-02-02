import axios from 'axios';

const api = axios.create({
    baseURL: '<your localhost url>'
});

export default api;