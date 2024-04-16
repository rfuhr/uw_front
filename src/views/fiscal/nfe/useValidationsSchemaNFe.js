import * as yup from 'yup';
import { validateCep, validateCNPJ, validateCPF, validatePhone, validateEmail } from 'validations-br';

export function useValidationsSchemaNFe() {
    const createSchemaDataHoraSaidaEntrada = (dadosIdentificacaoNFe) => {
        if (dadosIdentificacaoNFe && dadosIdentificacaoNFe.operacaoInterna) {
            const entrada = dadosIdentificacaoNFe.operacaoInterna.naturezaOperacao.indicadorOperacao === 'E';
            const dataHoraEmissao = dadosIdentificacaoNFe.dataHoraEmissao;

            if (entrada) {
                return yup.date().required('Data de entrada é obrigatória.').min(dataHoraEmissao, 'Data de entrada deve ser maior ou igual a data de emissão.');
            } else {
                return yup.date().required('Data de saída é obrigatória.').min(dataHoraEmissao, 'Data saída deve ser maior ou igual a data de emissão.');
            }
        } else {
            return yup.date().required('Data e hora de saída/entrada é obrigatória.');
        }
    };

    const createSchemaDocumentosReferenciados = (dadosIdentificacaoNFe) => {
        if (dadosIdentificacaoNFe && dadosIdentificacaoNFe.possuiDocumentoReferenciado) {
            return yup
                .array()
                .required('Documento Referenciado deve ser informado')
                .min(1, 'Pelo menos um documento referenciado deve ser fornecido.')
                .test('custom-validation', 'Erro de validação personalizado', function (values) {
                    const errors = [];

                    for (let i = 0; i < values.length; i++) {
                        const { tipoDocumentoReferenciado, chaveAcesso, ufEmitente, anoMes, cnpjEmitente, cpfEmitente, serie, numero, modeloDocumentoFiscal, numeroECF, numeroCOO } = values[i];

                        // Faça suas verificações personalizadas aqui
                        if (!tipoDocumentoReferenciado) {
                            errors.push(this.createError({ message: 'Tipo do documento referenciado é obrigatório ser informado.', path: `documentosReferenciados[${i}].tipoDocumentoReferenciado` }));
                        }

                        if ((tipoDocumentoReferenciado === '1' || tipoDocumentoReferenciado === '5') && !chaveAcesso) {
                            errors.push(this.createError({ message: 'Chave é obrigatória', path: `documentosReferenciados[${i}].chaveAcesso` }));
                        }
                        if (tipoDocumentoReferenciado === '2' || tipoDocumentoReferenciado === '3') {
                            if (!ufEmitente) errors.push(this.createError({ message: 'UF do emitente é obrigatório ser informado.', path: `documentosReferenciados[${i}].ufEmitente` }));
                            if (!anoMes) errors.push(this.createError({ message: 'Ano/Mês é obrigatório ser informado.', path: `documentosReferenciados[${i}].anoMes` }));
                            if (!ufEmitente) errors.push(this.createError({ message: 'UF do emitente é obrigatório ser informado.', path: `documentosReferenciados[${i}].ufEmitente` }));
                            if (!serie) errors.push(this.createError({ message: 'Série é obrigatória ser informado.', path: `documentosReferenciados[${i}].serie` }));
                            if (!numero) errors.push(this.createError({ message: 'Número é obrigatório ser informado.', path: `documentosReferenciados[${i}].numero` }));
                            if (!modeloDocumentoFiscal) errors.push(this.createError({ message: 'Modelo do Documento Fiscal é obrigatório ser informado.', path: `documentosReferenciados[${i}].modeloDocumentoFiscal` }));
                        }
                        if (tipoDocumentoReferenciado === '2') {
                            if (!cnpjEmitente) errors.push(this.createError({ message: 'Cnpj do emitente é obrigatório ser informado.', path: `documentosReferenciados[${i}].cnpjEmitente` }));
                        }
                        if (tipoDocumentoReferenciado === '3') {
                            if (!cnpjEmitente && !cpfEmitente) {
                                errors.push(this.createError({ message: 'Cnpj do emitente é obrigatório ser informado.', path: `documentosReferenciados[${i}].cnpjEmitente` }));
                                errors.push(this.createError({ message: 'Cpf do emitente é obrigatório ser informado.', path: `documentosReferenciados[${i}].cpfEmitente` }));
                            }
                        }
                        if (tipoDocumentoReferenciado === '4') {
                            if (!modeloDocumentoFiscal) errors.push(this.createError({ message: 'Modelo do Documento Fiscal é obrigatório ser informado.', path: `documentosReferenciados[${i}].modeloDocumentoFiscal` }));
                            if (!numeroECF) errors.push(this.createError({ message: 'Número ECF é obrigatório ser informado.', path: `documentosReferenciados[${i}].numeroECF` }));
                            if (!numeroCOO) errors.push(this.createError({ message: 'Número COO é obrigatório ser informado.', path: `documentosReferenciados[${i}].numeroCOO` }));
                        }
                    }

                    if (errors.length > 0) {
                        throw new yup.ValidationError(errors);
                    }

                    return true;
                });
        }
        return yup.mixed().optional();
    };

    const createSchemaLocalRetirada = (dadosIdentificacaoNFe) => {
        if (dadosIdentificacaoNFe && dadosIdentificacaoNFe.outroLocalRetirada) {
            return yup.object().shape({
                cnpj:
                    dadosIdentificacaoNFe.localRetirada.tipoPessoa === 'J'
                        ? yup
                              .string()
                              .required('CNPJ é obrigatório.')
                              .test('is-cnpj', 'CNPJ inválido.', (value) => {
                                  return value === '' || validateCNPJ(value);
                              })
                        : yup.mixed().notRequired(),
                cpf:
                    dadosIdentificacaoNFe.localRetirada.tipoPessoa === 'F'
                        ? yup
                              .string()
                              .required('CPF é obrigatório.')
                              .test('is-cpf', 'CPF inválido.', (value) => {
                                  return value === '' || validateCPF(value);
                              })
                        : yup.mixed().notRequired(),
                nomeRazaoSocial: dadosIdentificacaoNFe.localRetirada.tipoPessoa === 'J' ? yup.string().required('Razão Social é obrigatório.') : yup.string().required('Nome é obrigatório.'),
                cep: yup
                    .string()
                    .required('CEP é obrigatório.')
                    .test('is-cep', 'Cep inválido.', (value) => {
                        return value === '' || validateCep(value);
                    }),
                endereco: yup.string().required('Logradouro do endereço é obrigatório.'),
                numero: yup.string().required('Número do endereço é obrigatório.'),
                bairro: yup.string().required('Bairro do endereço é obrigatório.'),
                paisId: yup.number().required('País é obrigatório.'),
                ufId: yup.number().required('UF é obrigatório.'),
                cidadeId: yup.number().required('Cidade é obrigatória.'),
                telefone: yup
                    .string()
                    .required('Telefone é obrigatório.')
                    .test('is-numero', 'Número inválido.', (value) => {
                        return value === '' || validatePhone(value);
                    }),
                email: yup
                    .string()
                    .required('Email é obrigatório.')
                    .test('is-email', 'Email inválido.', (value) => {
                        return value === '' || validateEmail(value);
                    })
            });
        }
        return yup.mixed().optional();
    };

    const createSchemaLocalEntrega = (dadosDestinatarioNFe) => {
        if (dadosDestinatarioNFe && dadosDestinatarioNFe.outroLocalEntrega) {
            return yup.object().shape({
                cnpj:
                dadosDestinatarioNFe.localEntrega.tipoPessoa === 'J'
                        ? yup
                              .string()
                              .required('CNPJ é obrigatório.')
                              .test('is-cnpj', 'CNPJ inválido.', (value) => {
                                  return value === '' || validateCNPJ(value);
                              })
                        : yup.mixed().notRequired(),
                cpf:
                dadosDestinatarioNFe.localEntrega.tipoPessoa === 'F'
                        ? yup
                              .string()
                              .required('CPF é obrigatório.')
                              .test('is-cpf', 'CPF inválido.', (value) => {
                                  return value === '' || validateCPF(value);
                              })
                        : yup.mixed().notRequired(),
                nomeRazaoSocial: dadosDestinatarioNFe.localEntrega.tipoPessoa === 'J' ? yup.string().required('Razão Social é obrigatório.') : yup.string().required('Nome é obrigatório.'),
                cep: yup
                    .string()
                    .required('CEP é obrigatório.')
                    .test('is-cep', 'Cep inválido.', (value) => {
                        return value === '' || validateCep(value);
                    }),
                endereco: yup.string().required('Logradouro do endereço é obrigatório.'),
                numero: yup.string().required('Número do endereço é obrigatório.'),
                bairro: yup.string().required('Bairro do endereço é obrigatório.'),
                paisId: yup.number().required('País é obrigatório.'),
                ufId: yup.number().required('UF é obrigatório.'),
                cidadeId: yup.number().required('Cidade é obrigatória.'),
                telefone: yup
                    .string()
                    .required('Telefone é obrigatório.')
                    .test('is-numero', 'Número inválido.', (value) => {
                        return value === '' || validatePhone(value);
                    }),
                email: yup
                    .string()
                    .required('Email é obrigatório.')
                    .test('is-email', 'Email inválido.', (value) => {
                        return value === '' || validateEmail(value);
                    })
            });
        }
        return yup.mixed().optional();
    };

    const createSchemaAutorizacoes = (dadosIdentificacaoNFe) => {
        if (dadosIdentificacaoNFe && dadosIdentificacaoNFe.autorizarObterXml) {
            return yup
                .array()
                .required('Autorizações para obtenção de XML deve ser informada')
                .min(1, 'Pelo menos uma autorização deve ser fornecida.')
                .test('custom-validation', 'Erro de validação personalizado', function (values) {
                    const errors = [];

                    for (let i = 0; i < values.length; i++) {
                        const { tipoPessoa, cnpj, cpf } = values[i];

                        if (tipoPessoa === 'J') {
                            if (!cnpj) errors.push(this.createError({ message: 'Cnpj é obrigatório ser informado.', path: `autorizacoes[${i}].cnpj` }));
                            else {
                                if (!validateCNPJ(cnpj)) errors.push(this.createError({ message: 'Cnpj inválido.', path: `autorizacoes[${i}].cnpj` }));
                            }
                        } else {
                            if (!cpf) errors.push(this.createError({ message: 'Cpf é obrigatório ser informado.', path: `autorizacoes[${i}].cpf` }));
                            else {
                                if (!validateCPF(cpf)) errors.push(this.createError({ message: 'Cpf inválido.', path: `autorizacoes[${i}].cpf` }));
                            }
                        }
                    }

                    if (errors.length > 0) {
                        throw new yup.ValidationError(errors);
                    }

                    return true;
                });
        }
        return yup.mixed().optional();
    };

    const createSchemaDetalhamentoItem = () => {
        return yup.object().shape({
            itemId: yup.string().required('Item da NF-e é obrigatório.'),
            cfopId: yup.number().required('CFOP é obrigatório.'),
        })
    }

    return {
        createSchemaDataHoraSaidaEntrada,
        createSchemaDocumentosReferenciados,
        createSchemaLocalRetirada,
        createSchemaAutorizacoes,
        createSchemaLocalEntrega,
        createSchemaDetalhamentoItem
    };
}
