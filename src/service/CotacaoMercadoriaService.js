import CrudService from './CrudService';
import api from './api';

class CotacaoMercadoriaService extends CrudService {

    buscarCotacoesParaRetorno() {
        return api.get(`/${this.pathService}/servicos/get-cotacoes-retorno`);
    }

    getCotacaoParaRetorno(cotacaoMercadoriaId, cotacaoMercadoriaParceiroId) {
        return api.get(`/${this.pathService}/servicos/get-cotacao-retorno/${cotacaoMercadoriaId}/${cotacaoMercadoriaParceiroId}`);
    }
}

export default new CotacaoMercadoriaService('compras/cotacao-mercadoria');