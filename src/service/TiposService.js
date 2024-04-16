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

    getFinalidadeNfe() {
        return api.get('/fiscal/finalidade-nfe');
    }

    getTipoConsumidor() {
        return api.get('/fiscal/tipo-consumidor');
    }

    getTipoPresencaComprador() {
        return api.get('/fiscal/tipo-presenca-comprador');
    }

    getTipoCertificado() {
        return api.get('/configuracao/tipo-certificado');
    }

    getTipoAmbiente() {
        return api.get('/configuracao/tipo-ambiente');
    }

    getTipoEmissao() {
        return api.get('/configuracao/tipo-emissao');
    }

    getIndicadorOperacao() {
        return api.get('/tabela/indicador-operacao');
    }

    getDestinoOperacao() {
        return api.get('/fiscal/destino-operacao');
    }
 
    getModalidadeBaseCalculo() {
        return api.get('/fiscal/modalidade-base-calculo');
    }

    getTipoCalculo() {
        return api.get('/fiscal/tipo-calculo');
    }

    getTipoDocumentoReferenciado() {
        return api.get('/fiscal/tipo-documento-referenciado');
    }

    getModalidadeBaseCalculoSt() {
        return api.get('/fiscal/modalidade-base-calculo-st');
    }

    getSeloIpi() {
        return api.get('/fiscal/selo-ipi');
    }

    getIndicadorIEDestinatario() {
        return api.get('/fiscal/indicador-ie-destinatario');
    }
}


export default new TiposService();


