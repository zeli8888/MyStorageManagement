import axios, { HttpStatusCode } from 'axios';
import {
    firebaseSignOut,
} from './firebase/auth';
import { firebaseAuth } from './firebase/firebaseConfig';
const baseApi = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_URL
});

baseApi.interceptors.request.use(async (config) => {
    const user = firebaseAuth.currentUser;
    if (user) {
        // Add token to header, not force to refresh token
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

baseApi.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === HttpStatusCode.Unauthorized) {
            await firebaseSignOut();
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export default baseApi;