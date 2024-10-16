<script setup>
import { ref, computed, onMounted } from 'vue';
import _ from 'lodash';
import * as yup from 'yup';
import { useRouter } from 'vue-router';
import { useContexto } from '@/stores';
import { ContratoAgricolaService, UsuarioService, DepartamentoService, ParceiroLocalService, GrupoOperacaoAgricolaService, FinalidadeContratoAgricolaService, TipoContratoAgricolaService, IndiceFinanceiroService, OperacaoInternaService, PrecoAgricolaService } from '@/service';
import { useFormatDocumentos } from '@/composables/useFormatDocumentos';
import { useFormatDate } from '@/composables/useFormatDate';
import { useFormatNumber } from '@/composables/useFormatNumber';

import UWSeletorItemAgricola from '@/components/seletores/item/UWSeletorItemAgricola.vue';
import UWSeletorSafraAgricola from '@/components/seletores/safra/UWSeletorSafraAgricola.vue';
import UWSeletorOIAgricolaValidoContrato from '@/components/seletores/operacaoInterna/UWSeletorOIAgricolaValidoContrato.vue';
import UWSeletorFatoGeradorValidoContrato from '@/components/seletores/fatoGerador/UWSeletorFatoGeradorValidoContrato.vue';
import UWSeletorTipoPrecoAgricolaValidoOperacaoAgricola from '@/components/seletores/tipoPrecoAgricola/UWSeletorTipoPrecoAgricolaValidoOperacaoAgricola.vue';
import UWSeletorPredefinicaoPrecoAgricolaValidoOperacaoAgricola from '@/components/seletores/predefinicaoPrecoAgricola/UWSeletorPredefinicaoPrecoAgricolaValidoOperacaoAgricola.vue';
import UWSeletorSubItemClassAgricolaRomaneio from '@/components/seletores/subItemClassificacaoAgricola/UWSeletorSubItemClassAgricolaRomaneio.vue';

const getToday = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 59);
    return today;
};

const createSchema = () => {
    return yup.object().shape({
        dataDocumento: yup.date().required('Data do documento é obrigatório').max(getToday(), 'Data do Documento deve ser menor que a data atual.'),
        departamentoId: yup.number().required('Departamento é obrigatório'),
        itemId: yup.number().required('Produto é obrigatório'),
        safraId: yup.number().required('Safra é obrigatório'),
        parceiroLocalId: yup.number().required('Parceiro é obrigatório'),
        grupoOperacaoAgricolaId: yup.number().required('Grupo de Operação é obrigatório'),
        operacaoInternaId: yup.number().required('Operação Interna é obrigatório'),
        finalidadeContratoAgricolaId: yup.number().required('Finalidade do Contrato é obrigatório'),
        tipoContratoAgricolaId: yup.number().required('Tipo do Contrato é obrigatório'),
        dataVencimento: yup.date().required('Data de Vencimento é obrigatório').max(formData.value.dataDocumento, 'Data de Vencimento deve ser menor que a data de documento.'),
        dataLimiteEntrega: yup.date().required('Data Limite de Entrega é obrigatório').min(formData.value.dataDocumento, 'Data Limite de Entrega deve ser maior que a data de documento.'),
        fatoGeradorId: yup.number().required('Fato Gerador é obrigatório'),
        indiceFinanceiroId: yup.number().required('Índice Financeiro é obrigatório'),
        tipoPrecoAgricolaId: yup.number().required('Tipo de Preço é obrigatório'),
        predefinicaoPrecoAgricolaId: yup.number().required('Predefinição de Preço é obrigatório')
    });
};

const router = useRouter();
const contextoStore = useContexto();
const { formatDocumento } = useFormatDocumentos();
const { formatDate, formatToDDMMYYYY } = useFormatDate();
const { formatNumber } = useFormatNumber();

const formData = ref({
    dataDocumento: new Date(),
    dataMovimento: new Date(),
    valorDesconto: 0,
    parcelasFinanceiro: [],
    descontos: []
});
const temAutonomiaDataDocumento = ref(false);
const produtoSelecionado = ref();
const dadosParceiroLocal = ref({});
const operacaoInterna = ref();
const predefinicaoSelecionada = ref();
const erroDivisaoParcelas = ref(undefined);

const visibleSafra = computed(() => {
    return produtoSelecionado.value && produtoSelecionado.value.informaSafraAgricola === true;
});

const salvarRegistro = () => {
    // if (mode.value === 'novo') {
    //     criarRegistro();
    // } else {
    //     alterarRegistro();
    // }
};

const handleCancelar = () => {
    router.push({ path: '/agricola/movimento/contrato' });
};

const changeProduto = async (objeto) => {
    if (objeto) {
        produtoSelecionado.value = objeto;
    } else {
        produtoSelecionado.value = undefined;
    }
};

const changeParceiroLocal = (object) => {
    if (!object) {
        dadosParceiroLocal.value = {};
        return;
    }

    ParceiroLocalService.getById(object.id).then((data) => {
        dadosParceiroLocal.value = data;
        dadosParceiroLocal.value.cpfCnpj = formatDocumento(dadosParceiroLocal.value.cpfCnpj);
        if (dadosParceiroLocal.value.enderecos) {
            dadosParceiroLocal.value.enderecoCompleto = getEnderecoCompleto(dadosParceiroLocal.value.enderecos[0]);
        }
    });
};

const getEnderecoCompleto = (objetoEndereco) => {
    return `${objetoEndereco.endereco}, ${objetoEndereco.numero}, ${objetoEndereco.bairro}, ${objetoEndereco.cidadeNome} - ${objetoEndereco.ufSigla}, ${objetoEndereco.paisNome}, CEP: ${objetoEndereco.cep.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2-$3')}`;
};

const changeOperacaoInterna = async () => {
    if (formData.value.operacaoInternaId) {
        OperacaoInternaService.getById(formData.value.operacaoInternaId).then((data) => {
            operacaoInterna.value = data;
            if (contratoAvista.value) {
                formData.value.dataVencimento = new Date();
                formData.value.parcelasFinanceiro = [{
                    numeroParcela: 1,
                    dataVencimento: formData.value.dataVencimento,
                    valor: formData.value.valorLiquido | 0
                }];
                formData.value.quantidadeParcelas = 1;
                formData.value.distribuicaoParcelas = '0';
                recalcularParcelas();
            }
            formData.value.tipoPrecoAgricolaId = operacaoInterna.value.operacaoInternaAgricola.tipoPrecoAgricolaId;
            formData.value.tipoContratoAgricolaId = operacaoInterna.value.operacaoInternaAgricola.tipoContratoAgricolaId;
            if (!habilitaFinanceiro.value) {
                formData.value.valorUnitarioBase = 0;
                formData.value.valorBruto = 0;
                formData.value.valorLiquido = 0;
                formData.value.valorDesconto = 0;
                formData.value.valorUnitarioLiquido = 0;
                formData.value.valorUnitarioBruto = 0;
                formData.value.parcelasFinanceiro = [];
            } else {
                formData.value.indiceFinanceiroId = operacaoInterna.value.operacaoInternaFinanceiro.indiceFinanceiroPadraoId;
            }	
        });
    } else {
        operacaoInterna.value = undefined;
    }
};

const contratoAvista = computed(() => {
    return operacaoInterna.value && operacaoInterna.value.operacaoInternaAgricola && operacaoInterna.value.operacaoInternaAgricola.contratoAvista;
});

const changeGrupoOperacao = (data) => {
    if (!data) {
        // formData.value.operacaoInternaId = undefined;
        // formData.value.fatoGeradorId = undefined;
        // formData.value.tipoPrecoAgricolaId = undefined;
        // formData.value.predefinicaoPrecoAgricolaId = undefined;
    }
};

const changePredefinicaoPrecoAgricola = (predefinicao) => {
    if (predefinicao) {
        predefinicaoSelecionada.value = predefinicao;
    } else {
        predefinicaoSelecionada.value = undefined;
        formData.value.nivelClass1 = undefined;
        formData.value.nivelClass2 = undefined;
        formData.value.nivelClass3 = undefined;
        formData.value.nivelClass4 = undefined;
    }
};

function validarDistribuicaoParcelas(quantidadeParcelas, distribuicao) {
    // Verificar se a string está no formato correto
    const regex = /^(\d+,)*\d+$/;
    if (!regex.test(distribuicao)) {
        return { valido: false, mensagem: 'Distribuição das parcelas com formato inválido. Use dias separados por vírgula.' };
    }

    // Converter a string em um array de inteiros
    const diasArray = distribuicao.split(',').map(Number);

    // Verificar se o número de elementos no array é igual à quantidade de parcelas
    if (diasArray.length !== quantidadeParcelas) {
        return { valido: false, mensagem: `A quantidade de parcelas (${quantidadeParcelas}) não corresponde à distribuição fornecida.` };
    }

    // Verificar se os valores estão em ordem crescente
    for (let i = 1; i < diasArray.length; i++) {
        if (diasArray[i] <= diasArray[i - 1]) {
            return { valido: false, mensagem: 'Os dias informados na distribuição de parcelas devem estar em ordem crescente.' };
        }
    }

    return { valido: true, dias: diasArray };
}

const buscarPrecoUnitario = async () => {
    const payload = {
        itemId: formData.value.itemId,
        tipoPrecoAgricolaId: formData.value.tipoPrecoAgricolaId,
        empresaId: contextoStore.contexto.empresaId,
        empresaFilialId: contextoStore.contexto.empresaFilialId,
        departamentoId: formData.value.departamentoId,
        predefinicaoPrecoAgricolaId: formData.value.predefinicaoPrecoAgricolaId,
        nivelClass1Id: formData.value.nivelClass1Id,
        nivelClass2Id: formData.value.nivelClass2Id,
        nivelClass3Id: formData.value.nivelClass3Id,
        nivelClass4Id: formData.value.nivelClass4Id,
        dataBase: formData.value.dataDocumento
    }

    await PrecoAgricolaService.buscaPrecoVigente({...payload}).then((data) => {
            formData.value.valorUnitarioBase = _.round(data.valorUnitario, 5);
            formData.value.valorUnitarioBruto = _.round(data.valorUnitario, 5);
    }).catch(() => {
        formData.value.valorUnitarioBase = 0;
        formData.value.valorUnitarioBruto = 0;
    })
}

const calcularDescontos = async () => {
    const payload = {
        contratoAgricolaId: formData.value.id,
        departamentoId: formData.value.departamentoId,
        operacaoInternaId: formData.value.operacaoInternaId,
        grupoOperacaoAgricolaId: formData.value.grupoOperacaoAgricolaId,
        regraAtividadeId: 0,
        itemId: formData.value.itemId,
        dataBase: formData.value.dataDocumento,
        quantidadeContratada: formData.value.quantidadeContratada,
        valorBruto: formData.value.valorBruto
    }
    await ContratoAgricolaService.calcularDescontos(payload).then((data) => {
        if (!data || data.length === 0) {
            formData.value.descontos = [];
            formData.value.valorDesconto = 0;
            return;
        }
        data.forEach((itData) => {
            let desconto = formData.value.descontos.find((d) => d.tipoCalculoAgricolaId === itData.tipoCalculoAgricolaId);
            if (desconto) {
                desconto.percentualTaxaContrato = itData.percentualTaxaContrato;
                desconto.percentualTaxaAtual = itData.percentualTaxaAtual;
                desconto.valor = itData.valor;
            } else {
                desconto = {
                    contratoAgricolaId: formData.value.id,
                    tipoCalculoAgricolaId: itData.tipoCalculoAgricolaId,
                    percentualTaxaContrato: itData.percentualTaxaContrato,
                    percentualTaxaAtual: itData.percentualTaxaAtual,
                    valor: itData.valor
                }
                formData.value.descontos.push(desconto);
            }
        });
        formData.value.valorDesconto = formData.value.descontos.reduce((acc, desconto) => acc + desconto.valor, 0) || 0;
    });
}

const recalcularParcelas = () => {
    const { valido, mensagem, dias } = validarDistribuicaoParcelas(formData.value.quantidadeParcelas, formData.value.distribuicaoParcelas);
    if (!valido) {
        erroDivisaoParcelas.value = mensagem;
        formData.value.parcelasFinanceiro = [];
        return;
    }
    erroDivisaoParcelas.value = undefined;
    formData.value.parcelasFinanceiro = [];
    
    if (formData.value.valorLiquido && formData.value.valorLiquido > 0 && formData.value.quantidadeParcelas && formData.value.quantidadeParcelas > 0) {
        const valorParcela = (formData.value.valorLiquido / formData.value.quantidadeParcelas).toFixed(2);
        const parcelas = [];
        let totalParcelas = 0;

        for (let i = 0; i < formData.value.quantidadeParcelas; i++) {
            const dataVencimento = new Date(formData.value.dataDocumento);
            dataVencimento.setDate(dataVencimento.getDate() + dias[i]);

            const valor = Number(valorParcela); // Converte para número
            parcelas.push({
                numeroParcela: i + 1,
                dataVencimento,
                valor
            });
            totalParcelas += valor; // Acumula o total
        }

        // Ajuste da primeira parcela se necessário
        const diferença = (formData.value.valorLiquido - totalParcelas).toFixed(2);
        if (Math.abs(diferença) > 0) {
            parcelas[0].valor += Number(diferença); // Ajusta a primeira parcela
        }

        formData.value.parcelasFinanceiro = parcelas;
    }
};

const changeValorBruto = async () => {
   if (formData.value.valorBruto && formData.value.valorBruto > 0) {
        if (!formData.value.valorUnitarioBruto || formData.value.valorUnitarioBruto === 0) {
            await buscarPrecoUnitario();
        }
        if (!formData.value.quantidadeContratada || formData.value.quantidadeContratada === 0) {
                formData.value.quantidadeContratada = _.round(formData.value.valorBruto / formData.value.valorUnitarioBruto, 0) || 0;
        } else {
                const valorUnitario = _.round(formData.value.valorBruto / formData.value.quantidadeContratada, 5) || 0;
                if (_.round(valorUnitario) !== _.round(formData.value.valorUnitarioBruto)) {
                    //TODO Abrir mensagem diferença preço
                } else {
                    formData.value.quantidadeContratada = _.round(formData.value.valorBruto / formData.value.valorUnitarioBruto, 0) || 0;
                }
        }
        await calcularDescontos();
        formData.value.valorLiquido = _.round(formData.value.valorBruto - formData.value.valorDesconto, 2) || 0;
        formData.value.valorUnitarioLiquido = _.round(formData.value.valorLiquido / formData.value.quantidadeContratada, 5) || 0;
        recalcularParcelas();
   }
}

const changeQuantidadeContratada = async () => {
    if (formData.value.quantidadeContratada && formData.value.quantidadeContratada > 0) {
        if (!formData.value.valorUnitarioBruto || formData.value.valorUnitarioBruto === 0) {
            await buscarPrecoUnitario();
        }
        if (!formData.value.valorBruto || formData.value.valorBruto === 0) {
            formData.value.valorBruto = _.round(formData.value.valorUnitarioBruto * formData.value.quantidadeContratada, 2) || 0;
        } else {
            const valorUnitario = _.round(formData.value.valorBruto / formData.value.quantidadeContratada, 5) || 0;
                if (_.round(valorUnitario) !== _.round(formData.value.valorUnitarioBruto)) {
                    //TODO Abrir mensagem diferença preço
                } else {
                    formData.value.valorBruto = _.round(formData.value.valorUnitarioBruto * formData.value.quantidadeContratada, 2) || 0;
                }            
        }
        await calcularDescontos();
        formData.value.valorLiquido = _.round(formData.value.valorBruto - formData.value.valorDesconto, 2) || 0;
        formData.value.valorUnitarioLiquido = _.round(formData.value.valorLiquido / formData.value.quantidadeContratada, 5) || 0;
        formData.value.valorUnitarioBruto = _.round(formData.value.valorBruto / formData.value.quantidadeContratada, 5) || 0;        
        recalcularParcelas();
    }
}

const changeValorLiquido = async () => {
    if (formData.value.valorLiquido && formData.value.valorLiquido > 0) {
        if (!formData.value.valorUnitarioBruto || formData.value.valorUnitarioBruto === 0) {
            await buscarPrecoUnitario();
        }
        await calcularDescontos();
        formData.value.valorBruto = _.round(formData.value.valorLiquido + formData.value.valorDesconto, 2) || 0;
        formData.value.quantidadeContratada = _.round(formData.value.valorBruto / formData.value.valorUnitarioBruto, 0) || 0;
        formData.value.valorUnitarioLiquido = _.round(formData.value.valorLiquido / formData.value.quantidadeContratada, 5) || 0;
        recalcularParcelas();        
    }
}

const habilitaFinanceiro = computed(() => {
    return operacaoInterna.value && operacaoInterna.value.caracteristicaFinanceira
});

onMounted(async () => {
    UsuarioService.checkAutonomia(contextoStore.contexto.empresaId, contextoStore.contexto.empresaFilialId, 'ALTDTCONTRATO').then((data) => {
        temAutonomiaDataDocumento.value = data;
    });
});
</script>

<template>
    <UWPageBase title="Contrato Agrícola" subtitle="Criar novo contrato agrícola">
        <UWForm :schema="createSchema()" :values="formData" ref="formContrato" :visibleSave="false" @doSubmit="salvarRegistro" @doCancel="handleCancelar">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <div class="col-12">
                            <UWFieldSet title="Identificação do Contrato" class="col-12">
                                <div class="p-fluid formgrid grid">
                                    <UWInteger id="numero" label="Número" disabled v-model="formData.numero" classContainer="col-12 md:col-1" />
                                    <UWCalendar
                                        id="dataDocumento"
                                        label="Data do Romaneio"
                                        dateFormat="dd/mm/yy"
                                        :disabled="!temAutonomiaDataDocumento"
                                        required
                                        v-model="formData.dataDocumento"
                                        :errors="errors.value?.dataDocumento"
                                        classContainer="col-12 md:col-2"
                                    />
                                    <UWSeletor
                                        id="departamento"
                                        classContainer="col-12 md:col-3"
                                        v-model="formData.departamentoId"
                                        optionLabel="nome"
                                        optionValue="id"
                                        required
                                        label="Departamento"
                                        :service="DepartamentoService"
                                        placeholder="Selecione o departamento"
                                        :erros="errors.value?.departamentoId"
                                        :columnsFilters="[{ field: 'empresaFilial', value: formData.empresaFilialId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresaFilial.id' }]"
                                    />
                                    <UWSeletorItemAgricola
                                        classContainer="col-12 md:col-4"
                                        ref="seletorProduto"
                                        label="Produto"
                                        v-model="formData.itemId"
                                        required
                                        optionLabel="nome"
                                        optionValue="id"
                                        placeholder="Selecione o item"
                                        :erros="errors.value?.itemId"
                                        @changeObject="changeProduto"
                                    />
                                    <UWSeletorSafraAgricola
                                        classContainer="col-12 md:col-2"
                                        label="Safra"
                                        v-model="formData.safraId"
                                        :itemId="formData.itemId"
                                        required
                                        v-if="visibleSafra === true"
                                        optionLabel="nome"
                                        optionValue="id"
                                        placeholder="Selecione a safra"
                                        :erros="errors.value?.safraId"
                                        @changeObject="changeSafra"
                                    />
                                    <UWParceiroLocal id="parceiroLocal" classContainer="col-12 md:col-3" v-model="formData.parceiroLocalId" required label="Parceiro" :erros="errors.value?.parceiroLocalId" @changeObject="changeParceiroLocal" />
                                    <UWInput id="cpfCnpj" :label="dadosParceiroLocal.tipoPessoa === 'J' ? 'Cnpj' : 'Cpf'" uppercase disabled v-model="dadosParceiroLocal.cpfCnpj" classContainer="col-12 md:col-2" />
                                    <UWInput v-if="dadosParceiroLocal.tipoPessoa === 'J'" id="nomeLocal" label="Filial" uppercase disabled v-model="dadosParceiroLocal.nomeLocal" classContainer="col-12 md:col-3" />
                                    <UWInput
                                        id="endereco"
                                        label="Endereço"
                                        uppercase
                                        disabled
                                        v-model="dadosParceiroLocal.enderecoCompleto"
                                        :classContainer="{ 'col-12': true, 'md:col-4': dadosParceiroLocal.tipoPessoa === 'J', 'md:col-7': !dadosParceiroLocal.tipoPessoa || dadosParceiroLocal.tipoPessoa === 'F' }"
                                    />
                                </div>
                            </UWFieldSet>
                        </div>
                        <TabView class="col-12">
                            <TabPanel header="Informações Gerais">
                                <div class="grid nested-grid">
                                    <div class="col-12">
                                        <UWFieldSet title="Caracterização do Contrato" class="col-12">
                                            <div class="p-fluid formgrid grid">
                                                <UWSeletor
                                                    label="Grupo de Operação"
                                                    classContainer="col-12 md:col-3"
                                                    v-model="formData.grupoOperacaoAgricolaId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    :service="GrupoOperacaoAgricolaService"
                                                    placeholder="Selecione o grupo de operação"
                                                    @changeObject="changeGrupoOperacao"
                                                    :erros="errors.value?.grupoOperacaoAgricolaId"
                                                />
                                                <UWSeletorOIAgricolaValidoContrato
                                                    label="Operação Interna"
                                                    ref="seletorOperacaoInterna"
                                                    classContainer="col-12 md:col-3"
                                                    v-model="formData.operacaoInternaId"
                                                    :itemId="formData.itemId"
                                                    :grupoOperacaoAgricolaId="formData.grupoOperacaoAgricolaId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    placeholder="Selecione a operação interna"
                                                    @changeObject="changeOperacaoInterna"
                                                    :erros="errors.value?.operacaoInternaId"
                                                />
                                                <UWSeletor
                                                    label="Finalidade do Contrato"
                                                    classContainer="col-12 md:col-3"
                                                    v-model="formData.finalidadeContratoAgricolaId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    :service="FinalidadeContratoAgricolaService"
                                                    placeholder="Selecione a finalidade do contrato"
                                                    :erros="errors.value?.finalidadeContratoAgricolaId"
                                                />
                                                <UWSeletor
                                                    label="Tipo do Contrato"
                                                    classContainer="col-12 md:col-3"
                                                    v-model="formData.tipoContratoAgricolaId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    :service="TipoContratoAgricolaService"
                                                    placeholder="Selecione o tipo do contrato"
                                                    :erros="errors.value?.tipoContratoAgricolaId"
                                                />
                                            </div>
                                        </UWFieldSet>
                                    </div>
                                    <div class="col-12 flex flex-row gap-4">
                                        <UWFieldSet title="Datas do Contrato" class="col-3">
                                            <div class="p-fluid formgrid grid">
                                                <UWCalendar
                                                    id="dataVencimento"
                                                    label="Data de Vencimento"
                                                    dateFormat="dd/mm/yy"
                                                    :disabled="contratoAvista"
                                                    required
                                                    v-model="formData.dataVencimento"
                                                    :errors="errors.value?.dataVencimento"
                                                    classContainer="col-12 md:col-6"
                                                />
                                                <UWCalendar
                                                    id="dataLimiteEntrega"
                                                    label="Data Limite de Entrega"
                                                    dateFormat="dd/mm/yy"
                                                    required
                                                    v-model="formData.dataLimiteEntrega"
                                                    :errors="errors.value?.dataLimiteEntrega"
                                                    classContainer="col-12 md:col-6"
                                                />
                                            </div>
                                        </UWFieldSet>
                                        <UWFieldSet title="Prêmio" class="col-4">
                                            <div class="p-fluid formgrid grid">
                                                <UWCurrency id="valorPremio" label="Valor do Prêmio" v-model="formData.valorPremio" classContainer="col-12 md:col-6" :erros="errors.value?.valorPremio"/>
                                                <UWDecimal id="quantidadeAcordada" label="Quantidade Acordada" v-model="formData.quantidadeAcordada" classContainer="col-12 md:col-6" :erros="errors.value?.quantidadeAcordada"/>
                                            </div>
                                        </UWFieldSet>
                                        <UWFieldSet title="Observação" class="col-5">
                                            <div class="p-fluid formgrid grid">
                                                <UWInput id="observacao" label="Observação" v-model="formData.observacao" classContainer="col-12 md:col-12" :erros="errors.value?.observacao"/>
                                            </div>
                                        </UWFieldSet>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel header="Informações Financeira / Precificação">
                                <div class="grid nested-grid">
                                    <div class="col-12">
                                        <UWFieldSet title="Configuração Financeira" class="col-12">
                                            <div class="p-fluid formgrid grid">
                                                <UWSeletorFatoGeradorValidoContrato
                                                    label="Fato Gerador"
                                                    ref="seletorFatoGerador"
                                                    classContainer="col-12 md:col-3"
                                                    v-model="formData.fatoGeradorId"
                                                    :itemId="formData.itemId"
                                                    :grupoOperacaoAgricolaId="formData.grupoOperacaoAgricolaId"
                                                    :operacaoInternaId="formData.operacaoInternaId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    placeholder="Selecione o fato gerador"
                                                    :erros="errors.value?.fatoGeradorId"
                                                />
                                                <UWSeletor
                                                    label="Índice Financeiro"
                                                    classContainer="col-12 md:col-3"
                                                    v-model="formData.indiceFinanceiroId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    :service="IndiceFinanceiroService"
                                                    placeholder="Selecione o índice"
                                                    :erros="errors.value?.indiceFinanceiroId"
                                                />
                                                <UWSeletorTipoPrecoAgricolaValidoOperacaoAgricola
                                                    label="Tipo de Preço"
                                                    ref="seletorTipoPreco"
                                                    classContainer="col-12 md:col-3"
                                                    v-model="formData.tipoPrecoAgricolaId"
                                                    :itemId="formData.itemId"
                                                    :grupoOperacaoAgricolaId="formData.grupoOperacaoAgricolaId"
                                                    :operacaoInternaId="formData.operacaoInternaId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    placeholder="Selecione o tipo de preço"
                                                    :erros="errors.value?.tipoPrecoAgricolaId"
                                                />
                                                <UWSeletorPredefinicaoPrecoAgricolaValidoOperacaoAgricola
                                                    label="Predefinição de Preço"
                                                    ref="seletorPredefinicaoPreco"
                                                    classContainer="col-12 md:col-3"
                                                    v-model="formData.predefinicaoPrecoAgricolaId"
                                                    :itemId="formData.itemId"
                                                    :tipoPrecoAgricolaId="formData.tipoPrecoAgricolaId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    placeholder="Selecione a predefinição de preço"
                                                    @ChangeObject="changePredefinicaoPrecoAgricola"
                                                    :erros="errors.value?.predefinicaoPrecoAgricolaId"
                                                />
                                            </div>
                                        </UWFieldSet>
                                    </div>
                                    <div class="col-12">
                                        <UWFieldSet title="Classificação p/ composição de preço" class="col-12">
                                            <div class="p-fluid formgrid grid">
                                                <UWSeletorSubItemClassAgricolaRomaneio
                                                    classContainer="col-12 md:col-3"
                                                    :required="formData.predefinicaoPrecoAgricolaId > 0 && predefinicaoSelecionada.itemClassificacaoAgricola1Codigo !== 0"
                                                    :disabled="!formData.predefinicaoPrecoAgricolaId || (predefinicaoSelecionada && predefinicaoSelecionada.itemClassificacaoAgricola1Codigo === 0)"
                                                    :label="formData.predefinicaoPrecoAgricolaId ? predefinicaoSelecionada.itemClassificacaoAgricola1Nome : 'Nível Classificação 1'"
                                                    v-model="formData.nivelClass1Id"
                                                    :itemId="formData.itemId"
                                                    :itemClassificacaoAgricolaId="predefinicaoSelecionada?.itemClassificacaoAgricola1Id"
                                                    :dataRomaneio="new Date()"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    :erros="errors.value?.nivelClass1Id"
                                                />
                                                <UWSeletorSubItemClassAgricolaRomaneio
                                                    classContainer="col-12 md:col-3"
                                                    :required="formData.predefinicaoPrecoAgricolaId > 0 && predefinicaoSelecionada.itemClassificacaoAgricola2Codigo !== 0"
                                                    :disabled="!formData.predefinicaoPrecoAgricolaId || (predefinicaoSelecionada && predefinicaoSelecionada.itemClassificacaoAgricola2Codigo === 0)"
                                                    :label="formData.predefinicaoPrecoAgricolaId ? predefinicaoSelecionada.itemClassificacaoAgricola2Nome : 'Nível Classificação 2'"
                                                    v-model="formData.nivelClass2Id"
                                                    :itemId="formData.itemId"
                                                    :itemClassificacaoAgricolaId="predefinicaoSelecionada?.itemClassificacaoAgricola2Id"
                                                    :dataRomaneio="new Date()"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    :erros="errors.value?.nivelClass2Id"
                                                />
                                                <UWSeletorSubItemClassAgricolaRomaneio
                                                    classContainer="col-12 md:col-3"
                                                    :required="formData.predefinicaoPrecoAgricolaId > 0 && predefinicaoSelecionada.itemClassificacaoAgricola3Codigo !== 0"
                                                    :disabled="!formData.predefinicaoPrecoAgricolaId || (predefinicaoSelecionada && predefinicaoSelecionada.itemClassificacaoAgricola3Codigo === 0)"
                                                    :label="formData.predefinicaoPrecoAgricolaId ? predefinicaoSelecionada.itemClassificacaoAgricola3Nome : 'Nível Classificação 3'"
                                                    v-model="formData.nivelClass3Id"
                                                    :itemId="formData.itemId"
                                                    :itemClassificacaoAgricolaId="predefinicaoSelecionada?.itemClassificacaoAgricola3Id"
                                                    :dataRomaneio="new Date()"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    :erros="errors.value?.nivelClass3Id"
                                                />
                                                <UWSeletorSubItemClassAgricolaRomaneio
                                                    classContainer="col-12 md:col-3"
                                                    :required="formData.predefinicaoPrecoAgricolaId > 0 && predefinicaoSelecionada.itemClassificacaoAgricola4Codigo !== 0"
                                                    :disabled="!formData.predefinicaoPrecoAgricolaId || (predefinicaoSelecionada && predefinicaoSelecionada.itemClassificacaoAgricola4Codigo === 0)"
                                                    :label="formData.predefinicaoPrecoAgricolaId ? predefinicaoSelecionada.itemClassificacaoAgricola4Nome : 'Nível Classificação 4'"
                                                    v-model="formData.nivelClass4Id"
                                                    :itemId="formData.itemId"
                                                    :itemClassificacaoAgricolaId="predefinicaoSelecionada?.itemClassificacaoAgricola4Id"
                                                    :dataRomaneio="new Date()"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    :erros="errors.value?.nivelClass4Id"
                                                />
                                            </div>
                                        </UWFieldSet>
                                    </div>
                                    <div class="col-12 flex flex-row">
                                        <UWFieldSet title="Valores Contrato" class="col-12">
                                            <div class="p-fluid formgrid grid">
                                                <UWCurrency id="valorBruto" label="Valor Bruto" :required="habilitaFinanceiro" :disabled="!habilitaFinanceiro" v-model="formData.valorBruto" :errors="errors.value?.valorBruto" classContainer="col-12 md:col-2" 
                                                    @onChange="changeValorBruto"
                                                />
                                                <UWCurrency id="valorUnitarioLiquido" label="Valor Unitário Líquido" disabled v-model="formData.valorUnitarioLiquido" classContainer="col-12 md:col-2" />
                                                <UWCurrency id="valorUnitarioBruto" label="Valor Unitário Bruto" disabled v-model="formData.valorUnitarioBruto" classContainer="col-12 md:col-2" />
                                                <UWDecimal id="quantidadecontratada" label="Qtd Contratada" required v-model="formData.quantidadeContratada" :errors="errors.value?.quantidadeContratada" classContainer="col-12 md:col-2" 
                                                    @onChange="changeQuantidadeContratada"
                                                />
                                                <UWCurrency id="valorDesconto" label="Valor Desconto" disabled v-model="formData.valorDesconto" classContainer="col-12 md:col-2" />
                                                <UWCurrency id="valorLiquido" label="Valor Líquido" :required="habilitaFinanceiro" :disabled="!habilitaFinanceiro" v-model="formData.valorLiquido" :errors="errors.value?.valorLiquido" classContainer="col-12 md:col-2" 
                                                    @onChange="changeValorLiquido"
                                                />
                                            </div>
                                        </UWFieldSet>
                                    </div>
                                    <div class="col-12 flex flex-row">
                                        <UWFieldSet v-if="habilitaFinanceiro" title="Parcelas Financeiro" class="col-6 h-full">
                                            <div class="p-fluid formgrid grid">
                                                <UWInteger
                                                    id="quantidadeParcelas"
                                                    label="Quantidade Parcelas"
                                                    :required="!contratoAvista"
                                                    :disabled="contratoAvista"
                                                    v-model="formData.quantidadeParcelas"
                                                    :errors="errors.value?.quantidadeParcelas"
                                                    classContainer="col-12 md:col-4"
                                                    @change="recalcularParcelas"
                                                />
                                                <UWInput
                                                    id="distribuicaoParcelas"
                                                    label="Distribuição Parcelas"
                                                    :required="!contratoAvista"
                                                    :disabled="contratoAvista"
                                                    v-model="formData.distribuicaoParcelas"
                                                    :errors="errors.value?.distribuicaoParcelas"
                                                    classContainer="col-12 md:col-8"
                                                    @change="recalcularParcelas"
                                                />
                                                <small class="p-error col-12" style="margin-top: -0.8rem">{{ erroDivisaoParcelas }}</small>
                                                <DataTable :value="formData.parcelasFinanceiro" dataKey="tipoCalculoAgricolaId" size="small" tableStyle="min-width: 50rem" scrollable scrollHeight="200px" class="col-12">
                                                    <Column field="numeroParcela" header="Parcela" style="min-width: 8%" />
                                                    <Column field="dataVencimento" header="Vencimento" style="min-width: 8%">
                                                        <template #body="slotProps">
                                                            <div class="w-full text-center">{{ formatToDDMMYYYY(slotProps.data.dataVencimento) }}</div>
                                                        </template>
                                                    </Column>
                                                    <Column field="valor" header="Valor" style="min-width: 7%">
                                                        <template #body="slotProps">
                                                            <div class="w-full text-center">{{ formatNumber(slotProps.data.valor, 0) }}</div>
                                                        </template>
                                                    </Column>
                                                </DataTable>
                                            </div>
                                        </UWFieldSet>
                                        <UWFieldSet title="Taxas / Desconto" class="col-6 h-full">
                                            <div class="p-fluid formgrid grid">
                                                <DataTable :value="formData.descontos" dataKey="numeroParcela" size="small" tableStyle="min-width: 50rem" scrollable scrollHeight="200px" class="col-12">
                                                    <Column field="percentualTaxaContrato" header="% Taxa Contrato" style="min-width: 33%">
                                                        <template #body="slotProps">
                                                            <div class="w-full text-center">{{ formatNumber(slotProps.data.percentualTaxaContrato, 0) }}</div>
                                                        </template>
                                                    </Column>
                                                    <Column field="percentualTaxaAtual" header="% Taxa Atual" style="min-width: 33%">
                                                        <template #body="slotProps">
                                                            <div class="w-full text-center">{{ formatNumber(slotProps.data.percentualTaxaAtual, 0) }}</div>
                                                        </template>
                                                    </Column>
                                                    <Column field="valor" header="Valor do Desconto" style="min-width: 33%">
                                                        <template #body="slotProps">
                                                            <div class="w-full text-center">{{ formatNumber(slotProps.data.valor, 0) }}</div>
                                                        </template>
                                                    </Column>
                                                </DataTable>
                                            </div>
                                        </UWFieldSet>
                                    </div>
                                </div>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </template>
        </UWForm>
    </UWPageBase>
</template>
