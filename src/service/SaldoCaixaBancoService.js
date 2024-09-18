import api from './api';

class SaldoCaixaBancoService {

    buscaSaldoCaixaBanco(payload) {
        return api.post(`/financeiro/saldo-caixa-banco/consultar`, payload );
    }
}

export default new SaldoCaixaBancoService();