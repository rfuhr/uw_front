import CrudService from './CrudService';
import api from './api';

class TipoContaCxBcoService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }
}

export default new TipoContaCxBcoService('financeiro/tipo-conta-cxbco');