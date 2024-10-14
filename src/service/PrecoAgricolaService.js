import CrudService from './CrudService';
import api from './api';

class PrecoAgricolaService extends CrudService {

    buscaPrecoVigente(payload) {
        return api.post(`/${this.pathService}/servico/busca-preco-vigente`, JSON.stringify(payload));
    }
}

export default new PrecoAgricolaService('agricola/preco-agricola');