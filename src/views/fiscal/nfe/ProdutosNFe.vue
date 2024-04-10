<script setup>
import { ref, computed } from 'vue';
import * as yup from 'yup';
import _ from 'lodash';
import { useValidationsSchemaNFe } from './useValidationsSchemaNFe';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import UWSeletorItem from '@/components/seletores/UWSeletorItem.vue';

const toast = useToast();
const confirm = useConfirm();
const visibleDialog = ref(false);
const modeDialog = ref('');

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    errors: {}
});

const emit = defineEmits(['update:modelValue']);

const itensModelValue = computed({
    get: () => props.modelValue || {},
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const createSchemaItensNFe = (dynamicFields) => {
    const schemaObject = yup.object().shape({
        ...dynamicFields
    });

    return yup.object().shape({
        itens: yup.array().min(1, 'Deve ser informado pelo menos 1 item para NF-e').required('Obrigatório informar item para a NF-e').of(schemaObject)
    });
};

const createSchema = () => {
    const { createSchemaDetalhamentoItem } = useValidationsSchemaNFe();

    return createSchemaItensNFe({
        detalhamentoItem: createSchemaDetalhamentoItem(itensModelValue.value)
    });
};

const formProdutosNFe = ref(null);
const itemEmManutencao = ref({});
const itemSelecionado = ref();
const indexSelecionado = ref();

const validateForm = () => {
    if (formProdutosNFe.value) {
        return formProdutosNFe.value.validateForm();
    }
};

const adicionarItem = () => {
    const idLine = Math.floor(Math.random() * 100) * -1;
    itemEmManutencao.value = { idLine: idLine };
    if (!itensModelValue.value.itens)
        itensModelValue.value.itens = []
    const idx = itensModelValue.value.itens.length;
    itensModelValue.value.itens.push(itemEmManutencao.value);
    itemSelecionado.value = itemEmManutencao.value;
    indexSelecionado.value = idx;
    visibleDialog.value = true;
    modeDialog.value = 'add';
};

const onRowSelect = (event) => {
    itemEmManutencao.value = event.data;
    indexSelecionado.value = event.index;
};

const onRowUnselect = () => {
    itemEmManutencao.value = {};
    indexSelecionado.value = null;
};

const handleDelete = (event, data) => {
    itemSelecionado.value = data;
    itemEmManutencao.value = data;
    confirm.require({
        target: event.currentTarget,
        message: 'Deseja excluir este registro?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Excluir',
        accept: () => {
            itensModelValue.value.itens = itensModelValue.value.itens.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Item removido com sucesso', life: 5000 });
            itemSelecionado.value = null;
            itemEmManutencao.value = {};
        },
        reject: () => {}
    });
};

const handleEdit = (values) => {
    itemEmManutencao.value = values.data;
    itemSelecionado.value = values.data;
    indexSelecionado.value = values.index;
    modeDialog.value = 'edit';
    visibleDialog.value = true;
};

const handleVoltar = () => {
    if (modeDialog.value === 'add') {
        itensModelValue.value = itensModelValue.value.itens.filter((item) => item !== itemEmManutencao.value);
        itemSelecionado.value = null;
        itemEmManutencao.value = {};
    }
    visibleDialog.value = false;
};

const handleConfirmar = () => {
    visibleDialog.value = false;
};

defineExpose({
    validateForm
});

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
</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <div>
        <UWForm :schema="createSchema()" :values="itensModelValue" ref="formProdutosNFe" :visibleSave="false" :visibleCancel="false">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <UWFieldSet title="Itens da Nota" class="h-full">
                            <Toolbar>
                                <template v-slot:start>
                                    <div>
                                        <Button label="Adicionar Produto" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarItem()" />
                                    </div>
                                </template>
                            </Toolbar>
                            <DataTable
                                id="tableItensNFe"
                                ref="dtItens"
                                :value="itensModelValue.itens"
                                responsiveLayout="scroll"
                                size="small"
                                stripedRows
                                showGridlines
                                selectionMode="single"
                                dataKey="idLine"
                                v-model:selection="itemSelecionado"
                                @rowSelect="onRowSelect"
                                @rowUnselect="onRowUnselect"
                            >
                                <template #empty> Nenhum item informado. </template>
                                <Column style="width: 1%; text-align: left">
                                    <template #body="slotProps">
                                        <i v-if="temErro(errors?.value, `itens[${slotProps.index}]`)" class="pi pi-exclamation-circle text-red-500 text-bold" style="font-size: 1.3rem" />
                                        <i v-if="!temErro(errors?.value, `itens[${slotProps.index}]`)" class="pi pi-exclamation-circle text-green-500 text-bold" style="font-size: 1.3rem" />
                                    </template>
                                </Column>
                                <Column field="codigo" header="Código" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                                <Column field="nome" header="Nome" style="width: 2%; text-align: left" headerClass="columnHeaderItem"> </Column>
                                <Column field="ncmCodigo" header="Ncm" style="width: 7%" headerClass="columnHeaderItem"> </Column>
                                <Column field="cst" header="Cst" style="width: 3%" headerClass="columnHeaderItem"> </Column>
                                <Column field="cfop" header="Cfop" style="width: 3%" headerClass="columnHeaderItem"> </Column>
                                <Column field="unidadeMedida" header="U.M." style="width: 3%" headerClass="columnHeaderItem"> </Column>
                                <Column field="quantidade" header="Qtde" style="width: 4%" headerClass="columnHeaderItem"> </Column>
                                <Column field="valorUnitario" header="Valor Unitário" style="width: 5%" headerClass="columnHeaderItem"> </Column>
                                <Column field="percentualDesconto" header="% Desc." style="width: 3%" headerClass="columnHeaderItem"> </Column>
                                <Column field="valorDesconto" header="Valor Desc." style="width: 4%" headerClass="columnHeaderItem"> </Column>
                                <Column field="valorTotal" header="Valor Total" style="width: 7%" headerClass="columnHeaderItem"> </Column>
                                <Column field="baseCalculoIcms" header="Base Calc. Icms" style="width: 5%" headerClass="columnHeaderItem"> </Column>
                                <Column field="aliquotaIcms" header="Aliq. Icms" style="width: 3%" headerClass="columnHeaderItem"> </Column>
                                <Column field="valorIcms" header="Valor do Icms" style="width: 4%" headerClass="columnHeaderItem"> </Column>
                                <Column field="aliquotaIpi" header="Aliq. Ipi" style="width: 3%" headerClass="columnHeaderItem"> </Column>
                                <Column field="valorIpi" header="Valor do Ipi" style="width: 4%" headerClass="columnHeaderItem"> </Column>
                                <Column field="valorAproxTrib" header="Valor Aprox. Trib." style="width: 5%" headerClass="columnHeaderItem"> </Column>
                                <Column header="" style="width: 6%">
                                    <template #body="slotProps">
                                        <Button icon="pi pi-pencil" class="p-button-info p-button-sm mr-2" @click="handleEdit(slotProps)" />
                                        <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDelete($event, slotProps.data)" />
                                    </template>
                                </Column>
                            </DataTable>
                        </UWFieldSet>
                    </div>
                    <div class="col-12 mb-0">
                        <Message class="col-12 p-0 m-0" :closable="false" severity="error" v-if="_.get(errors?.value, 'itens', null)">{{ _.get(errors?.value, 'itens', null) }}</Message>
                        <Message class="col-12 p-0 m-0" :closable="false" severity="warn" v-if="temErro(errors?.value, 'itens[')">Atenção! Existem documentos referenciados com pendências nas informações informadas.</Message>
                    </div>
                </div>

                <Dialog v-model:visible="visibleDialog" :style="{ width: '90%' }" header="Detalhamento do Item" :modal="true" :closable="false">
                    <Divider class="m-0" />
                    <div class="col-12 pb-0 mb-0">
                        <div class="grid nested-grid">
                            <div class="col-12">
                                <div class="col-12">
                                    <UWFieldSet title="Dados do Produto / Serviço" class="h-full">
                                        <div class="p-fluid formgrid grid">
                                            <UWSeletorItem
                                                id="produto"
                                                v-model="itemEmManutencao.itemId"
                                                classContainer="col-12 md:col-4"
                                                required
                                                label="Produto / Serviço"
                                                :erros="_.get(errors?.value, `itens[${indexSelecionado}].detalhamentoItem.itemId`, null)"
                                            />
                                            <UWInput id="ncm" label="Ncm" uppercase disabled classContainer="col-12 md:col-2" />
                                            <UWInput id="gtin" label="GTIN" uppercase disabled classContainer="col-12 md:col-2" />
                                            <UWInput id="tipoProduto" label="Tipo do Produto" uppercase disabled classContainer="col-12 md:col-3" />
                                            <UWInput id="codigoCEST" label="Código CEST" uppercase disabled classContainer="col-12 md:col-1" />
                                            <UWSeletorCfop id="cfop" classContainer="col-12 md:col-4" required label="Cfop" />
                                            <UWInput id="grupoTributacao" label="Grupo de Tributação" uppercase disabled classContainer="col-12 md:col-2" />
                                            <UWInput id="unidadeMedidaComercial" label="Unidade de Medida" uppercase disabled classContainer="col-12 md:col-2" />
                                        </div>
                                        <div class="col-12">
                                            <Card style="width: 100%; background-color: whitesmoke" ref="cardDefinicaoParcelas">
                                                <template #content>
                                                    <div class="flex gap-0 flex-row justify-content-center align-content-end p-fluid formgrid grid">
                                                        <UWDecimal id="quantidade" label="Quantidade" required :maximoDigitos="5" autofocus classContainer="col-12 md:col-1" />
                                                        <UWCurrency id="valorUnitario" label="Valor Unitário" classContainer="col-12 md:col-1" />
                                                        <UWCurrency id="valorTotalBrutoItem" label="Valor Total Bruto" disabled classContainer="col-12 md:col-2" />
                                                        <UWDecimal id="percentualDesconto" label="% Desc." required :maximoDigitos="5" autofocus classContainer="col-12 md:col-1" />
                                                        <UWCurrency id="valorDesconto" label="Valor Desc." classContainer="col-12 md:col-1" />
                                                        <UWCurrency id="valorFrete" label="Valor Frete" classContainer="col-12 md:col-1" />
                                                        <UWCurrency id="valorSeguro" label="Valor Seguro" classContainer="col-12 md:col-1" />
                                                        <UWCurrency id="valorOutrasDespesas" label="Outras Desp." classContainer="col-12 md:col-1" />
                                                        <UWCurrency id="valorTotalBrutoItem" label="Valor Total" disabled classContainer="col-12 md:col-2" />
                                                    </div>
                                                </template>
                                            </Card>
                                        </div>
                                    </UWFieldSet>
                                </div>
                                <TabView class="col-12">
                                    <TabPanel header="Tributação ICMS / ST"> </TabPanel>
                                    <TabPanel header="ICMS para a UF de destino"> </TabPanel>
                                    <TabPanel header="IPI"> </TabPanel>
                                    <TabPanel header="Imposto de Importação"> </TabPanel>
                                    <TabPanel header="PIS"> </TabPanel>
                                    <TabPanel header="PIS ST"> </TabPanel>
                                    <TabPanel header="COFINS"> </TabPanel>
                                    <TabPanel header="COFINS ST"> </TabPanel>
                                </TabView>
                            </div>
                        </div>
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

<style>
.columnHeaderItem .p-column-title {
    text-align: center;
    width: 100%;
}
</style>
