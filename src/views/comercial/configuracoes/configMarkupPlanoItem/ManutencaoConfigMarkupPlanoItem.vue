<script setup>
import { reactive, computed, defineProps } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { ConfigMarkupPlanoItemService as Service, PlanoClassificacaoItemService } from '@/service';
import { parseISO } from 'date-fns';
import  ManutencaoConfigMarkupPlanoItemIndice from './ManutencaoConfigMarkupPlanoItemIndice.vue';

const schema = yup.object().shape({
    dataInicioVigencia: yup.date().required('Data Início Vigência é obrigatório.'),
    dataFinalVigencia: yup.date().required('Data Final Vigência é obrigatório.'),
    planoClassificacaoItemId: yup.number().required('Plano de Classificação do Item é obrigatório.'),
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
    planoClassificacaoItemId: undefined,
    id: undefined,
    configMarkupPlanoItemIndices: []
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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Configuração de Mark Up do Plano de Classificação do Item criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a Configuração de Mark Up do Plano de Classificação do Item.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Configuração de Mark Up do Plano de Classificação do Item alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a Configuração de Mark Up do Plano de Classificação do Item.', life: 5000 });
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
        formData.planoClassificacaoItemId = undefined;
        formData.dataInicioVigencia = undefined;
        formData.dataFinalVigencia = undefined;
        formData.id = undefined;
        formData.configMarkupPlanoItemIndices = [];
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
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '90%' }" :header="mode === 'create' ? 'Nova Configuração de Mark Up do Plano de Classificação do Item' : 'Alterar Configuração de Mark Up do Plano de Classificação do Item'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formConfigMarkupPlanoItem" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInput id="identificador" label="Identificador" disabled autofocus v-model="formData.id" classContainer="col-12 md:col-4" />
                        <UWSeletor 
                                id="seletorPlanoClassificacaoItem" 
                                label="Plano de Classificação do Item" 
                                v-model="formData.planoClassificacaoItemId" 
                                required
                                optionLabel="nome" 
                                optionValue="id" 
                                placeholder="Selecione o Plano de Classificação do Item" 
                                :service="PlanoClassificacaoItemService" 
                                classContainer="col-12 md:col-8"
                                :erros="errors?.value?.planoClassificacaoItemId"
                            >
                        </UWSeletor>   
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-4" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-4" />
                    </div>
                    <TabView class="col-12">
                        <TabPanel header="Índices" class="col-12">
                            <ManutencaoConfigMarkupPlanoItemIndice v-model="formData.configMarkupPlanoItemIndices" />
                        </TabPanel>
                    </TabView>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
