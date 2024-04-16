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
                                    <b>Valores do Repasse</b>
                                </Divider>

                                <UWCurrency id="valorBCIcmsStRetido" label="Valor da BC do ICMS ST Retido" disabled v-model="itemModelValue.tributacaoIcms.valorBCIcmsStRet" classContainer="col-12 md:col-offset-2 md:col-2" />
                                <UWCurrency id="aliqIcmsSt" label="Alíquota do ICMS ST" disabled v-model="itemModelValue.tributacaoIcms.aliqIcmsSt" classContainer="col-12 md:col-2" />
                                <UWCurrency id="valorIcmsProprioSubst" label="Valor do Icms Próprio Subst." disabled v-model="itemModelValue.tributacaoIcms.valorIcmsProprioSubst" classContainer="col-12 md:col-2" />
                                <UWCurrency id="valorIcmsStRetido" label="Valor do ICMS ST Retido" disabled v-model="itemModelValue.tributacaoIcms.valorIcmsStRet" classContainer="col-12 md:col-2" />
                            </div>
                        </div>
                    </div>
                </UWFieldSet>
            </div>
        </div>
    </div>
</template>
