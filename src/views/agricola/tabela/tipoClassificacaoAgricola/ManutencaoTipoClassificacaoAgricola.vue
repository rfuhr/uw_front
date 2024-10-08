<script setup>
import { reactive, computed, defineProps } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { TipoClassificacaoAgricolaService as Service } from '@/service';

const schema = yup.object().shape({
    nome: yup.string().required('Nome é obrigatório.').max(120, 'Nome deve ter no máximo 120 caracteres.'),
    codigo: yup.number().required('Código é obrigatório.'),
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
    nome: undefined,
    codigo: undefined
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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Tipo de Classificação Agrícola criado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar o Tipo de Classificação Agrícola.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Tipo de Classificação Agrícola alterado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar o Tipo de Classificação Agrícola.', life: 5000 });
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
        formData.codigo = undefined;
        formData.transferencia = false;
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
        });
    }
};
</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '40%' }" :header="mode === 'create' ? 'Novo Tipo de Classificação Agrícola' : 'Alterar Tipo de Classificação Agrícola'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formTipoClassificacaoAgricola" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInput id="codigo" label="Código" required autofocus v-model="formData.codigo" :errors="errors.value?.codigo" classContainer="col-12 md:col-4" />
                        <UWInput id="nome" label="Nome" required v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-12" />   
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
