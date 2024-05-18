import api from './api';

class SaldoEstoqueService {

    buscaSaldoEstoque(payload) {
        return api.post(`/estoque/saldo-estoque/consultar`, payload );
    }

    imprimirSaldoEstoque(payload) {
        return api.post(`/estoque/saldo-estoque/imprimir`, payload, { responseType: 'blob' } );
    }

}

export default new SaldoEstoqueService();