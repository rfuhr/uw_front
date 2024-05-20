import api from './api';

class TituloService {

    incluirTitulo(payload) {
        return api.post(`/financeiro/titulo`, payload );
    }
}

export default new TituloService();