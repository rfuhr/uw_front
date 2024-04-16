<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    errors: {}
});

const emit = defineEmits(['update:modelValue']);

const itemModelValue = computed({
    get: () => props.modelValue || {},
    set: (value) => {
        emit('update:modelValue', value);
    }
});

</script>

<template>
    <div>
        <div class="grid nested-grid">
            <div class="col-12">
                <UWFieldSet title="Informação do Imposto de Importação" class="h-full">
                    <div class="p-fluid formgrid grid">
                        <div class="col-12">
                            <div class="p-fluid formgrid grid">
                                <UWCurrency id="bcII" label="BC do II" disabled v-model="itemModelValue.ii.bcII" classContainer="col-12 md:col-offset-1 md:col-2" />
                                <UWCurrency id="vDespAdu" label="Valor Desp. Aduaneiras" disabled v-model="itemModelValue.ii.valorDespAduaneiras" classContainer="col-12 md:col-2" />
                                <UWCurrency id="vII" label="Valor do II" disabled v-model="itemModelValue.ii.valorII" classContainer="col-12 md:col-2" />
                                <UWDecimal id="vIOF" label="Valor do IOF" disabled v-model="itemModelValue.ii.valorIof" classContainer="col-12 md:col-2" />
                            </div>
                        </div>
                    </div>
                </UWFieldSet>
            </div>
        </div>
    </div>
</template>

