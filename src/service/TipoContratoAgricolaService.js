import CrudService from './CrudService';
import api from './api';

class TipoContratoAgricolaService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }
}

export default new TipoContratoAgricolaService('agricola/tipo-contrato-agricola');