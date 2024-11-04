import CrudService from './CrudService';
import api from './api';

class AutorizacaoService extends CrudService {

    getAutorizacaoByOrigem(documentoorigem, tipo) {
        return api.get(`/${this.pathService}/servicos/get-autorizacao-by-origem?documentoorigem=${documentoorigem}&tipo=${tipo}`);
    }

    autorizar(id) {
        return api.patch(`/${this.pathService}/${id}/autorizar`);
    }

    negar(id) {
        return api.patch(`/${this.pathService}/${id}/negar`);
    }

}


export default new AutorizacaoService('tabela/autorizacao');