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
                <UWFieldSet title="Informação sobre Tributos" class="h-full">
                    <div class="p-fluid formgrid grid">
                        <div class="col-12">
                            <div class="p-fluid formgrid grid">
                                <UWDecimal id="pDevol" label="% da Mercadoria Devolvida" disabled v-model="itemModelValue.pis.aliquotaPis" classContainer="col-12 md:col-2" />
                                <UWCurrency id="vIPIDevol" label="Valor do IPI Devolvido" disabled v-model="itemModelValue.pis.valorPis" classContainer="col-12 md:col-2" />
                            </div>
                        </div>
                    </div>
                </UWFieldSet>
            </div>
        </div>
    </div>
</template>

