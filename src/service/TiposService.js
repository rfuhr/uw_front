import api from './api';

class TiposService {

    getGrandezasMedida() {
        return api.get('/tabela/grandeza-medida');
    }

    getTipoOperacaoFiscal() {
        return api.get('/fiscal/tipo-operacao');
    }

    getTipoTributo() {
        return api.get('/fiscal/tipo-tributo');
    }

    getEntradaSaida() {
        return api.get('/fiscal/entrada-saida');
    }

}

export default new TiposService();


