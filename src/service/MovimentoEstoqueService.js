import api from './api';

class MovimentoEstoqueService {

    buscaMovimentoEstoque(payload) {
        return api.post(`/estoque/movimento-estoque/consultar`, payload );
    }

    imprimirRazaoEstoque(payload) {
        return api.post(`/estoque/movimento-estoque/imprimir`, payload, { responseType: 'blob' } );
    }

}

export default new MovimentoEstoqueService();