import CrudService from './CrudService';
import api from './api';

class ConfiguracaoFiscalService extends CrudService {

    getConfiguracaoFiscal(departamentoId, parceiroLocalEnderecoIdDestino, indicadorOperacao, cfopId, itemId, operacaoInternaId, dataBase) {
        const payload = {
            departamentoId,
            parceiroLocalEnderecoIdDestino,
            indicadorOperacao,
            cfopId,
            itemId,
            operacaoInternaId,
            dataBase
        };

        return api.post(`/${this.pathService}/services/tributacao`, JSON.stringify(payload));
    }
}

export default new ConfiguracaoFiscalService('fiscal/configuracao-fiscal');