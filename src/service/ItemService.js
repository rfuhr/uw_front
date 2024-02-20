import CrudService from './CrudService';
import api from './api';

class ItemService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }

}

export default new ItemService('estoque/item');