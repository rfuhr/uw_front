import CrudService from './CrudService';
import api from './api';

class RomaneioAgricolaService extends CrudService {

    cancelar(romaneioAgricolaId) {
        return api.put(`/${this.pathService}/${romaneioAgricolaId}/cancelar`);
    }
}

export default new RomaneioAgricolaService('agricola/romaneio-agricola');