import CrudService from './CrudService';
import api from './api';

class UsuarioService extends CrudService {

    infoUser() {
        return api.get(`${this.pathService}/info`);
    }

    checkPermissao(empresaId, empresaFilialId, tag, operacao) {
        if (!operacao)
            return api.get(`${this.pathService}/permissao/${empresaId}/${empresaFilialId}/${tag}`)
        else
            return api.get(`${this.pathService}/permissao/${empresaId}/${empresaFilialId}/${tag}?operacao=${operacao}`)
    }
}

export default new UsuarioService('seguranca/usuario');