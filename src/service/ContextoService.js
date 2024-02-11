import api from './api';

class ContextoService {

    getContexto(usuarioId) {
        return api.get(`/seguranca/usuario/${usuarioId}/contexto`);
    }

    getOrganogramaContexto(usuarioId) {
        return api.get(`/seguranca/usuario/${usuarioId}/organograma`);
    }

    alterarContexto(contexto) {
        return api.post(`/seguranca/usuario/${contexto.usuarioId}/contexto`, contexto);
    }
}

export default new ContextoService();