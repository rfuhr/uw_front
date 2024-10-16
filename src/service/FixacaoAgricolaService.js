import CrudService from './CrudService';
import api from './api';

class FixacaoAgricolaService extends CrudService {

    pesquisarRomaneios(filtros) {
        return api.post(`/${this.pathService}/servico/pesquisa-romaneios`, JSON.stringify(filtros));
    }

}

export default new FixacaoAgricolaService('agricola/fixacao-agricola');