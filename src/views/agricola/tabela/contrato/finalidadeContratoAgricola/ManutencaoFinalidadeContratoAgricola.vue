<script setup>
import { reactive, computed, defineProps } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { FinalidadeContratoAgricolaService as Service } from '@/service';

const schema = yup.object().shape({
    codigo: yup.number().required('Código é obrigatório.'),
    nome: yup.string().required('Nome é obrigatório.').max(120, 'Nome deve ter no máximo 120 caracteres.'),
    sigla: yup.string().required('Sigla é obrigatório.').max(20, 'Sigla deve ter no máximo 20 caracteres.'),
    dataInicioVigencia: yup.date().required('Data Início Vigência é obrigatório.')
        .nullable()
        .max(yup.ref('dataFinalVigencia'), 'Data de início de vigência deve ser menor que a data final.'),
    dataFinalVigencia: yup.date().required('Data Final Vigência é obrigatório.')
        .nullable()
        .min(yup.ref('dataInicioVigencia'), 'Data final de vigência deve ser maior que a data inicial.')

});

const props = defineProps({
    showDialog: {
        type: Boolean,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(['closeDialog']);

const toast = useToast();

const formData = reactive({
    nome: undefined
});

const showDialogComputed = computed({
    get: () => props.showDialog,
    set: (value) => {
        emit('update:showDialog', value);
    }
});

const hideDialog = () => {
    emit('closeDialog');
};

const criarRegistro = () => {
    Service.create(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Finalidade de contrato agrícola criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a finalidade de contrato agrícola.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Finalidade de contrato agrícola alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a finalidade de contrato agrícola.', life: 5000 });
        });
};

const salvarRegistro = async () => {
    if (props.mode === 'create') {
        criarRegistro();
    } else {
        alterarRegistro();
    }
};

const showModal = async () => {
    if (props.mode === 'create') {
        formData.nome = undefined;
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
        });
    }
};

const getProximoCodigo = () => {
    Service.getProximoCodigo()
        .then((data) => {
            formData.codigo = data;
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível obter o próximo código.', life: 5000 });
        });
};

</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '40%' }" :header="mode === 'create' ? 'Nova Finalidade de Contrato Agrícola' : 'Alterar Finalidade de Contrato Agrícola'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formFinalidadeContratoAgricola" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInteger id="codigo" label="Código" required autofocus v-model="formData.codigo" :showButton="true" @clickButton="getProximoCodigo" :errors="errors.value?.codigo" classContainer="col-12 md:col-4" />
                        <UWInput id="sigla" label="Sigla" required v-model="formData.sigla" :errors="errors.value?.sigla" classContainer="col-12 md:col-3" />
                        <UWInput id="nome" label="Nome" required v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-9" />
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-6" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-6" />                        
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
