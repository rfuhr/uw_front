<script setup>
import { reactive, computed, defineProps } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { BancoService as Service } from '@/service';

const schema = yup.object().shape({
    codigo: yup.number().required('Código é obrigatório.'),
    dv: yup.number().required('Dv é obrigatório.'),
    nome: yup.string().required('Nome é obrigatório.').max(120, 'Nome deve ter no máximo 120 caracteres.'),
    sigla: yup.string().required('Sigla é obrigatório.').max(10, 'Sigla deve ter no máximo 3 caracteres.'),
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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Banco criado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar o banco.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Banco alterado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar o banco.', life: 5000 });
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

</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '40%' }" :header="mode === 'create' ? 'Novo Banco' : 'Alterar Banco'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formBanco" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInteger id="codigo" label="Código" required autofocus v-model="formData.codigo" :errors="errors.value?.codigo" classContainer="col-12 md:col-4" />
                        <UWInput id="dv" label="DV" required v-model="formData.dv" :errors="errors.value?.dv" classContainer="col-12 md:col-3" />
                        <UWInput id="nome" label="Nome" required v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-12" />
                        <UWInput id="sigla" label="Sigla" required v-model="formData.sigla" :errors="errors.value?.sigla" classContainer="col-12 md:col-3" />
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
