<script setup>
import { ref, computed, onMounted } from 'vue';
import { TiposService, EnquadramentoService } from '@/service';

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

const selos = ref();

const mostrarValores = () => {
    if (
        itemModelValue.value.ipi.configuracaoFiscalIpi.situacaoTributariaCodigo === 0 ||
        itemModelValue.value.ipi.configuracaoFiscalIpi.situacaoTributariaCodigo === 49 ||
        itemModelValue.value.ipi.configuracaoFiscalIpi.situacaoTributariaCodigo === 50 ||
        itemModelValue.value.ipi.configuracaoFiscalIpi.situacaoTributariaCodigo === 99
    ) {
        itemModelValue.value.ipi.bcIpi = 0;
        itemModelValue.value.ipi.valorIpi = 0;
        itemModelValue.value.ipi.quantidade = 0;
        itemModelValue.value.ipi.valorUnidadeTributavel = 0;
        return false;
    } else {
        return true;
    }
};
onMounted(async () => {
    TiposService.getSeloIpi().then((data) => {
        selos.value = data;
    });
});
</script>

<template>
    <div>
        <div class="grid nested-grid">
            <div class="col-12">
                <UWFieldSet title="Informação sobre IPI" class="h-full">
                    <div class="p-fluid formgrid grid">
                        <div class="col-12">
                            <div class="p-fluid formgrid grid">
                                <UWInput id="cstIpi" label="Situação Tributária IPI" v-model="itemModelValue.ipi.configuracaoFiscalIpi.situacaoTributariaNome" disabled classContainer="col-12 md:col-3" />
                                <UWInputMask id="cnpj" label="Cnpj" mask="99.999.999/9999-99" required autofocus v-model="itemModelValue.ipi.cnpjProdutor" classContainer="col-12 md:col-2" />
                                <UWPickList
                                    id="selocontrole"
                                    label="Selo de Controle"
                                    disabled
                                    v-model="itemModelValue.ipi.configuracaoFiscalIpi.codigoSelo"
                                    optionLabel="name"
                                    optionValue="value"
                                    required
                                    :options="selos"
                                    classContainer="col-12 md:col-3"
                                />
                                <UWInteger id="quantidadeSelo" label="Quantidade de Selos" v-model="itemModelValue.ipi.quantidadeSelo" classContainer="col-12 md:col-2" />
                                <UWInput id="tipoCalculo" label="Tipo de Cálculo" v-model="itemModelValue.ipi.configuracaoFiscalIpi.tipoCalculoName" disabled classContainer="col-12 md:col-2" />
                                <UWSeletor
                                    classContainer="col-12 md:col-6"
                                    v-model="itemModelValue.ipi.configuracaoFiscalIpi.enquadramentoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    disabled
                                    label="Enquadramento Legal"
                                    :service="EnquadramentoService"
                                    :maxSizeLabel="108"
                                    placeholder="Selecione o enquadramento legal"
                                >
                                </UWSeletor>
                                <template v-if="mostrarValores()">
                                    <template v-if="itemModelValue.ipi.configuracaoFiscalIpi.tipoCalculo === 'P'">
                                        <UWCurrency id="bcIpi" label="BC do IPI" disabled v-model="itemModelValue.ipi.bcIpi" classContainer="col-12 md:col-2" />
                                        <UWDecimal id="pIpi" label="Alíquota do IPI" disabled v-model="itemModelValue.ipi.configuracaoFiscalIpi.aliquota" classContainer="col-12 md:col-2" />
                                    </template>
                                    <template v-if="itemModelValue.ipi.configuracaoFiscalIpi.tipoCalculo === 'V'">
                                        <UWDecimal id="qUnid" label="Quantidade na Unidade Tributável" disabled v-model="itemModelValue.ipi.quantidade" classContainer="col-12 md:col-2" />
                                        <UWCurrency id="vUnid" label="Valor por Unidade Tributável" disabled v-model="itemModelValue.ipi.quantidade" classContainer="col-12 md:col-2" />
                                    </template>
                                    <UWCurrency id="valorIpi" label="Valor do IPI" disabled v-model="itemModelValue.ipi.valorIpi" classContainer="col-12 md:col-2" />
                                </template>
                            </div>
                        </div>
                    </div>
                </UWFieldSet>
            </div>
        </div>
    </div>
</template>
