import CrudService from './CrudService';
import api from './api';
class CarteiraFinanceiraService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }
}

export default new CarteiraFinanceiraService('financeiro/carteira-financeira');