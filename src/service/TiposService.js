import api from './api';

class TiposService {

    getGrandezasMedida() {
        return api.get('/tabela/grandeza-medida');
    }

}

export default new TiposService();


