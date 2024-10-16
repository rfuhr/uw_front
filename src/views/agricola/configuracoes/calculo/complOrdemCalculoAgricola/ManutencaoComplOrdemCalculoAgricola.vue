<script setup>
import { ref, reactive, computed, defineProps, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { ComplOrdemCalculoAgricolaService as Service, ItemService, TiposService, TipoCalculoAgricolaService } from '@/service';

const formData = reactive({
    itemId: undefined,
    identificacaoDocumentoAgricola: undefined,
    tipoCalculoAgricolaId: undefined,
    ordem: undefined,
    dataInicioVigencia: null,
    dataFinalVigencia: null
});

const schema = yup.object().shape({
    itemId: yup.number().required('Produto é obrigatório.'),
    identificacaoDocumentoAgricola: yup.string().required('Documento é obrigatório.'),
    tipoCalculoAgricolaId: yup.number().required('Tipo de Cálculo é obrigatório.'),
    ordem: yup.number().required('Ordem é obrigatório.'),
    ordemCompl: yup.number().required('Compl. Ordem é obrigatório.'),
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

const identificacoes = ref([])

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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Compl. Ordem de cálculo criado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar o compl. ordem de cálculo.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Compl. Ordem de cálculo alterado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar o compl. ordem de cálculo.', life: 5000 });
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
        formData.itemId = undefined;
        formData.identificacaoDocumentoAgricola = undefined;
        formData.tipoCalculoAgricolaId = undefined;
        formData.ordem = undefined;
        formData.ordemCompl = undefined;
        formData.dataInicioVigencia = undefined;
        formData.dataFinalVigencia = undefined;
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
        });
    }
};

onMounted(async () => {
    TiposService.getIdentificacaoDocumentoAgricola().then((data) => {
        identificacoes.value = data;
    });
});
</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '50%' }" :header="mode === 'create' ? 'Novo Compl. Ordem de Cálculo' : 'Alterar Compl. Ordem de Cálculo'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formComplOrdemCalculo" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWSeletor
                            label="Produto"
                            classContainer="col-12 md:col-12"
                            v-model="formData.itemId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            :service="ItemService"
                            placeholder="Selecione o produto"
                            :erros="errors.value?.itemId"
                        />
                        <UWPickList
                            id="identificacaoDocumentoAgricola"
                            required
                            label="Identificação do Documento"
                            v-model="formData.identificacaoDocumentoAgricola"
                            optionLabel="name"
                            optionValue="value"
                            :options="identificacoes"
                            classContainer="col-12 md:col-6"
                            :errors="errors.value?.identificacaoDocumentoAgricola"
                        />
                        <UWSeletor
                            label="Tipo de Cálculo"
                            classContainer="col-12 md:col-6"
                            v-model="formData.tipoCalculoAgricolaId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            :service="TipoCalculoAgricolaService"
                            placeholder="Selecione o tipo de cálculo"
                            :erros="errors.value?.tipoCalculoAgricolaId"
                        />
                        <UWInteger id="ordem" label="Ordem" required autofocus v-model="formData.ordem" :errors="errors.value?.ordem" classContainer="col-12 md:col-6" />
                        <UWInteger id="ordemCompl" label="Ordem Compl." required autofocus v-model="formData.ordem" :errors="errors.value?.ordemCompl" classContainer="col-12 md:col-6" />
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-6" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-6" />                        
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
