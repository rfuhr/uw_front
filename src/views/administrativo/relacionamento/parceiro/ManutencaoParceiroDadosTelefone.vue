<script setup>
import { ref, computed } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import { validatePhone } from 'validations-br';

const props = defineProps({
    modelValue: []
});

const confirm = useConfirm();
const toast = useToast();

const createSchema = () => {
    return yup.object().shape({
        tipoTelefone: yup.string().required('Tipo de Telefone é obrigatório.').oneOf(['COM', 'REC', 'RES', 'ZAP'], 'Tipo de Telefone deve ser uma opção válida'),
        identificacao: yup.string().required('Identificação do telefone é obrigatório.'),
        numero: yup
            .string()
            .required('Número é obrigatório.')
            .test('is-numero', 'Número inválido.', (value) => {
                return value === '' || validatePhone(value);
            }),
        falar: yup.string(),
    });
};

const emit = defineEmits(['update:modelValue']);

const telefonesModelValue = computed({
    get: () => props.modelValue || [],
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const visibleDialog = ref(false);

const tiposTelefone = ref([
    { name: 'Comercial', value: 'COM' },
    { name: 'Recado', value: 'REC' },
    { name: 'Residencial', value: 'RES' },
    { name: 'Whatsapp', value: 'ZAP' }
]);

const formData = ref({
    tipoTelefone: undefined
});

const modeDialog = ref('')
const indexTelefoneEdicao = ref(0);

const getConstantTipoTelefone = (value) => {
    return tiposTelefone.value.find((item) => item.value === value).name;
};

const adicionarTelefone = () => {
    formData.value = {
        tipoTelefone: 'COM',
        tipoTelefoneNome: 'Comercial'
    };
    modeDialog.value = 'add';
    visibleDialog.value = true;
};

const getTelefoneFormatado = (objetoTelefone) => {
    const telefone = objetoTelefone.numero;
    const formattedTelefone = telefone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    return formattedTelefone;
};

const handleVoltar = () => {
    visibleDialog.value = false;
};

const confirmarTelefone = async () => {
    if (modeDialog.value === 'add') {
        telefonesModelValue.value.push({ ...formData.value });
    } else {
        telefonesModelValue.value[indexTelefoneEdicao.value] = { ...formData.value };
    }
    visibleDialog.value = false;
};

const handleEdit = (slot) => {
    indexTelefoneEdicao.value = slot.index;
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
            telefonesModelValue.value = telefonesModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Telefone removido com sucesso', life: 5000 });
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
                    <Button label="Adicionar Telefone" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarTelefone()" />
                </div>
            </template>
        </Toolbar>
        <DataTable ref="dtTelefones" :value="telefonesModelValue" responsiveLayout="scroll">
            <template #empty> Nenhum telefone informado. </template>

            <Column header="Tipo de Telefone" style="width: 10%"> 
                <template #body="slotProps">
                    <span>{{ getConstantTipoTelefone(slotProps.data.tipoTelefone) }} </span>
                </template>            
            </Column>
            <Column field="identificacao" header="Identificação" style="width: 15%"> </Column>
            <Column header="Telefone" style="width: 25%">
                <template #body="slotProps">
                    <span>{{ getTelefoneFormatado(slotProps.data) }} </span>
                </template>
            </Column>
            <Column field="falar" header="Falar com..." style="width: 15%"> </Column>
            <Column header="Ações" style="width: 10%">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="handleEdit(slotProps)" />
                    <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDelete($event, slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="visibleDialog" :style="{ width: '50%' }" header="Detalhes do Telefone" :modal="true">
        <UWForm :schema="createSchema()" :values="formData" visibleVoltar visibleConfirmar :visibleSave="false" :visibleCancel="false" @doVoltar="handleVoltar()" @doSubmit="confirmarTelefone" labelSalvar="Adicionar">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWPickList id="tipoTelefone" label="Tipo do Telefone" v-model="formData.tipoTelefone" optionLabel="name" optionValue="value" required :options="tiposTelefone" classContainer="col-12 md:col-3" />
                        <UWInput id="identificacao" label="Identificação" uppercase required autofocus v-model="formData.identificacao" :errors="errors.value?.identificacao" classContainer="col-12 md:col-9" />
                        <UWInputMask id="telefone" label="Telefone" :mask="'(99) 99999-9999'" required :unmask="true" v-model="formData.numero" :errors="errors.value?.numero" classContainer="col-12 md:col-3" />
                        <UWInput id="falar" label="Falar com" uppercase autofocus v-model="formData.falar" :errors="errors.value?.falar" classContainer="col-12 md:col-9" />
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
