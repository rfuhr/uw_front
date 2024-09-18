import CrudService from './CrudService';
import api from './api';

class OperacaoAcessoriaFinanceiraService extends CrudService {

    getJuros() {
        return api.get(`${this.pathService}/juros`);
    }

    getDescontos() {
        return api.get(`${this.pathService}/descontos`);
    }
}

export default new OperacaoAcessoriaFinanceiraService('financeiro/operacao-acessoria-financeira');