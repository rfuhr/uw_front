import CrudService from './CrudService';
import api from './api';

class RegraAtividadeService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }

    getSeletorByParceiro(filtros, parceiroId) {
        return api.post(`/${this.pathService}/seletores/by-parceiro/${parceiroId}`, JSON.stringify(filtros));
    }
}

export default new RegraAtividadeService('tabela/regra-atividade');