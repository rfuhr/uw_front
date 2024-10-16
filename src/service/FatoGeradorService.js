import CrudService from './CrudService';
import api from './api';

class FatoGeradorService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }

    getSeletorByValidadoParaContratoAgricola(filtros, itemId, grupoOperacaoAgricolaId, operacaoInternaId) {
        return api.post(`/${this.pathService}/seletores/valido/contrato-agricola?item=${itemId}&grupooperacaoagricola=${grupoOperacaoAgricolaId}&operacaointerna=${operacaoInternaId}`, JSON.stringify(filtros));
    }
}

export default new FatoGeradorService('financeiro/fato-gerador');