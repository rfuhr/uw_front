<!-- eslint-disable vue/no-deprecated-filter -->
<script setup>
import { ref, computed } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { ItemService } from '@/service';
import moment from 'moment'

const confirm = useConfirm();
const toast = useToast();

const visibleDialog = ref(false);
const modeDialog = ref('')
const indexItemEdicao = ref(0);

const formData = ref({
    itemId: undefined,
    dataInicioVigencia: undefined,
    dataFinalVigencia: undefined,
    valorCusto: 0.00,
    valorMarkup: 0.00,
    valorCalculado: 0.00,
    valorAtual: 0.00,
});

const props = defineProps({
    modelValue: []
});

const createSchema = () => {
    return yup.object().shape({
        itemId: yup.number().required('Item é obrigatório.'),
        dataInicioVigencia: yup.date().required('Data Início Vigência é obrigatório.'),
        dataFinalVigencia: yup.date().required('Data Final Vigência é obrigatório.'),
    });
};

const formataData = (data) => {
    if (data) {
        moment.locale('pt-br')
        return moment(data).format('DD/MM/YYYY')
    }
    return ''
}

const emit = defineEmits(['update:modelValue']);

const itensModelValue = computed({
    get: () => props.modelValue || [],
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const adicionarItem = () => {
    formData.value = {
        itemId: undefined,
        dataInicioVigencia: undefined,
        dataFinalVigencia: undefined,
        valorCusto: 0.00,
        valorMarkup: 0.00,
        valorCalculado: 0.00,
        valorAtual: 0.00,
    };
    modeDialog.value = 'add';
    visibleDialog.value = true;
};

const confirmarItem = async () => {
    if (modeDialog.value === 'add') {
        const item = itensModelValue.value.filter((item) => item.itemId === formData.value.itemId);
        let existe = false;
        if (item.length > 0) {
            itensModelValue.value.map((item) => {
                if ((formData.value.dataInicioVigencia >= new Date(item.dataInicioVigencia) && formData.value.dataInicioVigencia <= new Date(item.dataFinalVigencia))
                    || (formData.value.dataFinalVigencia >= new Date(item.dataInicioVigencia) && formData.value.dataFinalVigencia <= new Date(item.dataFinalVigencia)) 
                    || (formData.value.dataInicioVigencia <= new Date(item.dataInicioVigencia) && formData.value.dataFinalVigencia >= new Date(item.dataFinalVigencia)))
                {
                    existe = true;
                }
            })
            if (existe) {
                toast.add({ severity: 'error', summary: 'Erro', detail: 'Não é possível incluir o Item, pois o mesmo já possui um Item nessa mesma Vigência.', life: 5000 });
                return
            }
        }

        if (!existe) {
            itensModelValue.value.push({ ...formData.value });
        }
    } else {
        itensModelValue.value[indexItemEdicao.value] = { ...formData.value };
    }
    emit('update:modelValue', itensModelValue.value);
    visibleDialog.value = false;
};

const handleVoltar = () => {
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
            const listaFiltrada = itensModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Item removido com sucesso', life: 5000 });
            emit('update:modelValue', listaFiltrada);
        },
        reject: () => {

        }
    });
};

const changeItem = async (event) => {
    if (!event) {
        formData.value.itemCodigo = ''
        formData.value.itemNome = ''
    } else {
        formData.value.itemCodigo = event.codigo
        formData.value.itemNome = event.nome
    }
}

</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <div class="col-12">
        <Toolbar>
            <template v-slot:start>
                <div>
                    <Button label="Adicionar Item" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarItem()" />
                </div>
            </template>
        </Toolbar>
        <DataTable 
            id="dtItens" 
            ref="dtItens" 
            :value="itensModelValue" 
            responsiveLayout="scroll"
            >
            <template #empty> Nenhum Item informado. </template>

            <Column field="itemCodigo" header="Código" style="width: 12%"> </Column>
            <Column field="itemNome" header="Item" style="width: 30%"> </Column>
            <Column field="valor" header="Valor" style="width: 10%"> </Column>
            <Column field="percentualMaximoDesconto" header="% Máx. Desconto" style="width: 10%"> </Column>
            <Column header="Início Vigência" style="width: 10%">
                <template #body="slotProps">
                    <span>{{ formataData(slotProps.data.dataInicioVigencia) }}</span>
                </template>
            </Column>
            <Column header="Final Vigência" style="width: 10%">
                <template #body="slotProps">
                    <span>{{ formataData(slotProps.data.dataFinalVigencia) }}</span>
                </template>
            </Column>

            <Column header="Ações" style="width: 10%">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="handleEdit(slotProps)" />
                    <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDelete($event, slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="visibleDialog" :style="{ width: '80%' }" header="Detalhes do Item" :modal="true">
        <UWForm :schema="createSchema()" :values="formData" visibleVoltar visibleConfirmar :visibleSave="false" :visibleCancel="false" @doVoltar="handleVoltar()" @doSubmit="confirmarItem" labelSalvar="Adicionar">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWSeletor 
                                id="seletorItem" 
                                label="Item" 
                                v-model="formData.itemId" 
                                required
                                optionLabel="nome" 
                                optionValue="id" 
                                placeholder="Selecione o Item" 
                                :service="ItemService" 
                                classContainer="col-12 md:col-12"
                                :erros="errors?.value?.itemId"
                                @changeObject="changeItem"
                            >
                        </UWSeletor> 
                        <UWDecimal id="valorCusto" label="Valor Custo" maximoDigitos="2" disabled v-model="formData.valorCusto" classContainer="col-12 md:col-2" /> 
                        <UWDecimal id="valorMarkup" label="Valor Mark Up" maximoDigitos="2" disabled v-model="formData.valorMarkup" classContainer="col-12 md:col-2" /> 
                        <UWDecimal id="valorCalculado" label="Valor Calculado" maximoDigitos="2" disabled v-model="formData.valorCalculado" classContainer="col-12 md:col-2" /> 
                        <UWDecimal id="valorAtual" label="Valor Atual" maximoDigitos="2" disabled v-model="formData.valorAtual" classContainer="col-12 md:col-3" /> 
                        <UWDecimal id="valor" label="Valor" maximoDigitos="2" required v-model="formData.valor" :errors="errors.value?.valor" classContainer="col-12 md:col-3" /> 
                        <UWDecimal id="percentualMaximoDesconto" label="Percentual Máximo de Desconto" maximoDigitos="3" required v-model="formData.percentualMaximoDesconto" :errors="errors.value?.percentualMaximoDesconto" classContainer="col-12 md:col-4" /> 
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-4" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-4" />
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>

</template>
