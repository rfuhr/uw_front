<script setup>
import { ref, reactive, computed, defineProps, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { ItemClassificacaoAgricolaService as Service, TipoCalculoAgricolaService, TiposService, 
         GrupoClassificacaoAgricolaService
 } from '@/service';

const formData = reactive({
    nome: undefined,
    codigo: undefined,
    grupoClassificacaoAgricolaId: undefined,
    tipoCalculoAgricolaIdRomaneio: undefined,
    dataInicioVigencia: null,
    dataFinalVigencia: null
});

const schema = yup.object().shape({
    codigo: yup.number().required('Código é obrigatório.')
        .min(0, 'Código deve ser maior ou igual a 0'),
    nome: yup.string().required('Nome é obrigatório.')
        .max(120, 'Nome deve ter no máximo 120 caracteres.'),
    grupoClassificacaoAgricolaId: yup.number().required('Grupo de classificação é obrigatório.'),
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

const indicadoresDC = ref([]);

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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Item de classificação criado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar o item de classificação.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Item de classificação alterado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar o item de classificação.', life: 5000 });
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
        formData.grupoClassificacaoAgricolaId = undefined;
        formData.tipoCalculoAgricolaIdRomaneio = undefined;
        formData.dataInicioVigencia = undefined;
        formData.dataFinalVigencia = undefined;
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

onMounted(() => {
    TiposService.getIndicadorDC().then((data) => {
        indicadoresDC.value = data;
    });
});

</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '40%' }" :header="mode === 'create' ? 'Novo Item de Classificação' : 'Alterar Item de Classificação'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formItemClassificacao" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInteger id="id" label="Código" required autofocus v-model="formData.codigo" :showButton="true" @clickButton="getProximoCodigo" classContainer="col-12 md:col-3" :errors="errors.value?.codigo" />
                        <UWInput id="nome" label="Nome" required v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-12" />   
                        <UWSeletor
                            label="Grupo de Classificação"
                            classContainer="col-12 md:col-12"
                            v-model="formData.grupoClassificacaoAgricolaId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            :service="GrupoClassificacaoAgricolaService"
                            placeholder="Selecione o grupo de classificação agrícola"
                            :erros="errors.value?.grupoClassificacaoAgricolaId"
                        />
                        <UWSeletor
                            label="Tipo de Cálculo para Romaneio"
                            classContainer="col-12 md:col-12"
                            v-model="formData.tipoCalculoAgricolaIdRomaneio"
                            optionLabel="nome"
                            optionValue="id"
                            :service="TipoCalculoAgricolaService"
                            placeholder="Selecione o tipo de cálculo"
                            :erros="errors.value?.tipoCalculoAgricolaIdRomaneio"
                        />
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-6" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-6" />                        
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
