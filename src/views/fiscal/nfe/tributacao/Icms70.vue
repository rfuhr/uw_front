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
        modalidadesBC.value = response;
    });
    TiposService.getModalidadeBaseCalculoSt().then((response) => {
        modalidadesBCSt.value = response;
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
                                <UWInput id="origemProduto" label="Origem da Mercadoria" v-model="itemModelValue.item.origemNome" disabled classContainer="col-12 md:col-6" />
                                <UWInput id="grupoTributacao" label="Situação Tributária" v-model="situacaoTributaria" disabled classContainer="col-12 md:col-6" />
                                <Divider align="left" type="solid" class="ml-3 mr-3">
                                    <b>Icms</b>
                                </Divider>
                                <UWPickList
                                    id="modalidadeBC"
                                    label="Modalidade da Base de Cálculo"
                                    v-model="itemModelValue.tributacaoIcms.configuracaoFiscalIcms.modalidadeBaseCalculo"
                                    disabled
                                    optionLabel="name"
                                    optionValue="value"
                                    required
                                    :options="modalidadesBC"
                                    classContainer="col-12 md:col-4"
                                />
                                <UWCurrency id="percentualReducaoBCICMS" label="Redução da Base de Cálculo (%)" disabled v-model="itemModelValue.tributacaoIcms.configuracaoFiscalIcms.reducaoBaseCalculo" classContainer="col-12 md:col-2" />
                                <UWCurrency id="valorBCICMS" label="Base de Cálculo" disabled v-model="itemModelValue.tributacaoIcms.valorBCIcms" classContainer="col-12 md:col-2" />
                                <UWCurrency id="aliqIcms" label="Alíquota (%)" disabled v-model="itemModelValue.tributacaoIcms.configuracaoFiscalIcms.aliquota" classContainer="col-12 md:col-2" />
                                <UWCurrency id="valorIcms" label="Valor do Icms" disabled v-model="itemModelValue.tributacaoIcms.valorIcms" classContainer="col-12 md:col-2" />

                                <!-- <UWCurrency id="baseCalcFCP" label="Valor da BC para FCP" disabled v-model="itemModelValue.tributacaoIcms.baseCalcFCP" classContainer="col-12 md:col-offset-3 md:col-2" /> -->
                                <!-- <UWCurrency id="percentualFCP" label="% do ICMS para FCP" disabled v-model="itemModelValue.tributacaoIcms.percentualFCP" classContainer="col-12 md:col-2" /> -->
                                <!-- <UWCurrency id="valorFCP" label="Valor do Icms para FCP" disabled v-model="itemModelValue.tributacaoIcms.valorFCP" classContainer="col-12 md:col-2" /> -->
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="p-fluid formgrid grid">
                                <Divider align="left" type="solid" class="ml-3 mr-3">
                                    <b>Icms ST</b>
                                </Divider>
                                <UWPickList
                                    id="modalidadeBCST"
                                    label="Modalidade da Base de Cálculo ST"
                                    v-model="itemModelValue.tributacaoIcms.configuracaoFiscalIcms.modalidadeBaseCalculoST"
                                    disabled
                                    optionLabel="name"
                                    optionValue="value"
                                    required
                                    :options="modalidadesBCSt"
                                    classContainer="col-12 md:col-2"
                                />
                                <UWCurrency id="percentualMargem" label="Margem de Valor Agregado (%)" disabled v-model="itemModelValue.tributacaoIcms.configuracaoFiscalIcms.margemValorAgregadoST" classContainer="col-12 md:col-2" />
                                <UWCurrency id="percentualReducaoBCSt" label="Redução da Base de Cálculo ST (%)" disabled v-model="itemModelValue.tributacaoIcms.configuracaoFiscalIcms.reducaoBaseCalculoST" classContainer="col-12 md:col-2" />

                                <UWCurrency id="valorBCIcmsSt" label="Base de Cálculo ST" disabled v-model="itemModelValue.tributacaoIcms.valorBCIcmsST" classContainer="col-12 md:col-2" />
                                <UWCurrency id="aliqIcmsSt" label="Alíquota ST (%)" disabled v-model="itemModelValue.tributacaoIcms.configuracaoFiscalIcms.aliquotaST" classContainer="col-12 md:col-2" />
                                <UWCurrency id="valorIcmsSt" label="Valor do Icms ST" disabled v-model="itemModelValue.tributacaoIcms.valorIcmsST" classContainer="col-12 md:col-2" />

                                <!-- <UWCurrency id="baseCalcFCPSt" label="Valor da BC do FCP ST" disabled v-model="itemModelValue.tributacaoIcms.baseCalcFCPSt" classContainer="col-12 md:col-offset-3 md:col-2" /> -->
                                <!-- <UWCurrency id="percentualFCPSt" label="% FCP retido por ST " disabled v-model="itemModelValue.tributacaoIcms.percentualFCPSt" classContainer="col-12 md:col-2" /> -->
                                <!-- <UWCurrency id="valorFCPSt" label="Valor do FCP retido por ST" disabled v-model="itemModelValue.tributacaoIcms.valorFCPSt" classContainer="col-12 md:col-2" /> -->
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="p-fluid formgrid grid">
                                <Divider align="left" type="solid" class="ml-3 mr-3">
                                    <b>Desoneração</b>
                                </Divider>
                                <UWCurrency id="valorIcmsDesoneracao" label="Valor do ICMS desonerado" disabled v-model="itemModelValue.tributacaoIcms.valorIcmsDesoneracao" classContainer="col-12 md:col-offset-3 md:col-3" />
                                <UWSeletor
                                    id="motivoDesoneracao"
                                    classContainer="col-12 md:col-3"
                                    v-model="itemModelValue.tributacaoIcms.configuracaoFiscalIcms.motivoDesoneracaoSTId"
                                    disabled
                                    optionLabel="nome"
                                    optionValue="id"
                                    label="Motivo da Desoneração"
                                    :service="MotivoDesoneracaoService"
                                    placeholder="Selecione o motivo da desoneração"
                                />
                            </div>
                        </div>
                    </div>
                </UWFieldSet>
            </div>
        </div>
    </div>
</template>
