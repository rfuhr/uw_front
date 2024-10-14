import CrudService from './CrudService';
import api from './api';

class TipoPrecoAgricolaService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }

    getSeletorByValidadoParaOperacaoAgricola(filtros, itemId, grupoOperacaoAgricolaId, operacaoInternaId) {
        return api.post(`/${this.pathService}/seletores/valido/operacao-agricola?item=${itemId}&grupooperacaoagricola=${grupoOperacaoAgricolaId}&operacaointerna=${operacaoInternaId}`, JSON.stringify(filtros));
    }
}

export default new TipoPrecoAgricolaService('agricola/tipo-preco-agricola');