import * as yup from 'yup';

export function useValidationsSchemaNFe() {

    const createSchemaDataHoraSaidaEntrada = (dadosNFe) => {
        if (dadosNFe && dadosNFe.identificacaoNFe && dadosNFe.identificacaoNFe.operacaoInterna) {
            const entrada = dadosNFe.identificacaoNFe.operacaoInterna.naturezaOperacao.indicadorOperacao === 'E';
            const dataHoraEmissao = dadosNFe.identificacaoNFe.dataHoraEmissao;

            if (entrada) {
                return yup.date().required('Data de entrada é obrigatória.').min(dataHoraEmissao, 'Data de entrada deve ser maior ou igual a data de emissão.');
            } else {
                return yup.date().required('Data de saída é obrigatória.').min(dataHoraEmissao, 'Data saída deve ser maior ou igual a data de emissão.');
            }
        } else {
            return yup.date().required('Data e hora de saída/entrada é obrigatória.');
        }
    }

    return {
        createSchemaDataHoraSaidaEntrada
    };
}