import CrudService from './CrudService';
import api from './api';

class SubItemClassificacaoAgricolaService extends CrudService {

    buscarParaRomaneio(filtros, itemId, itemClassificacaoAgricolaId, dataRomaneio) {
        return api.post(`${this.pathService}/seletores/get-itens-to-romaneio?item=${itemId}&itemclassificacaoagricola=${itemClassificacaoAgricolaId}&dataromaneio=${dataRomaneio}`, JSON.stringify(filtros));
    }
}

export default new SubItemClassificacaoAgricolaService('agricola/sub-item-classificacao-agricola');