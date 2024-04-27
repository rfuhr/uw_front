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
}

export default new NFeService();