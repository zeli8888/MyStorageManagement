import axios, { HttpStatusCode } from 'axios';
import {
    firebaseSignOut,
} from './firebase/auth';
import { firebaseAuth } from './firebase/firebaseConfig';
import notificationService from './NotificationService';
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
        // network error
        if (!error.response) {
            notificationService.error('Network Error');
            return Promise.reject({ code: 'NETWORK_ERR', message: 'Network Error', error });
        }

        // token expired
        const status = error.response.status;
        if (status === HttpStatusCode.Unauthorized) {
            await firebaseSignOut();
            window.location.reload();
            notificationService.warning('Session Expired, Please Login Again');
            return Promise.reject({ code: status, message: 'Session Expired, Please Login Again', error });
        }

        // error message from server
        const serverMessage = error.response.data?.message;
        notificationService.error(serverMessage || `Request failed (${status})`);
        return Promise.reject({ code: status, message: serverMessage, error });
    }
);

export default baseApi;