import api from './api';

class ClassificacaoAgricolaService {

    recalcular(payload) {
        return api.post(`/agricola/classificacao-agricola/servicos/recalcular`, JSON.stringify(payload));
    }

    recalcularAll(payload) {
        return api.post(`/agricola/classificacao-agricola/servicos/recalcular/all`, JSON.stringify(payload));
    }

}

export default new ClassificacaoAgricolaService();