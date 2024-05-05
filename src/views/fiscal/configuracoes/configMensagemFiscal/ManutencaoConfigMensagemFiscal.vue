<script setup>
import { reactive, computed, defineProps } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { ConfigMensagemFiscalService as Service, MensagemFiscalService } from '@/service';
import { parseISO } from 'date-fns';
import ManutencaoConfigMensagemFiscalDados from './ManutencaoConfigMensagemFiscalDados.vue';

const schema = yup.object().shape({
    dataInicioVigencia: yup.date().required('Data Início Vigência é obrigatório.'),
    dataFinalVigencia: yup.date().required('Data Final Vigência é obrigatório.'),
    mensagemFiscalId: yup.number().required('Mensagem Fiscal é obrigatório.'),
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
    dataInicioVigencia: undefined,
    dataFinalVigencia: undefined,
    mensagemFiscalId: undefined,
    id: undefined,
    configMensagemFiscalConfigFiscals: [],
    configMensagemFiscalSituacTribs: [],
    configMensagemFiscalGrupoTribs: [],
    configMensagemFiscalItems: [],
    configMensagemFiscalOperInternas: [],
    configMensagemFiscalTipoIncentFiscals: [],
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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Configuração da Mensagem Fiscal criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a Configuração da Mensagem Fiscal.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Configuração da Mensagem Fiscal alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a Configuração da Mensagem Fiscal.', life: 5000 });
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
        formData.mensagemFiscalId = undefined;
        formData.dataInicioVigencia = undefined;
        formData.dataFinalVigencia = undefined;
        formData.id = undefined;
        formData.configMensagemFiscalConfigFiscals = [];
        formData.configMensagemFiscalSituacTribs = [];
        formData.configMensagemFiscalGrupoTribs = [];
        formData.configMensagemFiscalItems = [];
        formData.configMensagemFiscalOperInternas = [];
        formData.configMensagemFiscalTipoIncentFiscals = [];
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
            formData.dataInicioVigencia = parseISO(data.dataInicioVigencia)
            formData.dataFinalVigencia = parseISO(data.dataFinalVigencia)
        });
    }
};
</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '80%' }" :header="mode === 'create' ? 'Nova Configuração da Mensagem Fiscal' : 'Alterar Configuração da Mensagem Fiscal'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formConfiguracaoMensagemFiscal" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInput id="identificador" label="Identificador" disabled autofocus v-model="formData.id" classContainer="col-12 md:col-4" />
                        <UWSeletor 
                                id="seletorMensagemFiscal" 
                                label="Mensagem Fiscal" 
                                v-model="formData.mensagemFiscalId" 
                                required
                                optionLabel="nome" 
                                optionValue="id" 
                                placeholder="Selecione a Mensagem Fiscal" 
                                :service="MensagemFiscalService" 
                                classContainer="col-12 md:col-8"
                                :erros="errors?.value?.mensagemFiscalId"
                            >
                        </UWSeletor>   
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-4" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-4" />
                    </div>
                    <ManutencaoConfigMensagemFiscalDados v-model="formData" />
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
