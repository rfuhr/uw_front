import api from './api';

class AuthService {

    login(username, password) {
        return api.post(`/auth/login`, {username, password});
    }

    logout() {
        return api.post(`/auth/logout`);
    }
}

export default new AuthService();