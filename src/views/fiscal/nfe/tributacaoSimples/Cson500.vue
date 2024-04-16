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

const modalidadesBCSt = ref([]);

onMounted(() => {
    TiposService.getModalidadeBaseCalculoSt().then((response) => {
        modalidadesBCSt.value = response;
    });
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
                                    <b>Icms ST</b>
                                </Divider>

                                <UWCurrency id="valorBCIcmsStRet" label="Valor da BC do ICMS ST Retido" disabled v-model="itemModelValue.tributacaoIcms.valorBCIcmsStRet" classContainer="col-12 md:col-offset-2 md:col-2" />
                                <UWCurrency id="aliqIcmsSt" label="Alíquota do ICMS ST" disabled v-model="itemModelValue.tributacaoIcms.configuracaoFiscalIcms.aliquotaST" classContainer="col-12 md:col-2" />
                                <UWCurrency id="valorIcmsProprioSubst" label="Valor do ICMS Próprio Subst." disabled v-model="itemModelValue.tributacaoIcms.valorIcmsProprioSubst" classContainer="col-12 md:col-2" />
                                <UWCurrency id="valorIcmsStRet" label="Valor do ICMS ST Retido" disabled v-model="itemModelValue.tributacaoIcms.valorIcmsStRet" classContainer="col-12 md:col-2" />

                                <!-- <UWCurrency id="baseCalcFCPSt" label="Valor da BC do FCP ST" disabled v-model="itemModelValue.tributacaoIcms.baseCalcFCPSt" classContainer="col-12 md:col-offset-3 md:col-2" /> -->
                                <!-- <UWCurrency id="percentualFCPSt" label="% FCP retido por ST " disabled v-model="itemModelValue.tributacaoIcms.percentualFCPSt" classContainer="col-12 md:col-2" /> -->
                                <!-- <UWCurrency id="valorFCPSt" label="Valor do FCP retido por ST" disabled v-model="itemModelValue.tributacaoIcms.valorFCPSt" classContainer="col-12 md:col-2" /> -->
                            </div>
                        </div>
                    </div>
                </UWFieldSet>
            </div>
        </div>
    </div>
</template>
