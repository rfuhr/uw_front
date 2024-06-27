<script setup>
import { ref, computed, onMounted } from 'vue';
import _ from 'lodash';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useFormatDocumentos } from '@/composables/useFormatDocumentos';
import { useFormatNumber } from '@/composables/useFormatNumber';
import { useFormatDate } from '@/composables/useFormatDate';
import { useContexto } from '@/stores';
import { TipoOperacaoFinanceiraService, ParceiroLocalService, DepartamentoService, TituloService } from '@/service';

const emit = defineEmits(['doCancelar']);

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    parceiroLocal: {
        type: Number,
        required: true
    },
    tipoTitulo: {
        type: Number,
        required: true
    }
});

const localModelValue = computed({
    get: () => props.modelValue || {},
    set: () => {}
});


const createSchema = () => {
    return yup.object().shape({
        dataNegociacao: yup.date().required('Data da Negociação é obrigatória'),
        tipoOperacaoFinanceiraId: yup.number().required('Tipo de Operação Financeira é obrigatório'),
        departamentoId: yup.number().required('Departamento é obrigatório'),
        observacao: yup.string().required('Observação é obrigatória'),
        parcelasSelecionadas: yup.array().min(1, 'Selecione ao menos uma parcela para negociação'),
        novasParcelas: yup.array().min(1, 'Adicione ao menos uma parcela para negociação'),
    });
};

const confirm = useConfirm();
const toast = useToast();
const { formatNumber } = useFormatNumber();
const { formatToDDMMYYYY, formatToUTC } = useFormatDate();
const { formatDocumento } = useFormatDocumentos();
const contextoStore = useContexto();

const formData = ref({
    dataNegociacao: new Date(),
    valorJurosNegociado: 0.0,
    valorDescontoNegociado: 0.0,
    parcelasSelecionadas: [],
    novasParcelas: []
});
const dadosParceiroLocal = ref({});

const itemsReorganizar = [
    {
        label: 'Reorganizar Valores',
        command: () => {
            reogarnizarValoresParcelas();
        }
    }
];

const getEnderecoCompleto = (objetoEndereco) => {
    return `${objetoEndereco.endereco}, ${objetoEndereco.numero}, ${objetoEndereco.bairro}, ${objetoEndereco.cidadeNome} - ${objetoEndereco.ufSigla}, ${objetoEndereco.paisNome}, CEP: ${objetoEndereco.cep.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2-$3')}`;
};

const adicionarParcela = () => {
    let newDataVencimento = new Date(Math.max(...formData.value.parcelas.map((parcela) => new Date(parcela.dataVencimento)))) || new Date();
    newDataVencimento.setMonth(newDataVencimento.getMonth() + 1);

    formData.value.novasParcelas.push({
        numeroParcela: formData.value.novasParcelas.length + 1,
        dataVencimento: newDataVencimento,
        valorParcela: 0
    });
};

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
            formData.value.novasParcelas = formData.value.novasParcelas.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Parcela removida com sucesso', life: 5000 });
        },
        reject: () => {}
    });
};

const gerarParcelas = () => {
    formData.value.novasParcelas = [];
    if (formData.value.quantidadeParcelas && formData.value.dataPrimeiroVencimento && valorNegociadoPagar) {
        const valorParcela = (valorNegociadoPagar.value / formData.value.quantidadeParcelas).toFixed(2);
        let dataVencimento = new Date(formData.value.dataPrimeiroVencimento);
        for (let i = 0; i < formData.value.quantidadeParcelas; i++) {
            formData.value.novasParcelas.push({
                numeroParcela: i + 1,
                dataVencimento: dataVencimento,
                valorParcela: valorParcela
            });
            dataVencimento = new Date(dataVencimento);
            dataVencimento.setMonth(dataVencimento.getMonth() + 1);
        }
    }
};

const valorTotalAtraso = computed({
    get: () =>  formData.value.parcelasSelecionadas.reduce((acc, parc) => acc + parc.saldoParcela, 0) | 0
});

const valorNegociadoPagar = computed(() => {
    return valorTotalAtraso.value + formData.value.valorJurosNegociado - formData.value.valorDescontoNegociado;
});

const reogarnizarParcelas = () => {
    formData.value.novasParcelas.sort((a, b) => {
        const dateA = new Date(a.dataVencimento);
        const dateB = new Date(b.dataVencimento);
        return dateA - dateB;
    });

    formData.value.novasParcelas.forEach((parcela, index) => {
        parcela.numeroParcela = index + 1;
    });
};

const reogarnizarValoresParcelas = () => {
    if (formData.value.novasParcelas.length > 0) {
        const valorParcela = valorNegociadoPagar.value / formData.value.novasParcelas.length;
        formData.value.novasParcelas.forEach((parcela) => {
            parcela.valorParcela = valorParcela;
        });
    }
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
            formData.value.novasParcelas = [];
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Parcelas removidas com sucesso', life: 5000 });
        },
        reject: () => {}
    });
};

const handleCancelar = () => {
    emit('doCancelar');
};

onMounted(() => {
    ParceiroLocalService.getById(props.parceiroLocal).then((data) => {
        dadosParceiroLocal.value = data;
        dadosParceiroLocal.value.tipoPessoa = dadosParceiroLocal.value.cpfCnpj.length === 11 ? 'J' : 'F';
        dadosParceiroLocal.value.cpfCnpj = formatDocumento(dadosParceiroLocal.value.cpfCnpj);
        if (dadosParceiroLocal.value.enderecos) {
            dadosParceiroLocal.value.enderecoCompleto = getEnderecoCompleto(dadosParceiroLocal.value.enderecos[0]);
        }
    });
})

const valorTotalParcelas = computed(() => {
    let somaParcelas = formData.value.novasParcelas.reduce((total, parcela) => total + Math.round(parseFloat(parcela.valorParcela) * 100), 0) / 100;
    return somaParcelas;
});

const valorDiferencaParcelas = computed(() => {
    return valorNegociadoPagar.value - valorTotalParcelas.value;
});

const handleNegociacao = async () => {
    const negociacaoRequest = montarNegociacaoRequest();
    await TituloService.lancarNegociacao(negociacaoRequest)
        .then(() => {
            Swal.fire('Sucesso', 'Negociação realizada com sucesso', 'success');
            emit('doCancelar');
        })
        .catch(() => {
            Swal.fire('Falha', 'Ocorreu uma falha no processo de lançamento da negociação', 'error');
        })
        .finally(() => {});
};

const montarNegociacaoRequest = () => {
    return {
        dataNegociacao: formatToUTC(formData.value.dataNegociacao),
        tipoOperacaoFinanceiraId: formData.value.tipoOperacaoFinanceiraId,
        tipoTituloId: props.tipoTitulo,
        parceiroLocalId: props.parceiroLocal,
        departamentoId: formData.value.departamentoId,
        observacao: formData.value.observacao,
        valorJurosNegociado: formData.value.valorJurosNegociado,
        valorDescontoNegociado: formData.value.valorDescontoNegociado,
        selecionados: formData.value.parcelasSelecionadas.map((parc) => {
            return {
                tituloId: parc.tituloId,
                parcelaFinanceiroId: parc.parcelaFinanceiroId,
                movimentoFinanceiroId: parc.movimentoFinanceiroId,
                valorBaixa: parc.saldoParcela
            };
        }),
        novasParcelas: formData.value.novasParcelas.map((parcela) => {
            return {
                numeroParcela: parcela.numeroParcela,
                dataVencimento: formatToUTC(parcela.dataVencimento),
                valorParcela: parcela.valorParcela
            };
        })
    }
}

</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <UWPageBase title="Lançamento de Negociação" subtitle="Realizar negociações de títulos, com geração de um novo título.">
        <UWForm :schema="createSchema()" :values="formData" ref="formLancamentoNegociacao" @doSubmit="handleNegociacao" @doCancel="handleCancelar">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-9">
                        <UWFieldSet title="Identificação do Lançamento" class="h-full">
                            <div class="formgrid grid">
                                <UWCalendar id="dataNegociacao" label="Data" dateFormat="dd/mm/yy" disabled required v-model="formData.dataNegociacao" :errors="errors.value?.dataNegociacao" classContainer="col-12 md:col-2" />
                                <UWSeletor
                                    :id="departamento"
                                    classContainer="col-12 md:col-5"
                                    v-model="formData.departamentoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Departamento"
                                    :service="DepartamentoService"
                                    placeholder="Selecione o departamento"
                                    :erros="errors.value?.departamentoId"
                                    :columnsFilters="[{ field: 'empresaFilial', value: contextoStore.contexto.empresaFilialId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresaFilial.id' }]"
                                />
                                <UWSeletor
                                    id="tipoTitulo"
                                    classContainer="col-12 md:col-5"
                                    v-model="formData.tipoOperacaoFinanceiraId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Tipo de Operação Financeira"
                                    :service="TipoOperacaoFinanceiraService"
                                    placeholder="Selecione o tipo de operação"
                                    :columnsFilters="[{ field: 'selecionaNegociacao', value: true, matchMode: 'equal', tipoField: 'boolean', fieldFilter: 'selecionaNegociacao' }]"
                                    :erros="errors.value?.tipoOperacaoFinanceiraId"
                                />
                                <UWInput id="nomeLocal" :label="dadosParceiroLocal.tipoPessoa === 'J' ? 'Razão Social' : 'Nome'" uppercase disabled v-model="dadosParceiroLocal.nomeRazaoSocial" classContainer="col-12 md:col-5" />
                                <UWInput id="cpfCnpj" :label="dadosParceiroLocal.tipoPessoa === 'J' ? 'Cnpj' : 'Cpf'" uppercase disabled v-model="dadosParceiroLocal.cpfCnpj" classContainer="col-12 md:col-2" />
                                <UWInput v-if="dadosParceiroLocal.tipoPessoa === 'J'" id="nomeLocal" label="Filial" uppercase disabled v-model="dadosParceiroLocal.nomeLocal" classContainer="col-12 md:col-3" />
                                <UWInput
                                    id="endereco"
                                    label="Endereço"
                                    uppercase
                                    disabled
                                    v-model="dadosParceiroLocal.enderecoCompleto"
                                    :classContainer="{ 'col-12': true, 'md:col-4': dadosParceiroLocal.tipoPessoa === 'J', 'md:col-5': !dadosParceiroLocal.tipoPessoa || dadosParceiroLocal.tipoPessoa === 'F' }"
                                />   
                                <UWInput id="observacao" label="Observação" uppercase required v-model="formData.observacao" :errors="errors.value?.observacao" classContainer="col-12 md:col-12" />                             
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-3">
                        <UWFieldSet title="Valores da Negociação (R$)" class="h-full flex flex-column justify-content-center bg-red-50 border-solid">
                            <div class="formgrid grid">
                                <UWCurrency id="valorTotalAtraso" label="Total Negociado" disabled v-model="valorTotalAtraso" classContainer="col-12 md:col-12" />
                                <UWCurrency id="valorJurosNegociado" label="Juros Negociado" v-model="formData.valorJurosNegociado" classContainer="col-12 md:col-6" />
                                <UWCurrency id="valorDescontoNegociado" label="Desconto Negociado" v-model="formData.valorDescontoNegociado" classContainer="col-12 md:col-6" />
                                <UWCurrency id="valorNegociadoPagar" label="Valor Negociado a Pagar" disabled v-model="valorNegociadoPagar" classContainer="col-12 md:col-12" />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-12" v-if="errors.value?.parcelasSelecionadas || errors.value?.novasParcelas">
                        <Message class="col-12 p-0 m-0" :closable="false" severity="error" v-if="errors.value?.parcelasSelecionadas">{{ errors.value?.parcelasSelecionadas }}</Message>
                        <Message class="col-12 p-0 m-0" :closable="false" severity="error" v-if="errors.value?.novasParcelas">{{ errors.value?.novasParcelas }}</Message>
                    </div>
                    <TabView class="col-12">
                        <TabPanel header="Parcelas Negociadas" class="col-12">
                            <DataTable
                                :value="localModelValue"
                                v-model:selection="formData.parcelasSelecionadas"
                                paginator
                                :rows="10"
                                :rowClass="rowClass"
                                :rowStyle="rowStyle"
                                dataKey="movimentoId"
                                showGridlines
                                size="small"
                                stripedRows
                            >
                                <template #empty> Sem títulos selecionados para baixa. </template>
                                <Column selectionMode="multiple" headerStyle="width: 3rem" headerClass="columnHeaderItem"></Column>
                                <Column field="tipoTituloSigla" header="Tipo" sortable headerClass="columnHeaderItem" />
                                <Column field="saldoParcela" header="Saldo Parcela" sortable headerClass="columnHeaderItem">
                                    <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.saldoParcela, 2) }}</div>
                                    </template>
                                </Column>
                                <Column field="siglaCarteira" header="Carteira" sortable headerClass="columnHeaderItem" />
                                <Column field="empresaFilialSigla" header="Filial" sortable headerClass="columnHeaderItem" />
                                <Column field="departamentoSigla" header="Depto" sortable headerClass="columnHeaderItem" />
                                <Column field="nossoNumero" header="Nosso Número" sortable headerClass="columnHeaderItem" />
                                <Column field="numeroParcela" header="Parcela" sortable headerClass="columnHeaderItem" />
                                <Column field="documento" header="Documento" sortable headerClass="columnHeaderItem" />
                                <Column field="dataVencimento" header="Vencimento" sortable headerClass="columnHeaderItem">
                                    <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{ formatToDDMMYYYY(slotProps.data.dataVencimento) }}</div>
                                    </template>
                                </Column>
                                <Column field="caracteristicaMovimentoSigla" header="Carac. Mov." sortable headerClass="columnHeaderItem" />
                            </DataTable>
                        </TabPanel>
                        <TabPanel header="Novas Parcelas" class="col-12">
                            <div class="formgrid grid">
                                <div class="col-8">
                                    <Card style="width: 100%; height: 100%">
                                        <template #content>
                                            <DataTable ref="dtDados" :value="formData.novasParcelas" scrollable scrollHeight="15em" stripedRows responsiveLayout="scroll" dataKey="id" size="small">
                                                <template #empty> Nenhuma Parcela Gerada. </template>
                                                <template #header>
                                                    <div class="flex flex-wrap align-items-center justify-content-end gap-2">
                                                        <Button label="Adicionar Parcela" icon="pi pi-plus" text @click="adicionarParcela" />
                                                    </div>
                                                </template>
                                                <Column field="numeroParcela" header="Nº Parcela" style="width: 10%" />
                                                <Column field="dataVencimento" header="Data Vencimento" style="width: 50%">
                                                    <template #body="slotProps">
                                                        <Calendar v-model="slotProps.data.dataVencimento" dateFormat="dd/mm/yy" :class="{ 'w-5': true, 'p-invalid': _.get(errors.value, `novasParcelas[${slotProps.index}].dataVencimento`, null) }" />
                                                        <span v-if="_.get(errors.value, `novasParcelas[${slotProps.index}].dataVencimento`, null)">
                                                            <span v-for="(error, index) of _.get(errors.value, `novasParcelas[${slotProps.index}].dataVencimento`, null)" :key="index">
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
                                                            :class="{ 'w-full': true, 'p-invalid': _.get(errors.value, `novasParcelas[${slotProps.index}].valorParcela`, null) }"
                                                        />
                                                        <span v-if="_.get(errors.value, `novasParcelas[${slotProps.index}].valorParcela`, null)">
                                                            <span v-for="(error, index) of _.get(errors.value, `novasParcelas[${slotProps.index}].valorParcela`, null)" :key="index">
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
                                                <UWCurrency id="valorTotalParcela" label="Total das Parcelas" disabled v-model="valorNegociadoPagar" classContainer="col-12 md:col-6" />
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