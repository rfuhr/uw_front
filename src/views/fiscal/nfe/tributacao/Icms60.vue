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

const itemModelValue = computed({
    get: () => props.modelValue || {},
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const modalidadesBC = ref([]);

onMounted(() => {
    TiposService.getModalidadeBaseCalculo().then((response) => {
        modalidadesBC.value = response.data[0];
    });
});

const situacaoTributaria = computed(() => {
    return itemModelValue.value.tributacaoIcms?.configuracaoFiscalIcms?.situacaoTributariaCodigo + ' - ' + itemModelValue.value.tributacaoIcms?.configuracaoFiscalIcms?.situacaoTributariaNome;
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
                                <UWInput id="origemProduto" label="Origem da Mercadoria" v-model="itemModelValue.detalhamentoItem.item.origemNome" disabled classContainer="col-12 md:col-6" />
                                <UWInput id="grupoTributacao" label="Situação Tributária" v-model="situacaoTributaria" disabled classContainer="col-12 md:col-6" />
                                <Divider align="left" type="solid" class="ml-3 mr-3">
                                    <b>Icms ST</b>
                                </Divider>
                                
                                <UWCurrency id="valorBCICMSRetido" label="Base de Cálculo ST Retido" disabled v-model="itemModelValue.tributacaoIcms.valorBCIcmsRetido" classContainer="col-12 md:col-3" />
                                <UWCurrency id="aliqIcmsSt" label="Alíquota ST (%)" disabled v-model="itemModelValue.tributacaoIcms.configuracaoFiscalIcms.aliquotaST" classContainer="col-12 md:col-3" />
                                <UWCurrency id="valorIcmsProprioSubst" label="Valor do Icms Próprio Substituto" disabled v-model="itemModelValue.tributacaoIcms.valorIcmsProprioSubst" classContainer="col-12 md:col-3" />
                                <UWCurrency id="valorIcmsRetido" label="Valor do Icms Retido" disabled v-model="itemModelValue.tributacaoIcms.valorIcmsRetido" classContainer="col-12 md:col-3" />
                                
                                <!-- <UWCurrency id="baseCalculoFCPRet" label="Valor da BC do FCP Retido por ST" disabled v-model="itemModelValue.tributacaoIcms.valorBCFCPRetSt" classContainer="col-12 md:col-offset-3 md:col-2" /> -->
                                <!-- <UWCurrency id="percentualFCPRet" label="% do FCP Retido por ST" disabled v-model="itemModelValue.tributacaoIcms.percentualFCPRetSt" classContainer="col-12 md:col-2" /> -->
                                <!-- <UWCurrency id="percentualFCPRet" label="Valor do FCP Retido por ST" disabled v-model="itemModelValue.tributacaoIcms.valorFCPRetSt" classContainer="col-12 md:col-2" /> -->
                            </div>
                        </div>
                    </div>
                </UWFieldSet>
            </div>
        </div>
    </div>
</template>
