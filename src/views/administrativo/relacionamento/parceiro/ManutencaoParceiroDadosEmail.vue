<script setup>
import { ref, computed } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import { validateEmail } from 'validations-br';

const props = defineProps({
    modelValue: []
});

const confirm = useConfirm();
const toast = useToast();

const createSchema = () => {
    return yup.object().shape({
        tipoEmail: yup.string().required('Tipo de Email é obrigatório.').oneOf(['NFE', 'DIV'], 'Tipo de Email deve ser uma opção válida'),
        identificacao: yup.string().required('Identificação do email é obrigatório.'),
        email: yup
            .string()
            .required('Email é obrigatório.')
            .test('is-email', 'Email inválido.', (value) => {
                return value === '' || validateEmail(value);
            })
    });
};

const emit = defineEmits(['update:modelValue']);

const emailsModelValue = computed({
    get: () => props.modelValue || [],
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const visibleDialog = ref(false);

const tiposEmail = ref([
    { name: 'Diversos', value: 'DIV' },
    { name: 'Nota Fiscal Eletrônica', value: 'NFE' },
]);

const formData = ref({
    tipoEmail: undefined
});

const modeDialog = ref('')
const indexEmailEdicao = ref(0);

const getConstantTipoEmail = (value) => {
    return tiposEmail.value.find((item) => item.value === value).name;
};

const adicionarEmail = () => {
    formData.value = {
        tipoEmail: 'DIV',
        tipoTelefoneNome: 'Diversos'
    };
    modeDialog.value = 'add';
    visibleDialog.value = true;
};

const handleVoltar = () => {
    visibleDialog.value = false;
};

const confirmarEmail = async () => {
    if (modeDialog.value === 'add') {
        emailsModelValue.value.push({ ...formData.value });
    } else {
        emailsModelValue.value[indexEmailEdicao.value] = { ...formData.value };
    }
    visibleDialog.value = false;
};

const handleEdit = (slot) => {
    indexEmailEdicao.value = slot.index;
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
            emailsModelValue.value = emailsModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Email removido com sucesso', life: 5000 });
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
                    <Button label="Adicionar Email" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarEmail()" />
                </div>
            </template>
        </Toolbar>
        <DataTable ref="dtEmails" :value="emailsModelValue" responsiveLayout="scroll">
            <template #empty> Nenhum email informado. </template>

            <Column header="Tipo de Email" style="width: 10%"> 
                <template #body="slotProps">
                    <span>{{ getConstantTipoEmail(slotProps.data.tipoEmail) }} </span>
                </template>            
            </Column>
            <Column field="identificacao" header="Identificação" style="width: 15%"> </Column>
            <Column field="email" header="Email" style="width: 55%">
            </Column>
            <Column header="Ações" style="width: 10%">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="handleEdit(slotProps)" />
                    <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDelete($event, slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="visibleDialog" :style="{ width: '50%' }" header="Detalhes do Email" :modal="true">
        <UWForm :schema="createSchema()" :values="formData" visibleVoltar visibleConfirmar :visibleSave="false" :visibleCancel="false" @doVoltar="handleVoltar()" @doSubmit="confirmarEmail" labelSalvar="Adicionar">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWPickList id="tipoEmail" label="Tipo do Email" v-model="formData.tipoEmail" optionLabel="name" optionValue="value" required :options="tiposEmail" classContainer="col-12 md:col-3" />
                        <UWInput id="identificacao" label="Identificação" uppercase required autofocus v-model="formData.identificacao" :errors="errors.value?.identificacao" classContainer="col-12 md:col-9" />
                        <UWInput id="email" label="Email" type="email" required lowercase autofocus v-model="formData.email" :errors="errors.value?.email" classContainer="col-12 md:col-9" />
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
