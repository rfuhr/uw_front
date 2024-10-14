<script setup>
import { computed  } from 'vue';
import { IndiceFinanceiroService } from '@/service';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    errors: {}
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
    }
});


</script>

<template>
    <div class="formgrid grid pt-0">
        <UWSeletor
            label="Índice Financeiro Padrão"
            classContainer="col-12 md:col-3"
            v-model="localModelValue.indiceFinanceiroPadraoId"
            optionLabel="nome"
            optionValue="id"
            :service="IndiceFinanceiroService"
            placeholder="Selecione o índice financeiro"
            :erros="errors.value?.indiceFinanceiroPadraoId"
        />
    </div>
</template>
