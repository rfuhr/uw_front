import CrudService from './CrudService';
import api from './api';

class ParceiroLocalService extends CrudService {

    getEnderecoNFe(parceiroLocalId) {
        return api.get(`/${this.pathService}/${parceiroLocalId}/endereco/nfe`);
    }
}


export default new ParceiroLocalService('relacionamento/parceiro-local');