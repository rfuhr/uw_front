import api from './api';

class NFeService {

    downloadDanfeTeste() {
        return api.get(`/fiscal/nfe/teste/danfe`, { responseType: 'blob' });
    }

    gerarNfeTeste(empresaFilialId) {
        return api.get(`/fiscal/nfe/teste/${empresaFilialId}`, { responseType: 'blob' });
    }

    iniciarNfe(empresaFilialId) {
        return api.get(`/fiscal/nfe/filial/${empresaFilialId}/iniciar`);
    }

    getListaNFe(empresaFilialId) {
        return api.get(`/fiscal/nfe/filial/${empresaFilialId}`);
    }
   
    saveCacheNFe(payload) {
        return api.post(`/fiscal/nfe/cache`, payload );
    }

    getCacheNFe(cacheId) {
        return api.get(`/fiscal/nfe/cache/${cacheId}`);
    }

    getNFeComunicacaoSEFAZ(nfeId) {
        return api.get(`/fiscal/nfe/sefaz/${nfeId}`);
    }

    emitirNFe(payload) {
        return api.post(`/fiscal/nfe`, payload );
    }

    enviarNFe(nfeId) {
        return api.get(`/fiscal/nfe/${nfeId}/enviar`, { responseType: 'blob' } );
    }

    integrarNFe(nfeId) {
        return api.get(`/fiscal/nfe/${nfeId}/integrar`);
    }

    inutilizarNFe(nfeId) {
        return api.get(`/fiscal/nfe/${nfeId}/inutilizar`);
    }

    cancelarNFe(nfeId) {
        return api.get(`/fiscal/nfe/${nfeId}/cancelar`);
    }

    consultarStatusNFe(nfeId) {
        return api.get(`/fiscal/nfe/${nfeId}/consultar-status`);
    }
}

export default new NFeService();