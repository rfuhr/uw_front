<script setup>
import { ref, computed } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';

const props = defineProps({
    modelValue: []
});

const confirm = useConfirm();
const toast = useToast();

const createSchema = () => {
    return yup.object().shape({
        identificacao: yup.string().required('Identificação do email é obrigatório.'),
    });
};

const emit = defineEmits(['update:modelValue']);

const propriedadesModelValue = computed({
    get: () => props.modelValue || [],
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const visibleDialog = ref(false);

const formData = ref({
    identificacao: undefined
});

const modeDialog = ref('')
const indexPropriedadeEdicao = ref(0);

const adicionarPropriedade = () => {
    formData.value = {
        identificacao: undefined
    };
    modeDialog.value = 'add';
    visibleDialog.value = true;
};

const handleVoltar = () => {
    visibleDialog.value = false;
};

const confirmarPropriedade = async () => {
    if (modeDialog.value === 'add') {
        propriedadesModelValue.value.push({ ...formData.value });
    } else {
        propriedadesModelValue.value[indexPropriedadeEdicao.value] = { ...formData.value };
    }
    visibleDialog.value = false;
};

const handleEdit = (slot) => {
    indexPropriedadeEdicao.value = slot.index;
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
            propriedadesModelValue.value = propriedadesModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Propriedade removida com sucesso', life: 5000 });
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
                    <Button label="Adicionar Propriedade" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarPropriedade()" />
                </div>
            </template>
        </Toolbar>
        <DataTable ref="dtPropriedades" :value="propriedadesModelValue" responsiveLayout="scroll">
            <template #empty> Nenhuma propriedade informada. </template>

            <Column field="identificacao" header="Identificação" style="width: 15%"> </Column>
            <Column header="Ações" style="width: 10%">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="handleEdit(slotProps)" />
                    <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDelete($event, slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="visibleDialog" :style="{ width: '50%' }" header="Detalhes da Propriedade" :modal="true">
        <UWForm :schema="createSchema()" :values="formData" visibleVoltar visibleConfirmar :visibleSave="false" :visibleCancel="false" @doVoltar="handleVoltar()" @doSubmit="confirmarPropriedade" labelSalvar="Adicionar">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInput id="identificacao" label="Identificação" uppercase required autofocus v-model="formData.identificacao" :errors="errors.value?.identificacao" classContainer="col-12 md:col-9" />
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
