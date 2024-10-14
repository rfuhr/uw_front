<script setup>
import { ref, reactive, computed, defineProps, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { TipoCalculoAgricolaService as Service, TiposService } from '@/service';

const formData = reactive({
    nome: undefined,
    codigo: undefined,
    dataInicioVigencia: null,
    dataFinalVigencia: null
});

const schema = yup.object().shape({
    codigo: yup.number().required('Código é obrigatório.')
        .min(1, 'Código deve ser maior que 0'),
    nome: yup.string().required('Nome é obrigatório.')
        .max(120, 'Nome deve ter no máximo 120 caracteres.'),
    baseCalculoAgricola: yup.number().required('Base de cálculo é obrigatório.'),
    indicadorDC: yup.string().required('Indicador D/C é obrigatório.'),
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
const basesCalculo = ref([]);

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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Tipo de cálculo criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar o tipo de cálculo.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Tipo de Cálculo alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar o tipo de cálculo.', life: 5000 });
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
        formData.baseCalculoAgricolaId = undefined;
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

    TiposService.getBaseCalculoAgricola().then((data) => {
        basesCalculo.value = data;
    });
});

</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '40%' }" :header="mode === 'create' ? 'Novo Tipo de Cálculo' : 'Alterar Tipo de Cálculo'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formTipoCalculo" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInteger id="id" label="Código" required autofocus v-model="formData.codigo" :showButton="true" @clickButton="getProximoCodigo" classContainer="col-12 md:col-3" :errors="errors.value?.codigo" />
                        <UWInput id="nome" label="Nome" required v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-12" />   
                        <UWPickList
                            id="baseCalculoAgricola"
                            required
                            label="Base de Cálculo"
                            v-model="formData.baseCalculoAgricola"
                            optionLabel="name"
                            optionValue="value"
                            :options="basesCalculo"
                            classContainer="col-12 md:col-6"
                            :errors="errors.value?.baseCalculoAgricola"
                        />
                        <UWPickList
                            id="indicadorDC"
                            required
                            label="Indicador D/C"
                            v-model="formData.indicadorDC"
                            optionLabel="name"
                            optionValue="value"
                            :options="indicadoresDC"
                            classContainer="col-12 md:col-6"
                            :errors="errors.value?.indicadorDC"
                        />
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-6" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-6" />                        
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
