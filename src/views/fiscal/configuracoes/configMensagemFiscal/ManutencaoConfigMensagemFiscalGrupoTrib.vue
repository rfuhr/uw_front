<script setup>
import { ref, computed } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { GrupoTributacaoService } from '@/service';

const confirm = useConfirm();
const toast = useToast();

const visibleDialog = ref(false);
const modeDialog = ref('')
const indexGrupoTribEdicao = ref(0);

const formData = ref({
    grupoTributacaoId: undefined,
    dataInicioVigencia: undefined,
    dataFinalVigencia: undefined
});

const props = defineProps({
    modelValue: {}
});

const createSchema = () => {
    return yup.object().shape({
        grupoTributacaoId: yup.number().required('Grupo de Tributação é obrigatório.'),
        dataInicioVigencia: yup.date().required('Data Início Vigência é obrigatório.'),
        dataFinalVigencia: yup.date().required('Data Final Vigência é obrigatório.'),
    });
};

const emit = defineEmits(['update:modelValue']);

const grupoTribsModelValue = computed({
    get: () => props.modelValue || [],
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const adicionarGrupoTrib = () => {
    formData.value = {
        grupoTributacaoId: undefined,
        dataInicioVigencia: undefined,
        dataFinalVigencia: undefined
    };
    modeDialog.value = 'add';
    visibleDialog.value = true;
};

const confirmarGrupoTrib = async () => {
    if (modeDialog.value === 'add') {
        grupoTribsModelValue.value.push({ ...formData.value });
    } else {
        grupoTribsModelValue.value[indexGrupoTribEdicao.value] = { ...formData.value };
    }
    console.log(grupoTribsModelValue.value)
    visibleDialog.value = false;
};

const handleVoltar = () => {
    visibleDialog.value = false;
};

const handleEdit = (slot) => {
    indexGrupoTribEdicao.value = slot.index;
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
            grupoTribsModelValue.value = grupoTribsModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Grupo de Tributação removido com sucesso', life: 5000 });
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
                    <Button label="Adicionar Grupo de Tributação" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarGrupoTrib()" />
                </div>
            </template>
        </Toolbar>
        <DataTable ref="dtGrupoTrib" :value="grupoTribsModelValue" responsiveLayout="scroll">
            <template #empty> Nenhum Grupo de Tributação informado. </template>

            <Column field="grupoTributacaoId" header="Identificador" style="width: 12%"> </Column>
            <Column field="grupoTributacaoNome" header="Grupo de Tributação" style="width: 35%"> </Column>
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

    <Dialog v-model:visible="visibleDialog" :style="{ width: '70%' }" header="Detalhes da Grupo de Tributação" :modal="true">
        <UWForm :schema="createSchema()" :values="formData" visibleVoltar visibleConfirmar :visibleSave="false" :visibleCancel="false" @doVoltar="handleVoltar()" @doSubmit="confirmarGrupoTrib" labelSalvar="Adicionar">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWSeletor 
                                id="seletorGrupoTributacao" 
                                label="Grupo de Tributação" 
                                v-model="formData.grupoTributacaoId" 
                                optionLabel="nome" 
                                optionValue="id" 
                                placeholder="Selecione o Grupo de Tributação" 
                                :service="GrupoTributacaoService" 
                                classContainer="col-12 md:col-12"
                                :erros="errors?.value?.grupoTributacaoId"
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
