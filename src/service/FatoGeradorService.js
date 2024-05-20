import CrudService from './CrudService';
import api from './api';

class FatoGeradorService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }
}

export default new FatoGeradorService('financeiro/fato-gerador');