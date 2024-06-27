import api from './api';

class TituloService {

    incluirTitulo(payload) {
        return api.post(`/financeiro/titulo`, payload );
    }

    selecaoBaixa(payload) {
        return api.post(`/financeiro/titulo/baixa/selecao`, payload );
    }

    baixaTitulo(payload) {
        return api.post(`/financeiro/titulo/baixa`, payload );
    }

    selecaoEstorno(payload) {
        return api.post(`/financeiro/titulo/estorno/selecao`, payload );
    }    

    estornoBaixa(payload) {
        return api.post(`/financeiro/titulo/estorno`, payload );
    }

    selecaoConsulta(payload) {
        return api.post(`/financeiro/titulo/consulta/selecao`, payload );
    }  

    getById(tituloId) {
        return api.get(`/financeiro/titulo/${tituloId}`);
    }

    selecaoSubstituicaoCarteira(payload) {
        return api.post(`/financeiro/titulo/substituicao-carteira/selecao`, payload );
    }

    substituicaoCarteira(payload) {
        return api.post(`/financeiro/titulo/substituicao-carteira`, payload );
    }

    selecaoNegociacao(payload) {
        return api.post(`/financeiro/titulo/negociacao/selecao`, payload );
    }

    lancarNegociacao(payload) {
        return api.post(`/financeiro/titulo/negociacao`, payload );
    }
}

export default new TituloService();