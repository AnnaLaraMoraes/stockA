import axios from 'axios';

const api = (() => {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  instance.interceptors.request.use(async (config) => {
    config.headers.Authorization = window.localStorage.getItem('token')
      ? `Bearer ${window.localStorage.getItem('token')}`
      : null;
    config.headers.FirebaseUid = window.localStorage.getItem('useruid') || null;
    return config;
  });

  return instance;
})();

export default api;
