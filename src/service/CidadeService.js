import CrudService from './CrudService';
import api from './api';
class CidadeService extends CrudService {

    getCidadeByIbge(ibge) { 
        return api.get(`${this.pathService}/ibge/${ibge}`);
    }
}

export default new CidadeService('tabela/cidade');