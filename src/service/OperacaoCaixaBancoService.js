import CrudService from './CrudService';
import api from './api';

class OperacaoCaixaBancoService extends CrudService {

    getProximoCodigo() {
        return api.get(`${this.pathService}/proximo-codigo`);
    }
}

export default new OperacaoCaixaBancoService('financeiro/operacao-caixa-banco');