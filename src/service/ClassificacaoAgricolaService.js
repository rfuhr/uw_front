import api from './api';

const pathService = '/agricola/classificacao-agricola';
class ClassificacaoAgricolaService {

    realizarCalculoAgricola(payload) {
        return api.post(`${pathService}/servicos/calcular`, payload);
    }
}

export default new ClassificacaoAgricolaService();