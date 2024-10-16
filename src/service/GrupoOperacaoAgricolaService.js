import CrudService from './CrudService';
import api from './api';

class GrupoOperacaoAgricolaService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }
}

export default new GrupoOperacaoAgricolaService('agricola/grupo-operacao-agricola');