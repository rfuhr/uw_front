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
    return itemModelValue.value.cofins.configuracaoFiscalCofins.situacaoTributariaCodigo === 1 || itemModelValue.value.cofins.configuracaoFiscalCofins.situacaoTributariaCodigo === '2';
};

const grupoTributadoQtde = () => {
    return itemModelValue.value.cofins.configuracaoFiscalCofins.situacaoTributariaCodigo === 3;
};

const grupoNaoTributado = () => {
    return (
        itemModelValue.value.cofins.configuracaoFiscalCofins.situacaoTributariaCodigo === 4 ||
        itemModelValue.value.cofins.configuracaoFiscalCofins.situacaoTributariaCodigo === 5 ||
        itemModelValue.value.cofins.configuracaoFiscalCofins.situacaoTributariaCodigo === 6 ||
        itemModelValue.value.cofins.configuracaoFiscalCofins.situacaoTributariaCodigo === 7 ||
        itemModelValue.value.cofins.configuracaoFiscalCofins.situacaoTributariaCodigo === 8 ||
        itemModelValue.value.cofins.configuracaoFiscalCofins.situacaoTributariaCodigo === 9
    );
};

const grupoOutrasOperacoes = () => {
    if (!grupoTributadoAliquota() && !grupoTributadoQtde() && !grupoNaoTributado()) {
        return true;
    }
};

const grupoCofinsSt = () => {
    return itemModelValue.value.cofins.configuracaoFiscalCofins.tipoCalculoST;
};
</script>

<template>
    <div>
        <div class="grid nested-grid">
            <div class="col-12">
                <UWFieldSet title="Informação sobre COFINS" class="h-full">
                    <div class="p-fluid formgrid grid">
                        <div class="col-12">
                            <div class="p-fluid formgrid grid">
                                <Divider align="left" type="solid" class="ml-3 mr-3">
                                    <b>COFINS</b>
                                </Divider>
                                <UWInput id="cstCofins" label="Situação Tributária COFINS" v-model="itemModelValue.cofins.configuracaoFiscalCofins.situacaoTributariaNome" disabled classContainer="col-12 md:col-6" />
                                <template v-if="grupoTributadoAliquota()">
                                    <UWCurrency id="bcCofins" label="BC do COFINS" disabled v-model="itemModelValue.cofins.bcCofins" classContainer="col-12 md:col-2" />
                                    <UWDecimal id="pCofins" label="Alíquota do COFINS (%)" disabled v-model="itemModelValue.cofins.configuracaoFiscalCofins.aliquota" classContainer="col-12 md:col-2" />
                                    <UWCurrency id="valorCofins" label="Valor do COFINS" disabled v-model="itemModelValue.cofins.valorCofins" classContainer="col-12 md:col-2" />
                                </template>
                                <template v-if="grupoTributadoQtde()">
                                    <UWDecimal id="qVendida" label="Quantidade Vendida" disabled v-model="itemModelValue.cofins.quantidadeVendida" classContainer="col-12 md:col-2" />
                                    <UWDecimal id="vAliqCofins" label="Alíquota do COFINS (Reais)" disabled v-model="itemModelValue.cofins.configuracaoFiscalCofins.valorUnidade" classContainer="col-12 md:col-2" />
                                    <UWCurrency id="valorCofins" label="Valor do COFINS" disabled v-model="itemModelValue.cofins.valorCofins" classContainer="col-12 md:col-2" />
                                </template>
                                <template v-if="grupoOutrasOperacoes()">
                                    <UWCurrency v-if="itemModelValue.cofins.configuracaoFiscalCofins.tipoCalculo === 'P'" id="bcCofins" label="BC do COFINS" disabled v-model="itemModelValue.cofins.bcCofins" classContainer="col-12 md:col-2" />
                                    <UWDecimal v-if="itemModelValue.cofins.configuracaoFiscalCofins.tipoCalculo === 'P'" id="pCofins" label="Alíquota do COFINS (%)" disabled v-model="itemModelValue.cofins.configuracaoFiscalCofins.aliquota" classContainer="col-12 md:col-2" />
                                    
                                    <UWDecimal v-if="itemModelValue.cofins.configuracaoFiscalCofins.tipoCalculo === 'V'" id="qVendida" label="Quantidade Vendida" disabled v-model="itemModelValue.cofins.quantidadeVendida" classContainer="col-12 md:col-2" />
                                    <UWDecimal v-if="itemModelValue.cofins.configuracaoFiscalCofins.tipoCalculo === 'V'" id="vAliqCofins" label="Alíquota do COFINS (Reais)" disabled v-model="itemModelValue.cofins.configuracaoFiscalCofins.valorUnidade" classContainer="col-12 md:col-2" />
                                    
                                    <UWCurrency id="valorCofins" label="Valor do COFINS" disabled v-model="itemModelValue.cofins.valorCofins" classContainer="col-12 md:col-2" />
                                </template>

                                <template v-if="grupoCofinsSt()">
                                    <Divider align="left" type="solid" class="ml-3 mr-3">
                                        <b>COFINS ST</b>
                                    </Divider>
                                    <UWCurrency v-if="itemModelValue.cofins.configuracaoFiscalCofins.tipoCalculoST === 'P'" id="bcCofins" label="BC do COFINS" disabled v-model="itemModelValue.cofins.bcCofins" classContainer="col-12 md:col-offset-3 md:col-2" />
                                    <UWDecimal
                                        v-if="itemModelValue.cofins.configuracaoFiscalCofins.tipoCalculoST === 'P'"
                                        id="pCofins"
                                        label="Alíquota do COFINS ST (%)"
                                        disabled
                                        v-model="itemModelValue.cofins.configuracaoFiscalCofins.aliquotaST"
                                        classContainer="col-12 md:col-2"
                                    />
                                    <UWDecimal
                                        v-if="itemModelValue.cofins.configuracaoFiscalCofins.tipoCalculoST === 'V'"
                                        id="qVendida"
                                        label="Quantidade Vendida"
                                        disabled
                                        v-model="itemModelValue.cofins.quantidadeVendida"
                                        classContainer="col-12 md:col-offset-3 md:col-2"
                                    />
                                    <UWDecimal
                                        v-if="itemModelValue.cofins.configuracaoFiscalCofins.tipoCalculoST === 'V'"
                                        id="vAliqCofins"
                                        label="Alíquota do COFINS ST (Reais)"
                                        disabled
                                        v-model="itemModelValue.cofins.configuracaoFiscalCofins.valorUnidadeST"
                                        classContainer="col-12 md:col-2"
                                    />

                                    <UWCurrency id="valorCofins" label="Valor do COFINS ST" disabled v-model="itemModelValue.cofins.valorCofinsST" classContainer="col-12 md:col-2" />
                                </template>
                            </div>
                        </div>
                    </div>
                </UWFieldSet>
            </div>
        </div>
    </div>
</template>
