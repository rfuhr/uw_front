import CrudService from './CrudService';
import api from './api';

class TipoTituloService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }
}

export default new TipoTituloService('financeiro/tipo-titulo');