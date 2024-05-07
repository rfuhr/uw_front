<script setup>
import { computed } from 'vue';
import ManutencaoConfigMensagemFiscalConfigFiscal from './ManutencaoConfigMensagemFiscalConfigFiscal.vue';
import ManutencaoConfigMensagemFiscalSituacTrib from './ManutencaoConfigMensagemFiscalSituacTrib.vue';
import ManutencaoConfigMensagemFiscalGrupoTrib from './ManutencaoConfigMensagemFiscalGrupoTrib.vue';
import ManutencaoConfigMensagemFiscalItem from './ManutencaoConfigMensagemFiscalItem.vue';
import ManutencaoConfigMensagemFiscalOperInterna from './ManutencaoConfigMensagemFiscalOperInterna.vue';
import ManutencaoConfigMensagemFiscalTipoIncentFiscal from './ManutencaoConfigMensagemFiscalTipoIncentFiscal.vue';


const props = defineProps({
    modelValue: {}
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
    }
});

</script>

<template>
    <TabView class="col-12">
        <TabPanel header="Configuração Fiscal" class="col-12">
            <ManutencaoConfigMensagemFiscalConfigFiscal v-model="localModelValue.configMensagemFiscalConfigFiscals"/>
        </TabPanel>
        <TabPanel header="Situação Tributária" class="col-12">
            <ManutencaoConfigMensagemFiscalSituacTrib v-model="localModelValue.configMensagemFiscalSituacTribs"/>
        </TabPanel>
        <TabPanel header="Grupo Tributação" class="col-12">
            <ManutencaoConfigMensagemFiscalGrupoTrib v-model="localModelValue.configMensagemFiscalGrupoTribs"/>
        </TabPanel>
        <TabPanel header="Item" class="col-12">
            <ManutencaoConfigMensagemFiscalItem v-model="localModelValue.configMensagemFiscalItems"/>
        </TabPanel>
        <TabPanel header="Operação Interna" class="col-12">
            <ManutencaoConfigMensagemFiscalOperInterna v-model="localModelValue.configMensagemFiscalOperInternas"/>
        </TabPanel>
        <TabPanel header="Incentivo Fiscal" class="col-12">
            <ManutencaoConfigMensagemFiscalTipoIncentFiscal v-model="localModelValue.configMensagemFiscalTipoIncentFiscals"/>
        </TabPanel>
    </TabView>
</template>
