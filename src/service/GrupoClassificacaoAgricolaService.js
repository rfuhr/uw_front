import CrudService from './CrudService';
import api from './api';

class GrupoClassificacaoAgricolaService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }
}

export default new GrupoClassificacaoAgricolaService('agricola/grupo-classificacao-agricola');