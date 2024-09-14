import CrudService from './CrudService';
import api from './api';

class ParceiroLocalService extends CrudService {

    getEnderecoNFe(parceiroLocalId) {
        return api.get(`/${this.pathService}/${parceiroLocalId}/endereco/nfe`);
    }

    getPropriedades(parceiroLocalId, filtros) {
        return api.post(`/${this.pathService}/${parceiroLocalId}/propriedade`, JSON.stringify(filtros));
    }
}


export default new ParceiroLocalService('relacionamento/parceiro-local');