<script setup>
import { ref, computed, onMounted } from 'vue';
import * as yup from 'yup';
import _ from 'lodash';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useFormatNumber } from '@/composables/useFormatNumber';
import { useFormatDocumentos } from '@/composables/useFormatDocumentos';
import { TiposService } from '@/service';
import { useValidationsSchemaNFe } from './useValidationsSchemaNFe';
import moment from 'moment';

const createSchemaFinanceiroNFe = (dynamicFields) => {
    const schemaObject = {};

    Object.assign(schemaObject, { ...dynamicFields });
    return yup.object().shape(schemaObject);
};

const createSchema = () => {
    const { createSchemaPagamentos } = useValidationsSchemaNFe();

    return createSchemaFinanceiroNFe({
        pagamentos: createSchemaPagamentos(financeiroModelValue.value)
    });
};

const toast = useToast();
const confirm = useConfirm();
const { formatNumber } = useFormatNumber();
const { formatDocumento } = useFormatDocumentos();

const visibleDialog = ref(false);
const modeDialog = ref('');

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    visualizacao: {
        type: Boolean,
        required: true,
        default: false
    }
});

const emit = defineEmits(['update:modelValue']);

const financeiroModelValue = computed({
    get: () => props.modelValue || {},
    set: (value) => {
        emit('update:modelValue', value);
    }
});
const pagamentoEmManutencao = ref();
const pagamentoSelecionado = ref();
const tiposFormaPagamento = ref([]);
const meiosPagamento = ref([]);
const tiposIntegracaoPagamento = ref([]);
const bandeirasCartao = ref([]);
const indexSelecionado = ref();
const formFinanceiroNFe = ref(null);

const adicionarPagamento = () => {
    const idLine = Math.floor(Math.random() * 100) * -1;
    pagamentoEmManutencao.value = {
        idLine,
        valorPagamento: 0,
        numero: undefined,
        dataVencimento: undefined,
        grupoCartao: {},
        aux: {}
    };
    if (!financeiroModelValue.value.pagamentos) financeiroModelValue.value.pagamentos = [];
    else financeiroModelValue.value.pagamentos.push(pagamentoEmManutencao.value);

    const idx = financeiroModelValue.value.pagamentos.length === 0 ? 0 : financeiroModelValue.value.pagamentos.length - 1;
    pagamentoSelecionado.value = pagamentoEmManutencao.value;
    indexSelecionado.value = idx;
    visibleDialog.value = true;
    modeDialog.value = 'add';
};

const handleVoltar = () => {
    if (modeDialog.value === 'add') {
        financeiroModelValue.value.pagamentos = financeiroModelValue.value.pagamentos.filter((item) => item !== pagamentoEmManutencao.value);
        pagamentoSelecionado.value = null;
        pagamentoEmManutencao.value = {};
    }
    visibleDialog.value = false;
};

const handleConfirmar = () => {
    visibleDialog.value = false;
};

const temErro = (errors, str) => {
    let caminhoEncontrado = false;
    _.forEach(errors, (value, key) => {
        // Verifica se o caminho base está contido no caminho atual
        if (_.startsWith(key, str)) {
            caminhoEncontrado = true;
            return false; // Sai do loop forEach assim que encontrar um caminho válido
        }
    });
    return caminhoEncontrado;
};

onMounted(() => {
    TiposService.getIndicadorFormaPagamento().then((data) => {
        tiposFormaPagamento.value = data;
    });
    TiposService.getMeiosPagamento().then((data) => {
        meiosPagamento.value = data;
    });
    TiposService.getTiposIntegracaoPagamento().then((data) => {
        tiposIntegracaoPagamento.value = data;
    });
    TiposService.getBandeirasCartao().then((data) => {
        bandeirasCartao.value = data;
    });
});

const mostraGrupoCartao = () => {
    return pagamentoEmManutencao.value.meioPagamento === '03' || pagamentoEmManutencao.value.meioPagamento === '04';
};

const changeIndicadorFormaPagamento = (value) => {
    pagamentoEmManutencao.value.aux.indicadorFormaPagamento = value;
};

const changeMeioPagamento = (value) => {
    pagamentoEmManutencao.value.aux.meioPagamento = value;
    if (value.value === '90') {
        pagamentoEmManutencao.value.indicadorFormaPagamento = null;
        pagamentoEmManutencao.value.valorPagamento = 0;
        pagamentoEmManutencao.value.grupoCartao = {};
    }
};

const changeTipoIntegracao = (value) => {
    pagamentoEmManutencao.value.aux.tipoIntegracao = value;
};

const changeBandeiraCartao = (value) => {
    pagamentoEmManutencao.value.aux.bandeiraCartao = value;
};

const handleDelete = (event, data) => {
    pagamentoSelecionado.value = data;
    pagamentoEmManutencao.value = data;
    confirm.require({
        target: event.currentTarget,
        message: 'Deseja excluir este registro?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Excluir',
        accept: () => {
            financeiroModelValue.value.pagamentos = financeiroModelValue.value.pagamentos.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Item removido com sucesso', life: 5000 });
            pagamentoSelecionado.value = null;
            pagamentoEmManutencao.value = {};
        },
        reject: () => {}
    });
};

const handleEdit = (values) => {
    pagamentoEmManutencao.value = values.data;
    pagamentoSelecionado.value = values.data;
    indexSelecionado.value = values.index;
    modeDialog.value = 'edit';
    visibleDialog.value = true;
};

const validateForm = () => {
    if (formFinanceiroNFe.value) {
        return formFinanceiroNFe.value.validateForm();
    }
};

const formataData = (data) => {
    if (data) {
        moment.locale('pt-br')
        return moment(data).format('DD/MM/YYYY')
    }
    return ''
}

defineExpose({
    validateForm
});
</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <div>
        <UWForm :schema="createSchema()" :values="financeiroModelValue" ref="formFinanceiroNFe" :visibleSave="false" :visibleCancel="false">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <UWFieldSet title="Informações de Pagamento" class="h-full">
                            <Toolbar>
                                <template v-slot:start>
                                    <div>
                                        <Button v-show="!visualizacao" label="Adicionar Pagamento" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarPagamento()" />
                                    </div>
                                </template>
                            </Toolbar>
                            <div v-if="_.get(errors?.value, 'pagamentos', null) || temErro(errors?.value, 'pagamentos[')" class="col-12">
                                <Message class="col-12 p-0 m-0" :closable="false" severity="error" v-if="_.get(errors?.value, 'pagamentos', null)">{{ _.get(errors?.value, 'pagamentos', null) }}</Message>
                                <Message class="col-12 p-0 m-0" :closable="false" severity="warn" v-if="temErro(errors?.value, 'pagamentos[')">Atenção! Existem pagamentos com pendências nas informações informadas.</Message>
                            </div>
                            <div class="col-12">
                            <DataTable
                                id="tablePagamentos"
                                ref="dtPagamentos"
                                :value="financeiroModelValue.pagamentos"
                                responsiveLayout="scroll"
                                size="small"
                                stripedRows
                                showGridlines
                                selectionMode="single"
                                dataKey="idLine"
                                v-model:selection="pagamentoSelecionado"
                                @rowSelect="onRowSelect"
                                @rowUnselect="onRowUnselect"
                            >
                                <template #empty> Nenhum pagamento informado. </template>
                                <Column style="width: 1%; text-align: left">
                                    <template #body="slotProps">
                                        <i v-if="temErro(errors?.value, `pagamentos[${slotProps.index}]`)" class="pi pi-exclamation-circle text-red-500 text-bold" style="font-size: 1.3rem" />
                                        <i v-if="!temErro(errors?.value, `pagamentos[${slotProps.index}]`)" class="pi pi-exclamation-circle text-green-500 text-bold" style="font-size: 1.3rem" />
                                    </template>
                                </Column>
                                <Column field="numero" header="Parcela" style="width: 8%"> </Column>
                                <Column header="Data Vencimento" style="width: 12%">
                                    <template #body="slotProps">
                                        <span>{{ formataData(slotProps.data.dataVencimento) }}</span>
                                    </template>
                                </Column>
                                <Column field="aux.meioPagamento.name" header="Meio de Pagamento" style="width: 10%; text-align: left" headerClass="columnHeaderItem"> </Column>
                                <Column field="aux.indicadorFormaPagamento.name" header="Forma de Pagamento" style="width: 10%; text-align: left" headerClass="columnHeaderItem"> </Column>
                                <Column field="valorPagamento" header="Valor do Pagamento" style="width: 10%" headerClass="columnHeaderItem">
                                    <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.valorPagamento, 2) }}</div> </template
                                    >
                                </Column>
                                <Column field="aux.tipoIntegracao.name" header="Tipo de Integração" style="width: 10%; text-align: left" headerClass="columnHeaderItem"> </Column>
                                <Column field="grupoCartao.cnpj" header="CNPJ Inst. Pgto" style="width: 12%; text-align: left" headerClass="columnHeaderItem">
                                    <template #body="slotProps">
                                        <div class="w-full text-center pr-2">{{ formatDocumento(slotProps.data.grupoCartao.cnpj, 2) }}</div> </template
                                    >
                                </Column>
                                <Column field="aux.bandeiraCartao.name" header="Bandeira do Cartão" style="width: 10%; text-align: left" headerClass="columnHeaderItem"> </Column>
                                <Column field="grupoCartao.numeroAutorizacao" header="Número da Autorização" style="width: 10%; text-align: left" headerClass="columnHeaderItem"> </Column>
                                <Column header="" style="width: 18%">
                                    <template #body="slotProps">
                                        <Button v-show="!visualizacao" icon="pi pi-pencil" class="p-button-info p-button-sm mr-2" @click="handleEdit(slotProps)" />
                                        <Button v-show="!visualizacao" icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDelete($event, slotProps.data)" />
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                        </UWFieldSet>
                    </div>
                </div>

                <Dialog v-model:visible="visibleDialog" :style="{ width: '40%' }" header="Detalhamento do Pagamento" :modal="true" :closable="false">
                    <Divider class="m-0" />
                    <div class="col-12 pb-0 mb-0">
                        <div class="formgrid grid">
                            <UWPickList
                                id="meioPagamento"
                                label="Meio de Pagamento"
                                v-model="pagamentoEmManutencao.meioPagamento"
                                optionLabel="name"
                                optionValue="value"
                                autofocus 
                                required
                                :options="meiosPagamento"
                                classContainer="col-12 md:col-6"
                                @changeObject="changeMeioPagamento"
                                :errors="_.get(errors.value, `pagamentos[${indexSelecionado}].meioPagamento`, null)"
                            />
                            <UWPickList
                                v-if="pagamentoEmManutencao.meioPagamento !== '90'"
                                id="tipoPagamento"
                                label="Forma de Pagamento"
                                v-model="pagamentoEmManutencao.indicadorFormaPagamento"
                                optionLabel="name"
                                optionValue="value"
                                required
                                :options="tiposFormaPagamento"
                                classContainer="col-12 md:col-6"
                                @changeObject="changeIndicadorFormaPagamento"
                                :errors="_.get(errors.value, `pagamentos[${indexSelecionado}].indicadorFormaPagamento`, null)"
                            />                            
                            <UWInput 
                                id="numero" 
                                label="Parcela" 
                                required 
                                v-model="pagamentoEmManutencao.numero" 
                                :errors="_.get(errors.value, `pagamentos[${indexSelecionado}].numero`, null)" 
                                classContainer="col-12 md:col-4" 
                            />
                            <UWCalendar 
                                id="dataVencimento" 
                                label="Data de Vencimento" 
                                v-model="pagamentoEmManutencao.dataVencimento" 
                                dateFormat="dd/mm/yy" 
                                required 
                                :showTime="false" 
                                classContainer="col-12 md:col-4" 
                                :errors="_.get(errors.value, `pagamentos[${indexSelecionado}].dataVencimento`, null)" 
                            />
                            <UWCurrency v-if="pagamentoEmManutencao.meioPagamento !== '90'" id="valorPagamento" label="Valor Pagamento" v-model="pagamentoEmManutencao.valorPagamento" required classContainer="col-12 md:col-4" 
                            :errors="_.get(errors.value, `pagamentos[${indexSelecionado}].valorPagamento`, null)"/>
                        </div>
                    </div>
                    <div v-if="mostraGrupoCartao()" class="col-12">
                        <UWFieldSet title="Identificação do Cartão" class="h-full">
                            <div class="p-fluid formgrid grid">
                                <UWPickList
                                    id="tipoIntegracao"
                                    label="Tipo de Integração"
                                    v-model="pagamentoEmManutencao.grupoCartao.tipoIntegracao"
                                    optionLabel="name"
                                    optionValue="value"
                                    required
                                    :options="tiposIntegracaoPagamento"
                                    classContainer="col-12 md:col-6"
                                    @changeObject="changeTipoIntegracao"
                                    :errors="_.get(errors.value, `pagamentos[${indexSelecionado}].grupoCartao.tipoIntegracao`, null)"
                                />
                                <UWInputMask id="cnpj" label="Cnpj" mask="99.999.999/9999-99" required autofocus v-model="pagamentoEmManutencao.grupoCartao.cnpj" classContainer="col-12 md:col-6" 
                                :errors="_.get(errors.value, `pagamentos[${indexSelecionado}].grupoCartao.cnpj`, null)"/>
                                <UWPickList
                                    id="bandeiraCartao"
                                    label="Bandeira do Cartão"
                                    v-model="pagamentoEmManutencao.grupoCartao.bandeiraCartao"
                                    optionLabel="name"
                                    optionValue="value"
                                    required
                                    :options="bandeirasCartao"
                                    classContainer="col-12 md:col-6"
                                    @changeObject="changeBandeiraCartao"
                                    :errors="_.get(errors.value, `pagamentos[${indexSelecionado}].grupoCartao.bandeiraCartao`, null)"
                                />
                                <UWInput id="numeroAutorizacao" label="Número da Transação da Operação" v-model="pagamentoEmManutencao.grupoCartao.numeroAutorizacao" classContainer="col-12 md:col-6" 
                                :errors="_.get(errors.value, `pagamentos[${indexSelecionado}].grupoCartao.numeroAutorizacao`, null)"/>
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-12 mt-0 pt-0 pb-0">
                        <Divider />
                        <div class="flex justify-content-end flex-wrap gap-2">
                            <Button label="Voltar" icon="pi pi-replay" class="p-button-help" outlined @click="handleVoltar()" />
                            <Button type="submit" label="Confirmar" style="color: var(--teal-600)" outlined icon="pi pi-check" @click="handleConfirmar()" />
                        </div>
                    </div>
                </Dialog>
            </template>
        </UWForm>
    </div>
</template>
