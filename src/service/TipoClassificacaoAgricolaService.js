import CrudService from './CrudService';
import api from './api';

class TipoClassificacaoAgricolaService extends CrudService {

    findByTiposConfigurados(produtoId, safraId) {
        return api.get(`/${this.pathService}/servicos/tipos-configurados/produto/${produtoId}/safra/${safraId}`);
    }
}

export default new TipoClassificacaoAgricolaService('agricola/tipo-classificacao-agricola');