import CrudService from './CrudService';
import api from './api';
class UfService extends CrudService {

    getUfBySigla(sigla) {
        return api.get(`${this.pathService}/sigla/${sigla}`);
    }
}

export default new UfService('tabela/uf');