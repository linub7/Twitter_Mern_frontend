import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_DEVELOPMENT
    ? import.meta.env.VITE_REACT_APP_BACKEND_DEVELOPMENT_URL
    : import.meta.env.VITE_REACT_APP_BACKEND_PRODUCTION_URL,
});

export default client;
