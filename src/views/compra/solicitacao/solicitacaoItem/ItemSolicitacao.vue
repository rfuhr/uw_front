<script setup>
import { ref, computed, onMounted } from 'vue';
import * as yup from 'yup';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import { useContexto } from '@/stores';
import { DepartamentoService, ItemSimplificadoService, TiposService } from '@/service';

import UWSeletorItem from '@/components/seletores/item/UWSeletorItem.vue';

const props = defineProps({
    modelValue: [],
    informaItemSimplificado: {
        type: Boolean,
        required: true
    },
    isVisualizar: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue']);

const itensModelValue = computed({
    get: () => props.modelValue || [],
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const createSchema = () => {
    return yup.object().shape({
        itemId: props.informaItemSimplificado ? yup.number().nullable() : yup.number().required('Item é obrigatório'),
        itemSimplificadoId: props.informaItemSimplificado ? yup.number().required('Item simplificado é obrigatório') : yup.number().nullable(),
        departamentoEntregaId: yup.number().required('Departamento entrega é obrigatório'),
        quantidadeSolicitada: yup.number().required('Quantidade solicitada é obrigatória').min(1, 'Quantidade solicitada deve ser maior que 0'),
        urgenciaSolicitacaoMercadoria: yup.string().required('Urgência é obrigatória'),
        previsaoDiasUtilizacao: yup.number().required('Previsão de dias de utilização é obrigatória').min(1, 'Previsão de dias de utilização deve ser maior que 0')
    });
};

const contextoStore = useContexto();
const confirm = useConfirm();
const toast = useToast();

const formData = ref({
});
const modeDialog = ref('')
const visibleDialog = ref(false);
const indexItemEdicao = ref(0);
const urgencias = ref([])

const adicionarItem = () => {
    formData.value = {
        quantidadeEnviada: 0,
        quantidadeCancelada: 0,
        dataSolicitacao: new Date(),
    };
    modeDialog.value = 'add';
    visibleDialog.value = true;
};

const handleVoltar = () => {
    visibleDialog.value = false;
};

const confirmarItem = async () => {
    if (modeDialog.value === 'add') {
        itensModelValue.value.push({ ...formData.value });
    } else {
        itensModelValue.value[indexItemEdicao.value] = { ...formData.value };
    }
    visibleDialog.value = false;
};

const handleEdit = (slot) => {
    indexItemEdicao.value = slot.index;
    formData.value = { ...slot.data };
    modeDialog.value = 'edit';
    visibleDialog.value = true;
};

const handleDelete = (event, data) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Deseja excluir este registro?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Excluir',
        accept: () => {
            itensModelValue.value = itensModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Item removido com sucesso', life: 5000 });
        },
        reject: () => {

        }
    });
};

const changeItem = (item) => {
    if (item)
        formData.value.itemNome = item.nome;
    else
        formData.value.itemNome = null;
};

const changeItemSimplificado = (itemSimplificado) => {
    if (itemSimplificado)
        formData.value.itemSimplificadoNome = itemSimplificado.nome;
    else
        formData.value.itemSimplificadoNome = null;
};

const changeDepartamento = (departamento) => {
    if (departamento)
        formData.value.departamentoEntregaNome = departamento.nome
    else
        formData.value.departamentoEntregaNome = null
}

const getNomeItem = (data) => {
    return props.informaItemSimplificado ? data.itemSimplificadoNome : data.itemNome;
};

const getNomeUrgencia = (data) => {
    return urgencias.value.find((u) => u.value === data.urgenciaSolicitacaoMercadoria)?.name;
};


onMounted(() => {
    TiposService.getPrioridadeSolicitacaoItem().then((data) => {
        urgencias.value = data;
    })
});
</script>

<template>
    <ConfirmPopup></ConfirmPopup>
        <Toolbar class="col-12">
            <template v-slot:start>
                <div>
                    <Button v-if="!props.isVisualizar" label="Adicionar Item" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarItem()" />
                </div>
            </template>
        </Toolbar>
        <DataTable ref="dtItens" :value="itensModelValue" responsiveLayout="scroll">
            <template #empty> Nenhum item informado. </template>
            <Column field="item.nome" header="Item">
                <template #body="slotProps">
                    <div class="w-full text-left">{{ getNomeItem(slotProps.data) }}</div> 
                </template>
            </Column>
            <Column field="departamentoEntregaNome" header="Departamento Entrega">
                <template #body="slotProps">
                    <div class="w-full text-left">{{ slotProps.data.departamentoEntregaNome }}</div> 
                </template>
            </Column>                
            <Column field="quantidadeSolicitada" header="Quantidade Solicitada" />
            <Column field="urgenciaSolicitacaoMercadoria" header="Urgência">
                <template #body="slotProps">
                    <div class="w-full text-left">{{ getNomeUrgencia(slotProps.data) }}</div> 
                </template>
            </Column>                
            <Column field="previsaoDiasUtilizacao" header="Previsão Utilização" />
            <Column field="observacao" header="Observação" />
            <Column v-if="!props.isVisualizar" header="Ações" style="width: 10%">
                <template #body="slotProps">
                    <Button v-if="!props.isVisualizar" icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="handleEdit(slotProps)" />
                    <Button v-if="!props.isVisualizar" icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDelete($event, slotProps.data)" />
                </template>
            </Column>            
        </DataTable>

    <Dialog v-model:visible="visibleDialog" :style="{ width: '60%' }" header="Detalhes do Item" :modal="true">
        <UWForm :schema="createSchema()" :values="formData" visibleVoltar visibleConfirmar :visibleSave="false" :visibleCancel="false" @doVoltar="handleVoltar()" @doSubmit="confirmarItem" labelSalvar="Adicionar">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWFieldSet title="Dados do Item" class="col-12">
                            <div class="p-fluid formgrid grid">
                                <UWSeletorItem
                                    v-if="!props.informaItemSimplificado"
                                    id="produto"
                                    v-model="formData.itemId"
                                    classContainer="col-12 md:col-6"
                                    required
                                    autofocus
                                    label="Item"
                                    @changeObject="changeItem"
                                    :erros="errors?.value?.itemId"
                                />
                                <UWSeletor
                                    v-if="props.informaItemSimplificado"
                                    id="itemSimplificado"
                                    classContainer="col-12 md:col-6"
                                    v-model="formData.itemSimplificadoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Item Simplificado"
                                    :service="ItemSimplificadoService"
                                    placeholder="Selecione o item simplificado"
                                    :erros="errors.value?.itemSimplificadoId"
                                    @changeObject="changeItemSimplificado"
                                />
                                <UWSeletor
                                    id="departamento"
                                    classContainer="col-12 md:col-6"
                                    v-model="formData.departamentoEntregaId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Departamento Entrega"
                                    :service="DepartamentoService"
                                    placeholder="Selecione o departamento"
                                    :erros="errors.value?.departamentoEntregaId"
                                    :columnsFilters="[{ field: 'empresaFilial', value: contextoStore.contexto.empresaFilialId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresaFilial.id' }]"
                                    @changeObject="changeDepartamento"
                                />
                                <UWDecimal id="quantidadeSolicitada" label="Quantidade Solicitada" required v-model="formData.quantidadeSolicitada" 
                                :maximoDigitos="5" classContainer="col-12 md:col-3"  :erros="errors.value?.quantidadeSolicitada"/>
                                <UWPickList id="urgencia" label="Urgência" v-model="formData.urgenciaSolicitacaoMercadoria" optionLabel="name" optionValue="value" required :options="urgencias" classContainer="col-12 md:col-6" />
                                <UWInteger id="previsao" label="Previsão Utilização (dias)" required v-model="formData.previsaoDiasUtilizacao" classContainer="col-12 md:col-3" />
                                <UWInput id="observacao" label="Observação" v-model="formData.observacao" classContainer="col-12 md:col-12" :erros="errors.value?.observacao" />
                            </div>
                        </UWFieldSet>
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
