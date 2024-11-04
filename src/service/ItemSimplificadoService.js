import CrudService from './CrudService';
import api from './api';

class ItemSimplificadoService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }
}

export default new ItemSimplificadoService('compra/item-simplificado');