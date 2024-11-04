import CrudService from './CrudService';
import api from './api';

class ValidaDepartamentoGrupoContabilService extends CrudService {

    getValidacao(departamentoId, grupoContabilId) {
        return api.get(`/${this.pathService}/servicos/get-validacao?departamento=${departamentoId || -1}&grupocontabil=${grupoContabilId || -1}`);
    }
}

export default new ValidaDepartamentoGrupoContabilService('estoque/valida-departamento-grupo-contabil');