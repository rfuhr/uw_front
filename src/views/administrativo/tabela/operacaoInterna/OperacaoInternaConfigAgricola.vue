<script setup>
import { ref, computed, onMounted } from 'vue';
import { TiposService, TipoPrecoAgricolaService, TipoContratoAgricolaService } from '@/service';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    errors: {}
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue || { selecionaPesagem: false },
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const identificaoDocumentos = ref();

onMounted(async () => {
    TiposService.getIdentificacaoDocumentoAgricola().then((data) => {
        identificaoDocumentos.value = data;
    });
});

</script>

<template>
    <div class="formgrid grid pt-0">
        <UWPickList
            id="identificacaoDocumentoAgricola"
            label="Identificação do Documento"
            required
            v-model="localModelValue.identificacaoDocumentoAgricola"
            optionLabel="name"
            optionValue="value"
            :options="identificaoDocumentos"
            classContainer="col-12 md:col-4"
            :errors="errors?.value?.identificacaoDocumentoAgricola"
        />
        <UWToggleButton
            id="exigeNotaEntrada"
            classContainer="col-12 md:col-2"
            v-model="localModelValue.exigeNotaEntrada"
            onLabel="Exige nota de entrada"
            offLabel="Não exige nota de entrada"
            onIcon="pi pi-thumbs-up"
            offIcon="pi pi-thumbs-down"
        /> 
        <UWToggleButton
            id="fixaAutomatico"
            classContainer="col-12 md:col-2"
            v-model="localModelValue.fixaAutomatico"
            onLabel="Fixa automático"
            offLabel="Não fixa automático"
            onIcon="pi pi-thumbs-up"
            offIcon="pi pi-thumbs-down"
        />  
        <UWToggleButton
            id="complementoPrecoFixacao"
            classContainer="col-12 md:col-2"
            v-model="localModelValue.complementoPrecoFixacao"
            onLabel="É complemento de fixação"
            offLabel="Não é compl. de fixação"
            onIcon="pi pi-thumbs-up"
            offIcon="pi pi-thumbs-down"
        />
        <UWToggleButton
            id="contratoAvista"
            classContainer="col-12 md:col-2"
            v-model="localModelValue.contratoAvista"
            onLabel="Contrato à vista"
            offLabel="Contrato a prazo"
            onIcon="pi pi-thumbs-up"
            offIcon="pi pi-thumbs-down"
        />  
        <UWSeletor
            label="Tipo de Preço Agrícola"
            classContainer="col-12 md:col-6"
            v-model="localModelValue.tipoPrecoAgricolaId"
            optionLabel="nome"
            optionValue="id"
            required
            :service="TipoPrecoAgricolaService"
            placeholder="Selecione o tipo de preço agrícola"
            :erros="errors.value?.tipoPrecoAgricolaId"
        />
        <UWSeletor
            label="Tipo de Contrato Agrícola"
            classContainer="col-12 md:col-6"
            v-model="localModelValue.tipoContratoAgricolaId"
            optionLabel="nome"
            optionValue="id"
            required
            :service="TipoContratoAgricolaService"
            placeholder="Selecione o tipo de contrato agrícola"
            :erros="errors.value?.tipoContratoAgricolaId"
        />
    </div>
</template>
