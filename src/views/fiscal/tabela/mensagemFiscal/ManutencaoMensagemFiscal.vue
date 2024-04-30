<script setup>
import { reactive, computed, defineProps } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { MensagemFiscalService as Service, UfService } from '@/service';

const schema = yup.object().shape({
    nome: yup.string().required('Nome é obrigatório.').max(2000, 'Nome deve ter no máximo 2000 caracteres.'),
    sigla: yup.string().required('Sigla é obrigatório.').max(30, 'Sigla deve ter no máximo 30 caracteres.'),
    obsFiscal: yup.string().required('Observação Fiscal é obrigatória.').max(2000, 'Observação Fiscal deve ter no máximo 2000 caracteres.'),
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
    codigo: undefined,
    sigla: undefined,
    codigoAjuste: undefined,
    obsFiscal: undefined,
    ufId: undefined
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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Mensagem Fiscal criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a Mensagem Fiscal.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Mensagem Fiscal alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a Mensagem Fiscal.', life: 5000 });
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
        formData.sigla = undefined;
        formData.codigoAjuste = undefined;
        formData.obsFiscal = undefined;
        formData.ufId = undefined;
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
        });
    }
};
</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '60%' }" :header="mode === 'create' ? 'Nova Mensage mFiscal' : 'Alterar Mensagem Fiscal'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formMensagemFiscal" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInput id="codigo" label="Código" required autofocus v-model="formData.codigo" :errors="errors.value?.codigo" classContainer="col-12 md:col-2" />
                        <UWInput id="codigoAjuste" label="Código Ajuste" autofocus v-model="formData.codigoAjuste" classContainer="col-12 md:col-2" />
                        <UWInput id="sigla" label="Sigla" required autofocus v-model="formData.sigla" :errors="errors.value?.sigla" classContainer="col-12 md:col-4" />
                        <UWSeletor 
                                id="seletorUf" 
                                label="UF" 
                                v-model="formData.ufId" 
                                optionLabel="nome" 
                                optionValue="id" 
                                placeholder="Selecione a UF" 
                                :service="UfService" 
                                classContainer="col-12 md:col-4"
                                :erros="errors?.value?.ufId"
                            >
                        </UWSeletor>   
                        <UWTextArea id="nome" label="Nome" rows="5" required v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-12" />
                        <UWTextArea id="obsFiscal" label="Observação Fiscal" rows="5" required v-model="formData.obsFiscal" :errors="errors.value?.obsFiscal" classContainer="col-12 md:col-12" />
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
