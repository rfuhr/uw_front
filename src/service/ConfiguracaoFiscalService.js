import CrudService from './CrudService';
import api from './api';

class ConfiguracaoFiscalService extends CrudService {

    getConfiguracaoFiscal(departamentoId, parceiroLocalEnderecoIdDestino, indicadorOperacaoValue, cfopId, itemId, operacaoInternaId, dataBase,
        regimeTributarioId, classificacaoOperacaoId, origemId, ufOrigemId, ufDestinoId) {

        const payload = {
            departamentoId,
            parceiroLocalEnderecoIdDestino,
            indicadorOperacaoValue,
            cfopId,
            itemId,
            operacaoInternaId,
            dataBase,
            regimeTributarioId, 
            classificacaoOperacaoId,
            origemId, 
            ufOrigemId, 
            ufDestinoId
        };

        return api.post(`/${this.pathService}/services/tributacao`, JSON.stringify(payload));
    }

    calcularImposto(payload) {

        return api.post(`/${this.pathService}/services/calculo`, JSON.stringify(payload));
    
    }
}

export default new ConfiguracaoFiscalService('fiscal/configuracao-fiscal');