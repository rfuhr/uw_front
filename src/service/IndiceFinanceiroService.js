import CrudService from './CrudService';
import api from './api';

class IndiceFinanceiroService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }
}

export default new IndiceFinanceiroService('financeiro/indice-financeiro');