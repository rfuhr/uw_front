import CrudService from './CrudService';
import api from './api';

class GrupoFinanceiroService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }
}

export default new GrupoFinanceiroService('financeiro/grupo-financeiro');