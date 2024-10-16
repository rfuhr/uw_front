import CrudService from './CrudService';
import api from './api';
class OperacaoInternaService extends CrudService {

    getSeletorByOperacaoInternaValidadoParaRomaneio(filtros, itemId, grupoOperacaoAgricolaId) {
        return api.post(`/${this.pathService}/seletores/operacao-interna-agricola/valido/romaneio?item=${itemId}&grupooperacaoagricola=${grupoOperacaoAgricolaId}`, JSON.stringify(filtros));
    }

    getSeletorByOperacaoInternaValidadoParaContrato(filtros, itemId, grupoOperacaoAgricolaId) {
        return api.post(`/${this.pathService}/seletores/operacao-interna-agricola/valido/contrato?item=${itemId}&grupooperacaoagricola=${grupoOperacaoAgricolaId}`, JSON.stringify(filtros));
    }
}


export default new OperacaoInternaService('tabela/operacao-interna');