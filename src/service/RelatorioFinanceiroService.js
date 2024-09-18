import api from './api';

class RelatorioFinanceiroService {

    imprimirRelatorio(payload) {
        return api.post(`/financeiro/relatorio/imprimir`, payload, { responseType: 'blob' } );
    }

}

export default new RelatorioFinanceiroService();