import axios from 'axios';
import { auth } from '../firebase-config';

const api = (() => {
  const getAuthToken = async () => {
    try {
      const { currentUser } = await auth;
      return {
        token: `Bearer ${await currentUser?.getIdToken()}`,
        firebaseUid: currentUser?.uid,
      };
    } catch (err) {
      return err;
    }
  };

  const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  instance.interceptors.request.use(async (config) => {
    const { token, firebaseUid } = await getAuthToken();
    config.headers.Authorization = token;
    config.headers.FirebaseUid = firebaseUid;
    return config;
  });

  return instance;
})();

export default api;
