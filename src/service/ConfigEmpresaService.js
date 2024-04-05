import CrudService from './CrudService';
import api from './api';

class ConfigEmpresaService extends CrudService {

    getConfigByEmpresa(empresaId) {
        return api.get(`${this.pathService}/service/get-by-empresa/${empresaId}`);
    }

    getConfigNFe(empresaFilialId) {
        return api.get(`${this.pathService}/service/get-config-nfe/${empresaFilialId}`);
    }

}

export default new ConfigEmpresaService('configuracao/empresa');