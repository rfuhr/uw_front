import CrudService from './CrudService';
import api from './api';

class SolicitacaoMercadoriaService extends CrudService {

    buscarSolicitacoesPendentesParaCotacao(departamentoSolicitadoId) {
        return api.get(`/${this.pathService}/servicos/get-solicitacoes-pendentes-cotacao?departamentosolicitado=${departamentoSolicitadoId}`);
    }
}

export default new SolicitacaoMercadoriaService('compras/solicitacao-mercadoria');