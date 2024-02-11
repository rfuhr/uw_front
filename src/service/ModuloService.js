import api from './api';

class ModuloService {

    getAll() {
        return api.get('/seguranca/modulo');
    }

}

export default new ModuloService();