<script setup>
import { ref, computed } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { TipoIncentivoFiscalService } from '@/service';

const confirm = useConfirm();
const toast = useToast();

const visibleDialog = ref(false);
const modeDialog = ref('')
const indexTipoIncentFiscalEdicao = ref(0);

const formData = ref({
    tipoIncentivoFiscalId: undefined,
    dataInicioVigencia: undefined,
    dataFinalVigencia: undefined
});

const props = defineProps({
    modelValue: {}
});

const createSchema = () => {
    return yup.object().shape({
        tipoIncentivoFiscalId: yup.number().required('Tipo de Incentivo Fiscal é obrigatório.'),
        dataInicioVigencia: yup.date().required('Data Início Vigência é obrigatório.'),
        dataFinalVigencia: yup.date().required('Data Final Vigência é obrigatório.'),
    });
};

const emit = defineEmits(['update:modelValue']);

const tipoIncentFicalsModelValue = computed({
    get: () => props.modelValue || [],
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const adicionarTipoIncentFiscal = () => {
    formData.value = {
        tipoIncentivoFiscalId: undefined,
        dataInicioVigencia: undefined,
        dataFinalVigencia: undefined
    };
    modeDialog.value = 'add';
    visibleDialog.value = true;
};

const confirmarTipoIncentFiscal = async () => {
    if (modeDialog.value === 'add') {
        tipoIncentFicalsModelValue.value.push({ ...formData.value });
    } else {
        tipoIncentFicalsModelValue.value[indexTipoIncentFiscalEdicao.value] = { ...formData.value };
    }
    console.log(tipoIncentFicalsModelValue.value)
    visibleDialog.value = false;
};

const handleVoltar = () => {
    visibleDialog.value = false;
};

const handleEdit = (slot) => {
    indexTipoIncentFiscalEdicao.value = slot.index;
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
            tipoIncentFicalsModelValue.value = tipoIncentFicalsModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Tipo de Incentivo Fiscal removido com sucesso', life: 5000 });
        },
        reject: () => {

        }
    });
};

</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <div class="col-12">
        <Toolbar>
            <template v-slot:start>
                <div>
                    <Button label="Adicionar Tipo de Incentivo Fiscal" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarTipoIncentFiscal()" />
                </div>
            </template>
        </Toolbar>
        <DataTable ref="dtTipoIncentFiscal" :value="tipoIncentFicalsModelValue" responsiveLayout="scroll">
            <template #empty> Nenhum Tipo de Incentivo Fiscal informado. </template>

            <Column field="tipoIncentivoFiscalId" header="Identificador" style="width: 12%"> </Column>
            <Column field="tipoIncentivoFiscalNome" header="Tipo de Incentivo Fiscal" style="width: 35%"> </Column>
            <Column header="Início Vigência" style="width: 15%">
                <template #body="slotProps">
                    <Calendar v-model="slotProps.row.dataInicioVigencia" dateFormat="dd/mm/yy" />
                </template>
            </Column>
            <Column header="Final Vigência" style="width: 15%">
                <template #body="slotProps">
                    <Calendar v-model="slotProps.row.dataFinalVigencia" dateFormat="dd/mm/yy" />
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

    <Dialog v-model:visible="visibleDialog" :style="{ width: '70%' }" header="Detalhes da Tipo de Incentivo Fiscal" :modal="true">
        <UWForm :schema="createSchema()" :values="formData" visibleVoltar visibleConfirmar :visibleSave="false" :visibleCancel="false" @doVoltar="handleVoltar()" @doSubmit="confirmarTipoIncentFiscal" labelSalvar="Adicionar">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWSeletor 
                                id="seletorTipoIncentivoFiscal" 
                                label="Tipo de Incentivo Fiscal" 
                                v-model="formData.tipoIncentivoFiscalId" 
                                optionLabel="nome" 
                                optionValue="id" 
                                placeholder="Selecione o Tipo de Incentivo Fiscal" 
                                :service="TipoIncentivoFiscalService" 
                                classContainer="col-12 md:col-12"
                                :erros="errors?.value?.tipoIncentivoFiscalId"
                            >
                        </UWSeletor>  
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-3" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-3" />
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>

</template>
