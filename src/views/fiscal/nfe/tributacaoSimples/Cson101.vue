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
                <UWFieldSet title="Informações do ICMS da Operação própria e ST" class="h-full">
                    <div class="p-fluid formgrid grid">
                        <div class="col-12">
                            <div class="p-fluid formgrid grid">
                                <UWInput id="origemProduto" label="Origem da Mercadoria" v-model="itemModelValue.item.origemNome" disabled classContainer="col-12 md:col-6" />
                                <UWInput id="grupoTributacao" label="Grupo de Tributação" v-model="itemModelValue.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaNome" disabled classContainer="col-12 md:col-6" />
                                <Divider align="left" type="solid" class="ml-3 mr-3">
                                    <b>Crédito Simples Nacional</b>
                                </Divider>
                                <UWCurrency id="aliqCredSN" label="% Crédito SN" disabled v-model="itemModelValue.tributacaoIcms.configuracaoFiscalIcms.aliquotaCredito" classContainer="col-12 md:col-offset-3 md:col-3" />
                                <UWCurrency id="valorCredIcmsSN" label="Valor do Crédito do ICMS" disabled v-model="itemModelValue.tributacaoIcms.valorCredIcmsSN" classContainer="col-12 md:col-3" />
                            </div>
                        </div>
                    </div>
                </UWFieldSet>
            </div>
        </div>
    </div>
</template>
