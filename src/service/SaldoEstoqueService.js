import api from './api';

class SaldoEstoqueService {

    buscaSaldoEstoque(payload) {
        return api.post(`/estoque/saldo-estoque/consultar`, payload );
    }

}

export default new SaldoEstoqueService();