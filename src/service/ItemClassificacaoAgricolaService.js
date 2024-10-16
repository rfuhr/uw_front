import CrudService from './CrudService';
import api from './api';

class ItemClassificacaoAgricolaService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }

    buscarParaRomaneio(itemId, dataRomaneio) {
        return api.get(`${this.pathService}/servicos/get-itens-to-romaneio?item=${itemId}&dataromaneio=${dataRomaneio}`);
    }
}

export default new ItemClassificacaoAgricolaService('agricola/item-classificacao-agricola');