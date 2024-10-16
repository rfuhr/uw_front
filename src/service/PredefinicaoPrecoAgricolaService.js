import CrudService from './CrudService';
import api from './api';

class PredefinicaoPrecoAgricolaService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }

    getSeletorByValidadoParaOperacaoAgricola(filtros, itemId, tipoPrecoAgricolaId) {
        return api.post(`/${this.pathService}/seletores/valido/operacao-agricola?item=${itemId}&tipoprecoagricola=${tipoPrecoAgricolaId}`, JSON.stringify(filtros));
    }
}

export default new PredefinicaoPrecoAgricolaService('agricola/predefinicao-preco-agricola');