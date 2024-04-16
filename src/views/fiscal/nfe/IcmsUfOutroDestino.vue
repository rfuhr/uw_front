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
                <UWFieldSet title="Informação do ICMS Interestadual" class="h-full">
                    <div class="p-fluid formgrid grid">
                        <div class="col-12">
                            <div class="p-fluid formgrid grid">
                                <UWCurrency id="baseCalcIcmsUFDest" label="BC do ICMS na UF de destino" disabled v-model="itemModelValue.tributacaoIcms.valorBCUFDest" classContainer="col-12 md:col-2" />
                                <UWCurrency id="aliqIcmsInternaUFDest" label="Alíq. Icms Interna da UF Destino" disabled v-model="itemModelValue.tributacaoIcms.aliqIcmsIntUFDest" classContainer="col-12 md:col-2" />
                                <UWCurrency id="aliqInterestadual" label="Alíq.Interestadual das UFs" disabled v-model="itemModelValue.tributacaoIcms.aliqInterestadual" classContainer="col-12 md:col-2" />
                                <UWCurrency id="percentualProvPartilha" label="% Provisório de Partilha" disabled v-model="itemModelValue.tributacaoIcms.percentualProvPartilha" classContainer="col-12 md:col-2" />
                                <UWCurrency id="valorIcmsUFDest" label="Valor Icms para UF Destino" disabled v-model="itemModelValue.tributacaoIcms.valorIcmsUFDest" classContainer="col-12 md:col-2" />
                                <UWCurrency id="valorIcmsUFRemet" label="Valor Icms na UF Remetente" disabled v-model="itemModelValue.tributacaoIcms.valorIcmsUFRemet" classContainer="col-12 md:col-2" />
                                <UWCurrency id="baseCalcFCPIcmsUFDest" label="BC FCP na UF de destino" disabled v-model="itemModelValue.tributacaoIcms.valorBCFCPUFDest" classContainer="col-12 md:col-offset-3 md:col-2" />
                                <UWCurrency id="percentualFCPIcmsUFDest" label="% FCP na UF de destino" disabled v-model="itemModelValue.tributacaoIcms.valorBCFCPUFDest" classContainer="col-12 md:col-2" />
                                <UWCurrency id="valorFCPUFDest" label="Valor FCP na UF Destino" disabled v-model="itemModelValue.tributacaoIcms.valorFCPUFDest" classContainer="col-12 md:col-2" />
                            </div>
                        </div>
                    </div>
                </UWFieldSet>
            </div>
        </div>
    </div>
</template>
