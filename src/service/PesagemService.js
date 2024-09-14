import CrudService from './CrudService';
import api from './api';

class PesagemService extends CrudService {

    finalizar(pesagemId) {
        return api.put(`${this.pathService}/${pesagemId}/finalizar`);
    }  
}

export default new PesagemService('agricola/pesagem');