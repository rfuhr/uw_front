import api from './api';

class NFeService {

    downloadDanfeTeste() {
        return api.get(`/fiscal/nfe/teste/danfe`, { responseType: 'blob' });
    }

    gerarNfeTeste(empresaFilialId) {
        return api.get(`/fiscal/nfe/teste/${empresaFilialId}`, { responseType: 'blob' });
    }
   
}

export default new NFeService();