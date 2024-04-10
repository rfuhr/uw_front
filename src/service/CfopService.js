import CrudService from './CrudService';
import api from './api';
class CfopService extends CrudService {

    getSeletorByOperacaoInterna(filtros, operacaoInternaId) {
        return api.post(`/${this.pathService}/seletores/by-operacao-interna/${operacaoInternaId}`, JSON.stringify(filtros));
    }
}

export default new CfopService('fiscal/cfop');