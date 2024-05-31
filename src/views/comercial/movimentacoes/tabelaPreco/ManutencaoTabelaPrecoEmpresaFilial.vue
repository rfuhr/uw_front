<!-- eslint-disable vue/no-deprecated-filter -->
<script setup>
import { ref, computed } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { EmpresaFilialService } from '@/service';

const confirm = useConfirm();
const toast = useToast();

const visibleDialog = ref(false);
const modeDialog = ref('')
const indexFilialEdicao = ref(0);

const formData = ref({
    empresaFilialId: undefined
});

const props = defineProps({
    modelValue: []
});

const createSchema = () => {
    return yup.object().shape({
        empresaFilialId: yup.number().required('Item é obrigatório.')
    });
};

const emit = defineEmits(['update:modelValue']);

const filiaisModelValue = computed({
    get: () => props.modelValue || [],
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const adicionarFilial = () => {
    formData.value = {
        empresaFilialId: undefined
    };
    modeDialog.value = 'add';
    visibleDialog.value = true;
};

const confirmarFilial = async () => {
    if (modeDialog.value === 'add') {
        const filial = filiaisModelValue.value.filter((item) => item.empresaFilialId === formData.value.empresaFilialId);
        if (filial.length > 0) {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Não é possível incluir a Filial, pois o mesmo já possui uma Filial nessa Tabela de Preço.', life: 5000 });
            return
        } else {
            filiaisModelValue.value.push({ ...formData.value });
        }
    } else {
        filiaisModelValue.value[indexFilialEdicao.value] = { ...formData.value };
    }
    emit('update:modelValue', filiaisModelValue.value);
    visibleDialog.value = false;
};

const handleVoltar = () => {
    visibleDialog.value = false;
};

const handleEdit = (slot) => {
    indexFilialEdicao.value = slot.index;
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
            const listaFiltrada = filiaisModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Filial removida com sucesso', life: 5000 });
            emit('update:modelValue', listaFiltrada);
        },
        reject: () => {

        }
    });
};

const changeFilial = async (event) => {
    if (!event) {
        formData.value.empresaFilialNome = ''
    } else {
        formData.value.empresaFilialNome = event.nome
    }
}

</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <div class="col-12">
        <Toolbar>
            <template v-slot:start>
                <div>
                    <Button label="Adicionar Filial" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarFilial()" />
                </div>
            </template>
        </Toolbar>
        <DataTable 
            id="dtFiliais" 
            ref="dtFiliais" 
            :value="filiaisModelValue" 
            responsiveLayout="scroll"
            >
            <template #empty> Nenhuma Filial informada. </template>

            <Column field="empresaFilialId" header="Identificador" style="width: 12%"> </Column>
            <Column field="empresaFilialNome" header="Filial" style="width: 30%"> </Column>

            <Column header="Ações" style="width: 10%">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="handleEdit(slotProps)" />
                    <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDelete($event, slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="visibleDialog" :style="{ width: '80%' }" header="Detalhes da Filial" :modal="true">
        <UWForm :schema="createSchema()" :values="formData" visibleVoltar visibleConfirmar :visibleSave="false" :visibleCancel="false" @doVoltar="handleVoltar()" @doSubmit="confirmarFilial" labelSalvar="Adicionar">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWSeletor 
                                id="seletorFilial" 
                                label="Filial" 
                                v-model="formData.empresaFilialId" 
                                required
                                optionLabel="nome" 
                                optionValue="id" 
                                placeholder="Selecione a Filial" 
                                :service="EmpresaFilialService" 
                                classContainer="col-12 md:col-12"
                                :erros="errors?.value?.empresaFilialId"
                                @changeObject="changeFilial"
                            >
                        </UWSeletor>  
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>

</template>
