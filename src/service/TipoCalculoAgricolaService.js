import CrudService from './CrudService';
import api from './api';

class TipoCalculoAgricolaService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }
}

export default new TipoCalculoAgricolaService('agricola/tipo-calculo-agricola');