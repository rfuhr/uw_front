import api from './api';

class CalcularPrecoBaseService {

    calcularPrecoBase(tipoPrecoId, itemId) {
        return api.get(`/comercial/calcular-preco-base/${tipoPrecoId}/item/${itemId}`);
    }

}

export default new CalcularPrecoBaseService();