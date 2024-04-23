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
                                <UWInput id="origemProduto" label="Origem da Mercadoria" v-model="itemModelValue.detalhamentoItem.item.origemNome" disabled classContainer="col-12 md:col-6" />
                                <UWInput id="grupoTributacao" label="Grupo de Tributação" v-model="itemModelValue.tributacaoIcms.configuracaoFiscalIcms.situacaoTributariaNome" disabled classContainer="col-12 md:col-6" />
                                <Divider align="left" type="solid" class="ml-3 mr-3">
                                    <b>Crédito Simples Nacional</b>
                                </Divider>
                                <UWCurrency id="aliqCredSN" label="Alíquota aplicável de cálculo do crédito" disabled v-model="itemModelValue.configuracaoFiscalIcms.aliquotaCredito" classContainer="col-12 md:col-offset-3 md:col-3" />
                                <UWCurrency id="valorCredSN" label="Valor Crédito do ICMS" disabled v-model="itemModelValue.tributacaoIcms.valorCredIcmsSN" classContainer="col-12 md:col-3" />
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="p-fluid formgrid grid">
                                <Divider align="left" type="solid" class="ml-3 mr-3">
                                    <b>Icms ST</b>
                                </Divider>

                                <UWPickList
                                    id="modalidadeBC"
                                    label="Modalidade da BC do ICMS ST"
                                    v-model="itemModelValue.tributacaoIcms.configuracaoFiscalIcms.modalidadeBaseCalculoST"
                                    disabled
                                    optionLabel="name"
                                    optionValue="value"
                                    :options="modalidadesBCSt"
                                    classContainer="col-12 md:col-2"
                                />
                                <UWCurrency id="percentualMargem" label="% Margem de Valor do ICMS ST" disabled v-model="itemModelValue.tributacaoIcms.configuracaoFiscalIcms.margemValorAgregadoST" classContainer="col-12 md:col-2" />
                                <UWCurrency id="percentualReducaoBCSt" label="% da Redução de BC do ICMS ST" disabled v-model="itemModelValue.tributacaoIcms.configuracaoFiscalIcms.reducaoBaseCalculoST" classContainer="col-12 md:col-2" />

                                <UWCurrency id="valorBCIcmsSt" label="Valor da BC do ICMS ST" disabled v-model="itemModelValue.tributacaoIcms.valorBCIcmsSt" classContainer="col-12 md:col-2" />
                                <UWCurrency id="aliqIcmsSt" label="Alíquota do ICMS ST" disabled v-model="itemModelValue.tributacaoIcms.configuracaoFiscalIcms.aliquotaST" classContainer="col-12 md:col-2" />
                                <UWCurrency id="valorIcmsSt" label="Valor do ICMS ST" disabled v-model="itemModelValue.tributacaoIcms.valorIcmsSt" classContainer="col-12 md:col-2" />

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
