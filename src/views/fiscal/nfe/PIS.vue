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

const grupoTributadoAliquota = () => {
    return itemModelValue.value.pis.configuracaoFiscalPis.situacaoTributariaCodigo === 1 || itemModelValue.value.pis.configuracaoFiscalPis.situacaoTributariaCodigo === '2';
};

const grupoTributadoQtde = () => {
    return itemModelValue.value.pis.configuracaoFiscalPis.situacaoTributariaCodigo === 3;
};

const grupoNaoTributado = () => {
    return (
        itemModelValue.value.pis.configuracaoFiscalPis.situacaoTributariaCodigo === 4 ||
        itemModelValue.value.pis.configuracaoFiscalPis.situacaoTributariaCodigo === 5 ||
        itemModelValue.value.pis.configuracaoFiscalPis.situacaoTributariaCodigo === 6 ||
        itemModelValue.value.pis.configuracaoFiscalPis.situacaoTributariaCodigo === 7 ||
        itemModelValue.value.pis.configuracaoFiscalPis.situacaoTributariaCodigo === 8 ||
        itemModelValue.value.pis.configuracaoFiscalPis.situacaoTributariaCodigo === 9
    );
};

const grupoOutrasOperacoes = () => {
    if (!grupoTributadoAliquota() && !grupoTributadoQtde() && !grupoNaoTributado()) {
        return true;
    }
};

const grupoPisSt = () => {
    return itemModelValue.value.pis.configuracaoFiscalPis.tipoCalculoST;
};
</script>

<template>
    <div>
        <div class="grid nested-grid">
            <div class="col-12">
                <UWFieldSet title="Informação sobre IPI" class="h-full">
                    <div class="p-fluid formgrid grid">
                        <div class="col-12">
                            <div class="p-fluid formgrid grid">
                                <Divider align="left" type="solid" class="ml-3 mr-3">
                                    <b>PIS</b>
                                </Divider>
                                <UWInput id="cstIpi" label="Situação Tributária PIS" v-model="itemModelValue.pis.configuracaoFiscalPis.situacaoTributariaNome" disabled classContainer="col-12 md:col-6" />
                                <template v-if="grupoTributadoAliquota()">
                                    <UWCurrency id="bcPis" label="BC do PIS" disabled v-model="itemModelValue.pis.bcPis" classContainer="col-12 md:col-2" />
                                    <UWDecimal id="pPis" label="Alíquota do PIS (%)" disabled v-model="itemModelValue.pis.configuracaoFiscalPis.aliquota" classContainer="col-12 md:col-2" />
                                    <UWCurrency id="valorPis" label="Valor do PIS" disabled v-model="itemModelValue.pis.valorPis" classContainer="col-12 md:col-2" />
                                </template>
                                <template v-if="grupoTributadoQtde()">
                                    <UWDecimal id="qVendida" label="Quantidade Vendida" disabled v-model="itemModelValue.pis.quantidadeVendida" classContainer="col-12 md:col-2" />
                                    <UWDecimal id="vAliqPis" label="Alíquota do PIS (Reais)" disabled v-model="itemModelValue.pis.configuracaoFiscalPis.valorUnidade" classContainer="col-12 md:col-2" />
                                    <UWCurrency id="valorPis" label="Valor do PIS" disabled v-model="itemModelValue.pis.valorPis" classContainer="col-12 md:col-2" />
                                </template>
                                <template v-if="grupoOutrasOperacoes()">
                                    <UWCurrency v-if="itemModelValue.pis.configuracaoFiscalPis.tipoCalculo === 'P'" id="bcPis" label="BC do PIS" disabled v-model="itemModelValue.pis.bcPis" classContainer="col-12 md:col-2" />
                                    <UWDecimal v-if="itemModelValue.pis.configuracaoFiscalPis.tipoCalculo === 'P'" id="pPis" label="Alíquota do PIS (%)" disabled v-model="itemModelValue.pis.configuracaoFiscalPis.aliquota" classContainer="col-12 md:col-2" />
                                    
                                    <UWDecimal v-if="itemModelValue.pis.configuracaoFiscalPis.tipoCalculo === 'V'" id="qVendida" label="Quantidade Vendida" disabled v-model="itemModelValue.pis.quantidadeVendida" classContainer="col-12 md:col-2" />
                                    <UWDecimal v-if="itemModelValue.pis.configuracaoFiscalPis.tipoCalculo === 'V'" id="vAliqPis" label="Alíquota do PIS (Reais)" disabled v-model="itemModelValue.pis.configuracaoFiscalPis.valorUnidade" classContainer="col-12 md:col-2" />
                                    
                                    <UWCurrency id="valorPis" label="Valor do PIS" disabled v-model="itemModelValue.pis.valorPis" classContainer="col-12 md:col-2" />
                                </template>

                                <template v-if="grupoPisSt()">
                                    <Divider align="left" type="solid" class="ml-3 mr-3">
                                        <b>PIS ST</b>
                                    </Divider>
                                    <UWCurrency v-if="itemModelValue.pis.configuracaoFiscalPis.tipoCalculoST === 'P'" id="bcPis" label="BC do PIS" disabled v-model="itemModelValue.pis.bcPis" classContainer="col-12 md:col-offset-3 md:col-2" />
                                    <UWDecimal
                                        v-if="itemModelValue.pis.configuracaoFiscalPis.tipoCalculoST === 'P'"
                                        id="pPis"
                                        label="Alíquota do PIS ST (%)"
                                        disabled
                                        v-model="itemModelValue.pis.configuracaoFiscalPis.aliquotaST"
                                        classContainer="col-12 md:col-2"
                                    />
                                    <UWDecimal
                                        v-if="itemModelValue.pis.configuracaoFiscalPis.tipoCalculoST === 'V'"
                                        id="qVendida"
                                        label="Quantidade Vendida"
                                        disabled
                                        v-model="itemModelValue.pis.quantidadeVendida"
                                        classContainer="col-12 md:col-offset-3 md:col-2"
                                    />
                                    <UWDecimal
                                        v-if="itemModelValue.pis.configuracaoFiscalPis.tipoCalculoST === 'V'"
                                        id="vAliqPis"
                                        label="Alíquota do PIS ST (Reais)"
                                        disabled
                                        v-model="itemModelValue.pis.configuracaoFiscalPis.valorUnidadeST"
                                        classContainer="col-12 md:col-2"
                                    />

                                    <UWCurrency id="valorPis" label="Valor do PIS ST" disabled v-model="itemModelValue.pis.valorPisST" classContainer="col-12 md:col-2" />
                                </template>
                            </div>
                        </div>
                    </div>
                </UWFieldSet>
            </div>
        </div>
    </div>
</template>
