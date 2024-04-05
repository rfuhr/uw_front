<script setup>
import { ref, computed, onMounted } from 'vue';
import { TiposService } from '@/service';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    errors: {}
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue || {nome: 'Rodrigo'},
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const destinosOperacao = ref([]);
const finalidadesNfe = ref([]);
const tiposConsumidor = ref([]);
const tiposPresenca = ref([]);

onMounted(async () => {
    TiposService.getDestinoOperacao().then((data) => {
        destinosOperacao.value = data;
    });
    TiposService.getFinalidadeNfe().then((data) => {
        finalidadesNfe.value = data;
    });    
    TiposService.getTipoConsumidor().then((data) => {
        tiposConsumidor.value = data;
    }); 
    TiposService.getTipoPresencaComprador().then((data) => {
        tiposPresenca.value = data;
    });       
});

</script>

<template>
    <div class="formgrid grid pt-0">
        <UWPickList id="destinoOperacao" label="Destino da Operação" v-model="localModelValue.destinoOperacao" optionLabel="name" optionValue="value" required :options="destinosOperacao" classContainer="col-12 md:col-6" />
        <UWPickList id="finalidadeNfe" label="Finalidade da NFe" v-model="localModelValue.finalidadeNfe" optionLabel="name" optionValue="value" :options="finalidadesNfe" classContainer="col-12 md:col-6" />
        <UWPickList id="tipoConsumidor" label="Tipo do Consumidor" v-model="localModelValue.tipoConsumidor" optionLabel="name" optionValue="value" :options="tiposConsumidor" classContainer="col-12 md:col-6" />
        <UWPickList id="tipoPresenca" label="Tipo de Presença de comprador" v-model="localModelValue.tipoPresenca" optionLabel="name" optionValue="value" :options="tiposPresenca" classContainer="col-12 md:col-6" />
    </div>
</template>