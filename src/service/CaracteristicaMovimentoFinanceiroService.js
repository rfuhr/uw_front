import CrudService from './CrudService';
import api from './api';
class CaracteristicaMovimentoFinanceiroService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }
}

export default new CaracteristicaMovimentoFinanceiroService('financeiro/caracteristica-movimento-financeiro');