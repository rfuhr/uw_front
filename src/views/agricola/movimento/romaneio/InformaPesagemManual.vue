<script setup>
import { reactive, computed } from 'vue';
import * as yup from 'yup';
// import { useToast } from 'primevue/usetoast';

const schema = yup.object().shape({
    peso: yup.number().required('Peso é obrigatório'),
    justificativa: yup.string().required('Justificativa é obrigatório.').max(120, 'Justificativa deve ter no máximo 120 caracteres.'),
});

const props = defineProps({
    modelValue: {},
    showDialog: {
        type: Boolean,
        required: true
    },
    tipoPeso: {
        type: String,
        default: 'entrada'
    }
});

const emit = defineEmits(['closeDialog', 'update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        if (!value) value = 0;
        if (value !== props.modelValue) {
            emit('update:modelValue', value);
        }
    }
});

// const toast = useToast();

const formData = reactive({
    justificativa: undefined,
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

const salvarRegistro = async () => {
    if (props.tipoPeso === 'entrada') {
        localModelValue.value.pesoEntrada = formData.peso;
        localModelValue.value.justificativaPesoEntrada = formData.justificativa;
        localModelValue.value.pesoEntradaManual = true
        emit('closeDialog');
    } else {
        localModelValue.value.pesoSaida = formData.peso;
        localModelValue.value.justificativaPesoSaida = formData.justificativa;
        localModelValue.value.pesoSaidaManual = true
        emit('closeDialog');        
    }
};

const handleLimpar = async () => {
    if (props.tipoPeso === 'entrada') {
        localModelValue.value.pesoEntrada = 0;
        localModelValue.value.justificativaPesoEntrada = undefined;
        localModelValue.value.pesoEntradaManual = false
        emit('closeDialog');
    } else {
        localModelValue.value.pesoSaida = 0;
        localModelValue.value.justificativaPesoSaida = undefined;
        localModelValue.value.pesoSaidaManual = false
        emit('closeDialog');        
    }
};

const showModal = async () => {
    if (props.tipoPeso === 'entrada') {
        formData.peso = localModelValue.value.pesoEntrada;
        formData.justificativa = localModelValue.value.justificativaPesoEntrada;
    } else {
        formData.peso = localModelValue.value.pesoSaida;
        formData.justificativa = localModelValue.value.justificativaPesoSaida;        
    }
};

</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '40%' }" :header="tipoPeso === 'entrada' ? 'Peso Manual de Entrada' : 'Peso Manual de Saída'"  :modal="true" :closable="false"
            @show="showModal" >
        <UWForm :schema="schema" :values="formData" @doVoltar="hideDialog" @doSubmit="salvarRegistro" :visibleSave="false" :visibleCancel="false" 
                visibleVoltar visibleConfirmar>
            <template #errors="{ errors }">
                <UWFieldSet title="Dados da Pesagem" class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInteger id="peso" label="Peso" v-model="formData.peso" :errors="errors.value?.peso" classContainer="col-12 md:col-3" />
                        <UWInput id="justificativa" label="Justificativa" uppercase required v-model="formData.justificativa" :errors="errors.value?.justificativa" classContainer="col-12 md:col-12" />
                    </div>
                </UWFieldSet>
            </template>
            <template #buttons>
                <Button label="Limpar" icon="pi pi-times" class="p-button-secondary" outlined @click="handleLimpar" />
            </template>
        </UWForm>
    </Dialog>
</template>
