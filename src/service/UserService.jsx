import axios from 'axios'

class UserService {
    login(user) {
        return axios.post(import.meta.env.VITE_REACT_APP_API_URL + '/auth/login', user);
    }

    register(user) {
        return axios.post(import.meta.env.VITE_REACT_APP_API_URL + '/auth/register', user);
    }
}

export default new UserService()