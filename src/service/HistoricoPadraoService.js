import CrudService from './CrudService';
import api from './api';

class HistoricoPadraoService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }
}

export default new HistoricoPadraoService('tabela/historico-padrao');