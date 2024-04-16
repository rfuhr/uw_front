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
const modalidadesBCSt = ref([]);

onMounted(() => {
    TiposService.getModalidadeBaseCalculo().then((response) => {
        modalidadesBC.value = response.data[0];
    });
    TiposService.getModalidadeBaseCalculoSt().then((response) => {
        modalidadesBCSt.value = response.data[0];
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
                                <UWInput id="origemProduto" label="Origem da Mercadoria" v-model="itemModelValue.tributacaoIcms.origemMercadoria" disabled classContainer="col-12 md:col-6" />
                                <UWInput id="grupoTributacao" label="Grupo de Tributação" v-model="itemModelValue.tributacaoIcms.grupoTributacaoDescricao" disabled classContainer="col-12 md:col-6" />
                                <Divider align="left" type="solid" class="ml-3 mr-3">
                                    <b>Icms</b>
                                </Divider>
                                <UWPickList
                                    id="modalidadeBC"
                                    label="Modalidade de determinação da BC do ICMS"
                                    v-model="itemModelValue.tributacaoIcms.modalidadeBC"
                                    disabled
                                    optionLabel="name"
                                    optionValue="value"
                                    required
                                    :options="modalidadesBC"
                                    classContainer="col-12 md:col-4"
                                />
                                <UWCurrency id="percentualReducaoBCICMS" label="% Redução da BC do ICMS" disabled v-model="itemModelValue.tributacaoIcms.percentualReducaoBCIcms" classContainer="col-12 md:col-2" />
                                <UWCurrency id="valorBCICMS" label="Valor da BC do ICMS" disabled v-model="itemModelValue.tributacaoIcms.valorBCIcms" classContainer="col-12 md:col-2" />
                                <UWCurrency id="aliqIcms" label="Alíquota do imposto" disabled v-model="itemModelValue.tributacaoIcms.aliquotaIcms" classContainer="col-12 md:col-2" />
                                <UWCurrency id="valorIcms" label="Valor do ICMS" disabled v-model="itemModelValue.tributacaoIcms.valorIcms" classContainer="col-12 md:col-2" />

                                <UWCurrency id="baseCalcFCP" label="Valor da BC para FCP" disabled v-model="itemModelValue.tributacaoIcms.baseCalcFCP" classContainer="col-12 md:col-offset-3 md:col-2" />
                                <UWCurrency id="percentualFCP" label="% do ICMS para FCP" disabled v-model="itemModelValue.tributacaoIcms.percentualFCP" classContainer="col-12 md:col-2" />
                                <UWCurrency id="valorFCP" label="Valor do Icms para FCP" disabled v-model="itemModelValue.tributacaoIcms.valorFCP" classContainer="col-12 md:col-2" />
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="p-fluid formgrid grid">
                                <Divider align="left" type="solid" class="ml-3 mr-3">
                                    <b>Icms ST</b>
                                </Divider>
                                <UWPickList
                                    id="modalidadeBCST"
                                    label="Modalidade da BC do ICMS ST"
                                    v-model="itemModelValue.tributacaoIcms.modalidadeBCST"
                                    disabled
                                    optionLabel="name"
                                    optionValue="value"
                                    required
                                    :options="modalidadesBCST"
                                    classContainer="col-12 md:col-2"
                                />
                                <UWCurrency id="percentualMargem" label="% Margem de Valor do ICMS ST" disabled v-model="itemModelValue.tributacaoIcms.percentualMargemSt" classContainer="col-12 md:col-2" />
                                <UWCurrency id="percentualReducaoBCSt" label="% da Redução de BC do ICMS ST" disabled v-model="itemModelValue.tributacaoIcms.percentualRedBaseSt" classContainer="col-12 md:col-2" />

                                <UWCurrency id="valorBCIcmsSt" label="Valor da BC do ICMS ST" disabled v-model="itemModelValue.tributacaoIcms.valorBCIcmsSt" classContainer="col-12 md:col-2" />
                                <UWCurrency id="aliqIcmsSt" label="Alíquota do ICMS ST" disabled v-model="itemModelValue.tributacaoIcms.aliqIcmsSt" classContainer="col-12 md:col-2" />
                                <UWCurrency id="valorIcmsSt" label="Valor do ICMS ST" disabled v-model="itemModelValue.tributacaoIcms.valorIcmsSt" classContainer="col-12 md:col-2" />
                                <UWCurrency id="percentualBCOperacaoProproa" label="% BC da Operação Própria" disabled v-model="itemModelValue.tributacaoIcms.percentualBCOperacaoPropria" classContainer="col-12 md:col-offset-4 md:col-2" />
                                <UWInput id="ufDestino" label="UF Devido" v-model="itemModelValue.tributacaoIcms.ufDevidoIcmsST" disabled classContainer="col-12 md:col-2" />
                            </div>
                        </div>
                    </div>
                </UWFieldSet>
            </div>
        </div>
    </div>
</template>
