import CrudService from './CrudService';
import api from './api';

class PlanoClassificacaoItemService extends CrudService {

    getJsonEstrutura() {
        return api.get(`${this.pathService}/estrutura`);
    }

}

export default new PlanoClassificacaoItemService('estoque/plano-classificacao-item');