import CrudService from './CrudService';
import api from './api';

class ContratoAgricolaService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }

    buscarParaSelecaoRomaneio(parceiroId, itemId, safraId) {
        return api.get(`${this.pathService}/servicos/get-contratos-selecao-romaneio?parceiro=${parceiroId}&item=${itemId}&safra=${safraId}`);
    }

    buscarParaSelecaoFixacao(parceiroId, itemId) {
        return api.get(`${this.pathService}/servicos/get-contratos-selecao-fixacao?parceiro=${parceiroId}&item=${itemId}`);
    }

    calcularDescontos(payload) {
        return api.post(`${this.pathService}/servicos/calcula-desconto`, JSON.stringify(payload));
    }
}

export default new ContratoAgricolaService('agricola/contrato-agricola');