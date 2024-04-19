<script setup>
import { ref, computed } from 'vue';
import * as yup from 'yup';
import _ from 'lodash';
import { useValidationsSchemaNFe } from './useValidationsSchemaNFe';
import { useFormatNumber } from '@/composables/useFormatNumber';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import UWSeletorItem from '@/components/seletores/UWSeletorItem.vue';
import UWSeletorCfopByOpInt from '@/components/seletores/UWSeletorCfopByOpInt.vue';
import { Icms00, Icms10, Icms20, Icms30, Icms40, Icms41, Icms50, Icms51, Icms60, Icms70, Icms90, PartilhaIcms, RepasseIcms } from './tributacao';
import { Cson101, Cson102, Cson103, Cson201, Cson202, Cson203, Cson300, Cson400, Cson500, Cson900 } from './tributacaoSimples';
import IcmsUfOutroDestino from './IcmsUfOutroDestino.vue';
import Ipi from './Ipi.vue';
import II from './II.vue';
import PIS from './PIS.vue';
import Cofins from './Cofins.vue';
import { ConfiguracaoFiscalService } from '@/service';

const toast = useToast();
const confirm = useConfirm();
const visibleDialog = ref(false);
const modeDialog = ref('');
const seletorCfop = ref(null);

const { formatNumber } = useFormatNumber();

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    errors: {},
    dadosAuxiliares: {
        type: Object,
        required: true
    }
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
        itens: yup
            .array()
            .min(1, 'Deve ser informado pelo menos 1 item para NF-e')
            .required('Obrigatório informar item para a NF-e')
            .of(
                yup.object().shape({
                    ...schemaObject.fields
                })
            )
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

const subTotal = computed(() => {
    return itemEmManutencao.value.detalhamentoItem.quantidade * itemEmManutencao.value.detalhamentoItem.valorUnitario || 0;
});

const valorTotal = computed(() => {
    return (
        subTotal.value - itemEmManutencao.value.detalhamentoItem.valorDesconto + itemEmManutencao.value.detalhamentoItem.valorFrete + itemEmManutencao.value.detalhamentoItem.valorSeguro + itemEmManutencao.value.detalhamentoItem.valorOutrasDespesas ||
        0
    );
});

const validateForm = () => {
    if (formProdutosNFe.value) {
        return formProdutosNFe.value.validateForm();
    }
};

const adicionarItem = () => {
    const idLine = Math.floor(Math.random() * 100) * -1;
    itemEmManutencao.value = {
        idLine: idLine,
        detalhamentoItem: {
            cfopId: props.dadosAuxiliares.cfopId,
            quantidade: 0,
            valorUnitario: 0,
            percentualDesconto: 0,
            valorDesconto: 0,
            valorFrete: 0,
            valorSeguro: 0,
            valorOutrasDespesas: 0,
            cfop: {},
            item: {}
        },
        configuracaoFiscal: {},
        tributacaoIcms: {},
        ipi: {},
        ii: {},
        pis: {},
        pisSt: {},
        cofins: {},
        cofinsSt: {}
    };
    itensModelValue.value.itens.push(itemEmManutencao.value);

    const idx = itensModelValue.value.itens.length === 0 ? 0 : itensModelValue.value.itens.length - 1;
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

const handleVoltar = async () => {
    if (modeDialog.value === 'add') {
        const indexParaRemover = _.findIndex(itensModelValue.value.itens, { idLine: itemEmManutencao.value.idLine });
        if (indexParaRemover !== -1) {
            itensModelValue.value.itens.splice(indexParaRemover, 1);
        }
        itemSelecionado.value = null;
        itemEmManutencao.value = {};
    }
    visibleDialog.value = false;
};

const handleConfirmar = () => {
    itemEmManutencao.value.detalhamentoItem.subTotal = subTotal.value;
    itemEmManutencao.value.detalhamentoItem.valorTotal = valorTotal.value;
    visibleDialog.value = false;
};

// const temTributacao = () => {
//     return configuracaoFiscal.value.temIcms || configuracaoFiscal.value.temPartilhaIcms || configuracaoFiscal.value.temRepasseIcms || configuracaoFiscal.value.temIcmsParaUfDestino || configuracaoFiscal.value.temIpi || configuracaoFiscal.value.temII || configuracaoFiscal.value.temPis || configuracaoFiscal.value.temPisSt || configuracaoFiscal.value.temCofins || configuracaoFiscal.value.temCofinsSt;
// }

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

const getConfiguracaoFiscal = async () => {
    try {
        itemEmManutencao.value.configuracaoFiscal = await ConfiguracaoFiscalService.getConfiguracaoFiscal(
            props.dadosAuxiliares.emitenteId,
            props.dadosAuxiliares.parceiroLocalEnderecoIdDestino,
            props.dadosAuxiliares.indicadorOperacao,
            itemEmManutencao.value.detalhamentoItem.cfopId,
            itemEmManutencao.value.detalhamentoItem.itemId,
            props.dadosAuxiliares.operacaoInternaId,
            props.dadosAuxiliares.dataHoraEmissao
        );
        if (!itemEmManutencao.value.configuracaoFiscal) {
            itemEmManutencao.value.configuracaoFiscal = {
                temIcms: false,
                temPartilhaIcms: false,
                temRepasseIcms: false,
                temIcmsParaUfDestino: false,
                temIpi: false,
                temII: false,
                temPis: false,
                temPisSt: false,
                temCofins: false,
                temCofinsSt: false
            };
        } else {
            itemEmManutencao.value.tributacaoIcms.configuracaoFiscalIcms = itemEmManutencao.value.configuracaoFiscal.configuracaoFiscalIcms;
            itemEmManutencao.value.ipi.configuracaoFiscalIpi = itemEmManutencao.value.configuracaoFiscal.configuracaoFiscalIpi;
            itemEmManutencao.value.pis.configuracaoFiscalPis = itemEmManutencao.value.configuracaoFiscal.configuracaoFiscalPis;
            itemEmManutencao.value.cofins.configuracaoFiscalCofins = itemEmManutencao.value.configuracaoFiscal.configuracaoFiscalCofins;
        }
    } catch (error) {
        itemEmManutencao.value.configuracaoFiscal = {
            temIcms: false,
            temPartilhaIcms: false,
            temRepasseIcms: false,
            temIcmsParaUfDestino: false,
            temIpi: false,
            temII: false,
            temPis: false,
            temPisSt: false,
            temCofins: false,
            temCofinsSt: false
        };
        toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Não foi encontrado configuração fiscal para o item.', life: 5000 });
    }
};

const changeItem = async (object) => {
    if (object) {
        itemEmManutencao.value.detalhamentoItem.item = object;
        itemEmManutencao.value.tributacaoIcms = {};
        await getConfiguracaoFiscal();
    } else {
        itemEmManutencao.value.detalhamentoItem.item = {};
        itemEmManutencao.value.tributacaoIcms = {};
        itemEmManutencao.value.configuracaoFiscal = {
                temIcms: false,
                temPartilhaIcms: false,
                temRepasseIcms: false,
                temIcmsParaUfDestino: false,
                temIpi: false,
                temII: false,
                temPis: false,
                temPisSt: false,
                temCofins: false,
                temCofinsSt: false
            };
    }
};

const changeCfop = async (object) => {
    if (object) {
        itemEmManutencao.value.detalhamentoItem.cfop = object;
        itemEmManutencao.value.tributacaoIcms = {};
        await getConfiguracaoFiscal();
    } else {
        itemEmManutencao.value.detalhamentoItem.cfop = {};
        itemEmManutencao.value.tributacaoIcms = {};
        itemEmManutencao.value.configuracaoFiscal = {
                temIcms: false,
                temPartilhaIcms: false,
                temRepasseIcms: false,
                temIcmsParaUfDestino: false,
                temIpi: false,
                temII: false,
                temPis: false,
                temPisSt: false,
                temCofins: false,
                temCofinsSt: false
            };
    }
};

const changeQuantidade = () => {
    changePercentualDesconto();
};

const changePercentualDesconto = () => {
    itemEmManutencao.value.detalhamentoItem.valorDesconto = ((subTotal.value * itemEmManutencao.value.detalhamentoItem.percentualDesconto) / 100) || 0;
};

const changeValorDesconto = () => {
    itemEmManutencao.value.detalhamentoItem.percentualDesconto = ((itemEmManutencao.value.detalhamentoItem.valorDesconto * 100) / subTotal.value) || 0;
};

const changeValorUnitario = () => {
    changePercentualDesconto();
}
const showDialog = () => {
    seletorCfop.value.reload(itemEmManutencao.value.detalhamentoItem.cfopId)
}
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
                                <Column field="detalhamentoItem.item.codigo" header="Código" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                                <Column field="detalhamentoItem.item.nome" header="Nome" style="width: 30%; text-align: left" headerClass="columnHeaderItem"> </Column>
                                <Column field="detalhamentoItem.cfop.codigo" header="Cfop" style="width: 3%" headerClass="columnHeaderItem"> 
                                    <template #body="slotProps">
                                        <div class="w-full text-center">{{ slotProps.data.detalhamentoItem.cfop?.codigo }}</div>
                                    </template>template>
                                </Column>
                                <Column field="detalhamentoItem.item.unidadeMedidaComercialNome" header="U.M." style="width: 3%" headerClass="columnHeaderItem"> 
                                    <template #body="slotProps">
                                        <div class="w-full text-center">{{ slotProps.data.detalhamentoItem.item.unidadeMedidaComercialNome }}</div>
                                    </template>template>                                
                                </Column>
                                <Column field="detalhamentoItem.quantidade" header="Qtde" style="width: 4%" headerClass="columnHeaderItem"> 
                                    <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.detalhamentoItem.quantidade, 0)}}</div>
                                    </template>template>
                                </Column>
                                <Column field="detalhamentoItem.valorUnitario" header="Valor Unitário" style="width: 5%" headerClass="columnHeaderItem"> 
                                    <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.detalhamentoItem.valorUnitario, 2)}}</div>
                                    </template>template>
                                </Column>
                                <Column field="detalhamentoItem.percentualDesconto" header="% Desc." style="width: 3%" headerClass="columnHeaderItem"> 
                                    <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.detalhamentoItem.percentualDesconto, 2)}}</div>
                                    </template>template>
                                </Column>
                                <Column field="detalhamentoItem.valorDesconto" header="Valor Desc." style="width: 4%" headerClass="columnHeaderItem"> 
                                    <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.detalhamentoItem.valorDesconto, 2)}}</div>
                                    </template>template>
                                </Column>
                                <Column field="detalhamentoItem.valorTotal" header="Valor Total" style="width: 7%" headerClass="columnHeaderItem"> 
                                    <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{formatNumber(slotProps.data.detalhamentoItem.valorTotal, 2)}}</div>
                                    </template>template>
                                </Column>
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
                        <Message class="col-12 p-0 m-0" :closable="false" severity="warn" v-if="temErro(errors?.value, 'itens[')">Atenção! Existem itens da nfe com pendências nas informações informadas.</Message>
                    </div>
                </div>

                <Dialog v-model:visible="visibleDialog" :style="{ width: '90%' }" header="Detalhamento do Item" :modal="true" :closable="false"
                @show="showDialog()">
                    <Divider class="m-0" />
                    <div class="col-12 pb-0 mb-0">
                        <div class="grid nested-grid">
                            <div class="col-12">
                                <div class="col-12">
                                    <UWFieldSet title="Dados do Produto / Serviço" class="h-full">
                                        <div class="p-fluid formgrid grid">
                                            <UWSeletorItem
                                                id="produto"
                                                v-model="itemEmManutencao.detalhamentoItem.itemId"
                                                classContainer="col-12 md:col-4"
                                                required
                                                autofocus
                                                label="Produto / Serviço"
                                                @changeObject="changeItem"
                                                :erros="_.get(errors?.value, `itens[${indexSelecionado}].detalhamentoItem.itemId`, null)"
                                            />
                                            <UWInput id="ncm" label="Ncm" v-model="itemEmManutencao.detalhamentoItem.item.ncmCodigo" disabled classContainer="col-12 md:col-1" />
                                            <UWInput id="origemProduto" label="Origem do Produto" v-model="itemEmManutencao.detalhamentoItem.item.origemNome" uppercase disabled classContainer="col-12 md:col-3" />
                                            <UWSeletorCfopByOpInt
                                                id="cfop"
                                                ref="seletorCfop"
                                                v-model="itemEmManutencao.detalhamentoItem.cfopId"
                                                :operacaoInternaId="props.dadosAuxiliares.operacaoInternaId"
                                                classContainer="col-12 md:col-4"
                                                :erros="_.get(errors?.value, `itens[${indexSelecionado}].detalhamentoItem.cfopId`, null)"
                                                required
                                                label="Cfop"
                                                @changeObject="changeCfop"
                                            />
                                        </div>
                                        <div class="col-12">
                                            <UWFieldSet title="Quantidade e Valores do Item" class="h-full surface-200">
                                                <div class="flex gap-0 flex-row justify-content-center align-content-end p-fluid formgrid grid">
                                                    <UWInput id="unidadeMedidaComercial" v-model="itemEmManutencao.detalhamentoItem.item.unidadeMedidaComercialNome" label="Unidade de Medida" uppercase disabled classContainer="col-12 md:col-2" />
                                                    <UWDecimal id="quantidade" label="Quantidade" v-model="itemEmManutencao.detalhamentoItem.quantidade" :maximoDigitos="5" classContainer="col-12 md:col-2" 
                                                    @onChange="changeQuantidade"/>
                                                    <UWCurrency id="valorUnitario" label="Valor Unitário" v-model="itemEmManutencao.detalhamentoItem.valorUnitario" classContainer="col-12 md:col-2" 
                                                    @onChange="changeValorUnitario"/>
                                                    <UWCurrency id="valorTotalBrutoItem" label="Valor Total Bruto" v-model="subTotal" disabled classContainer="col-12 md:col-2" />
                                                    <UWDecimal
                                                        id="percentualDesconto"
                                                        v-model="itemEmManutencao.detalhamentoItem.percentualDesconto"
                                                        label="% Desc."
                                                        :maximoDigitos="2"
                                                        @onChange="changePercentualDesconto()"
                                                        classContainer="col-12 md:col-2"
                                                    />
                                                    <UWCurrency id="valorDesconto" v-model="itemEmManutencao.detalhamentoItem.valorDesconto" label="Valor Desc." classContainer="col-12 md:col-2" @onChange="changeValorDesconto()" />
                                                    <UWCurrency id="valorFrete" label="Valor Frete" v-model="itemEmManutencao.detalhamentoItem.valorFrete" classContainer="col-12 md:col-2" />
                                                    <UWCurrency id="valorSeguro" label="Valor Seguro" v-model="itemEmManutencao.detalhamentoItem.valorSeguro" classContainer="col-12 md:col-2" />
                                                    <UWCurrency id="valorOutrasDespesas" label="Outras Desp." v-model="itemEmManutencao.detalhamentoItem.valorOutrasDespesas" classContainer="col-12 md:col-2" />
                                                    <UWCurrency id="valorTotalBrutoItem" label="Valor Total" v-model="valorTotal" disabled classContainer="col-12 md:col-2" />
                                                </div>
                                            </UWFieldSet>
                                        </div>
                                        <UWTextArea id="infoAdicionais" v-model="itemEmManutencao.infoAdicionais" label="Informações Adicionais do Item" uppercase classContainer="col-12 md:col-12" />
                                    </UWFieldSet>
                                </div>
                                <!-- <Accordion v-if="temTributacao()" :activeIndex="0" expandIcon="pi pi-plus" collapseIcon="pi pi-minus" class="col-12"> -->
                                    <!-- <AccordionTab> -->
                                        <!-- <template #header> -->
                                            <!-- <span class="flex align-items-center gap-2 w-full"> -->
                                                <!-- <i class="pi pi-percentage" style="font-size: 1rem"></i> -->
                                                <!-- <span class="font-bold white-space-nowrap">Tributações</span> -->
                                                <!-- <Badge value="3" class="ml-auto mr-2" /> -->
                                            <!-- </span> -->
                                        <!-- </template> -->
                                        <TabView class="col-12">
                                            <TabPanel header="ICMS" v-if="itemEmManutencao.configuracaoFiscal.temIcms">
                                                <Icms00 v-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 0" v-model="itemEmManutencao" />
                                                <Icms10 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 10" v-model="itemEmManutencao" />
                                                <Icms20 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 20" v-model="itemEmManutencao" />
                                                <Icms30 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 30" v-model="itemEmManutencao" />
                                                <Icms40 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 40" v-model="itemEmManutencao" />
                                                <Icms41 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 41" v-model="itemEmManutencao" />
                                                <Icms50 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 50" v-model="itemEmManutencao" />
                                                <Icms51 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 51" v-model="itemEmManutencao" />
                                                <Icms60 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 60" v-model="itemEmManutencao" />
                                                <Icms70 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 70" v-model="itemEmManutencao" />
                                                <Icms90 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 90" v-model="itemEmManutencao" />

                                                <Cson101 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 101" v-model="itemEmManutencao" />
                                                <Cson102 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 102" v-model="itemEmManutencao" />
                                                <Cson103 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 103" v-model="itemEmManutencao" />
                                                <Cson201 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 201" v-model="itemEmManutencao" />
                                                <Cson202 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 202" v-model="itemEmManutencao" />
                                                <Cson203 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 203" v-model="itemEmManutencao" />
                                                <Cson300 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 300" v-model="itemEmManutencao" />
                                                <Cson400 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 400" v-model="itemEmManutencao" />
                                                <Cson500 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 500" v-model="itemEmManutencao" />
                                                <Cson900 v-else-if="itemEmManutencao.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaCodigo === 900" v-model="itemEmManutencao" />
                                            </TabPanel>
                                            <!-- <TabPanel header="Partilha de Icms" v-if="configuracaoFiscal.temPartilhaIcms">
                                                <PartilhaIcms v-if="itemEmManutencao.tributacaoIcms.grupoTributacao === 'Partilha'" v-model="itemEmManutencao" />
                                            </TabPanel> -->
                                            <!-- <TabPanel header="Repasse de Icms" v-if="configuracaoFiscal.temRepasseIcms">
                                                <RepasseIcms v-if="itemEmManutencao.tributacaoIcms.grupoTributacao === 'Repasse'" v-model="itemEmManutencao" />
                                            </TabPanel> -->
                                            <!-- <TabPanel header="ICMS para a UF de destino" v-if="configuracaoFiscal.temIcmsParaUfDestino">
                                                <IcmsUfOutroDestino v-model="itemEmManutencao" />
                                            </TabPanel> -->
                                            <TabPanel header="IPI" v-if="itemEmManutencao.configuracaoFiscal.temIpi">
                                                <Ipi v-model="itemEmManutencao" />
                                            </TabPanel>
                                            <!-- <TabPanel header="Imposto de Importação" v-if="configuracaoFiscal.temII">
                                                <II v-model="itemEmManutencao" />
                                            </TabPanel> -->
                                            <TabPanel header="PIS" v-if="itemEmManutencao.configuracaoFiscal.temPis">
                                                <PIS v-model="itemEmManutencao" />
                                            </TabPanel>
                                            <TabPanel header="COFINS" v-if="itemEmManutencao.configuracaoFiscal.temCofins">
                                                <Cofins v-model="itemEmManutencao" />
                                            </TabPanel>
                                            <TabPanel header="COFINS ST" v-if="itemEmManutencao.configuracaoFiscal.temCofinsSt">
                                                <CofinsST v-model="itemEmManutencao" />
                                            </TabPanel>
                                        </TabView>
                                    <!-- </AccordionTab> -->
                                <!-- </Accordion> -->
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
