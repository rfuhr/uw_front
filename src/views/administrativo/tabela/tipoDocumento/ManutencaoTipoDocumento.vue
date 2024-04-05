<script setup>
import { ref, computed, defineProps  } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { TipoDocumentoService as Service } from '@/service';

const schema = yup.object().shape({
    nome: yup.string().required('Nome é obrigatório.').max(120, 'Nome deve ter no máximo 120 caracteres.'),
    sigla: yup.string().required('Sigla é obrigatória.').max(120, 'Sigla deve ter no máximo 120 caracteres.'),
    codigoReceita: yup.string().notRequired().max(2, 'Código na receita deve ter no máximo 2 caracteres.'),
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

const formData = ref({
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
    Service.create(formData.value)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Tipo de documento criado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar o tipo de documento.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.value.id = props.id;
    Service.update(formData.value)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Tipo de Documento alterado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar o tipo de documento.', life: 5000 });
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
        formData.value = {}
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData.value, data);
        });
    }
};

</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '40%' }" :header="mode === 'create' ? 'Novo Tipo de Documento' : 'Alterar Tipo de Documento'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formTipoDocumento" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInput id="sigla" label="Sigla" required v-model="formData.sigla" :errors="errors.value?.sigla" classContainer="col-12 md:col-4" />
                        <UWInput id="nome" label="Nome" required v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-12" />
                        <UWInput id="codigo" label="Código Receita" v-model="formData.codigoReceita" :errors="errors.value?.codigoReceita" classContainer="col-12 md:col-12" />
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
