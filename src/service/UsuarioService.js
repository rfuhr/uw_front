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

    checkAutonomia(empresaId, empresaFilialId, tag) {
        return api.get(`${this.pathService}/autonomia/${empresaId}/${empresaFilialId}/${tag}`)
    }    
}

export default new UsuarioService('seguranca/usuario');