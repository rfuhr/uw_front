import CrudService from './CrudService';
import api from './api';

class CondicaoPagamentoService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }

}

export default new CondicaoPagamentoService('financeiro/condicao-pagamento');