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
        modalidadesBC.value = response;
    });
});

const situacaoTributacao = computed(() => {
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
                                <UWInput id="grupoTributacao" label="Situação Tributária" v-model="situacaoTributacao" disabled classContainer="col-12 md:col-6" />
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
                                    :options="modalidadesBC"
                                    classContainer="col-12 md:col-3"
                                />
                                <UWCurrency id="valorBCICMS" label="Base de Cálculo" disabled v-model="itemModelValue.tributacaoIcms.valorBCIcms" classContainer="col-12 md:col-3" />
                                <UWDecimal id="aliqIcms" label="Alíquota (%)" disabled v-model="itemModelValue.tributacaoIcms.configuracaoFiscalIcms.aliquota" classContainer="col-12 md:col-3" />
                                <UWCurrency id="valorIcms" label="Valor do Icms" disabled v-model="itemModelValue.tributacaoIcms.valorIcms" classContainer="col-12 md:col-3" />
                                <!-- <UWCurrency id="percentualFCP" label="% do ICMS relativo ao FCP" disabled v-model="itemModelValue.tributacaoIcms.percentualFCP" classContainer="col-12 md:col-offset-3 md:col-3" /> -->
                                <!-- <UWCurrency id="percentualFCP" label="Valor do FCP" disabled v-model="itemModelValue.tributacaoIcms.valorFCP" classContainer="col-12 md:col-3" /> -->
                            </div>
                        </div>
                    </div>
                </UWFieldSet>
            </div>
        </div>
    </div>
</template>
