import CrudService from './CrudService';
import api from './api';

class FinalidadeContratoAgricolaService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }
}

export default new FinalidadeContratoAgricolaService('agricola/finalidade-contrato-agricola');