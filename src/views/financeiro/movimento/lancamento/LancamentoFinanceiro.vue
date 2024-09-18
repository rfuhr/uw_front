<script setup>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { useContexto } from '@/stores';
import {
    TituloService,
    UsuarioService,
    EmpresaFilialService,
    DepartamentoService,
    TipoTituloService,
    CaracteristicaMovimentoFinanceiroService,
    GrupoFinanceiroService,
    FatoGeradorService,
    CarteiraFinanceiraService,
    ParceiroLocalService,
    HistoricoPadraoService,
    BancoService,
    AgenciaService,
    ContaService
} from '@/service';
import { useFormatDocumentos } from '@/composables/useFormatDocumentos';
import { useFormatDate } from '@/composables/useFormatDate';
import * as yup from 'yup';
import _ from 'lodash';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

const { formatDocumento } = useFormatDocumentos();
const { formatToUTC } = useFormatDate();

const confirm = useConfirm();
const toast = useToast();

const formData = ref({
    dataMovimento: new Date(),
    valorTitulo: 0,
    parcelas: [],
    historicoPadrao: {}
});

const enviandoTitulo = ref(false);
const seletorAgencia = ref(null);
const seletorConta = ref(null);
const carteiraSelecionada = ref({});

const itemsReorganizar = [
    {
        label: 'Reorganizar Valores',
        command: () => {
            reogarnizarValoresParcelas();
        }
    }
];

const createSchema = () => {
    return yup.object().shape({
        dataMovimento: yup.date().required('Data de movimento é obrigatória').max(new Date(), 'Data de Movimento deve ser menor que a data atual.'),
        empresaFilialId: yup.number().required('Filial é obrigatório'),
        departamentoId: yup.number().required('Departamento é obrigatório'),
        tipoTituloId: yup.number().required('Tipo de Título é obrigatório'),
        caracteristicaMovimentoFinanceiroId: yup.number().required('Característica de Movimento é obrigatória'),
        grupoFinanceiroId: yup.number().required('Grupo Financeiro é obrigatório'),
        fatoGeradorId: yup.number().required('Fato Gerador é obrigatório'),
        carteiraFinanceiraId: yup.number().required('Carteira Financeira é obrigatória'),
        parceiroLocalId: yup.number().required('Parceiro é obrigatório'),
        historicoPadraoId: yup.number().required('Histórico Padrão é obrigatório'),
        documento: formData.value.historicoPadrao.informaDocumento === 'S' ? yup.string().required('Documento é obrigatório') : yup.string(),
        dataDocumento:
            formData.value.historicoPadrao.informaDocumento === 'S'
                ? yup.date().required('Data do Documento é obrigatória').max(formData.value.dataMovimento, 'Data de Documento não pode ser maior que a data de movimento.')
                : yup.date().max(formData.value.dataMovimento, 'Data de Documento não pode ser maior que data de movimento.'),
        valorTitulo: yup.number().required('Valor do Título é obrigatório').min(0.01, 'Valor do Título deve ser maior que 0')
    });
};

const temAutonomiaDataMovimento = ref(false);

const dadosParceiroLocal = ref({});

const contextoStore = useContexto();

const changeParceiroLocal = (object) => {
    if (!object) {
        dadosParceiroLocal.value = {};
        return;
    }

    ParceiroLocalService.getById(object.id).then((data) => {
        dadosParceiroLocal.value = data;
        dadosParceiroLocal.value.tipoPessoa = dadosParceiroLocal.value.cpfCnpj.length === 11 ? 'J' : 'F';
        dadosParceiroLocal.value.cpfCnpj = formatDocumento(dadosParceiroLocal.value.cpfCnpj);
        if (dadosParceiroLocal.value.enderecos) {
            dadosParceiroLocal.value.enderecoCompleto = getEnderecoCompleto(dadosParceiroLocal.value.enderecos[0]);
        }
    });
};

const getEnderecoCompleto = (objetoEndereco) => {
    return `${objetoEndereco.endereco}, ${objetoEndereco.numero}, ${objetoEndereco.bairro}, ${objetoEndereco.cidadeNome} - ${objetoEndereco.ufSigla}, ${objetoEndereco.paisNome}, CEP: ${objetoEndereco.cep.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2-$3')}`;
};

const valorLiquido = computed(() => {
    return formData.value.valorTitulo;
});

const valorTotalParcelas = computed(() => {
    let somaParcelas = formData.value.parcelas.reduce((total, parcela) => total + Math.round(parseFloat(parcela.valorParcela) * 100), 0) / 100;
    return somaParcelas;
});

const valorDiferencaParcelas = computed(() => {
    return valorLiquido.value - valorTotalParcelas.value;
});

const changeHistoricoPadrao = (object) => {
    if (object) {
        formData.value.historicoPadrao = object;
    } else {
        formData.value.historicoPadrao = {};
    }
};

const adicionarParcela = () => {
    let newDataVencimento = new Date(Math.max(...formData.value.parcelas.map((parcela) => new Date(parcela.dataVencimento)))) || new Date();
    newDataVencimento.setMonth(newDataVencimento.getMonth() + 1);

    formData.value.parcelas.push({
        numeroParcela: formData.value.parcelas.length + 1,
        dataVencimento: newDataVencimento,
        valorParcela: 0
    });
};

onMounted(() => {
    UsuarioService.checkAutonomia(contextoStore.contexto.empresaId, contextoStore.contexto.empresaFilialId, 'ALTDTMOVLCTOFIN').then((data) => {
        temAutonomiaDataMovimento.value = data;
    });
    formData.value.empresaFilialId = contextoStore.contexto.empresaFilialId;
});

const handleDeleteParcela = (event, data) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Deseja excluir esta parcela?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Excluir',
        accept: () => {
            formData.value.parcelas = formData.value.parcelas.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Parcela removida com sucesso', life: 5000 });
        },
        reject: () => {}
    });
};

const limparParcelas = (event) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Deseja apagar todas as parcelas?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Excluir',
        accept: () => {
            formData.value.parcelas = [];
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Parcelas removidas com sucesso', life: 5000 });
        },
        reject: () => {}
    });
};

const gerarParcelas = () => {
    formData.value.parcelas = [];
    if (formData.value.quantidadeParcelas && formData.value.dataPrimeiroVencimento && valorLiquido) {
        const valorParcela = (valorLiquido.value / formData.value.quantidadeParcelas).toFixed(2);
        let dataVencimento = new Date(formData.value.dataPrimeiroVencimento);
        for (let i = 0; i < formData.value.quantidadeParcelas; i++) {
            formData.value.parcelas.push({
                numeroParcela: i + 1,
                dataVencimento: dataVencimento,
                valorParcela: valorParcela
            });
            dataVencimento = new Date(dataVencimento);
            dataVencimento.setMonth(dataVencimento.getMonth() + 1);
        }
    }
};

const reogarnizarParcelas = () => {
    formData.value.parcelas.sort((a, b) => {
        const dateA = new Date(a.dataVencimento);
        const dateB = new Date(b.dataVencimento);
        return dateA - dateB;
    });

    formData.value.parcelas.forEach((parcela, index) => {
        parcela.numeroParcela = index + 1;
    });
};

const reogarnizarValoresParcelas = () => {
    if (formData.value.parcelas.length > 0) {
        const valorParcela = valorLiquido.value / formData.value.parcelas.length;
        formData.value.parcelas.forEach((parcela) => {
            parcela.valorParcela = valorParcela;
        });
    }
};

const cancelar = () => {
    confirm.require({
        target: event.currentTarget,
        message: 'Deseja cancelar o lançamento?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Sim',
        accept: () => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Lançamento cancelado com sucesso', life: 5000 });
            formData.value = {
                dataMovimento: new Date(),
                valorTitulo: 0,
                parcelas: [],
                historicoPadrao: {}
            };
            window.location.reload();
        },
        reject: () => {}
    });
};

const salvarRegistro = async () => {
    enviandoTitulo.value = true;
    const tituloRequest = montarLancamentoTituloRequest();
    await TituloService.incluirTitulo(tituloRequest)
        .then(() => {
            Swal.fire('Sucesso', 'Título gerado com sucesso', 'success');
            window.location.reload();
        })
        .catch(() => {
            Swal.fire('Falha', 'Ocorreu uma falha no processo de lançamento de título', 'error');
        })
        .finally(() => {
            enviandoTitulo.value = false;
        });
};

const montarLancamentoTituloRequest = () => {
    return {
        dataMovimento: formatToUTC(formData.value.dataMovimento),
        empresaFilialId: formData.value.empresaFilialId,
        departamentoId: formData.value.departamentoId,
        tipoTituloId: formData.value.tipoTituloId,
        caracteristicaMovimentoFinanceiroId: formData.value.caracteristicaMovimentoFinanceiroId,
        grupoFinanceiroId: formData.value.grupoFinanceiroId,
        fatoGeradorId: formData.value.fatoGeradorId,
        carteiraFinanceiraId: formData.value.carteiraFinanceiraId,
        parceiroLocalId: formData.value.parceiroLocalId,
        historicoPadraoId: formData.value.historicoPadraoId,
        documento: formData.value.documento,
        dataDocumento: formData.value.dataDocumento ? formatToUTC(formData.value.dataDocumento) : null,
        complemento: formData.value.complemento,
        valorTitulo: formData.value.valorTitulo,
        valorLiquido: valorLiquido.value,
        observacao: formData.value.observacao,
        contaId: formData.value.contaId,
        parcelas: formData.value.parcelas.map((parcela) => {
            return {
                numeroParcela: parcela.numeroParcela,
                dataVencimento: formatToUTC(parcela.dataVencimento),
                valorParcela: parcela.valorParcela
            };
        })
    };
};

const onChangeBanco = (value) => {
    if (value) {
        seletorAgencia.value.reload();
        seletorConta.value.reload();
    } else {
        formData.value.agenciaId = null;
        formData.value.contaId = null;
    }
};

const onChangeAgencia = (value) => {
    if (value) {
        seletorConta.value.reload();
    } else {
        formData.value.contaId = null;
    }
};

const onChangeCarteira = (value) => {
    if (value) {
        carteiraSelecionada.value = value;
        if (!carteiraSelecionada.value.informaBanco) {
            formData.value.bancoId = null;
            formData.value.agenciaId = null;
            formData.value.contaId = null;
        }
    } else {
        carteiraSelecionada.value = null;
        formData.value.bancoId = null;
        formData.value.agenciaId = null;
        formData.value.contaId = null;
    }
};
</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <UWPageBase title="Lançamento de Título" subtitle="Realiza lançamento manual de títulos financeiro">
        <UWForm :schema="createSchema()" :values="formData" ref="formLancamentoTitulo" @doSubmit="salvarRegistro" @doCancel="cancelar">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <UWFieldSet title="Classificação do Título" class="h-full">
                            <div class="p-fluid formgrid grid">
                                <UWCalendar
                                    id="dataMovimento"
                                    label="Data de Movimento"
                                    dateFormat="dd/mm/yy"
                                    :disabled="!temAutonomiaDataMovimento"
                                    required
                                    v-model="formData.dataMovimento"
                                    :errors="errors.value?.dataMovimento"
                                    classContainer="col-12 md:col-3"
                                />
                                <UWSeletor
                                    :id="empresaFilial"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.empresaFilialId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    disabled
                                    label="Filial"
                                    :service="EmpresaFilialService"
                                    placeholder="Selecione a filial"
                                    :erros="errors.value?.empresaFilialId"
                                    :columnsFilters="[{ field: 'empresa', value: contextoStore.empresaId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresa.id' }]"
                                />
                                <UWSeletor
                                    :id="departamento"
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
                                <UWSeletor
                                    id="tipoTitulo"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.tipoTituloId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Tipo de Título"
                                    :service="TipoTituloService"
                                    placeholder="Selecione o tipo de título"
                                    :erros="errors.value?.tipoTituloId"
                                />
                                <UWSeletor
                                    id="caracteristicaMovimentoFinanceiro"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.caracteristicaMovimentoFinanceiroId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Característica de Movimento"
                                    :service="CaracteristicaMovimentoFinanceiroService"
                                    placeholder="Selecione a característica de movimento"
                                    :erros="errors.value?.caracteristicaMovimentoFinanceiroId"
                                />
                                <UWSeletor
                                    id="grupoFinanceiro"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.grupoFinanceiroId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Grupo Financeiro"
                                    :service="GrupoFinanceiroService"
                                    placeholder="Selecione o grupo financeiro"
                                    :erros="errors.value?.grupoFinanceiroId"
                                />
                                <UWSeletor
                                    id="fatoGerador"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.fatoGeradorId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Fato Gerador"
                                    :service="FatoGeradorService"
                                    placeholder="Selecione o fato gerador"
                                    :erros="errors.value?.fatoGeradorId"
                                />
                                <UWSeletor
                                    id="carteiraFinanceira"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.carteiraFinanceiraId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Carteira Financeira"
                                    :service="CarteiraFinanceiraService"
                                    placeholder="Selecione a carteira financeira"
                                    :erros="errors.value?.carteiraFinanceiraId"
                                    @changeObject="onChangeCarteira"
                                />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-12">
                        <UWFieldSet title="Identificação do Parceiro" class="h-full">
                            <div class="p-fluid formgrid grid">
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
                    <div class="col-12">
                        <UWFieldSet title="Identificação do Documento" class="h-full">
                            <div class="p-fluid formgrid grid">
                                <UWSeletor
                                    id="historicoPadrao"
                                    classContainer="col-12 md:col-2"
                                    v-model="formData.historicoPadraoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Histórico Padrão"
                                    :service="HistoricoPadraoService"
                                    placeholder="Selecione o histórico padrão"
                                    :erros="errors.value?.historicoPadraoId"
                                    @changeObject="changeHistoricoPadrao"
                                />

                                <UWInput
                                    id="documento"
                                    label="Documento"
                                    uppercase
                                    :required="formData.historicoPadrao.informaDocumento === 'S'"
                                    :disabled="formData.historicoPadrao.informaDocumento === 'N'"
                                    v-model="formData.documento"
                                    :errors="errors.value?.documento"
                                    classContainer="col-12 md:col-2"
                                />
                                <UWCalendar
                                    id="dataDocumento"
                                    label="Data do Documento"
                                    :required="formData.historicoPadrao.informaDocumento === 'S'"
                                    :disabled="formData.historicoPadrao.informaDocumento === 'N'"
                                    v-model="formData.dataDocumento"
                                    :errors="errors.value?.dataDocumento"
                                    classContainer="col-12 md:col-2"
                                />
                                <UWInput id="complemento" label="Complemento" uppercase :disabled="formData.historicoPadrao.informaDocumento === 'N'" v-model="formData.historico" :errors="errors.value?.historico" classContainer="col-12 md:col-6" />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-2">
                        <UWFieldSet title="Valores do Título" class="h-full">
                            <div class="p-fluid formgrid grid">
                                <UWCurrency id="valorTitulo" label="Valor do Título" required v-model="formData.valorTitulo" :errors="errors.value?.valorTitulo" classContainer="col-12 md:col-12" />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-10">
                        <UWFieldSet title="Dados Bancários" class="h-full">
                            <div class="p-fluid formgrid grid">
                                <UWSeletor
                                    id="banco"
                                    classContainer="col-12 md:col-4"
                                    v-model="formData.bancoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    :required="carteiraSelecionada.informaBanco"
                                    :disabled="!carteiraSelecionada.informaBanco"
                                    label="Banco"
                                    :service="BancoService"
                                    placeholder="Selecione o banco"
                                    :erros="errors.value?.bancoId"
                                    @changeObject="onChangeBanco"
                                />
                                <UWSeletor
                                    id="agencia"
                                    ref="seletorAgencia"
                                    classContainer="col-12 md:col-4"
                                    v-model="formData.agenciaId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    :required="carteiraSelecionada.informaBanco"
                                    :disabled="!carteiraSelecionada.informaBanco"
                                    label="Agência"
                                    :service="AgenciaService"
                                    placeholder="Selecione a agência"
                                    :columnsFilters="[{ field: 'banco', value: formData.bancoId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'banco.id' }]"
                                    :erros="errors.value?.agenciaId"
                                    @changeObject="onChangeAgencia"
                                />
                                <UWSeletor
                                    id="conta"
                                    ref="seletorConta"
                                    classContainer="col-12 md:col-4"
                                    v-model="formData.contaId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    :required="carteiraSelecionada.informaBanco"
                                    :disabled="!carteiraSelecionada.informaBanco"
                                    label="Conta"
                                    :service="ContaService"
                                    placeholder="Selecione a conta"
                                    :columnsFilters="[{ field: 'agencia', value: formData.agenciaId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'agencia.id' }]"
                                    :erros="errors.value?.agenciaId"
                                    @changeObject="onChangeConta"
                                />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-12">
                        <UWFieldSet title="Observação" class="h-full">
                            <div class="p-fluid formgrid grid">
                                <UWInput id="observacao" label="" uppercase v-model="formData.observacao" :errors="errors.value?.observacao" classContainer="col-12 md:col-12" />
                            </div>
                        </UWFieldSet>
                    </div>
                    <TabView class="col-12">
                        <TabPanel header="Parcelas" class="col-12">
                            <div class="formgrid grid">
                                <div class="col-8">
                                    <Card style="width: 100%; height: 100%">
                                        <template #content>
                                            <DataTable ref="dtDados" :value="formData.parcelas" scrollable scrollHeight="15em" stripedRows responsiveLayout="scroll" dataKey="id" size="small">
                                                <template #empty> Nenhuma Parcela Gerada. </template>
                                                <template #header>
                                                    <div class="flex flex-wrap align-items-center justify-content-end gap-2">
                                                        <Button label="Adicionar Parcela" icon="pi pi-plus" text @click="adicionarParcela" />
                                                    </div>
                                                </template>
                                                <Column field="numeroParcela" header="Nº Parcela" style="width: 10%" />
                                                <Column field="dataVencimento" header="Data Vencimento" style="width: 50%">
                                                    <template #body="slotProps">
                                                        <Calendar v-model="slotProps.data.dataVencimento" dateFormat="dd/mm/yy" :class="{ 'w-5': true, 'p-invalid': _.get(errors.value, `parcelas[${slotProps.index}].dataVencimento`, null) }" />
                                                        <span v-if="_.get(errors.value, `parcelas[${slotProps.index}].dataVencimento`, null)">
                                                            <span v-for="(error, index) of _.get(errors.value, `parcelas[${slotProps.index}].dataVencimento`, null)" :key="index">
                                                                <small class="p-error">{{ error }}</small>
                                                            </span>
                                                        </span>
                                                    </template>
                                                </Column>
                                                <Column field="valorParcela" header="Valor Parcela" style="width: 20%">
                                                    <template #body="slotProps">
                                                        <InputNumber
                                                            mode="currency"
                                                            currency="BRL"
                                                            locale="pt-Br"
                                                            v-model="slotProps.data.valorParcela"
                                                            :class="{ 'w-full': true, 'p-invalid': _.get(errors.value, `parcelas[${slotProps.index}].valorParcela`, null) }"
                                                        />
                                                        <span v-if="_.get(errors.value, `parcelas[${slotProps.index}].valorParcela`, null)">
                                                            <span v-for="(error, index) of _.get(errors.value, `parcelas[${slotProps.index}].valorParcela`, null)" :key="index">
                                                                <small class="p-error">{{ error }}</small>
                                                            </span>
                                                        </span>
                                                    </template>
                                                    ></Column
                                                >
                                                <Column :rowEditor="true" style="width: 2%; min-width: 8rem" bodyStyle="text-align:center">
                                                    <template #roweditoriniticon>
                                                        <Button icon="pi pi-pencil" text class="p-button-secundary p-button-sm mr-2" />
                                                    </template>
                                                </Column>
                                                <Column header="">
                                                    <template #body="slotProps">
                                                        <Button icon="pi pi-trash" text class="p-button-danger p-button-sm" @click="handleDeleteParcela($event, slotProps.data)" />
                                                    </template>
                                                </Column>
                                            </DataTable>
                                        </template>
                                    </Card>
                                </div>
                                <div class="col-4">
                                    <Card style="width: 100%; background-color: whitesmoke" ref="cardDefinicaoParcelas">
                                        <template #content>
                                            <div class="flex gap-2 flex-column align-items-center align-content-center p-fluid formgrid grid">
                                                <UWInteger id="valorParcela" label="Quantidade Parcelas" v-model="formData.quantidadeParcelas" classContainer="col-12 md:col-6" />
                                                <UWCalendar id="dataVencimento" label="Primeiro Vencimento" v-model="formData.dataPrimeiroVencimento" classContainer="col-12 md:col-6" />
                                                <UWCurrency id="valorTotalParcela" label="Total das Parcelas" disabled v-model="valorTotalParcelas" classContainer="col-12 md:col-6" />
                                                <UWCurrency id="valorDiferença" label="Diferença das Parcelas" disabled v-model="valorDiferencaParcelas" classContainer="col-12 md:col-6" />
                                            </div>
                                        </template>
                                        <template #footer>
                                            <div class="flex flex-row gap-2">
                                                <Button label="Gerar Parcelas" class="w-full" severity="warning" @click="gerarParcelas" />
                                                <SplitButton label="Reorganizar Parcelas" @click="reogarnizarParcelas" class="w-full" severity="success" :model="itemsReorganizar" />
                                                <Button label="Limpar Parcelas" class="w-full" severity="danger" @click="limparParcelas" />
                                            </div>
                                        </template>
                                    </Card>
                                </div>
                            </div>
                        </TabPanel>
                    </TabView>
                </div>
            </template>
        </UWForm>
    </UWPageBase>
</template>

<style>
.fundoTabPanel {
    background-color: red;
}
</style>
