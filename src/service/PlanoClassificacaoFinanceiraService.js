import CrudService from './CrudService';
import api from './api';

class PlanoClassificacaoFinanceiraService extends CrudService {

    getJsonEstrutura() {
        return api.get(`${this.pathService}/estrutura`);
    }

}

export default new PlanoClassificacaoFinanceiraService('financeiro/plano-classificacao-financeira');