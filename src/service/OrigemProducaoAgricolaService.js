import CrudService from './CrudService';
import api from './api';

class OrigemProducaoAgricolaService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }
}

export default new OrigemProducaoAgricolaService('agricola/origem-producao-agricola');